import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useTradesStore, useCollectionStore, useAuthStore, useUIStore, useOffersStore, offersWaitingForMe, type TradeMatch } from '../store/index';
import { TradeOffers } from '../components/TradeOffers';
import { STICKERS_BY_EDITION, EDITIONS, BG } from '../data/stickers';
import { ArrowLeftRight, ClipboardList, Search, Send, Inbox, User as UserIcon, Link2, RotateCcw, X, Check, AlertTriangle, Save, Users, Zap, RefreshCw, Share2 } from 'lucide-react';
import { TradeStoryCard } from '../components/TradeStoryCard';
import { AuthModal } from '../components/AuthModal';
import { QrCode } from '../components/QrCode';
import { useEditions } from '../hooks/useEditionData';
import { useT, albumName, stickerName } from '../i18n';
import type { Sticker } from '../types';
import { C } from '../theme';

type StickerNum = string | number;

const StickerChip: React.FC<{ sticker: Sticker; tag?: string; tagColor?: string; onRemove?: () => void; checked?: boolean; onToggle?: () => void }> = ({ sticker, tag, tagColor, onRemove, checked, onToggle }) => {
  const bg = BG[sticker.player?.colKey ?? ''] ?? 'linear-gradient(135deg,#0d1a3a,#1a2f6b)';
  const edition = EDITIONS.find((e) => e.id === sticker.editionId);
  const t = useT();
  return (
    <div
      role={onToggle ? 'checkbox' : undefined}
      aria-checked={onToggle ? !!checked : undefined}
      tabIndex={onToggle ? 0 : undefined}
      onClick={onToggle}
      onKeyDown={onToggle ? (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onToggle(); } } : undefined}
      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '12px', background: checked ? 'rgba(201,162,39,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${checked ? 'rgba(201,162,39,0.4)' : 'rgba(255,255,255,0.07)'}`, cursor: onToggle ? 'pointer' : undefined }}
    >
      {onToggle && <div style={{ width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0, background: checked ? C.gold : 'transparent', border: `2px solid ${checked ? C.gold : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>{checked && <Check size={13} strokeWidth={3} />}</div>}
      <div style={{ width: '32px', height: '42px', borderRadius: '6px', background: bg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
        {sticker.imageUrl ? <img src={sticker.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{sticker.player?.flag}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '12px', fontWeight: 700, color: C.textPrimary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stickerName(sticker, t)}</p>
        <p style={{ fontSize: '11px', color: C.textTertiary, margin: '2px 0 0' }}>{edition?.year} · #{sticker.number}{sticker.isShiny ? ' · ★ Shiny' : ''}</p>
      </div>
      {tag && <span style={{ fontSize: '11px', fontWeight: 700, color: tagColor ?? C.gold, background: `${tagColor ?? C.gold}18`, padding: '2px 7px', borderRadius: '6px', flexShrink: 0, whiteSpace: 'nowrap' }}>{tag}</span>}
      {onRemove && <button onClick={onRemove} style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: C.textTertiary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><X size={11} /></button>}
    </div>
  );
};

const AlbumSelect: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const t = useT();
  return (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{ padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: C.textPrimary, fontSize: '11px', outline: 'none', cursor: 'pointer' }}
  >
    {EDITIONS.map((ed) => (
      <option key={ed.id} value={ed.id} style={{ background: C.bgCard }}>{ed.hostFlag} {albumName(ed.label, t)}</option>
    ))}
  </select>
  );
};

export const TradeView: React.FC = () => {
  const { user } = useAuthStore();
  const { myTrade, shareToken, loading, error, loadMyTrade, saveTrade, fetchTradeByToken, compareWithUser, findMatches, matches, matchesLoading, newMatchIds, markMatchesSeen } = useTradesStore();
  // Les matches affichés dans l'onglet sont « vus » : l'étiquette Nouveau reste jusqu'au prochain passage
  const [shownAsNew, setShownAsNew] = useState<string[]>([]);

  // Notifications système (uniquement quand l'appli est ouverte en arrière-plan)
  const canNotify = typeof Notification !== 'undefined';
  const [notifPermission, setNotifPermission] = useState(canNotify ? Notification.permission : 'denied');
  const askNotifications = async () => setNotifPermission(await Notification.requestPermission());
  const { collection } = useCollectionStore();
  const { goHome, setActiveTab, pendingTradeToken, setPendingTradeToken } = useUIStore();
  const [showAuth, setShowAuth] = useState(false);
  const t = useT();
  useEditions('all'); // noms des stickers des annonces et des matches, tous albums confondus

  const [tokenInput, setTokenInput]   = useState('');
  const [fetchedTrade, setFetchedTrade] = useState<{ have: any[]; want: any[]; username?: string } | null>(null);
  const [fetching, setFetching]       = useState(false);
  const [copied, setCopied]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [activeTab, setTradeTab]     = useState<'my' | 'find' | 'compare' | 'match' | 'offers'>('my');
  const { propose, offers, loadOffers } = useOffersStore();
  const waitingOffers = offersWaitingForMe(offers);
  useEffect(() => { if (user) loadOffers(); }, [user]);
  useEffect(() => {
    if (activeTab !== 'match' || newMatchIds.length === 0) return;
    setShownAsNew((prev) => [...new Set([...prev, ...newMatchIds])]);
    markMatchesSeen();
  }, [activeTab, newMatchIds]);

  const [haveEdition, setHaveEdition] = useState(EDITIONS[EDITIONS.length - 1].id);
  const [wantEdition, setWantEdition] = useState(EDITIONS[EDITIONS.length - 1].id);

  const [haveList, setHaveList] = useState<Array<{ editionId: string; number: StickerNum }>>([]);
  const [wantList, setWantList] = useState<Array<{ editionId: string; number: StickerNum }>>([]);

  // ── Comparaison de collection ─────────────────────────────────────────────
  const [compareUsername, setCompareUsername] = useState('');
  const [comparing, setComparing] = useState(false);
  const [compareResult, setCompareResult] = useState<
    { userId: string; username: string; collection: Record<string, any> } | 'not_found' | 'self' | null
  >(null);

  // ── Échange fait en vrai : on coche ce qui a été donné / reçu, puis on valide ──
  // Seule MA collection est modifiée : l'autre collectionneur valide de son côté
  // (personne ne peut écrire dans la collection d'un autre).
  type Entry = { editionId: string; number: StickerNum };
  const [give, setGive] = useState<Record<string, Entry>>({});
  const [receive, setReceive] = useState<Record<string, Entry>>({});
  const [tradeDone, setTradeDone] = useState<string | null>(null);
  const applyTrade = useCollectionStore((s) => s.applyTrade);
  useEffect(() => { setGive({}); setReceive({}); setTradeDone(null); }, [compareResult, fetchedTrade]);
  const toggle = (setter: React.Dispatch<React.SetStateAction<Record<string, Entry>>>, e: Entry) => () => setter((prev) => {
    const k = `${e.editionId}-${e.number}`;
    const next = { ...prev };
    if (next[k]) delete next[k]; else next[k] = { editionId: e.editionId, number: e.number };
    return next;
  });
  const giveCount = Object.keys(give).length, receiveCount = Object.keys(receive).length;
  const handleValidateTrade = (otherName: string) => {
    applyTrade(Object.values(give), Object.values(receive));
    setGive({}); setReceive({});
    setTradeDone(t('Échange enregistré (donnés : {g}, reçus : {r}). {name} doit aussi le valider de son côté.', { g: giveCount, r: receiveCount, name: otherName }));
  };
  const myDupes = (e: Entry) => collection[`${e.editionId}-${e.number}`]?.duplicates ?? 0;

  // Proposer l'échange coché (onglet Comparer : on connaît l'identifiant de l'autre membre)
  const handlePropose = async (otherUserId: string, otherName: string) => {
    const ok = await propose(otherUserId, Object.values(give), Object.values(receive));
    if (!ok) return;
    setGive({}); setReceive({});
    setTradeDone(t('Proposition envoyée à {name}. Suis-la dans l’onglet Propositions.', { name: otherName }));
  };

  const renderValidateBar = (otherName: string, otherUserId?: string) => (
    <div style={{ position: 'sticky', bottom: 0, display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 14px', borderRadius: '14px', background: C.bgElevated, border: '1px solid rgba(201,162,39,0.3)', boxShadow: '0 -8px 24px rgba(0,0,0,0.4)' }}>
      {tradeDone ? (
        <p style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: C.green, margin: 0, lineHeight: 1.5 }}><Check size={14} style={{ flexShrink: 0, marginTop: '2px' }} /> {tradeDone}</p>
      ) : (
        <p style={{ fontSize: '12px', color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>
          {t("Échange fait ? Coche les stickers donnés et reçus pour mettre ta collection à jour d'un coup.")}
        </p>
      )}
      <button
        className={`btn-tactile${giveCount + receiveCount > 0 ? ' btn-gold' : ''}`}
        disabled={giveCount + receiveCount === 0}
        onClick={() => handleValidateTrade(otherName)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '44px', borderRadius: '10px', border: giveCount + receiveCount > 0 ? 'none' : '1px solid rgba(255,255,255,0.1)', background: giveCount + receiveCount > 0 ? undefined : 'transparent', color: giveCount + receiveCount > 0 ? undefined : C.textTertiary, fontSize: '13px', fontWeight: 700, cursor: giveCount + receiveCount > 0 ? 'pointer' : 'default' }}
      >
        <ArrowLeftRight size={15} /> {t('Valider l’échange · donnés : {g} · reçus : {r}', { g: giveCount, r: receiveCount })}
      </button>
      {otherUserId && giveCount + receiveCount > 0 && (
        <button className="btn-tactile" onClick={() => handlePropose(otherUserId, otherName)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '40px', borderRadius: '10px', background: 'rgba(52,152,219,0.1)', border: '1px solid rgba(52,152,219,0.35)', color: C.blue, fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
          <Send size={14} /> {t('Proposer cet échange à {name}', { name: otherName })}
        </button>
      )}
    </div>
  );

  useEffect(() => { if (user) loadMyTrade(); }, [user]);
  useEffect(() => { if (myTrade) { setHaveList(myTrade.have); setWantList(myTrade.want); } }, [myTrade]);

  const getStickerFromEntry = (entry: { editionId: string; number: StickerNum }) => {
    const stickers = STICKERS_BY_EDITION[entry.editionId] ?? [];
    return stickers.find((s) => String(s.number) === String(entry.number)) ?? null;
  };

  // "🇧🇷 Pelé #21" (année ajoutée hors 2026) au lieu d'un simple numéro
  const entryLabel = (e: { editionId: string; number: StickerNum }) => {
    const st = getStickerFromEntry(e);
    const year = e.editionId !== '26' ? ` · ${EDITIONS.find((x) => x.id === e.editionId)?.year ?? e.editionId}` : '';
    if (!st) return `#${e.number}${year}`;
    const name = stickerName(st, t);
    return `${st.player?.flag ?? ''} ${name} #${e.number}${year}`;
  };

  const addHaveFromEdition = () => {
    const stickers = STICKERS_BY_EDITION[haveEdition] ?? [];
    const dupes = stickers.filter((s) => {
      const e = collection[`${haveEdition}-${s.number}`];
      return e?.owned && e.duplicates > 0;
    });
    setHaveList((prev) => {
      const existing = new Set(prev.map((e) => `${e.editionId}-${e.number}`));
      const toAdd = dupes.filter((s) => !existing.has(`${haveEdition}-${s.number}`)).map((s) => ({ editionId: haveEdition, number: s.number }));
      return [...prev, ...toAdd];
    });
  };

  const addWantFromEdition = () => {
    const stickers = STICKERS_BY_EDITION[wantEdition] ?? [];
    const missing = stickers.filter((s) => !collection[`${wantEdition}-${s.number}`]?.owned);
    setWantList((prev) => {
      const existing = new Set(prev.map((e) => `${e.editionId}-${e.number}`));
      const toAdd = missing.filter((s) => !existing.has(`${wantEdition}-${s.number}`)).map((s) => ({ editionId: wantEdition, number: s.number }));
      return [...prev, ...toAdd];
    });
  };

  const handleSave = async () => {
    await saveTrade(haveList as any, wantList as any);
    if (!useTradesStore.getState().error) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  // ── Image format story Instagram de mon annonce ─────────────────────────
  const storyRef = useRef<HTMLDivElement>(null);
  const [storyBusy, setStoryBusy] = useState(false);
  const handleStory = async () => {
    if (!storyRef.current || !shareToken) return;
    setStoryBusy(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(storyRef.current, { backgroundColor: null, scale: 1 });
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
      if (!blob) return;
      const file = new File([blob], `paninibase-echange-${shareToken}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: t("Mon code d'échange PaniniBase : {code}", { code: shareToken }) }).catch(() => {});
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = file.name; a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setStoryBusy(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}?trade=${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFetch = async (tokenOverride?: string) => {
    const t = (tokenOverride ?? tokenInput).trim();
    if (!t) return;
    setFetching(true);
    const result = await fetchTradeByToken(t);
    setFetchedTrade(result);
    setFetching(false);
  };

  // ── Ouverture via lien partagé (?trade=xxxxx) ───────────────────────────
  useEffect(() => {
    if (!pendingTradeToken) return;
    setTradeTab('find');
    setTokenInput(pendingTradeToken);
    handleFetch(pendingTradeToken);
    setPendingTradeToken(null);
  }, [pendingTradeToken]);

  const handleCompare = async () => {
    if (!compareUsername.trim()) return;
    setComparing(true);
    const result = await compareWithUser(compareUsername.trim());
    setCompareResult(result);
    setComparing(false);
  };

  // ── Calcul des différences de collection ──────────────────────────────────
  const compareData = useMemo(() => {
    if (!compareResult || compareResult === 'not_found' || compareResult === 'self') return null;
    const theirCollection = compareResult.collection;

    const iCanGive: Sticker[] = [];
    const theyCanGive: Sticker[] = [];

    EDITIONS.forEach((ed) => {
      const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
      stickers.forEach((s) => {
        const k = `${ed.id}-${s.number}`;
        const mine = collection[k];
        const theirs = theirCollection[k];
        const myOwned = mine?.owned ?? false;
        const myDupes = mine?.duplicates ?? 0;
        const theirOwned = theirs?.owned ?? false;
        const theirDupes = theirs?.duplicates ?? 0;

        if (myOwned && myDupes > 0 && !theirOwned) iCanGive.push(s);
        if (theirOwned && theirDupes > 0 && !myOwned) theyCanGive.push(s);
      });
    });

    const byShinyFirst = (a: Sticker, b: Sticker) => (a.isShiny === b.isShiny ? 0 : a.isShiny ? -1 : 1);
    iCanGive.sort(byShinyFirst);
    theyCanGive.sort(byShinyFirst);

    const albumStats = EDITIONS.map((ed) => {
      const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
      const myOwnedCount = stickers.filter((s) => collection[`${ed.id}-${s.number}`]?.owned).length;
      const theirOwnedCount = stickers.filter((s) => theirCollection[`${ed.id}-${s.number}`]?.owned).length;
      return {
        edition: ed,
        myPct: ed.totalStickers > 0 ? Math.round((myOwnedCount / ed.totalStickers) * 100) : 0,
        theirPct: ed.totalStickers > 0 ? Math.round((theirOwnedCount / ed.totalStickers) * 100) : 0,
      };
    }).filter((a) => a.myPct > 0 || a.theirPct > 0);

    return { iCanGive, theyCanGive, albumStats };
  }, [compareResult, collection]);

  if (!user) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center', background: C.bgBase }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(201,162,39,0.1)', border: '2px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: C.gold }}><ArrowLeftRight size={32} /></div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: C.textPrimary, marginBottom: '10px' }}>{t('Mode Échange')}</h2>
        <p style={{ fontSize: '13px', color: C.textTertiary, lineHeight: 1.7, marginBottom: '24px', maxWidth: '280px' }}>
          {pendingTradeToken
            ? t("Quelqu'un t'a envoyé son annonce d'échange. Connecte-toi pour voir ce que vous pouvez vous échanger.")
            : t("Connecte-toi pour partager tes doublons et trouver les stickers qu'il te manque.")}
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn-tactile btn-gold" onClick={() => setShowAuth(true)} style={{ padding: '11px 22px', borderRadius: '10px', border: 'none', fontSize: '13px', cursor: 'pointer' }}>{t('Se connecter')}</button>
          <button className="btn-tactile" onClick={() => { setActiveTab('home'); goHome(); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: C.textSecondary, fontSize: '13px', cursor: 'pointer' }}>{t('← Retour')}</button>
        </div>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    );
  }

  return (
    <div className="view-bg" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, padding: '14px 20px 0', background: C.bgCard, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 800, color: C.textPrimary }}><ArrowLeftRight size={16} /> {t('Échanges')}</h1>
        </div>
        <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
          {[
            { key: 'my', label: t('Mon annonce'), Icon: ClipboardList },
            { key: 'find', label: t('Trouver un échange'), Icon: Search },
            { key: 'compare', label: t('Comparer'), Icon: Users },
            { key: 'match', label: newMatchIds.length > 0 ? `${t('Matches')} (${newMatchIds.length})` : t('Matches'), Icon: Zap },
            { key: 'offers', label: waitingOffers > 0 ? `${t('Propositions')} (${waitingOffers})` : t('Propositions'), Icon: Inbox },
          ].map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setTradeTab(key as any)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '12px', fontWeight: activeTab === key ? 700 : 400, color: activeTab === key ? C.textPrimary : C.textTertiary, background: 'none', border: 'none', cursor: 'pointer', borderBottom: `2px solid ${activeTab === key ? C.gold : 'transparent'}`, transition: 'all 0.15s' }}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {activeTab === 'my' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {error && (
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', fontSize: '12px', color: C.redLight }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={13} /> {t('Erreur : {msg}', { msg: error })}
                </div>
                {error.includes('on_conflict') || error.includes('constraint') ? (
                  <p style={{ marginTop: '6px', fontSize: '11px', opacity: 0.85 }}>
                    {t("→ La base de données n'est pas configurée correctement. Contacte l'admin pour appliquer la migration SQL manquante.")}
                  </p>
                ) : null}
              </div>
            )}

            <div style={{ background: C.bgCard, border: '1px solid rgba(46,204,113,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.green }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: C.green }}>{t("J'ai à échanger")}</span>
                <span style={{ fontSize: '11px', color: C.textTertiary }}>({haveList.length})</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <AlbumSelect value={haveEdition} onChange={setHaveEdition} />
                  <button onClick={addHaveFromEdition} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: C.green, background: 'rgba(46,204,113,0.1)', border: '1px solid rgba(46,204,113,0.25)', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <RotateCcw size={13} /> {t('Ajouter mes doublons')}
                  </button>
                </div>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
                {haveList.length === 0 ? (
                  <p style={{ fontSize: '12px', color: C.textTertiary, fontStyle: 'italic', textAlign: 'center', padding: '12px 0' }}>
                    {t('Choisis un album ci-dessus puis clique « Ajouter mes doublons »')}
                  </p>
                ) : haveList.map((entry) => {
                  const s = getStickerFromEntry(entry);
                  if (!s) return null;
                  return <StickerChip key={`${entry.editionId}-${entry.number}`} sticker={s} onRemove={() => setHaveList((l) => l.filter((e) => !(e.editionId === entry.editionId && String(e.number) === String(entry.number))))} />;
                })}
              </div>
              {haveList.length > 0 && (
                <div style={{ padding: '8px 16px 12px' }}>
                  <button onClick={() => { if (confirm(t('Vider ta liste de doublons à échanger ?'))) setHaveList([]); }} style={{ fontSize: '11px', color: C.textTertiary, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>{t('Vider la liste')}</button>
                </div>
              )}
            </div>

            <div style={{ background: C.bgCard, border: '1px solid rgba(231,76,60,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.red }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: C.red }}>{t('Je recherche')}</span>
                <span style={{ fontSize: '11px', color: C.textTertiary }}>({wantList.length})</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <AlbumSelect value={wantEdition} onChange={setWantEdition} />
                  <button onClick={addWantFromEdition} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: C.red, background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.25)', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <RotateCcw size={13} /> {t('Ajouter mes manquants')}
                  </button>
                </div>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
                {wantList.length === 0 ? (
                  <p style={{ fontSize: '12px', color: C.textTertiary, fontStyle: 'italic', textAlign: 'center', padding: '12px 0' }}>
                    {t('Choisis un album ci-dessus puis clique « Ajouter mes manquants »')}
                  </p>
                ) : wantList.map((entry) => {
                  const s = getStickerFromEntry(entry);
                  if (!s) return null;
                  return <StickerChip key={`${entry.editionId}-${entry.number}`} sticker={s} onRemove={() => setWantList((l) => l.filter((e) => !(e.editionId === entry.editionId && String(e.number) === String(entry.number))))} />;
                })}
              </div>
              {wantList.length > 0 && (
                <div style={{ padding: '8px 16px 12px' }}>
                  <button onClick={() => { if (confirm(t('Vider ta liste de stickers recherchés ?'))) setWantList([]); }} style={{ fontSize: '11px', color: C.textTertiary, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>{t('Vider la liste')}</button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className={`btn-tactile${!saved && !loading ? ' btn-gold' : ''}`} onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '13px', borderRadius: '12px', background: saved ? 'rgba(46,204,113,0.15)' : undefined, color: saved ? C.green : undefined, fontWeight: 800, fontSize: '14px', border: saved ? `1px solid ${C.green}` : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                {loading ? '...' : saved ? (<><Check size={15} /> {t('Sauvegardé !')}</>) : (<><Save size={15} /> {t('Sauvegarder mon annonce')}</>)}
              </button>

              {shareToken && (
                <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ fontSize: '11px', color: C.textTertiary, marginBottom: '8px' }}>{t("Ton code d'échange :")}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <code style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)', color: C.gold, fontSize: '14px', fontWeight: 700, letterSpacing: '2px' }}>{shareToken}</code>
                    <button className="btn-tactile" onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', borderRadius: '8px', background: copied ? 'rgba(46,204,113,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${copied ? C.green : 'rgba(255,255,255,0.1)'}`, color: copied ? C.green : C.textSecondary, fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{copied ? <Check size={13} /> : <Link2 size={13} />} {copied ? t('Copié') : t('Copier le lien')}</button>
                  </div>
                  {/* QR code : à montrer à un copain pour qu'il ouvre l'annonce direct */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <QrCode value={`${window.location.origin}?trade=${shareToken}`} size={96} />
                    <p style={{ fontSize: '12px', color: C.textSecondary, lineHeight: 1.5 }}>
                      {t('Montre ce QR code à un autre collectionneur : il ouvre ton annonce directement sur son téléphone.')}
                    </p>
                  </div>
                  <button className="btn-tactile" onClick={handleStory} disabled={storyBusy} style={{ marginTop: '10px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '10px', borderRadius: '10px', background: 'linear-gradient(90deg, rgba(225,48,108,0.18), rgba(131,58,180,0.18))', border: '1px solid rgba(225,48,108,0.4)', color: '#FF8FB8', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                    <Share2 size={14} /> {storyBusy ? t('Création de l’image…') : t('Partager en story')}
                  </button>
                </div>
              )}

              {/* Image story — hors écran, utilisée uniquement pour la capture */}
              {shareToken && (
                <div style={{ position: 'fixed', top: 0, left: '-99999px', pointerEvents: 'none' }} aria-hidden>
                  <TradeStoryCard
                    ref={storyRef}
                    code={shareToken}
                    url={`${window.location.origin}?trade=${shareToken}`}
                    have={haveList.map(getStickerFromEntry).filter(Boolean) as Sticker[]}
                    want={wantList.map(getStickerFromEntry).filter(Boolean) as Sticker[]}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'find' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: C.bgCard, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px' }}>
              <p style={{ fontSize: '12px', color: C.textTertiary, lineHeight: 1.6, marginBottom: '12px' }}>{t("Entre le code d'échange d'un collectionneur pour voir ses doublons et ce qu'il recherche.")}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder={t('Code (ex : a3f9bc)')} onKeyDown={(e) => e.key === 'Enter' && handleFetch()} style={{ flex: 1, padding: '11px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: C.textPrimary, fontSize: '13px', outline: 'none' }} />
                <button className="btn-tactile" onClick={() => handleFetch()} disabled={fetching} style={{ padding: '11px 16px', borderRadius: '10px', background: C.gold, color: '#000', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>{fetching ? '...' : t('Voir →')}</button>
              </div>
            </div>

            {fetchedTrade && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)' }}>
                  <div style={{ color: C.gold, display: 'flex' }}><UserIcon size={20} /></div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>{fetchedTrade.username ?? t('Anonyme')}</p>
                    <p style={{ fontSize: '11px', color: C.textTertiary, margin: '2px 0 0' }}>{t('{n} doublon|{n} doublons', { n: fetchedTrade.have.length })} · {t('{n} recherché|{n} recherchés', { n: fetchedTrade.want.length })}</p>
                  </div>
                </div>
                <div style={{ background: C.bgCard, border: '1px solid rgba(46,204,113,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.green }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: C.green }}>{t('Propose ({n})', { n: fetchedTrade.have.length })}</span>
                  </div>
                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
                    {fetchedTrade.have.map((entry: any) => {
                      const s = getStickerFromEntry(entry);
                      if (!s) return null;
                      const iWant = wantList.some((e) => e.editionId === entry.editionId && String(e.number) === String(entry.number));
                      return <StickerChip key={`${entry.editionId}-${entry.number}`} sticker={s} tag={iWant ? t('← Tu le veux !') : undefined} tagColor={C.green} checked={!!receive[`${entry.editionId}-${entry.number}`]} onToggle={toggle(setReceive, entry)} />;
                    })}
                  </div>
                </div>
                <div style={{ background: C.bgCard, border: '1px solid rgba(231,76,60,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.red }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: C.red }}>{t('Recherche ({n})', { n: fetchedTrade.want.length })}</span>
                  </div>
                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
                    {fetchedTrade.want.map((entry: any) => {
                      const s = getStickerFromEntry(entry);
                      if (!s) return null;
                      const iHave = haveList.some((e) => e.editionId === entry.editionId && String(e.number) === String(entry.number));
                      return <StickerChip key={`${entry.editionId}-${entry.number}`} sticker={s} tag={iHave ? t("← Tu l'as !") : undefined} tagColor={C.gold} checked={!!give[`${entry.editionId}-${entry.number}`]} onToggle={myDupes(entry) > 0 ? toggle(setGive, entry) : undefined} />;
                    })}
                  </div>
                </div>
                {renderValidateBar(fetchedTrade.username ?? t('Anonyme'))}
              </div>
            )}

            {fetchedTrade === null && tokenInput && !fetching && (
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)', textAlign: 'center', fontSize: '13px', color: C.red }}>
                {t('Code introuvable — vérifie le code et réessaie')}
              </div>
            )}
          </div>
        )}

        {activeTab === 'compare' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: C.bgCard, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px' }}>
              <p style={{ fontSize: '12px', color: C.textTertiary, lineHeight: 1.6, marginBottom: '12px' }}>
                {t("Entre le pseudo d'un autre collectionneur pour comparer vos collections : ce que tu peux lui donner, ce qu'il peut te donner.")}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={compareUsername}
                  onChange={(e) => setCompareUsername(e.target.value)}
                  placeholder={t('Pseudo du collectionneur')}
                  onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
                  style={{ flex: 1, padding: '11px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: C.textPrimary, fontSize: '13px', outline: 'none' }}
                />
                <button className="btn-tactile" onClick={handleCompare} disabled={comparing} style={{ padding: '11px 16px', borderRadius: '10px', background: C.gold, color: '#000', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                  {comparing ? '...' : t('Comparer →')}
                </button>
              </div>
            </div>

            {compareResult === 'not_found' && (
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)', textAlign: 'center', fontSize: '13px', color: C.red }}>
                {t("Pseudo introuvable — vérifie l'orthographe exacte.")}
              </div>
            )}
            {compareResult === 'self' && (
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)', textAlign: 'center', fontSize: '13px', color: C.gold }}>
                {t("C'est ton propre pseudo 😄")}
              </div>
            )}

            {compareData && typeof compareResult === 'object' && compareResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Header comparatif */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(46,204,113,0.12)', border: '2px solid rgba(46,204,113,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '14px', fontWeight: 800, color: C.green }}>{t('Toi')}</div>
                  </div>
                  <Users size={18} color={C.textTertiary} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(52,152,219,0.12)', border: '2px solid rgba(52,152,219,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '16px', fontWeight: 800, color: C.blue }}>
                      {compareResult.username.charAt(0).toUpperCase()}
                    </div>
                    <p style={{ fontSize: '11px', color: C.textSecondary }}>{compareResult.username}</p>
                  </div>
                </div>

                {/* Tu peux lui donner */}
                <div style={{ background: C.bgCard, border: '1px solid rgba(46,204,113,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.green }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: C.green }}>{t('Tu peux lui donner ({n})', { n: compareData.iCanGive.length })}</span>
                  </div>
                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
                    {compareData.iCanGive.length === 0 ? (
                      <p style={{ fontSize: '12px', color: C.textTertiary, fontStyle: 'italic', textAlign: 'center', padding: '12px 0' }}>{t("Rien à donner pour l'instant")}</p>
                    ) : (
                      <>
                        {compareData.iCanGive.slice(0, 30).map((s) => <StickerChip key={s.id} sticker={s} tagColor={C.green} checked={!!give[`${s.editionId}-${s.number}`]} onToggle={toggle(setGive, s)} />)}
                        {compareData.iCanGive.length > 30 && <p style={{ fontSize: '11px', color: C.textTertiary, textAlign: 'center' }}>{t('+ {n} autres', { n: compareData.iCanGive.length - 30 })}</p>}
                      </>
                    )}
                  </div>
                </div>

                {/* Il/elle peut te donner */}
                <div style={{ background: C.bgCard, border: '1px solid rgba(52,152,219,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.blue }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: C.blue }}>{t('{name} peut te donner ({n})', { name: compareResult.username, n: compareData.theyCanGive.length })}</span>
                  </div>
                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
                    {compareData.theyCanGive.length === 0 ? (
                      <p style={{ fontSize: '12px', color: C.textTertiary, fontStyle: 'italic', textAlign: 'center', padding: '12px 0' }}>{t("Rien à recevoir pour l'instant")}</p>
                    ) : (
                      <>
                        {compareData.theyCanGive.slice(0, 30).map((s) => <StickerChip key={s.id} sticker={s} tagColor={C.blue} checked={!!receive[`${s.editionId}-${s.number}`]} onToggle={toggle(setReceive, s)} />)}
                        {compareData.theyCanGive.length > 30 && <p style={{ fontSize: '11px', color: C.textTertiary, textAlign: 'center' }}>{t('+ {n} autres', { n: compareData.theyCanGive.length - 30 })}</p>}
                      </>
                    )}
                  </div>
                </div>

                {renderValidateBar(compareResult.username, compareResult.userId)}

                {/* Complétion par album */}
                {compareData.albumStats.length > 0 && (
                  <div style={{ background: C.bgCard, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
                      {t('Complétion par album')} <span style={{ color: C.green }}>● {t('Toi')}</span> <span style={{ color: C.blue }}>● {compareResult.username}</span>
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {compareData.albumStats.map(({ edition, myPct, theirPct }) => (
                        <div key={edition.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: C.textSecondary, marginBottom: '4px' }}>
                            <span>{edition.hostFlag} {edition.year}</span>
                            <span>{myPct}% · {theirPct}%</span>
                          </div>
                          <div style={{ display: 'flex', gap: '3px', height: '5px' }}>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${myPct}%`, background: C.green, transition: 'width 0.5s ease' }} />
                            </div>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${theirPct}%`, background: C.blue, transition: 'width 0.5s ease' }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'offers' && <TradeOffers entryLabel={entryLabel} />}

        {/* ── MATCHING AUTOMATIQUE ── */}
        {activeTab === 'match' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div style={{ padding: '14px 16px', borderRadius: '14px', background: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.2)' }}>
              <p style={{ fontSize: '12px', color: C.textSecondary, lineHeight: 1.6, marginBottom: '12px' }}>
                {t("Trouve automatiquement des collectionneurs avec qui un échange est intéressant pour les deux : ils ont ce que tu veux et tu as ce qu'ils veulent.")}
              </p>
              <p style={{ fontSize: '11px', color: C.textTertiary }}>
                {t('⚠️ Pour apparaître dans les résultats, tu dois avoir sauvegardé une annonce dans « Mon annonce ».')}
              </p>
              <p style={{ fontSize: '11px', color: C.textTertiary, marginTop: '8px' }}>
                {t("PaniniBase cherche de nouveaux matches toutes les 10 minutes tant que l'appli est ouverte.")}{' '}
                {canNotify && notifPermission === 'default' && (
                  <button onClick={askNotifications} style={{ padding: 0, background: 'none', border: 'none', color: C.gold, fontSize: '11px', textDecoration: 'underline', cursor: 'pointer' }}>{t('Me prévenir par notification')}</button>
                )}
                {notifPermission === 'granted' && <span style={{ color: C.green }}>{t('✓ Notifications activées')}</span>}
              </p>
            </div>

            <button
              className="btn-tactile btn-gold"
              onClick={() => findMatches()}
              disabled={matchesLoading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '13px', border: 'none', cursor: matchesLoading ? 'wait' : 'pointer' }}
            >
              {matchesLoading
                ? <><RefreshCw size={14} style={{ animation: 'spin 0.7s linear infinite' }} /> {t('Recherche en cours…')}</>
                : <><Zap size={14} /> {t('Trouver mes matches')}</>
              }
            </button>

            {matches.length === 0 && !matchesLoading && (
              <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: C.textTertiary }}>
                  {t('Clique sur « Trouver mes matches » pour lancer la recherche.')}
                </p>
              </div>
            )}

            {matches.map((match: TradeMatch) => (
              <div key={match.userId} style={{ background: C.bgCard, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                {/* Header du match */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(201,162,39,0.12)', border: '1.5px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: C.gold }}>
                      {match.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: C.textPrimary, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {match.username}
                        {shownAsNew.includes(match.userId) && <span style={{ fontSize: '10px', fontWeight: 800, color: '#fff', background: C.red, padding: '1px 6px', borderRadius: '6px' }}>{t('Nouveau')}</span>}
                      </p>
                      <p style={{ fontSize: '12px', color: C.textSecondary, margin: '2px 0 0' }}>
                        {t('Tu donnes {g}, tu reçois {r}', { g: match.youCanGive.length, r: match.theyCanGive.length })}
                      </p>
                    </div>
                  </div>
                  {/* Badge score coloré */}
                  <span style={{
                    padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                    background: match.matchScore >= 10 ? 'rgba(201,162,39,0.15)' : match.matchScore >= 5 ? 'rgba(46,204,113,0.12)' : 'rgba(52,152,219,0.12)',
                    color: match.matchScore >= 10 ? C.gold : match.matchScore >= 5 ? C.green : C.blue,
                    border: `1px solid ${match.matchScore >= 10 ? 'rgba(201,162,39,0.3)' : match.matchScore >= 5 ? 'rgba(46,204,113,0.25)' : 'rgba(52,152,219,0.25)'}`,
                  }}>
                    {match.matchScore >= 10 ? t('🔥 Top match') : match.matchScore >= 5 ? t('✓ Bon match') : t('Match')}
                  </span>
                </div>

                {/* Détail du match */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                  {/* Il peut te donner */}
                  <div style={{ padding: '10px 14px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: C.green, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                      {t('Te donne ({n})', { n: match.theyCanGive.length })}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '100px', overflowY: 'auto' }}>
                      {match.theyCanGive.slice(0, 8).map((e: any, i: number) => (
                        <span key={i} style={{ fontSize: '11px', color: C.textSecondary, background: 'rgba(255,255,255,0.04)', borderRadius: '4px', padding: '2px 6px', display: 'inline-block' }}>
                          {entryLabel(e)}
                        </span>
                      ))}
                      {match.theyCanGive.length > 8 && <span style={{ fontSize: '11px', color: C.textTertiary }}>{t('+ {n} autres', { n: match.theyCanGive.length - 8 })}</span>}
                    </div>
                  </div>

                  {/* Tu lui donnes */}
                  <div style={{ padding: '10px 14px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                      {t('Tu lui donnes ({n})', { n: match.youCanGive.length })}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '100px', overflowY: 'auto' }}>
                      {match.youCanGive.slice(0, 8).map((e: any, i: number) => (
                        <span key={i} style={{ fontSize: '11px', color: C.textSecondary, background: 'rgba(255,255,255,0.04)', borderRadius: '4px', padding: '2px 6px', display: 'inline-block' }}>
                          {entryLabel(e)}
                        </span>
                      ))}
                      {match.youCanGive.length > 8 && <span style={{ fontSize: '11px', color: C.textTertiary }}>{t('+ {n} autres', { n: match.youCanGive.length - 8 })}</span>}
                    </div>
                  </div>
                </div>

                {/* Bouton contacter */}
                <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-tactile"
                    onClick={() => {
                      setTradeTab('find');
                      setTokenInput(match.shareToken);
                      handleFetch(match.shareToken);
                    }}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', borderRadius: '10px', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.25)', color: C.gold, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    <Search size={16} /> {t('Voir son annonce complète')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
