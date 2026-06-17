import React, { useState, useEffect, useCallback } from 'react';
import { EDITIONS, STICKERS_BY_EDITION } from '../data/stickers';
import { useUIStore, useCollectionStore } from '../store/index';
import { useEditionStats, useTeamStats, useFilteredStickers } from '../hooks';
import { StickerCard } from '../components/StickerCard';
import { DetailPanel } from '../components/DetailPanel';
import type { AlbumFilter } from '../types';

type Position = 'all' | 'Gardien' | 'Défenseur' | 'Milieu' | 'Attaquant';
type ViewMode = 'grid' | 'list';

export const AlbumView: React.FC = () => {
  const {
    selectedEditionId, selectedStickerNumber,
    albumFilter, albumSearch, albumTeamFilter,
    goHome, selectSticker,
    setAlbumFilter, setAlbumSearch, setAlbumTeamFilter,
  } = useUIStore();
  const { isOwned, setOwned } = useCollectionStore();

  const [viewMode, setViewMode]       = useState<ViewMode>('grid');
  const [posFilter, setPosFilter]     = useState<Position>('all');
  const [selected, setSelected]       = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode]   = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const editionId = selectedEditionId!;
  const edition   = EDITIONS.find((e) => e.id === editionId)!;
  const { owned, missing, dupes, pct, total } = useEditionStats(editionId);
  const teamStats  = useTeamStats(editionId);
  const allStickers = STICKERS_BY_EDITION[editionId] ?? [];
  const filtered   = useFilteredStickers(editionId, albumFilter, albumSearch, albumTeamFilter)
    .filter((s) => posFilter === 'all' || s.player?.position === posFilter);

  const selectedSticker = selectedStickerNumber != null
    ? (allStickers.find((s) => s.number === selectedStickerNumber) ?? null)
    : null;

  const progressColor = pct === 100 ? '#C9A227' : pct > 75 ? '#2ECC71' : pct > 40 ? '#3498DB' : '#E74C3C';

  // ── Notification helper ──────────────────────────────────────────────────────
  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // ── Raccourci clavier ────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Espace = toggle owned sur le sticker sélectionné
      if (e.code === 'Space' && selectedStickerNumber != null && !selectMode) {
        e.preventDefault();
        const cur = isOwned(editionId, selectedStickerNumber);
        setOwned(editionId, selectedStickerNumber, !cur);
        notify(cur ? '✕ Retiré de ta collection' : '✓ Ajouté à ta collection');
      }
      // Escape = désélectionner / quitter mode select
      if (e.code === 'Escape') {
        if (selectMode) { setSelectMode(false); setSelected(new Set()); }
        else selectSticker(null);
      }
      // S = activer mode sélection multiple
      if (e.code === 'KeyS' && !e.ctrlKey && !e.metaKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag !== 'INPUT') setSelectMode((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedStickerNumber, selectMode, editionId, isOwned, setOwned]);

  // ── Sélection multiple ───────────────────────────────────────────────────────
  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleCardClick = (s: { id: string; number: string | number }) => {
    if (selectMode) {
      toggleSelect(s.id);
    } else {
      selectSticker(s.number === selectedStickerNumber ? null : s.number as number);
    }
  };

  const addAllSelected = () => {
    let count = 0;
    filtered.forEach((s) => {
      if (selected.has(s.id) && !isOwned(editionId, s.number)) { setOwned(editionId, s.number, true); count++; }
    });
    setSelected(new Set());
    setSelectMode(false);
    notify(`✓ ${count} sticker${count > 1 ? 's' : ''} ajouté${count > 1 ? 's' : ''} !`);
  };

  const removeAllSelected = () => {
    let count = 0;
    filtered.forEach((s) => {
      if (selected.has(s.id) && isOwned(editionId, s.number)) { setOwned(editionId, s.number, false); count++; }
    });
    setSelected(new Set());
    setSelectMode(false);
    notify(`✕ ${count} sticker${count > 1 ? 's' : ''} retiré${count > 1 ? 's' : ''}`);
  };

  const selectAllFiltered = () => {
    setSelected(new Set(filtered.map((s) => s.id)));
  };

  const filterBtns: Array<{ key: AlbumFilter; label: string; color: string; bg: string }> = [
    { key: 'all',     label: 'Tous',        color: '#F0F4FF', bg: 'rgba(255,255,255,0.07)' },
    { key: 'owned',   label: '✓ Possédés',  color: '#2ECC71', bg: 'rgba(46,204,113,0.1)' },
    { key: 'missing', label: '○ Manquants', color: '#E74C3C', bg: 'rgba(231,76,60,0.1)' },
    { key: 'dupes',   label: '× Doublons',  color: '#C9A227', bg: 'rgba(201,162,39,0.1)' },
  ];

  const positions: Array<{ key: Position; label: string; icon: string }> = [
    { key: 'all',       label: 'Tous',       icon: '👥' },
    { key: 'Gardien',   label: 'Gardiens',   icon: '🧤' },
    { key: 'Défenseur', label: 'Défenseurs', icon: '🛡️' },
    { key: 'Milieu',    label: 'Milieux',    icon: '⚡' },
    { key: 'Attaquant', label: 'Attaquants', icon: '🎯' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', position: 'relative' }}>

      {/* ── Notification toast ── */}
      {notification && (
        <div style={{
          position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 50, padding: '8px 16px', borderRadius: '20px',
          background: '#0D1526', border: '1px solid rgba(201,162,39,0.4)',
          color: '#C9A227', fontSize: '12px', fontWeight: 600,
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.2s ease',
          whiteSpace: 'nowrap',
        }}>
          {notification}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ flexShrink: 0, padding: '12px 16px', background: '#0D1526', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <button onClick={goHome} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#8A9BBF', fontSize: '11px', cursor: 'pointer' }}>
            ← Albums
          </button>
          <span style={{ fontSize: '18px' }}>{edition.hostFlag}</span>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#F0F4FF' }}>{edition.label}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Sélection multiple toggle */}
            <button
              onClick={() => { setSelectMode((v) => !v); setSelected(new Set()); }}
              style={{
                padding: '4px 10px', borderRadius: '8px', fontSize: '11px',
                background: selectMode ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${selectMode ? 'rgba(201,162,39,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: selectMode ? '#C9A227' : '#4A5A7A', cursor: 'pointer', transition: 'all 0.15s',
              }}
              title="Mode sélection multiple (raccourci: S)"
            >
              ☑ Sélection
            </button>
            {/* View mode */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '2px', gap: '2px' }}>
              {(['grid', 'list'] as ViewMode[]).map((m) => (
                <button key={m} onClick={() => setViewMode(m)} style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '13px', background: viewMode === m ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', cursor: 'pointer', color: viewMode === m ? '#F0F4FF' : '#4A5A7A' }}>
                  {m === 'grid' ? '⊞' : '☰'}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: progressColor }}>{pct}%</span>
          </div>
        </div>

        {/* Barre sélection multiple */}
        {selectMode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.2)' }}>
            <span style={{ fontSize: '11px', color: '#C9A227', fontWeight: 600 }}>
              {selected.size} sélectionné{selected.size > 1 ? 's' : ''}
            </span>
            <button onClick={selectAllFiltered} style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '10.5px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#8A9BBF', cursor: 'pointer' }}>
              Tout sélectionner ({filtered.length})
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
              <button
                onClick={addAllSelected}
                disabled={selected.size === 0}
                style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: selected.size > 0 ? 'rgba(46,204,113,0.15)' : 'transparent', border: `1px solid ${selected.size > 0 ? '#2ECC71' : 'rgba(255,255,255,0.08)'}`, color: selected.size > 0 ? '#2ECC71' : '#4A5A7A', cursor: selected.size > 0 ? 'pointer' : 'default' }}
              >
                ✓ Ajouter
              </button>
              <button
                onClick={removeAllSelected}
                disabled={selected.size === 0}
                style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: selected.size > 0 ? 'rgba(231,76,60,0.12)' : 'transparent', border: `1px solid ${selected.size > 0 ? '#E74C3C' : 'rgba(255,255,255,0.08)'}`, color: selected.size > 0 ? '#E74C3C' : '#4A5A7A', cursor: selected.size > 0 ? 'pointer' : 'default' }}
              >
                ✕ Retirer
              </button>
              <button onClick={() => { setSelectMode(false); setSelected(new Set()); }} style={{ padding: '5px 10px', borderRadius: '8px', fontSize: '11px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#4A5A7A', cursor: 'pointer' }}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
          {[
            { val: owned,   lbl: 'Possédés',  color: '#2ECC71' },
            { val: missing, lbl: 'Manquants',  color: '#E74C3C' },
            { val: dupes,   lbl: 'Doublons',   color: '#C9A227' },
            { val: total,   lbl: 'Total',      color: '#8A9BBF' },
          ].map(({ val, lbl, color }) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: '8px', color: '#4A5A7A', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{lbl}</div>
            </div>
          ))}
          <div className="hide-mobile" style={{ marginLeft: 'auto', fontSize: '9px', color: '#4A5A7A', alignSelf: 'flex-end', paddingBottom: '2px' }}>
            Espace = ✓/✕ · S = sélection · Esc = fermer
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: progressColor, borderRadius: '2px', boxShadow: `0 0 8px ${progressColor}`, transition: 'width 0.6s ease' }} />
        </div>

        {/* Search + filters */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#4A5A7A', pointerEvents: 'none' }}>🔍</span>
            <input
              type="text"
              value={albumSearch}
              onChange={(e) => setAlbumSearch(e.target.value)}
              placeholder="Joueur ou N°..."
              style={{ paddingLeft: '26px', paddingRight: '10px', paddingTop: '6px', paddingBottom: '6px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#F0F4FF', fontSize: '12px', outline: 'none', width: '140px' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#C9A227')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>
          {filterBtns.map((fb) => {
            const active = albumFilter === fb.key;
            return (
              <button key={fb.key} onClick={() => setAlbumFilter(albumFilter === fb.key ? 'all' : fb.key)} style={{ padding: '5px 10px', borderRadius: '8px', fontSize: '11px', border: `1px solid ${active ? fb.color : 'rgba(255,255,255,0.08)'}`, background: active ? fb.bg : 'transparent', color: active ? fb.color : '#4A5A7A', fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 0.12s' }}>
                {fb.label}
              </button>
            );
          })}
        </div>

        {/* Position filter */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '8px', flexWrap: 'wrap' }}>
          {positions.map(({ key, label, icon }) => {
            const active = posFilter === key;
            return (
              <button key={key} onClick={() => setPosFilter(key)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '10.5px', border: `1px solid ${active ? '#C9A227' : 'rgba(255,255,255,0.07)'}`, background: active ? 'rgba(201,162,39,0.1)' : 'transparent', color: active ? '#C9A227' : '#4A5A7A', fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 0.12s' }}>
                <span style={{ fontSize: '11px' }}>{icon}</span> {label}
              </button>
            );
          })}
        </div>

        {/* Team chips */}
        <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
          <button onClick={() => setAlbumTeamFilter(null)} style={{ flexShrink: 0, padding: '3px 10px', borderRadius: '20px', fontSize: '10px', border: `1px solid ${!albumTeamFilter ? '#C9A227' : 'rgba(255,255,255,0.07)'}`, background: !albumTeamFilter ? 'rgba(201,162,39,0.1)' : 'transparent', color: !albumTeamFilter ? '#C9A227' : '#4A5A7A', fontWeight: !albumTeamFilter ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Toutes
          </button>
          {teamStats.map((t) => {
            const active = albumTeamFilter === t.name;
            return (
              <button key={t.name} onClick={() => setAlbumTeamFilter(active ? null : t.name)} style={{ flexShrink: 0, padding: '3px 10px', borderRadius: '20px', fontSize: '10px', border: `1px solid ${active ? '#C9A227' : 'rgba(255,255,255,0.07)'}`, background: active ? 'rgba(201,162,39,0.1)' : 'transparent', color: active ? '#C9A227' : '#4A5A7A', fontWeight: active ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {t.flag} {t.name} <span style={{ opacity: 0.4 }}>{t.owned}/{t.total}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px', background: '#070C18' }}>
          {filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#4A5A7A' }}>
              <div style={{ fontSize: '48px', opacity: 0.15, marginBottom: '12px' }}>🔍</div>
              <p style={{ fontSize: '13px' }}>Aucun sticker trouvé</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="album-grid-mobile" style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))' }}>
              {filtered.map((s) => (
                <div
                  key={s.id}
                  style={{ position: 'relative' }}
                  onClick={() => handleCardClick(s)}
                >
                  <StickerCard
                    sticker={s}
                    selected={selectMode ? selected.has(s.id) : s.number === selectedStickerNumber}
                    onClick={() => {}}
                  />
                  {/* Checkbox overlay en mode sélection */}
                  {selectMode && (
                    <div style={{
                      position: 'absolute', top: '5px', left: '5px', zIndex: 10,
                      width: '18px', height: '18px', borderRadius: '5px',
                      background: selected.has(s.id) ? '#C9A227' : 'rgba(0,0,0,0.6)',
                      border: `2px solid ${selected.has(s.id) ? '#C9A227' : 'rgba(255,255,255,0.4)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', color: '#000', fontWeight: 800,
                      transition: 'all 0.12s',
                    }}>
                      {selected.has(s.id) ? '✓' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {filtered.map((s) => {
                const ownedSticker = isOwned(editionId, s.number);
                const isBadge = s.category === 'badge';
                const isSelected = selectMode ? selected.has(s.id) : s.number === selectedStickerNumber;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleCardClick(s)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '12px', cursor: 'pointer', background: isSelected ? 'rgba(201,162,39,0.08)' : ownedSticker ? 'rgba(46,204,113,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isSelected ? 'rgba(201,162,39,0.3)' : ownedSticker ? 'rgba(46,204,113,0.15)' : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.12s' }}
                  >
                    {selectMode && (
                      <div style={{ width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0, background: selected.has(s.id) ? '#C9A227' : 'transparent', border: `2px solid ${selected.has(s.id) ? '#C9A227' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#000', fontWeight: 800 }}>
                        {selected.has(s.id) ? '✓' : ''}
                      </div>
                    )}
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#4A5A7A', width: '40px', flexShrink: 0, textAlign: 'right' }}>
                      {typeof s.number === 'string' ? s.number : `#${s.number}`}
                    </span>
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>{s.player?.flag}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: ownedSticker ? '#F0F4FF' : '#8A9BBF', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {isBadge ? `Écusson ${s.teamName}` : s.player?.name}
                      </p>
                      <p style={{ fontSize: '10.5px', color: '#4A5A7A', margin: '1px 0 0' }}>
                        {isBadge ? 'Écusson' : `${s.player?.position}${s.player?.club ? ` · ${s.player.club}` : ''}`}
                      </p>
                    </div>
                    {s.isShiny && (
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#C9A227', background: 'rgba(201,162,39,0.12)', padding: '2px 7px', borderRadius: '6px', flexShrink: 0 }}>★ SHINY</span>
                    )}
                    <div style={{ flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%', background: ownedSticker ? 'rgba(46,204,113,0.2)' : 'transparent', border: `1.5px solid ${ownedSticker ? '#2ECC71' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#2ECC71' }}>
                      {ownedSticker ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail panel desktop — caché en mode sélection et sur mobile */}
        {!selectMode && (
          <div className="album-detail-panel">
            <DetailPanel
              editionId={editionId}
              sticker={selectedSticker}
              onClose={() => selectSticker(null)}
            />
          </div>
        )}
      </div>

      {/* Detail panel mobile — bottom sheet overlay */}
      {!selectMode && selectedSticker && (
        <div
          className="mobile-detail-sheet"
          style={{ position: 'fixed', inset: 0, zIndex: 90, display: 'none', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(4,8,20,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => e.target === e.currentTarget && selectSticker(null)}
        >
          <div
            style={{ background: '#0D1526', borderTop: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px 24px 0 0', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #C9A227, transparent)', borderRadius: '24px 24px 0 0' }} />
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.15)' }} />
            </div>
            <div className="mobile-detail-content">
              <DetailPanel
                editionId={editionId}
                sticker={selectedSticker}
                onClose={() => selectSticker(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
