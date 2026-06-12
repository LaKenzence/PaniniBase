import React from 'react';
import { EDITIONS, STICKERS_BY_EDITION } from '../data/stickers';
import { useUIStore } from '../store';
import { useEditionStats, useTeamStats, useFilteredStickers } from '../hooks';
import { StickerCard } from '../components/StickerCard';
import { DetailPanel } from '../components/DetailPanel';
import type { AlbumFilter } from '../types';

export const AlbumView: React.FC = () => {
  const {
    selectedEditionId,
    selectedStickerNumber,
    albumFilter,
    albumSearch,
    albumTeamFilter,
    goHome,
    selectSticker,
    setAlbumFilter,
    setAlbumSearch,
    setAlbumTeamFilter,
  } = useUIStore();

  const editionId = selectedEditionId!;
  const edition = EDITIONS.find((e) => e.id === editionId)!;
  const { owned, missing, dupes, pct, total } = useEditionStats(editionId);
  const teamStats = useTeamStats(editionId);
  const filtered = useFilteredStickers(editionId, albumFilter, albumSearch, albumTeamFilter);
  const allStickers = STICKERS_BY_EDITION[editionId] ?? [];

  const selectedSticker = selectedStickerNumber != null
    ? (allStickers.find((s) => s.number === selectedStickerNumber) ?? null)
    : null;

  const filterBtns: Array<{ key: AlbumFilter; label: string; activeColor: string; activeBg: string }> = [
    { key: 'all',     label: 'Tous',      activeColor: 'var(--text-primary)',  activeBg: 'var(--bg-elevated)' },
    { key: 'owned',   label: '✓ Possédés', activeColor: 'var(--green)',        activeBg: 'rgba(46,204,113,0.1)' },
    { key: 'missing', label: '○ Manquants',activeColor: 'var(--red)',          activeBg: 'rgba(231,76,60,0.1)' },
    { key: 'dupes',   label: '× Doublons', activeColor: 'var(--gold)',         activeBg: 'rgba(201,162,39,0.1)' },
  ];

  const progressColor = pct === 100 ? 'var(--gold)' : pct > 75 ? 'var(--green)' : pct > 40 ? '#3498DB' : 'var(--red)';

  return (
    <div className="flex flex-col flex-1 overflow-hidden slide-in">
      {/* ── Header ── */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {/* Title row */}
        <div className="flex items-center gap-2.5 mb-3">
          <button
            onClick={goHome}
            className="flex items-center gap-1.5 transition-all hover:opacity-80"
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '4px 8px',
            }}
          >
            ← Albums
          </button>

          <div className="flex items-center gap-2 ml-1">
            <span style={{ fontSize: '20px' }}>{edition.hostFlag}</span>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{edition.label}</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
              {allStickers.length} catalogués · {total} total
            </span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: progressColor }}>
              {pct}%
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 mb-3">
          {[
            { val: owned,   lbl: 'Possédés',    color: 'var(--green)' },
            { val: missing, lbl: 'Manquants',   color: 'var(--red)' },
            { val: dupes,   lbl: 'Doublons',    color: 'var(--gold)' },
            { val: total,   lbl: 'Total album', color: 'var(--text-secondary)' },
          ].map(({ val, lbl, color }) => (
            <div key={lbl} className="text-center">
              <div style={{ fontSize: '16px', fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: '8px', color: 'var(--text-tertiary)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="progress-bar rounded-full mb-3" style={{ height: '4px', background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="progress-fill rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${progressColor}, ${progressColor}cc)`,
              boxShadow: pct > 0 ? `0 0 8px ${progressColor}` : 'none',
            }}
          />
        </div>

        {/* Toolbar */}
        <div className="flex gap-2 flex-wrap items-center mb-2.5">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>🔍</span>
            <input
              type="text"
              value={albumSearch}
              onChange={(e) => setAlbumSearch(e.target.value)}
              placeholder="Joueur ou N°..."
              style={{
                paddingLeft: '26px',
                paddingRight: '10px',
                paddingTop: '5px',
                paddingBottom: '5px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                fontSize: '11.5px',
                outline: 'none',
                width: '140px',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            />
          </div>

          {/* Filter buttons */}
          {filterBtns.map((fb) => {
            const isActive = albumFilter === fb.key;
            return (
              <button
                key={fb.key}
                onClick={() => setAlbumFilter(albumFilter === fb.key ? 'all' : fb.key)}
                style={{
                  fontSize: '10.5px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  border: `1px solid ${isActive ? fb.activeColor : 'var(--border-subtle)'}`,
                  background: isActive ? fb.activeBg : 'transparent',
                  color: isActive ? fb.activeColor : 'var(--text-tertiary)',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.12s',
                  cursor: 'pointer',
                }}
              >
                {fb.label}
              </button>
            );
          })}
        </div>

        {/* Team chips */}
        <div
          className="flex gap-1.5 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          <button
            onClick={() => setAlbumTeamFilter(null)}
            className="team-chip flex-shrink-0"
            style={{
              fontSize: '10px',
              padding: '3px 10px',
              borderRadius: '20px',
              border: `1px solid ${!albumTeamFilter ? 'var(--gold)' : 'var(--border-subtle)'}`,
              background: !albumTeamFilter ? 'rgba(201,162,39,0.1)' : 'transparent',
              color: !albumTeamFilter ? 'var(--gold)' : 'var(--text-tertiary)',
              fontWeight: !albumTeamFilter ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Toutes
          </button>
          {teamStats.map((t) => {
            const isActive = albumTeamFilter === t.name;
            return (
              <button
                key={t.name}
                onClick={() => setAlbumTeamFilter(isActive ? null : t.name)}
                className="team-chip flex-shrink-0"
                style={{
                  fontSize: '10px',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  border: `1px solid ${isActive ? 'var(--gold)' : 'var(--border-subtle)'}`,
                  background: isActive ? 'rgba(201,162,39,0.1)' : 'transparent',
                  color: isActive ? 'var(--gold)' : 'var(--text-tertiary)',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.flag} {t.name}{' '}
                <span style={{ opacity: 0.5 }}>{t.owned}/{t.total}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-3" style={{ background: 'var(--bg-base)' }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: '48px', opacity: 0.15, marginBottom: '12px' }}>🔍</div>
              <p style={{ fontSize: '12px' }}>Aucun sticker trouvé</p>
            </div>
          ) : (
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))' }}
            >
              {filtered.map((s) => (
                <StickerCard
                  key={s.id}
                  sticker={s}
                  selected={s.number === selectedStickerNumber}
                  onClick={() => selectSticker(s.number === selectedStickerNumber ? null : s.number)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <DetailPanel
          editionId={editionId}
          sticker={selectedSticker}
          onClose={() => selectSticker(null)}
        />
      </div>
    </div>
  );
};
