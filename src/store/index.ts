import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { flushSync } from 'react-dom';
import { supabase } from '../lib/supabase';
import type { CollectionMap, AlbumFilter, View } from '../types';
import { onEditionRenumbered } from '../data/stickers';
import { CHECKLIST_SIZES } from '../data/checklists';
import type { User } from '@supabase/supabase-js';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ─── helpers ─────────────────────────────────────────────────────────────────
type StickerNum = string | number;
const key = (editionId: string, number: StickerNum) => `${editionId}-${number}`;

let realtimeChannel: RealtimeChannel | null = null;

// ─── Auth Store ───────────────────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  loading: boolean;
  init: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<string | null>;
  signUpEmail: (email: string, password: string, username: string) => Promise<string | null>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ user: session?.user ?? null, loading: false });
    if (session?.user) {
      useCollectionStore.getState().loadFromSupabase(session.user.id);
      useCollectionStore.getState().subscribeRealtime(session.user.id);
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null });
      if (session?.user) {
        useCollectionStore.getState().loadFromSupabase(session.user.id);
        useCollectionStore.getState().subscribeRealtime(session.user.id);
      } else {
        useCollectionStore.getState().unsubscribeRealtime();
      }
    });

    // Retente automatiquement la sync dès que la connexion réseau revient
    window.addEventListener('online', () => {
      useCollectionStore.getState().retrySync();
    });
  },

  signInEmail: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  },

  signUpEmail: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, username });
    }
    return null;
  },

  signInGoogle: async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  },

  signOut: async () => {
    useCollectionStore.getState().unsubscribeRealtime();
    await supabase.auth.signOut();
    set({ user: null, loading: false });
  },
}));

// ─── Collection Store (undo/redo + retry offline + realtime) ─────────────────
interface HistoryEntry {
  editionId: string;
  number: StickerNum;
  prevOwned: boolean;
  prevDuplicates: number;
  nextOwned: boolean;
  nextDuplicates: number;
}

interface PendingMutation {
  editionId: string;
  number: StickerNum;
  owned: boolean;
  duplicates: number;
}

interface CollectionState {
  collection: CollectionMap;
  syncing: boolean;
  history: HistoryEntry[];
  future: HistoryEntry[];
  pendingSync: Record<string, PendingMutation>;
  favorites: Record<string, true>;
  /** Albums cochés avec les anciens numéros, à convertir aux numéros officiels Panini au chargement */
  pendingRenumber: string[];
  renumberEdition: (editionId: string, map: Map<number, number>) => void;
  loadFromSupabase: (userId: string) => Promise<void>;
  setOwned: (editionId: string, number: StickerNum, owned: boolean) => void;
  setDuplicates: (editionId: string, number: StickerNum, delta: number) => void;
  isOwned: (editionId: string, number: StickerNum) => boolean;
  getDuplicates: (editionId: string, number: StickerNum) => number;
  toggleFavorite: (playerKey: string) => void;
  isFavorite: (playerKey: string) => boolean;
  exportCollection: () => string;
  importCollection: (json: string) => boolean;
  /** Échange fait en vrai : -1 doublon par sticker donné, +1 par sticker reçu. Renvoie le nombre de changements. */
  applyTrade: (given: Array<{ editionId: string; number: StickerNum }>, received: Array<{ editionId: string; number: StickerNum }>) => number;
  clearCollection: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  retrySync: () => Promise<void>;
  subscribeRealtime: (userId: string) => void;
  unsubscribeRealtime: () => void;
}

const MAX_HISTORY = 100;

// Pousse une mutation vers Supabase. En cas d'échec (réseau coupé, etc.),
// elle est ajoutée à la file d'attente `pendingSync` pour être retentée plus tard.
const pushToSupabase = (editionId: string, number: StickerNum, owned: boolean, duplicates: number) => {
  const user = useAuthStore.getState().user;
  if (!user) return;
  const k = key(editionId, number);

  supabase.from('collection').upsert({
    user_id: user.id, edition_id: editionId, sticker_number: number, owned, duplicates,
  }, { onConflict: 'user_id,edition_id,sticker_number' })
    .then(({ error }) => {
      if (error) {
        useCollectionStore.setState((s) => ({
          pendingSync: { ...s.pendingSync, [k]: { editionId, number, owned, duplicates } },
        }));
      } else {
        useCollectionStore.setState((s) => {
          if (!s.pendingSync[k]) return s;
          const next = { ...s.pendingSync };
          delete next[k];
          return { pendingSync: next };
        });
      }
    }, () => {
      useCollectionStore.setState((s) => ({
        pendingSync: { ...s.pendingSync, [k]: { editionId, number, owned, duplicates } },
      }));
    });
};

// Envoi groupé (import, échange validé) : une seule requête, file d'attente si échec
const pushManyToSupabase = (entries: PendingMutation[]) => {
  const user = useAuthStore.getState().user;
  if (!user || entries.length === 0) return;
  const queue = () => useCollectionStore.setState((s) => {
    const next = { ...s.pendingSync };
    for (const m of entries) next[key(m.editionId, m.number)] = m;
    return { pendingSync: next };
  });
  supabase.from('collection').upsert(
    entries.map((m) => ({ user_id: user.id, edition_id: m.editionId, sticker_number: m.number, owned: m.owned, duplicates: m.duplicates })),
    { onConflict: 'user_id,edition_id,sticker_number' },
  ).then(({ error }) => { if (error) queue(); }, queue);
};

// Valide un fichier importé : on ne garde que les entrées bien formées,
// ré-indexées avec la clé attendue (un fichier édité à la main peut être faux).
export const sanitizeCollection = (raw: unknown): CollectionMap | null => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const out: CollectionMap = {};
  for (const v of Object.values(raw as Record<string, any>)) {
    if (!v || typeof v !== 'object') continue;
    const ed = v.stickerEditionId, num = v.stickerNumber;
    if (typeof ed !== 'string' || !ed || (typeof num !== 'string' && typeof num !== 'number') || num === '') continue;
    const owned = v.owned === true;
    const dupes = Number.isFinite(v.duplicates) ? Math.max(0, Math.floor(v.duplicates)) : 0;
    out[key(ed, num)] = { stickerEditionId: ed, stickerNumber: num, owned, duplicates: owned ? dupes : 0 };
  }
  return out;
};

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      collection: {},
      syncing: false,
      history: [],
      future: [],
      pendingSync: {},
      favorites: {},
      pendingRenumber: [],

      renumberEdition: (editionId, map) => {
        if (!get().pendingRenumber.includes(editionId)) return;
        const next: CollectionMap = {};
        const moved: PendingMutation[] = [];
        for (const [k, e] of Object.entries(get().collection)) {
          if (e.stickerEditionId !== editionId) { next[k] = e; continue; }
          const n = map.get(Number(e.stickerNumber));
          if (n == null) continue; // sticker absent de l'album officiel
          next[key(editionId, n)] = { ...e, stickerNumber: n };
          moved.push({ editionId, number: n, owned: e.owned, duplicates: e.duplicates });
        }
        set((s) => ({ collection: next, history: [], future: [], pendingRenumber: s.pendingRenumber.filter((id) => id !== editionId) }));
        pushManyToSupabase(moved);
      },

      loadFromSupabase: async (userId: string) => {
        const { data, error } = await supabase.from('collection').select('*').eq('user_id', userId);
        if (error || !data) return;
        const map: CollectionMap = {};
        for (const row of data) {
          const k = key(row.edition_id, row.sticker_number);
          map[k] = { stickerEditionId: row.edition_id, stickerNumber: row.sticker_number, owned: row.owned, duplicates: row.duplicates };
        }
        set({ collection: map });
      },

      setOwned: (editionId, number, owned) => {
        const k = key(editionId, number);
        const prev = get().collection[k];
        const prevOwned = prev?.owned ?? false;
        const prevDuplicates = prev?.duplicates ?? 0;
        const nextDuplicates = owned ? prevDuplicates : 0;

        set((s) => ({
          collection: { ...s.collection, [k]: { stickerEditionId: editionId, stickerNumber: number, owned, duplicates: nextDuplicates } },
          history: [...s.history.slice(-MAX_HISTORY + 1), { editionId, number, prevOwned, prevDuplicates, nextOwned: owned, nextDuplicates }],
          future: [],
        }));
        pushToSupabase(editionId, number, owned, nextDuplicates);
      },

      setDuplicates: (editionId, number, delta) => {
        const k = key(editionId, number);
        const current = get().collection[k];
        if (!current?.owned) return;
        const prevDuplicates = current.duplicates;
        const nextDuplicates = Math.max(0, prevDuplicates + delta);

        set((s) => ({
          collection: { ...s.collection, [k]: { ...current, duplicates: nextDuplicates } },
          history: [...s.history.slice(-MAX_HISTORY + 1), { editionId, number, prevOwned: true, prevDuplicates, nextOwned: true, nextDuplicates }],
          future: [],
        }));
        pushToSupabase(editionId, number, true, nextDuplicates);
      },

      isOwned: (editionId, number) => get().collection[key(editionId, number)]?.owned ?? false,
      getDuplicates: (editionId, number) => get().collection[key(editionId, number)]?.duplicates ?? 0,

      // ── Favoris : indépendant du statut "possédé", stocké en local uniquement ──
      toggleFavorite: (playerKey) => set((s) => {
        const next = { ...s.favorites };
        if (next[playerKey]) delete next[playerKey];
        else next[playerKey] = true;
        return { favorites: next };
      }),
      isFavorite: (playerKey) => !!get().favorites[playerKey],

      exportCollection: () => JSON.stringify(get().collection, null, 2),

      importCollection: (json) => {
        let clean: CollectionMap | null;
        try { clean = sanitizeCollection(JSON.parse(json)); } catch { return false; }
        if (!clean) return false;
        set({ collection: clean, history: [], future: [] });
        // Connecté : sinon la prochaine synchro écraserait l'import avec l'ancienne collection
        pushManyToSupabase(Object.values(clean).map((e) => ({ editionId: e.stickerEditionId, number: e.stickerNumber, owned: e.owned, duplicates: e.duplicates })));
        return true;
      },

      applyTrade: (given, received) => {
        const { collection } = get();
        const next = { ...collection };
        const changes: HistoryEntry[] = [];
        for (const g of given) {
          const k = key(g.editionId, g.number);
          const cur = next[k];
          if (!cur?.owned || cur.duplicates === 0) continue; // on ne donne qu'un doublon
          next[k] = { ...cur, duplicates: cur.duplicates - 1 };
          changes.push({ editionId: g.editionId, number: g.number, prevOwned: true, prevDuplicates: cur.duplicates, nextOwned: true, nextDuplicates: cur.duplicates - 1 });
        }
        for (const r of received) {
          const k = key(r.editionId, r.number);
          const cur = next[k];
          const prevOwned = cur?.owned ?? false, prevDuplicates = cur?.duplicates ?? 0;
          const nextDuplicates = prevOwned ? prevDuplicates + 1 : 0;
          next[k] = { stickerEditionId: r.editionId, stickerNumber: r.number, owned: true, duplicates: nextDuplicates };
          changes.push({ editionId: r.editionId, number: r.number, prevOwned, prevDuplicates, nextOwned: true, nextDuplicates });
        }
        set((s) => ({ collection: next, history: [...s.history, ...changes].slice(-MAX_HISTORY), future: [] }));
        pushManyToSupabase(changes.map((c) => ({ editionId: c.editionId, number: c.number, owned: c.nextOwned, duplicates: c.nextDuplicates })));
        return changes.length;
      },

      clearCollection: () => {
        set({ collection: {}, history: [], future: [], pendingSync: {} });
        // Connecté : efface aussi côté serveur, sinon tout revient au prochain chargement
        const user = useAuthStore.getState().user;
        if (user) supabase.from('collection').delete().eq('user_id', user.id).then(() => {}, () => {});
      },

      undo: () => {
        const { history, future, collection } = get();
        if (history.length === 0) return;
        const entry = history[history.length - 1];
        const k = key(entry.editionId, entry.number);
        const restored = { stickerEditionId: entry.editionId, stickerNumber: entry.number, owned: entry.prevOwned, duplicates: entry.prevDuplicates };
        set({
          collection: { ...collection, [k]: restored },
          history: history.slice(0, -1),
          future: [...future, entry],
        });
        pushToSupabase(entry.editionId, entry.number, entry.prevOwned, entry.prevDuplicates);
      },

      redo: () => {
        const { history, future, collection } = get();
        if (future.length === 0) return;
        const entry = future[future.length - 1];
        const k = key(entry.editionId, entry.number);
        const restored = { stickerEditionId: entry.editionId, stickerNumber: entry.number, owned: entry.nextOwned, duplicates: entry.nextDuplicates };
        set({
          collection: { ...collection, [k]: restored },
          history: [...history, entry],
          future: future.slice(0, -1),
        });
        pushToSupabase(entry.editionId, entry.number, entry.nextOwned, entry.nextDuplicates);
      },

      canUndo: () => get().history.length > 0,
      canRedo: () => get().future.length > 0,

      // ── Retente toutes les mutations en attente (appelé au retour réseau ou manuellement) ──
      retrySync: async () => {
        const pending = get().pendingSync;
        const keys = Object.keys(pending);
        if (keys.length === 0) return;
        const user = useAuthStore.getState().user;
        if (!user) return;

        for (const k of keys) {
          const m = pending[k];
          const { error } = await supabase.from('collection').upsert({
            user_id: user.id, edition_id: m.editionId, sticker_number: m.number, owned: m.owned, duplicates: m.duplicates,
          }, { onConflict: 'user_id,edition_id,sticker_number' });

          if (!error) {
            set((s) => {
              const next = { ...s.pendingSync };
              delete next[k];
              return { pendingSync: next };
            });
          }
        }
      },

      // ── Realtime : reflète les changements faits depuis un autre appareil ──
      subscribeRealtime: (userId: string) => {
        if (realtimeChannel) return; // déjà abonné
        realtimeChannel = supabase
          .channel('collection-changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'collection', filter: `user_id=eq.${userId}` },
            (payload) => {
              const row = (payload.new ?? payload.old) as any;
              if (!row) return;
              const k = key(row.edition_id, row.sticker_number);
              if (payload.eventType === 'DELETE') {
                set((s) => {
                  const next = { ...s.collection };
                  delete next[k];
                  return { collection: next };
                });
              } else {
                set((s) => ({
                  collection: {
                    ...s.collection,
                    [k]: { stickerEditionId: row.edition_id, stickerNumber: row.sticker_number, owned: row.owned, duplicates: row.duplicates },
                  },
                }));
              }
            }
          )
          .subscribe();
      },

      unsubscribeRealtime: () => {
        if (realtimeChannel) {
          supabase.removeChannel(realtimeChannel);
          realtimeChannel = null;
        }
      },
    }),
    {
      name: 'paninibase-collection-v2',
      partialize: (state) => ({ collection: state.collection, pendingSync: state.pendingSync, favorites: state.favorites, pendingRenumber: state.pendingRenumber }) as any,
      // v1 : albums 2002–2022 renumérotés selon les checklists Panini. Les collections
      // enregistrées avant (version 0) seront converties au chargement de chaque album.
      version: 1,
      migrate: (persisted: any, version) => {
        if (version < 1 && persisted?.collection) {
          const editions = new Set(Object.values(persisted.collection as CollectionMap).map((e) => e.stickerEditionId));
          persisted.pendingRenumber = Object.keys(CHECKLIST_SIZES).filter((id) => editions.has(id));
        }
        return persisted;
      },
    }
  )
);

// ─── Trades Store ─────────────────────────────────────────────────────────────
interface TradeEntry { editionId: string; number: StickerNum; }
export interface TradeMatch {
  userId: string;
  username: string;
  shareToken: string;
  theyCanGive: Array<{ editionId: string; number: string | number }>;
  youCanGive: Array<{ editionId: string; number: string | number }>;
  matchScore: number;
}

interface TradesState {
  myTrade: { have: TradeEntry[]; want: TradeEntry[] } | null;
  shareToken: string | null;
  loading: boolean;
  error: string | null;
  loadMyTrade: () => Promise<void>;
  saveTrade: (have: TradeEntry[], want: TradeEntry[]) => Promise<void>;
  fetchTradeByToken: (token: string) => Promise<{ have: TradeEntry[]; want: TradeEntry[]; username?: string } | null>;
  compareWithUser: (username: string) => Promise<{ userId: string; username: string; collection: CollectionMap } | 'not_found' | 'self' | null>;
  findMatches: () => Promise<TradeMatch[]>;
  matches: TradeMatch[];
  matchesLoading: boolean;
  /** Matches apparus depuis la dernière visite de l'onglet Matches */
  newMatchIds: string[];
  markMatchesSeen: () => void;
}

// Collectionneurs déjà vus dans l'onglet Matches (par appareil : simple confort, pas une donnée)
const SEEN_MATCHES_KEY = 'paninibase-seen-matches';
const readSeenMatches = (): string[] => {
  try { return JSON.parse(localStorage.getItem(SEEN_MATCHES_KEY) ?? '[]'); } catch { return []; }
};

export const useTradesStore = create<TradesState>((set) => ({
  myTrade: null,
  shareToken: null,
  loading: false,
  error: null,
  matches: [],
  matchesLoading: false,
  newMatchIds: [],

  markMatchesSeen: () => {
    const ids = [...new Set([...readSeenMatches(), ...useTradesStore.getState().matches.map((m) => m.userId)])];
    try { localStorage.setItem(SEEN_MATCHES_KEY, JSON.stringify(ids)); } catch { /* stockage indisponible */ }
    set({ newMatchIds: [] });
  },

  loadMyTrade: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    const { data, error } = await supabase.from('trades').select('*').eq('user_id', user.id).maybeSingle();
    if (error) { set({ error: error.message }); return; }
    if (data) {
      set({ myTrade: { have: data.have_stickers, want: data.want_stickers }, shareToken: data.share_token });
    }
  },

  saveTrade: async (have, want) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    set({ loading: true, error: null });
    const { data, error } = await supabase.from('trades').upsert(
      { user_id: user.id, have_stickers: have, want_stickers: want },
      { onConflict: 'user_id' }
    ).select().maybeSingle();
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    if (data) set({ myTrade: { have, want }, shareToken: data.share_token });
    set({ loading: false });
  },

  fetchTradeByToken: async (token) => {
    // Passe par une fonction SQL dédiée (RPC) qui ne retourne que la ligne
    // correspondant exactement au token -- pas un accès direct à la table
    // qui permettrait de tout lire (voir migration de sécurité).
    const { data, error } = await supabase.rpc('get_trade_by_token', { token });
    if (error || !data || data.length === 0) return null;
    const row = data[0];
    return {
      have: row.have_stickers,
      want: row.want_stickers,
      username: row.username ?? undefined,
    };
  },

  // ── Comparaison de collection avec un autre utilisateur par pseudo ────────
  compareWithUser: async (username: string) => {
    const me = useAuthStore.getState().user;
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('username', username.trim())
      .maybeSingle();

    if (pErr || !profile) return 'not_found';
    if (me && profile.id === me.id) return 'self';

    const { data: rows, error: cErr } = await supabase.rpc('get_user_collection', { target_user_id: profile.id });
    if (cErr || !rows) return null;

    const map: CollectionMap = {};
    for (const row of rows as any[]) {
      const k = `${row.edition_id}-${row.sticker_number}`;
      map[k] = { stickerEditionId: row.edition_id, stickerNumber: row.sticker_number, owned: row.owned, duplicates: row.duplicates };
    }
    return { userId: profile.id, username: profile.username, collection: map };
  },

  // ── Matching automatique : top 20 utilisateurs avec qui échanger ──────────
  findMatches: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return [];
    set({ matchesLoading: true });

    const { data, error } = await supabase.rpc('find_trade_matches', {
      current_user_id: user.id,
    });

    if (error || !data) { set({ matchesLoading: false }); return []; }

    const matches: TradeMatch[] = (data as any[]).map((row) => ({
      userId: row.matched_user_id,
      username: row.username,
      shareToken: row.share_token,
      theyCanGive: row.they_can_give ?? [],
      youCanGive: row.you_can_give ?? [],
      matchScore: row.match_score,
    }));

    const seen = new Set(readSeenMatches());
    set({ matches, matchesLoading: false, newMatchIds: matches.filter((m) => !seen.has(m.userId)).map((m) => m.userId) });
    return matches;
  },
}));

// ─── Échanges suivis à deux (table trade_offers, voir supabase/trade_offers.sql) ──
export type OfferStatus = 'proposed' | 'accepted' | 'declined' | 'cancelled' | 'done';
export interface TradeOffer {
  id: string;
  /** true : c'est moi qui ai proposé */
  mine: boolean;
  otherName: string;
  /** Toujours de MON point de vue : ce que je donne / ce que je reçois */
  give: TradeEntry[];
  receive: TradeEntry[];
  status: OfferStatus;
  iConfirmed: boolean;
  otherConfirmed: boolean;
  createdAt: string;
}

/** Ligne de la base → proposition vue par `me` (give/receive inversés pour le destinataire). */
export const offerFromRow = (row: any, me: string): TradeOffer => {
  const mine = row.from_user === me;
  return {
    id: row.id,
    mine,
    otherName: (mine ? row.to_profile?.username : row.from_profile?.username) ?? '?',
    give: mine ? row.give : row.receive,
    receive: mine ? row.receive : row.give,
    status: row.status,
    iConfirmed: mine ? row.from_done : row.to_done,
    otherConfirmed: mine ? row.to_done : row.from_done,
    createdAt: row.created_at,
  };
};

/** Propositions qui attendent quelque chose de moi : répondre, ou confirmer un échange accepté. */
export const offersWaitingForMe = (offers: TradeOffer[]) =>
  offers.filter((o) => (o.status === 'proposed' && !o.mine) || (o.status === 'accepted' && !o.iConfirmed)).length;

interface OffersState {
  offers: TradeOffer[];
  loading: boolean;
  error: string | null;
  loadOffers: () => Promise<void>;
  propose: (toUserId: string, give: TradeEntry[], receive: TradeEntry[]) => Promise<boolean>;
  respond: (id: string, accept: boolean) => Promise<void>;
  cancel: (id: string) => Promise<void>;
  /** Je confirme avoir fait l'échange : ma collection est mise à jour (une seule fois) */
  confirm: (id: string) => Promise<void>;
}

export const useOffersStore = create<OffersState>((set, get) => ({
  offers: [],
  loading: false,
  error: null,

  loadOffers: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    set({ loading: true });
    const { data, error } = await supabase
      .from('trade_offers')
      .select('*, from_profile:profiles!trade_offers_from_user_fkey(username), to_profile:profiles!trade_offers_to_user_fkey(username)')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) { set({ loading: false, error: error.message }); return; }
    set({ loading: false, error: null, offers: (data ?? []).map((r) => offerFromRow(r, user.id)) });
  },

  propose: async (toUserId, give, receive) => {
    const user = useAuthStore.getState().user;
    if (!user) return false;
    const { error } = await supabase.from('trade_offers').insert({ from_user: user.id, to_user: toUserId, give, receive });
    if (error) { set({ error: error.message }); return false; }
    await get().loadOffers();
    return true;
  },

  respond: async (id, accept) => {
    const { error } = await supabase.rpc('respond_trade_offer', { offer_id: id, accept });
    if (error) set({ error: error.message });
    await get().loadOffers();
  },

  cancel: async (id) => {
    const { error } = await supabase.rpc('cancel_trade_offer', { offer_id: id });
    if (error) set({ error: error.message });
    await get().loadOffers();
  },

  confirm: async (id) => {
    const offer = get().offers.find((o) => o.id === id);
    if (!offer) return;
    const { data: first, error } = await supabase.rpc('confirm_trade_offer', { offer_id: id });
    if (error) { set({ error: error.message }); return; }
    // La base dit si c'est ma première confirmation : jamais deux fois la même mise à jour
    if (first) useCollectionStore.getState().applyTrade(offer.give, offer.receive);
    await get().loadOffers();
  },
}));

// ─── UI Store ─────────────────────────────────────────────────────────────────
export type AppView = View | 'trade';
export type NavTab = 'home' | 'collection' | 'trade';

interface UIState {
  view: AppView;
  activeTab: NavTab;
  selectedEditionId: string | null;
  selectedStickerNumber: StickerNum | null;
  selectedPlayerKey: string | null;
  albumFilter: AlbumFilter;
  albumSearch: string;
  albumTeamFilter: string | null;
  albumViewMode: 'grid' | 'list';
  previousView: AppView | null;
  pendingTradeToken: string | null;

  setActiveTab: (tab: NavTab) => void;
  setPendingTradeToken: (token: string | null) => void;
  goHome: () => void;
  goAlbum: (editionId: string, opts?: { team?: string | null; sticker?: StickerNum | null }) => void;
  goPlayer: (playerKey: string) => void;
  goTrade: () => void;
  goBack: () => void;
  selectSticker: (number: StickerNum | null) => void;
  setAlbumFilter: (f: AlbumFilter) => void;
  setAlbumSearch: (q: string) => void;
  setAlbumTeamFilter: (team: string | null) => void;
  setAlbumViewMode: (m: 'grid' | 'list') => void;
}

// Changement de page animé (fondu + léger glissement, voir index.css) quand le
// navigateur le permet ; sinon, ou si l'utilisateur réduit les animations, changement direct.
const withTransition = (update: () => void) => {
  type Transition = { ready: Promise<void>; finished: Promise<void> };
  const doc = document as Document & { startViewTransition?: (cb: () => void) => Transition };
  if (!doc.startViewTransition || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { update(); return; }
  const transition = doc.startViewTransition(() => flushSync(update));
  // Deux navigations rapprochées : la première animation est sautée (rejet « AbortError »), c'est normal
  transition.ready.catch(() => {});
  transition.finished.catch(() => {});
};

export const useUIStore = create<UIState>((set, get) => ({
  view: 'home',
  activeTab: 'home',
  selectedEditionId: null,
  selectedStickerNumber: null,
  selectedPlayerKey: null,
  albumFilter: 'all',
  albumSearch: '',
  albumTeamFilter: null,
  albumViewMode: 'grid',
  previousView: null,
  pendingTradeToken: null,

  setActiveTab: (tab) => withTransition(() => set({ activeTab: tab })),
  setPendingTradeToken: (token) => set({ pendingTradeToken: token }),
  goHome: () => withTransition(() => set({ view: 'home', selectedEditionId: null, selectedStickerNumber: null })),
  // opts.team : album filtré sur une équipe ; opts.sticker : sticker déjà sélectionné
  goAlbum: (editionId, opts = {}) => withTransition(() => set((s) => ({ view: 'album', selectedEditionId: editionId, selectedStickerNumber: opts.sticker ?? null, albumTeamFilter: opts.team ?? null, previousView: s.view }))),
  goPlayer: (playerKey) => withTransition(() => set((s) => ({ view: 'player', selectedPlayerKey: playerKey, previousView: s.view }))),
  goTrade: () => withTransition(() => set((s) => ({ view: 'trade', activeTab: 'trade', previousView: s.view }))),
  goBack: () => withTransition(() => {
    const { previousView, selectedEditionId } = get();
    if (previousView === 'album' && selectedEditionId) set({ view: 'album', selectedPlayerKey: null });
    else set({ view: 'home', selectedEditionId: null, selectedPlayerKey: null });
  }),
  selectSticker: (number) => set({ selectedStickerNumber: number }),
  setAlbumFilter: (f) => set({ albumFilter: f }),
  setAlbumSearch: (q) => set({ albumSearch: q }),
  setAlbumTeamFilter: (team) => set({ albumTeamFilter: team }),
  setAlbumViewMode: (m) => set({ albumViewMode: m }),
}));

// Un album passe aux numéros officiels Panini : on convertit les stickers déjà cochés
onEditionRenumbered((editionId, map) => useCollectionStore.getState().renumberEdition(editionId, map));
