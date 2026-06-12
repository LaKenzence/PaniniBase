import React from 'react';
import type { Sticker } from '../types';
import { useCollectionStore } from '../store';
import { BG } from '../data/stickers';

interface Props {
  sticker: Sticker;
  selected?: boolean;
  onClick: () => void;
}

export const StickerCard: React.FC<Props> = ({ sticker, selected, onClick }) => {
  const isOwned = useCollectionStore((s) => s.isOwned);
  const getDuplicates = useCollectionStore((s) => s.getDuplicates);

  const owned = isOwned(sticker.editionId, sticker.number);
  const dupes = getDuplicates(sticker.editionId, sticker.number);
  const bg = BG[sticker.player?.colKey ?? ''] ?? 'linear-gradient(135deg,#0d1a3a,#1a2f6b)';
  const isBadge = sticker.category === 'badge';

  let borderColor = 'var(--border-subtle)';
  if (selected)      borderColor = 'var(--red)';
  else if (dupes > 0) borderColor = 'var(--gold)';
  else if (owned)     borderColor = 'var(--green)';

  let shadowColor = 'none';
  if (selected)       shadowColor = '0 0 0 1px var(--red), 0 4px 16px rgba(231,76,60,0.3)';
  else if (dupes > 0) shadowColor = '0 0 0 1px var(--gold), 0 4px 16px rgba(201,162,39,0.2)';
  else if (owned)     shadowColor = '0 0 0 1px var(--green), 0 4px 16px rgba(46,204,113,0.15)';

  return (
    <div
      onClick={onClick}
      className={`sticker-holo rounded-xl overflow-hidden cursor-pointer ${sticker.isShiny ? 'sticker-shiny' : ''} ${owned && sticker.isShiny ? 'owned-shiny' : ''}`}
      style={{
        border: `1px solid ${borderColor}`,
        boxShadow: shadowColor,
        background: 'var(--bg-card)',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      {/* ── Visual area ── */}
      <div
        className="relative w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ aspectRatio: '3/4', background: bg }}
      >
        {/* Base overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.13) 0%, transparent 55%)' }}
        />

        {/* Shiny rainbow overlay */}
        {sticker.isShiny && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, rgba(255,215,0,0.08), rgba(200,100,255,0.06), rgba(0,200,255,0.08))',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Number badge */}
        <span
          className="absolute top-1.5 left-1.5 z-10"
          style={{
            fontSize: '7.5px',
            fontWeight: 600,
            padding: '1.5px 4px',
            borderRadius: '4px',
            background: 'rgba(0,0,0,0.5)',
            color: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {sticker.number}
        </span>

        {/* Status badge */}
        {dupes > 0 && (
          <span
            className="absolute top-1.5 right-1.5 z-10 flex items-center justify-center"
            style={{
              width: '14px', height: '14px',
              borderRadius: '50%',
              background: 'var(--gold)',
              fontSize: '7px',
              fontWeight: 700,
              color: '#000',
              boxShadow: '0 0 6px rgba(201,162,39,0.6)',
            }}
          >
            {dupes}
          </span>
        )}
        {owned && dupes === 0 && (
          <span
            className="absolute top-1.5 right-1.5 z-10 flex items-center justify-center"
            style={{
              width: '14px', height: '14px',
              borderRadius: '50%',
              background: 'var(--green)',
              fontSize: '8px',
              color: '#fff',
              boxShadow: '0 0 6px rgba(46,204,113,0.5)',
            }}
          >
            ✓
          </span>
        )}

        {/* Content */}
        {isBadge ? (
          <div className="flex flex-col items-center relative z-10">
            <span style={{ fontSize: '28px', lineHeight: 1, marginBottom: '4px', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}>
              {sticker.player?.flag}
            </span>
            <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Écusson
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center relative z-10">
            <div
              className="flex items-center justify-center mb-1"
              style={{
                width: '36px', height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)',
                border: '1.5px solid rgba(255,255,255,0.3)',
                fontSize: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              }}
            >
              {sticker.player?.flag}
            </div>
            <span
              className="text-center px-1 truncate"
              style={{
                fontSize: '8px',
                color: 'rgba(255,255,255,0.92)',
                fontWeight: 600,
                maxWidth: '80px',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              {sticker.player?.name.split(' ').pop()}
            </span>
          </div>
        )}

        {/* Shiny star */}
        {sticker.isShiny && (
          <span
            className="absolute bottom-1.5 right-1.5 z-10"
            style={{ fontSize: '9px', color: '#FFD700', textShadow: '0 0 6px rgba(255,215,0,0.8)' }}
          >
            ★
          </span>
        )}

        {/* Darkening for not owned */}
        {!owned && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.4)', mixBlendMode: 'multiply' }}
          />
        )}
      </div>

      {/* ── Info row ── */}
      <div className="px-2 py-1.5">
        <p
          className="truncate"
          style={{
            fontSize: '9.5px',
            fontWeight: 600,
            color: owned ? 'var(--text-primary)' : 'var(--text-tertiary)',
            marginBottom: '2px',
          }}
        >
          {isBadge ? (sticker.teamName ?? '') : sticker.player?.name}
        </p>
        <div className="flex justify-between items-center">
          <span style={{ fontSize: '8px', color: 'var(--text-tertiary)' }}>
            {isBadge ? 'Écusson' : sticker.player?.position}
          </span>
          {sticker.isShiny && (
            <span style={{ fontSize: '7px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.5px' }}>
              SHINY
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
