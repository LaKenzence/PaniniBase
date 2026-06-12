import React from 'react';
import { EDITIONS, STICKERS_BY_EDITION } from '../data/stickers';
import { useUIStore } from '../store';
import { useGlobalStats, useEditionStats } from '../hooks';

const AlbumCard: React.FC<{ editionId: string }> = ({ editionId }) => {
  const { goAlbum } = useUIStore();
  const edition = EDITIONS.find((e) => e.id === editionId)!;
  const { owned, pct, total } = useEditionStats(editionId);
  const catalogued = (STICKERS_BY_EDITION[editionId] ?? []).length;

  return (
    <div
      onClick={() => goAlbum(editionId)}
      className="sticker-holo cursor-pointer rounded-xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
    >
      {/* Cover */}
      <div
        className="relative w-full flex flex-col items-center justify-center p-4"
        style={{ aspectRatio: '3/4', background: edition.bgGradient }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 100%)' }}
        />
        {/* Sheen */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)' }}
        />

        <span className="text-4xl mb-2 relative z-10 drop-shadow-lg">{edition.hostFlag}</span>
        <span className="relative z-10" style={{ fontSize: '26px', fontWeight: 800, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.5)', letterSpacing: '-0.5px' }}>
          {edition.year}
        </span>
        <span className="relative z-10 mt-0.5" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          {edition.hostCountry}
        </span>

        {/* Total badge */}
        <div
          className="absolute top-2 right-2 z-10"
          style={{
            fontSize: '8px',
            padding: '2px 6px',
            borderRadius: '6px',
            background: 'rgba(0,0,0,0.4)',
            color: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {total} stickers
        </div>

        {/* Progress bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] z-10" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: pct === 100 ? 'var(--gold)' : 'var(--green)',
              boxShadow: pct > 0 ? `0 0 6px ${pct === 100 ? 'var(--gold)' : 'var(--green)'}` : 'none',
            }}
          />
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }} className="truncate">
          {edition.label}
        </p>
        <div className="flex justify-between items-center">
          <span style={{ fontSize: '9.5px', color: 'var(--text-tertiary)' }}>
            {catalogued > 0 ? `${owned} / ${catalogued} catalogués` : 'Données à venir'}
          </span>
          {pct > 0 && (
            <span style={{ fontSize: '10px', fontWeight: 700, color: pct === 100 ? 'var(--gold)' : 'var(--green)' }}>
              {pct}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const HomeView: React.FC = () => {
  const { totalCatalogued, totalOwned, totalDupes } = useGlobalStats();

  const stats = [
    { val: EDITIONS.length, lbl: 'Albums', color: 'var(--gold)' },
    { val: totalCatalogued.toLocaleString(), lbl: 'Stickers catalogués', color: 'var(--text-primary)' },
    { val: totalOwned.toLocaleString(), lbl: 'Dans ta collection', color: 'var(--green)' },
    { val: totalDupes.toLocaleString(), lbl: 'Doublons', color: '#F39C12' },
  ];

  return (
    <div className="flex-1 overflow-y-auto slide-in">
      {/* ── Hero ── */}
      <div
        className="relative px-6 py-10 text-center overflow-hidden"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(201,162,39,0.07) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10">
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '8px' }}>
            ⚽ World Cup Edition
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.8px', lineHeight: 1.1, marginBottom: '8px' }}>
            Panini<span style={{ color: 'var(--gold)' }}>Base</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
            Toutes les cartes Panini Coupe du Monde · 1970 — 2026
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 flex-wrap">
            {stats.map(({ val, lbl, color }) => (
              <div key={lbl} className="text-center">
                <div style={{ fontSize: '22px', fontWeight: 800, color, letterSpacing: '-0.5px', lineHeight: 1 }}>
                  {val}
                </div>
                <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  {lbl}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Albums grid ── */}
      <div className="p-5 pb-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Choisir un album
          </h2>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{EDITIONS.length} éditions</span>
        </div>

        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
          {EDITIONS.map((ed) => (
            <AlbumCard key={ed.id} editionId={ed.id} />
          ))}
        </div>
      </div>
    </div>
  );
};
