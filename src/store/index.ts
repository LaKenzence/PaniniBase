import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { CollectionMap, AlbumFilter, View } from '../types';
import type { User } from '@supabase/supabase-js';

// ─── helpers ─────────────────────────────────────────────────────────────────
const key = (editionId: string, number: number) => `${editionId}-${number}`;

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
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null });
      if (session?.user) {
        useCollectionStore.getState().loadFromSupabase(session.user.id);
      }
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
    await supabase.auth.signOut();
    set({ user: null, loading: false });
  },
}));

// ─── Collection Store ─────────────────────────────────────────────────────────
interface CollectionState {
  collection: CollectionMap;
  syncing: boolean;
  loadFromSupabase: (userId: string) => Promise<void>;
  setOwned: (editionId: string, number: number, owned: boolean) => void;
  setDuplicates: (editionId: string, number: number, delta: number) => void;
  isOwned: (editionId: string, number: number) => boolean;
  getDuplicates: (editionId: string, number: number) => number;
  exportCollection: () => string;
  importCollection: (json: string) => boolean;
  clearCollection: () => void;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      collection: {},
      syncing: false,

      loadFromSupabase: async (userId: string) => {
        const { data, error } = await supabase
          .from('collection')
          .select('*')
          .eq('user_id', userId);
        if (error || !data) return;
        const map: CollectionMap = {};
        for (const row of data) {
          const k = key(row.edition_id, row.sticker_number);
          map[k] = {
            stickerEditionId: row.edition_id,
            stickerNumber: row.sticker_number,
            owned: row.owned,
            duplicates: row.duplicates,
          };
        }
        set({ collection: map });
      },

      setOwned: (editionId, number, owned) => {
        const k = key(editionId, number);
        set((s) => ({
          collection: {
            ...s.collection,
            [k]: { stickerEditionId: editionId, stickerNumber: number, owned, duplicates: owned ? (s.collection[k]?.duplicates ?? 0) : 0 },
          },
        }));
        const user = useAuthStore.getState().user;
        if (user) {
          supabase.from('collection').upsert({
            user_id: user.id, edition_id: editionId, sticker_number: number, owned,
            duplicates: owned ? (get().collection[k]?.duplicates ?? 0) : 0,
          }, { onConflict: 'user_id,edition_id,sticker_number' }).then(() => {});
        }
      },

      setDuplicates: (editionId, number, delta) => {
        const k = key(editionId, number);
        set((s) => {
          const current = s.collection[k];
          if (!current?.owned) return s;
          const duplicates = Math.max(0, current.duplicates + delta);
          const user = useAuthStore.getState().user;
          if (user) {
            supabase.from('collection').upsert({
              user_id: user.id, edition_id: editionId, sticker_number: number,
              owned: true, duplicates,
            }, { onConflict: 'user_id,edition_id,sticker_number' }).then(() => {});
          }
          return { collection: { ...s.collection, [k]: { ...current, duplicates } } };
        });
      },

      isOwned: (editionId, number) => get().collection[key(editionId, number)]?.owned ?? false,
      getDuplicates: (editionId, number) => get().collection[key(editionId, number)]?.duplicates ?? 0,

      exportCollection: () => JSON.stringify(get().collection, null, 2),

      importCollection: (json) => {
        try {
          const parsed = JSON.parse(json);
          set({ collection: parsed });
          return true;
        } catch { return false; }
      },

      clearCollection: () => set({ collection: {} }),
    }),
    { name: 'paninibase-collection-v2' }
  )
);

// ─── Trades Store ─────────────────────────────────────────────────────────────
interface TradeEntry { editionId: string; number: number; }
interface TradesState {
  myTrade: { have: TradeEntry[]; want: TradeEntry[] } | null;
  shareToken: string | null;
  loading: boolean;
  loadMyTrade: () => Promise<void>;
  saveTrade: (have: TradeEntry[], want: TradeEntry[]) => Promise<void>;
  fetchTradeByToken: (token: string) => Promise<{ have: TradeEntry[]; want: TradeEntry[]; username?: string } | null>;
}

export const useTradesStore = create<TradesState>((set) => ({
  myTrade: null,
  shareToken: null,
  loading: false,

  loadMyTrade: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    const { data } = await supabase.from('trades').select('*').eq('user_id', user.id).maybeSingle();
    if (data) {
      set({ myTrade: { have: data.have_stickers, want: data.want_stickers }, shareToken: data.share_token });
    }
  },

  saveTrade: async (have, want) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    set({ loading: true });
    const { data } = await supabase.from('trades').upsert(
      { user_id: user.id, have_stickers: have, want_stickers: want },
      { onConflict: 'user_id' }
    ).select().single();
    if (data) set({ myTrade: { have, want }, shareToken: data.share_token });
    set({ loading: false });
  },

  fetchTradeByToken: async (token) => {
    const { data } = await supabase
      .from('trades')
      .select('*, profiles(username)')
      .eq('share_token', token)
      .maybeSingle();
    if (!data) return null;
    return {
      have: data.have_stickers,
      want: data.want_stickers,
      username: (data as any).profiles?.username,
    };
  },
}));

// ─── UI Store ─────────────────────────────────────────────────────────────────
export type AppView = View | 'trade';

interface UIState {
  view: AppView;
  selectedEditionId: string | null;
  selectedStickerNumber: number | null;
  selectedPlayerKey: string | null;
  albumFilter: AlbumFilter;
  albumSearch: string;
  albumTeamFilter: string | null;
  albumViewMode: 'grid' | 'list';
  previousView: AppView | null;

  goHome: () => void;
  goAlbum: (editionId: string) => void;
  goPlayer: (playerKey: string) => void;
  goTrade: () => void;
  goBack: () => void;
  selectSticker: (number: number | null) => void;
  setAlbumFilter: (f: AlbumFilter) => void;
  setAlbumSearch: (q: string) => void;
  setAlbumTeamFilter: (team: string | null) => void;
  setAlbumViewMode: (m: 'grid' | 'list') => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  view: 'home',
  selectedEditionId: null,
  selectedStickerNumber: null,
  selectedPlayerKey: null,
  albumFilter: 'all',
  albumSearch: '',
  albumTeamFilter: null,
  albumViewMode: 'grid',
  previousView: null,

  goHome: () => set({ view: 'home', selectedEditionId: null, selectedStickerNumber: null }),
  goAlbum: (editionId) => set((s) => ({ view: 'album', selectedEditionId: editionId, selectedStickerNumber: null, previousView: s.view })),
  goPlayer: (playerKey) => set((s) => ({ view: 'player', selectedPlayerKey: playerKey, previousView: s.view })),
  goTrade: () => set((s) => ({ view: 'trade', previousView: s.view })),
  goBack: () => {
    const { previousView, selectedEditionId } = get();
    if (previousView === 'album' && selectedEditionId) set({ view: 'album', selectedPlayerKey: null });
    else set({ view: 'home', selectedEditionId: null, selectedPlayerKey: null });
  },
  selectSticker: (number) => set({ selectedStickerNumber: number }),
  setAlbumFilter: (f) => set({ albumFilter: f }),
  setAlbumSearch: (q) => set({ albumSearch: q }),
  setAlbumTeamFilter: (team) => set({ albumTeamFilter: team }),
  setAlbumViewMode: (m) => set({ albumViewMode: m }),
}));
