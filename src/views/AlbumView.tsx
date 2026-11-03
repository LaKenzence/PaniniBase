import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { EDITIONS, STICKERS_BY_EDITION } from '../data/stickers';
import { useUIStore, useCollectionStore } from '../store/index';
import { useEditionStats, useTeamStats, useFilteredStickers } from '../hooks';
import { DetailPanel } from '../components/DetailPanel';
import { Confetti } from '../components/Confetti';
import { VirtualStickerGrid, type VirtualStickerGridHandle } from '../components/VirtualStickerGrid';
import { useDebounce } from '../hooks/useDebounce';
import { useEditions } from '../hooks/useEditionData';
import { Undo2, Redo2, ClipboardList, CheckSquare, LayoutGrid, List, SlidersHorizontal, Search, RotateCcw, Star, Share2, Zap, MoreHorizontal, Copy, Flag } from 'lucide-react';
import { ScanMode } from '../components/ScanMode';
import { haptic } from '../lib/haptic';
import { ShareCard } from '../components/ShareCard';
import { TeamProgress } from '../components/TeamProgress';
import { buildTradeList } from '../lib/stickerList';
import { useT, albumName, stickerName } from '../i18n';
import type { AlbumFilter } from '../types';
import { C } from '../theme';
import { clickable } from '../lib/a11y';

type Position = 'all' | 'Gardien' | 'Défenseur' | 'Milieu' | 'Attaquant';
type ViewMode = 'grid' | 'list';

export const AlbumView: React.FC = () => {
  const {
    selectedEditionId, selectedStickerNumber,
    albumFilter, albumSearch, albumTeamFilter,
    goHome, selectSticker,
    setAlbumFilter, setAlbumSearch, setAlbumTeamFilter,
  } = useUIStore();
  const { isOwned, setOwned, setDuplicates, undo, redo, canUndo, canRedo } = useCollectionStore();
  const gridRef = useRef<VirtualStickerGridHandle>(null);

  const [viewMode, setViewMode]           = useState<ViewMode>('grid');
  const [posFilter, setPosFilter]         = useState<Position>('all');
  const [selected, setSelected]           = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode]       = useState(false);
  const [notification, setNotification]   = useState<string | null>(null);
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [bulkInput, setBulkInput]         = useState('');
  const [showFilters, setShowFilters]     = useState(false);
  const [showConfetti, setShowConfetti]   = useState(false);
  const [searchInput, setSearchInput]     = useState(albumSearch);
  const [showMore, setShowMore]           = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const t = useT();

  const debouncedSearch = useDebounce(searchInput, 200);
  useEffect(() => { setAlbumSearch(debouncedSearch); }, [debouncedSearch]);

  const editionId    = selectedEditionId!;
  const albumReady   = useEditions([editionId]);
  const edition      = EDITIONS.find((e) => e.id === editionId)!;
  const { owned, missing, dupes, pct, total } = useEditionStats(editionId);
  const teamStats    = useTeamStats(editionId);
  const teamTotals   = useMemo(() => Object.fromEntries(teamStats.map((team) => [team.name, team])), [teamStats]);
  const allStickers  = STICKERS_BY_EDITION[editionId] ?? [];
  const baseFiltered = useFilteredStickers(editionId, albumFilter, albumSearch, albumTeamFilter);
  // Mémoïsé : évite de refiltrer à chaque re-render (ex: apparition d'un toast)
  const filtered = useMemo(
    () => baseFiltered.filter((s) => posFilter === 'all' || s.player?.position === posFilter),
    [baseFiltered, posFilter]
  );

  const selectedSticker = selectedStickerNumber != null
    ? (allStickers.find((s) => String(s.number) === String(selectedStickerNumber)) ?? null)
    : null;

  const selectedIndex = selectedSticker ? filtered.findIndex((s) => s.id === selectedSticker.id) : -1;
  const progressColor = pct === 100 ? C.gold : pct > 75 ? C.green : pct > 40 ? C.blue : C.red;

  const activeFilterCount = (albumFilter !== 'all' ? 1 : 0) + (posFilter !== 'all' ? 1 : 0) + (albumTeamFilter ? 1 : 0);

  // Toast ; avec `undoable`, il propose « Annuler » (pas de Ctrl+Z sur mobile)
  const [toastUndo, setToastUndo] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const notify = (msg: string, undoable = false) => {
    setNotification(msg);
    setToastUndo(undoable);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setNotification(null), undoable ? 4000 : 2500);
  };
  const undoFromToast = () => {
    if (canUndo()) undo();
    notify(t('↩ Annulé'));
  };

  // ── Confetti quand l'album atteint 100% ──────────────────────────────────
  const prevPct = useRef(pct);
  useEffect(() => {
    if (prevPct.current < 100 && pct === 100) {
      setShowConfetti(true);
      notify(t('🎉 Album complété !'));
      setTimeout(() => setShowConfetti(false), 2000);
    }
    prevPct.current = pct;
  }, [pct]);

  // ── Mini célébration quand UNE équipe atteint 100% (pas tout l'album) ────
  const prevTeamPcts = useRef<Record<string, number>>({});
  useEffect(() => {
    teamStats.forEach((team) => {
      const teamPct = team.total > 0 ? Math.round((team.owned / team.total) * 100) : 0;
      const prev = prevTeamPcts.current[team.name] ?? teamPct;
      if (prev < 100 && teamPct === 100) {
        notify(t('{flag} Équipe {name} complétée !', { flag: team.flag, name: t(team.name) }));
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
      }
      prevTeamPcts.current[team.name] = teamPct;
    });
  }, [teamStats]);

  // ── Ferme le popover filtres au clic extérieur ───────────────────────────
  useEffect(() => {
    if (!showFilters) return;
    const handler = (e: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) setShowFilters(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showFilters]);

  // ── Idem pour le menu « ⋯ » ──────────────────────────────────────────────
  useEffect(() => {
    if (!showMore) return;
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setShowMore(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMore]);

  // ── Partage de la progression en image ──────────────────────────────────
  const handleShare = async () => {
    if (!shareCardRef.current) return;
    setSharing(true);
    try {
      const { default: html2canvas } = await import('html2canvas'); // chargé seulement au partage
      const canvas = await html2canvas(shareCardRef.current, { backgroundColor: null, scale: 2 });
      canvas.toBlob(async (blob) => {
        if (!blob) { setSharing(false); return; }
        const file = new File([blob], `paninibase-${editionId}.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: t('Ma progression PaniniBase'), text: t("{pct}% de l'album {album} complété !", { pct, album: albumName(edition.label, t) }) });
            notify(t('✓ Partagé !'));
          } catch {
            /* utilisateur a annulé le partage — pas une erreur, on ne notifie pas */
          }
        } else {
          // Pas de Web Share API (desktop) : téléchargement direct
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = `paninibase-${editionId}.png`; a.click();
          URL.revokeObjectURL(url);
          notify(t('✓ Image téléchargée !'));
        }
        setSharing(false);
      }, 'image/png');
    } catch {
      setSharing(false);
      notify(t("⚠️ Impossible de générer l'image"));
    }
  };

  // ── Liste manquants / doublons en texte (WhatsApp, bourse d'échange) ─────
  const handleCopyList = async () => {
    // Code Panini quand il existe (« FRA19 », sans espace : recollable dans « Ajout en masse »)
    const label = (s: { number: number; code?: string }) => s.code?.replace(/s/g, '') ?? s.number;
    const missingNums = allStickers.filter((s) => !isOwned(editionId, s.number)).map(label);
    const dupesList = allStickers
      .map((s) => ({ number: label(s), count: useCollectionStore.getState().getDuplicates(editionId, s.number) }))
      .filter((d) => d.count > 0);
    const text = buildTradeList(albumName(edition.label, t), missingNums, dupesList, {
      title: 'PaniniBase', missing: t('Il me manque'), dupes: t('Doublons'), none: t('aucun'),
    });
    try {
      await navigator.clipboard.writeText(text);
      notify(t('✓ Liste copiée — colle-la où tu veux'));
    } catch {
      // Presse-papier refusé (vieux navigateur, page non sécurisée) : partage natif si possible
      if (navigator.share) navigator.share({ text }).catch(() => {});
      else notify(t('⚠️ Copie impossible sur ce navigateur'));
    }
  };

  // ── Raccourcis clavier ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.code === 'Space' && selectedStickerNumber != null && !selectMode) {
        e.preventDefault();
        const cur = isOwned(editionId, selectedStickerNumber);
        setOwned(editionId, selectedStickerNumber, !cur);
        notify(cur ? t('✕ Retiré') : t('✓ Ajouté'), true);
      }
      if (e.code === 'ArrowRight' && selectedIndex !== -1 && !selectMode) {
        e.preventDefault();
        const next = filtered[selectedIndex + 1];
        if (next) selectSticker(next.number);
      }
      if (e.code === 'ArrowLeft' && selectedIndex !== -1 && !selectMode) {
        e.preventDefault();
        const prev = filtered[selectedIndex - 1];
        if (prev) selectSticker(prev.number);
      }
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) { undo(); notify(t('↩ Annulé')); }
      }
      if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyY' || (e.code === 'KeyZ' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo()) { redo(); notify(t('↪ Rétabli')); }
      }
      if (e.code === 'Escape') {
        if (showMore) setShowMore(false);
        else if (showFilters) setShowFilters(false);
        else if (showBulkInput) { setShowBulkInput(false); setBulkInput(''); }
        else if (selectMode) { setSelectMode(false); setSelected(new Set()); }
        else selectSticker(null);
      }
      if (e.code === 'KeyS' && !e.ctrlKey && !e.metaKey) setSelectMode((v) => !v);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedStickerNumber, selectedIndex, selectMode, showBulkInput, showFilters, showMore, editionId, filtered, canUndo, canRedo]);

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const handleCardClick = (s: { id: string; number: string | number }) => {
    if (selectMode) toggleSelect(s.id);
    else selectSticker(String(s.number) === String(selectedStickerNumber) ? null : s.number as any);
  };

  // Appui long sur mobile : colle le sticker, ou ajoute un doublon s'il est déjà là
  const handleLongPress = (s: { number: string | number }) => {
    haptic();
    if (!isOwned(editionId, s.number)) { setOwned(editionId, s.number, true); notify(t('✓ #{n} ajouté', { n: s.number }), true); }
    else { setDuplicates(editionId, s.number, 1); notify(t('+1 doublon pour #{n}', { n: s.number }), true); }
  };

  const addAllSelected = () => {
    let count = 0;
    filtered.forEach((s) => { if (selected.has(s.id) && !isOwned(editionId, s.number)) { setOwned(editionId, s.number, true); count++; } });
    setSelected(new Set()); setSelectMode(false);
    notify(t('✓ {n} sticker ajouté !|✓ {n} stickers ajoutés !', { n: count }));
  };
  // NB : les ajouts groupés font une action d'historique par sticker, donc pas
  // de bouton « Annuler » unique ici (il n'annulerait que le dernier).

  const removeAllSelected = () => {
    let count = 0;
    filtered.forEach((s) => { if (selected.has(s.id) && isOwned(editionId, s.number)) { setOwned(editionId, s.number, false); count++; } });
    setSelected(new Set()); setSelectMode(false);
    notify(t('✕ {n} retiré|✕ {n} retirés', { n: count }));
  };

  const applyBulkInput = () => {
    const parts = bulkInput.split(',').map((p) => p.trim()).filter(Boolean);
    const toAdd: Array<string | number> = [];
    for (const part of parts) {
      const rangeMatch = part.match(/^(\d+)-(\d+)$/);
      if (rangeMatch) {
        const from = parseInt(rangeMatch[1]); const to = parseInt(rangeMatch[2]);
        for (let i = from; i <= to; i++) toAdd.push(i);
        continue;
      }
      const prefixRangeMatch = part.match(/^([A-Za-z]+)(\d+)-[A-Za-z]+(\d+)$/);
      if (prefixRangeMatch) {
        const prefix = prefixRangeMatch[1];
        const from = parseInt(prefixRangeMatch[2]); const to = parseInt(prefixRangeMatch[3]);
        for (let i = from; i <= to; i++) toAdd.push(`${prefix}${i}`);
        continue;
      }
      toAdd.push(isNaN(Number(part)) ? part : Number(part));
    }
    let count = 0;
    toAdd.forEach((n) => {
      // Numéro de l'album ou code Panini (« MEX14 », « MEX 14 »)
      const code = String(n).replace(/\s/g, '').toUpperCase();
      const s = allStickers.find((s) => String(s.number) === String(n) || s.code?.replace(/\s/g, '') === code);
      if (s && !isOwned(editionId, s.number)) { setOwned(editionId, s.number, true); count++; }
    });
    setShowBulkInput(false); setBulkInput('');
    notify(count > 0 ? t('✓ {n} sticker ajouté !|✓ {n} stickers ajoutés !', { n: count }) : t('Aucun sticker trouvé'));
  };

  const resetAllFilters = () => {
    setAlbumFilter('all'); setPosFilter('all'); setAlbumTeamFilter(null);
    setAlbumSearch(''); setSearchInput('');
    setShowFilters(false);
  };

  const filterBtns: Array<{ key: AlbumFilter; label: string; color: string; bg: string }> = [
    { key: 'all',     label: t('Tous'),        color: C.textPrimary, bg: 'rgba(255,255,255,0.07)' },
    { key: 'owned',   label: t('✓ Possédés'),  color: C.green, bg: 'rgba(46,204,113,0.1)' },
    { key: 'missing', label: t('○ Manquants'), color: C.red, bg: 'rgba(231,76,60,0.1)' },
    { key: 'dupes',   label: t('× Doublons'),  color: C.gold, bg: 'rgba(201,162,39,0.1)' },
  ];

  const positions: Array<{ key: Position; label: string; icon: string }> = [
    { key: 'all', label: t('Tous'), icon: '👥' }, { key: 'Gardien', label: t('Gardiens'), icon: '🧤' },
    { key: 'Défenseur', label: t('Défenseurs'), icon: '🛡️' }, { key: 'Milieu', label: t('Milieux'), icon: '⚡' },
    { key: 'Attaquant', label: t('Attaquants'), icon: '🎯' },
  ];

  const iconBtnStyle = (active: boolean): React.CSSProperties => ({
    minWidth: '36px', height: '36px', borderRadius: '9px',
    background: active ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)', color: active ? C.textPrimary : C.textSecondary,
    fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  });

  // Actions secondaires, rangées dans le menu « ⋯ » pour garder la barre lisible sur mobile
  const moreItems: Array<{ Icon: typeof Redo2; label: string; hint?: string; active?: boolean; disabled?: boolean; onClick: () => void }> = [
    { Icon: Redo2, label: t('Rétablir'), hint: 'Ctrl+Y', disabled: !canRedo(), onClick: () => { redo(); notify(t('↪ Rétabli')); } },
    { Icon: Copy, label: t('Copier manquants / doublons'), onClick: handleCopyList },
    { Icon: Flag, label: t('Progression par équipe'), onClick: () => setShowTeams(true) },
    { Icon: ClipboardList, label: t('Ajout en masse'), active: showBulkInput, onClick: () => setShowBulkInput((v) => !v) },
    { Icon: CheckSquare, label: t('Sélection multiple'), hint: 'S', active: selectMode, onClick: () => { setSelectMode((v) => !v); setSelected(new Set()); } },
    { Icon: Share2, label: sharing ? t('Génération…') : t('Partager ma progression'), disabled: sharing, onClick: handleShare },
    viewMode === 'grid'
      ? { Icon: List, label: t('Afficher en liste'), onClick: () => setViewMode('list') }
      : { Icon: LayoutGrid, label: t('Afficher en grille'), onClick: () => setViewMode('grid') },
  ];

  return (
    <div className="slide-in view-bg" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', position: 'relative' }}>

      {showConfetti && <Confetti />}

      {notification && (
        <div role="status" aria-live="polite" className="album-toast" style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 95, display: 'flex', alignItems: 'center', gap: '12px', padding: toastUndo ? '6px 6px 6px 16px' : '10px 16px', borderRadius: '24px', background: C.bgElevated, border: '1px solid rgba(201,162,39,0.4)', color: C.gold, fontSize: '13px', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.6)', animation: 'fadeIn 0.2s ease', whiteSpace: 'nowrap' }}>
          {notification}
          {toastUndo && (
            <button className="btn-tactile" onClick={undoFromToast} style={{ minHeight: '36px', padding: '0 14px', borderRadius: '18px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: C.textPrimary, fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              {t('Annuler')}
            </button>
          )}
        </div>
      )}

      {/* ── Toolbar compacte ── */}
      <div style={{ flexShrink: 0, padding: '10px 16px', background: C.bgCard, borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'relative', zIndex: 30 }}>

        {/* Ligne 1 : titre + actions principales */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <button className="btn-tactile" onClick={goHome} aria-label={t('Retour à la liste des albums')} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: C.textSecondary, fontSize: '11px', cursor: 'pointer' }}>{t('← Albums')}</button>
          <span style={{ fontSize: '18px' }}>{edition.hostFlag}</span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>{albumName(edition.label, t)}</span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: progressColor }}>{pct}%</span>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button className="btn-tactile" onClick={() => { if(canUndo()) { undo(); notify(t('↩ Annulé')); } }} disabled={!canUndo()} title={t('Annuler (Ctrl+Z)')} aria-label={t('Annuler la dernière action')} style={iconBtnStyle(canUndo())}><Undo2 size={16} /></button>
            <button className="btn-tactile" onClick={() => setScanOpen(true)} title={t('Mode scan rapide')} aria-label={t('Ouvrir le mode scan rapide')} style={{ ...iconBtnStyle(false), gap: '6px', padding: '0 12px', fontSize: '12px', fontWeight: 700, color: C.gold, borderColor: 'rgba(201,162,39,0.3)', background: 'rgba(201,162,39,0.08)' }}><Zap size={16} /> {t('Scan')}</button>
            <div ref={moreRef} style={{ position: 'relative' }}>
              <button className="btn-tactile" onClick={() => setShowMore((v) => !v)} title={t("Plus d'actions")} aria-label={t("Plus d'actions")} aria-haspopup="menu" aria-expanded={showMore} style={iconBtnStyle(showMore || showBulkInput || selectMode)}><MoreHorizontal size={18} /></button>
              {showMore && (
                <div role="menu" className="popover-in" style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 40, width: '240px', background: C.bgElevated, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', boxShadow: '0 16px 40px rgba(0,0,0,0.6)', padding: '6px' }}>
                  {moreItems.map(({ Icon, label, hint, active, disabled, onClick }) => (
                    <button
                      key={label}
                      role="menuitem"
                      disabled={disabled}
                      onClick={() => { onClick(); setShowMore(false); }}
                      style={{ width: '100%', minHeight: '44px', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 12px', borderRadius: '9px', border: 'none', background: active ? 'rgba(201,162,39,0.1)' : 'transparent', color: disabled ? C.textTertiary : active ? C.gold : C.textPrimary, fontSize: '13px', textAlign: 'left', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1 }}
                    >
                      <Icon size={16} />
                      <span style={{ flex: 1 }}>{label}</span>
                      {hint && <span className="hide-mobile" style={{ fontSize: '11px', color: C.textTertiary }}>{hint}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ligne 2 : recherche + bouton Filtres (popover) */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '140px', maxWidth: '220px' }}>
            <Search size={12} color={C.textTertiary} style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder={t('Joueur ou N°…')} style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '26px', paddingRight: '10px', paddingTop: '6px', paddingBottom: '6px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: C.textPrimary, fontSize: '12px', outline: 'none' }} onFocus={(e) => (e.currentTarget.style.borderColor = C.gold)} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
          </div>

          {/* Bouton Filtres avec badge */}
          <div ref={filtersRef} style={{ position: 'relative' }}>
            <button
              className="btn-tactile"
              onClick={() => setShowFilters((v) => !v)}
              aria-label={t('Ouvrir les filtres')}
              aria-expanded={showFilters}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 600,
                background: activeFilterCount > 0 ? 'rgba(201,162,39,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${activeFilterCount > 0 ? 'rgba(201,162,39,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: activeFilterCount > 0 ? C.gold : C.textSecondary,
                cursor: 'pointer',
              }}
            >
              <SlidersHorizontal size={15} /> {t('Filtres')}
              {activeFilterCount > 0 && (
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: C.gold, color: '#000', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{activeFilterCount}</span>
              )}
              <span style={{ fontSize: '11px', color: 'inherit', opacity: 0.6 }}>{showFilters ? '▲' : '▼'}</span>
            </button>

            {/* Popover */}
            {showFilters && (
              <div className="popover-in" style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 40, width: '300px', background: C.bgElevated, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', boxShadow: '0 16px 40px rgba(0,0,0,0.6)', padding: '14px' }}>

                {/* Statut */}
                <p style={{ fontSize: '11px', fontWeight: 700, color: C.textTertiary, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{t('Statut')}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {filterBtns.map((fb) => {
                    const active = albumFilter === fb.key;
                    return <button key={fb.key} onClick={() => setAlbumFilter(albumFilter === fb.key ? 'all' : fb.key)} style={{ padding: '5px 10px', borderRadius: '8px', fontSize: '11px', border: `1px solid ${active ? fb.color : 'rgba(255,255,255,0.08)'}`, background: active ? fb.bg : 'transparent', color: active ? fb.color : C.textSecondary, fontWeight: active ? 600 : 400, cursor: 'pointer' }}>{fb.label}</button>;
                  })}
                </div>

                {/* Position */}
                <p style={{ fontSize: '11px', fontWeight: 700, color: C.textTertiary, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{t('Poste')}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {positions.map(({ key, label, icon }) => {
                    const active = posFilter === key;
                    return <button key={key} onClick={() => setPosFilter(key)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', border: `1px solid ${active ? C.gold : 'rgba(255,255,255,0.08)'}`, background: active ? 'rgba(201,162,39,0.1)' : 'transparent', color: active ? C.gold : C.textSecondary, fontWeight: active ? 600 : 400, cursor: 'pointer' }}><span>{icon}</span> {label}</button>;
                  })}
                </div>

                {/* Équipe */}
                <p style={{ fontSize: '11px', fontWeight: 700, color: C.textTertiary, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{t('Équipe')}</p>
                <select
                  value={albumTeamFilter ?? ''}
                  onChange={(e) => setAlbumTeamFilter(e.target.value === '' ? null : e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', borderRadius: '8px', fontSize: '11px', border: `1px solid ${albumTeamFilter ? C.gold : 'rgba(255,255,255,0.08)'}`, background: albumTeamFilter ? 'rgba(201,162,39,0.08)' : 'rgba(255,255,255,0.04)', color: albumTeamFilter ? C.gold : C.textSecondary, outline: 'none', cursor: 'pointer', marginBottom: '14px' }}
                >
                  <option value="" style={{ background: C.bgElevated, color: C.textSecondary }}>{t('🌍 Toutes les équipes')}</option>
                  {teamStats.map((team) => (
                    <option key={team.name} value={team.name} style={{ background: C.bgElevated, color: C.textPrimary }}>{team.flag} {t(team.name)} — {team.owned}/{team.total}</option>
                  ))}
                </select>

                <button onClick={resetAllFilters} style={{ width: '100%', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: C.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <RotateCcw size={12} /> {t('Réinitialiser les filtres')}
                </button>
              </div>
            )}
          </div>

          {/* Compteurs = filtres en un tap (« qu'est-ce qu'il me manque ? ») */}
          <div className="album-quick-filters" style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            {([{ key: 'owned', val: owned, lbl: t('possédés'), color: C.green }, { key: 'missing', val: missing, lbl: t('manquants'), color: C.red }, { key: 'dupes', val: dupes, lbl: t('doublons'), color: C.gold }] as const).map((s) => {
              const active = albumFilter === s.key;
              return (
                <button
                  key={s.key}
                  className="btn-tactile"
                  onClick={() => setAlbumFilter(active ? 'all' : s.key)}
                  aria-pressed={active}
                  title={active ? t('Afficher tous les stickers') : t('Afficher seulement les {what}', { what: s.lbl })}
                  style={{ minHeight: '32px', padding: '0 10px', borderRadius: '16px', fontSize: '11.5px', whiteSpace: 'nowrap', cursor: 'pointer', color: active ? s.color : C.textSecondary, background: active ? `${s.color}1A` : 'transparent', border: `1px solid ${active ? s.color : 'rgba(255,255,255,0.08)'}` }}
                >
                  <span style={{ fontWeight: 800, color: s.color }}>{s.val}</span> {s.lbl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ajout en masse panel */}
        {showBulkInput && (
          <div style={{ marginTop: '10px', padding: '12px', borderRadius: '12px', background: 'rgba(52,152,219,0.06)', border: '1px solid rgba(52,152,219,0.2)' }}>
            <p style={{ fontSize: '11px', color: C.blue, marginBottom: '8px', fontWeight: 600 }}>
              📋 {t('Ajout en masse — colle tes numéros (ex :')} <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 4px', borderRadius: '3px' }}>1,5,12-18,MEX1,MEX5</code>)
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input autoFocus value={bulkInput} onChange={(e) => setBulkInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') applyBulkInput(); if (e.key === 'Escape') { setShowBulkInput(false); setBulkInput(''); } }} placeholder="1,5,12-18,22,MEX1-MEX5..." style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(52,152,219,0.4)', background: 'rgba(255,255,255,0.04)', color: C.textPrimary, fontSize: '12px', outline: 'none' }} />
              <button className="btn-tactile btn-gold" onClick={applyBulkInput} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>{t('Ajouter')}</button>
              <button className="btn-tactile" onClick={() => { setShowBulkInput(false); setBulkInput(''); }} style={{ padding: '8px 10px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: C.textTertiary, cursor: 'pointer', fontSize: '12px' }}>✕</button>
            </div>
          </div>
        )}

        {/* Barre sélection multiple */}
        {selectMode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.2)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: C.gold, fontWeight: 600 }}>{t('{n} sélectionné|{n} sélectionnés', { n: selected.size })}</span>
            <button onClick={() => setSelected(new Set(filtered.map((s) => s.id)))} style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '11px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: C.textSecondary, cursor: 'pointer' }}>{t('Tout ({n})', { n: filtered.length })}</button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
              <button className={`btn-tactile ${selected.size > 0 ? 'btn-green' : ''}`} onClick={addAllSelected} disabled={selected.size === 0} style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: selected.size > 0 ? undefined : 'transparent', border: selected.size > 0 ? 'none' : '1px solid rgba(255,255,255,0.08)', color: selected.size > 0 ? undefined : C.textTertiary, cursor: selected.size > 0 ? 'pointer' : 'default' }}>{t('✓ Ajouter')}</button>
              <button className="btn-tactile" onClick={removeAllSelected} disabled={selected.size === 0} style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: selected.size > 0 ? 'rgba(231,76,60,0.12)' : 'transparent', border: `1px solid ${selected.size > 0 ? C.red : 'rgba(255,255,255,0.08)'}`, color: selected.size > 0 ? C.red : C.textTertiary, cursor: selected.size > 0 ? 'pointer' : 'default' }}>{t('✕ Retirer')}</button>
              <button onClick={() => { setSelectMode(false); setSelected(new Set()); }} style={{ padding: '5px 10px', borderRadius: '8px', fontSize: '11px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: C.textTertiary, cursor: 'pointer' }}>{t('Annuler')}</button>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', marginTop: '10px' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: progressColor, boxShadow: `0 0 8px ${progressColor}`, transition: 'width 0.6s ease' }} />
        </div>

        {/* Pages de l'album : une pastille par équipe, clic = aller à sa page */}
        {viewMode === 'grid' && !albumTeamFilter && teamStats.length > 1 && (
          <div className="team-strip" style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginTop: '10px', paddingBottom: '2px', scrollbarWidth: 'none' }}>
            {teamStats.map((team) => {
              const done = team.owned === team.total;
              return (
                <button
                  key={team.name}
                  className="btn-tactile"
                  onClick={() => gridRef.current?.scrollToTeam(team.name)}
                  title={`${t(team.name)} — ${team.owned}/${team.total}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0, padding: '4px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', background: done ? 'rgba(201,162,39,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${done ? 'rgba(201,162,39,0.4)' : 'rgba(255,255,255,0.08)'}`, color: done ? C.gold : C.textSecondary }}
                >
                  <span style={{ fontSize: '13px' }}>{team.flag}</span>
                  {team.owned}/{team.total}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'hidden', background: C.bgBase, position: 'relative' }}>
          {!albumReady ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: C.textTertiary }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: C.gold, animation: 'spin 0.7s linear infinite' }} />
              <p style={{ fontSize: '12px' }}>{t("Ouverture de l'album…")}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: C.textTertiary, textAlign: 'center', padding: '0 20px' }}>
              <div className="empty-state-icon" style={{ opacity: 0.3, marginBottom: '14px', color: C.textTertiary }}><Search size={48} /></div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: C.textSecondary, marginBottom: '6px' }}>{t('Aucun sticker trouvé')}</p>
              <p style={{ fontSize: '11.5px', color: C.textTertiary, marginBottom: '16px', maxWidth: '240px' }}>
                {t("Essaie d'ajuster tes filtres ou ta recherche pour voir plus de stickers.")}
              </p>
              {activeFilterCount > 0 || albumSearch ? (
                <button className="btn-tactile" onClick={resetAllFilters} style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)', color: C.gold, fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RotateCcw size={14} /> {t('Réinitialiser les filtres')}
                </button>
              ) : null}
            </div>
          ) : viewMode === 'grid' ? (
            // Grille virtualisée — ne rend que les cartes visibles, indispensable pour les gros albums (2026 = 980 stickers)
            <div style={{ position: 'absolute', inset: 0, padding: '6px' }}>
              <VirtualStickerGrid
                ref={gridRef}
                stickers={filtered}
                selectMode={selectMode}
                selected={selected}
                selectedStickerNumber={selectedStickerNumber}
                onCardClick={handleCardClick}
                onLongPress={handleLongPress}
                groupByTeam
                teamTotals={teamTotals}
              />
            </div>
          ) : (
            <div style={{ height: '100%', overflowY: 'auto', padding: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {filtered.map((s) => {
                  const ownedS = isOwned(editionId, s.number);
                  const isBadge = s.category === 'badge';
                  const isSelected = selectMode ? selected.has(s.id) : String(s.number) === String(selectedStickerNumber);
                  return (
                    <div key={s.id} {...clickable(() => handleCardClick(s), `${s.code ?? `#${s.number}`} ${stickerName(s, t)}${ownedS ? `, ${t('possédé')}` : ''}`)} aria-pressed={isSelected} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '12px', cursor: 'pointer', background: isSelected ? 'rgba(201,162,39,0.08)' : ownedS ? 'rgba(46,204,113,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isSelected ? 'rgba(201,162,39,0.3)' : ownedS ? 'rgba(46,204,113,0.15)' : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.12s' }}>
                      {selectMode && <div style={{ width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0, background: selected.has(s.id) ? C.gold : 'transparent', border: `2px solid ${selected.has(s.id) ? C.gold : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#000', fontWeight: 800 }}>{selected.has(s.id) ? '✓' : ''}</div>}
                      <span style={{ fontSize: '11px', fontWeight: 700, color: C.textTertiary, width: '40px', flexShrink: 0, textAlign: 'right' }}>{s.code ?? `#${s.number}`}</span>
                      <span style={{ fontSize: '20px', flexShrink: 0 }}>{s.player?.flag}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: ownedS ? C.textPrimary : C.textSecondary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stickerName(s, t)}</p>
                        <p style={{ fontSize: '11px', color: C.textTertiary, margin: '1px 0 0' }}>{isBadge ? t('Écusson') : s.category === 'player' ? [s.player?.position && t(s.player.position), s.player?.club].filter(Boolean).join(' · ') || t('Joueur') : t('Sticker spécial')}</p>
                      </div>
                      {s.isShiny && <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 700, color: C.gold, background: 'rgba(201,162,39,0.12)', padding: '2px 7px', borderRadius: '6px', flexShrink: 0 }}><Star size={10} fill={C.gold} /> SHINY</span>}
                      <div style={{ flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%', background: ownedS ? 'rgba(46,204,113,0.2)' : 'transparent', border: `1.5px solid ${ownedS ? C.green : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: C.green }}>{ownedS ? '✓' : ''}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {!selectMode && (
          <div className={`album-detail-panel${selectedSticker ? '' : ' album-detail-panel--empty'}`} style={{ height: '100%', display: 'flex', minHeight: 0 }}>
            <DetailPanel editionId={editionId} sticker={selectedSticker} onClose={() => selectSticker(null)} />
          </div>
        )}
      </div>

      {/* Mobile bottom sheet — swipe ← → pour changer de sticker, swipe ↓ pour fermer */}
      {!selectMode && selectedSticker && (
        <div className="mobile-detail-sheet" style={{ position: 'fixed', inset: 0, zIndex: 90, display: 'none', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(4,8,20,0.85)', backdropFilter: 'blur(8px)' }} onClick={(e) => e.target === e.currentTarget && selectSticker(null)}>
          <div
            style={{ background: C.bgCard, borderTop: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px 24px 0 0', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => { touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
            onTouchEnd={(e) => {
              const start = touchStartRef.current;
              touchStartRef.current = null;
              if (!start) return;
              const dx = e.changedTouches[0].clientX - start.x;
              const dy = e.changedTouches[0].clientY - start.y;
              // Swipe vers le bas (dominant) = fermer
              if (Math.abs(dy) > Math.abs(dx) && dy > 70) {
                selectSticker(null);
                return;
              }
              // Swipe horizontal (dominant) = sticker précédent / suivant
              if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
                if (dx < 0) {
                  const next = filtered[selectedIndex + 1];
                  if (next) selectSticker(next.number);
                } else {
                  const prev = filtered[selectedIndex - 1];
                  if (prev) selectSticker(prev.number);
                }
              }
            }}
          >
            <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, borderRadius: '24px 24px 0 0' }} />
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}><div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.15)' }} /></div>
            {filtered.length > 1 && (
              <div style={{ textAlign: 'center', fontSize: '11px', color: C.textTertiary, marginBottom: '4px' }}>
                {selectedIndex + 1} / {filtered.length} · {t('glisse ← → pour naviguer')}
              </div>
            )}
            <div className="mobile-detail-content">
              <DetailPanel editionId={editionId} sticker={selectedSticker} onClose={() => selectSticker(null)} />
            </div>
          </div>
        </div>
      )}
      {/* Mode scan rapide */}
      {scanOpen && <ScanMode editionId={editionId} onClose={() => setScanOpen(false)} />}

      {showTeams && (
        <TeamProgress
          teams={teamStats}
          onClose={() => setShowTeams(false)}
          onPick={(team) => { setAlbumTeamFilter(team); setShowTeams(false); }}
        />
      )}

      {/* Carte de partage — hors écran, utilisée uniquement pour la capture d'image */}
      <div style={{ position: 'fixed', top: 0, left: '-9999px', pointerEvents: 'none' }}>
        <ShareCard
          ref={shareCardRef}
          hostFlag={edition.hostFlag}
          label={albumName(edition.label, t)}
          year={edition.year}
          pct={pct}
          owned={owned}
          total={total}
        />
      </div>
    </div>
  );
};
