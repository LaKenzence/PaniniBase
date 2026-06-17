import React from 'react';
import type { Sticker } from '../types';
import { useCollectionStore } from '../store/index';
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
  const hasImage = !!sticker.imageUrl;

  let borderColor = 'rgba(255,255,255,0.07)';
  if (selected)       borderColor = '#E74C3C';
  else if (dupes > 0) borderColor = '#C9A227';
  else if (owned)     borderColor = '#2ECC71';

  let shadow = 'none';
  if (selected)       shadow = '0 0 0 1.5px #E74C3C, 0 4px 16px rgba(231,76,60,0.3)';
  else if (dupes > 0) shadow = '0 0 0 1.5px #C9A227, 0 4px 16px rgba(201,162,39,0.2)';
  else if (owned)     shadow = '0 0 0 1.5px #2ECC71, 0 4px 16px rgba(46,204,113,0.15)';

  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
        border: `1px solid ${borderColor}`,
        boxShadow: shadow,
        background: '#0D1526',
        transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
        position: 'relative',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
    >
      {/* ── Visual ── */}
      <div
        style={{
          position: 'relative', width: '100%', aspectRatio: '3/4',
          background: hasImage ? '#000' : bg,
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* Image réelle */}
        {hasImage ? (
          <>
            <img
              src={sticker.imageUrl}
              alt={sticker.player?.name ?? ''}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                display: 'block',
                filter: owned ? 'none' : 'grayscale(60%) brightness(0.6)',
                transition: 'filter 0.2s',
              }}
            />
            {/* Shimmer overlay au hover pour les shiny */}
            {sticker.isShiny && (
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,215,0,0.15) 45%, rgba(255,100,200,0.1) 50%, rgba(100,200,255,0.12) 55%, transparent 70%)',
                mixBlendMode: 'screen',
              }} />
            )}
          </>
        ) : (
          <>
            {/* Gradient background */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(255,255,255,0.13) 0%,transparent 55%)' }} />

            {/* Contenu emoji */}
            {isBadge ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <span style={{ fontSize: '28px', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}>{sticker.player?.flag}</span>
                <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.6)', marginTop: '4px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Écusson</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                  {sticker.player?.flag}
                </div>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.92)', fontWeight: 600, maxWidth: '80px', textAlign: 'center', textShadow: '0 1px 3px rgba(0,0,0,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 4px' }}>
                  {sticker.player?.name.split(' ').pop()}
                </span>
              </div>
            )}

            {/* Dim if not owned */}
            {!owned && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
            )}
          </>
        )}

        {/* Number badge */}
        <span style={{
          position: 'absolute', top: '5px', left: '5px', zIndex: 10,
          fontSize: '7.5px', fontWeight: 700,
          padding: '1.5px 4px', borderRadius: '4px',
          background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(4px)',
        }}>
          {sticker.number}
        </span>

        {/* Status badge */}
        {dupes > 0 ? (
          <span style={{
            position: 'absolute', top: '5px', right: '5px', zIndex: 10,
            width: '16px', height: '16px', borderRadius: '50%',
            background: '#C9A227', fontSize: '8px', fontWeight: 800,
            color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 6px rgba(201,162,39,0.7)',
          }}>
            {dupes}
          </span>
        ) : owned ? (
          <span style={{
            position: 'absolute', top: '5px', right: '5px', zIndex: 10,
            width: '16px', height: '16px', borderRadius: '50%',
            background: '#2ECC71', fontSize: '9px',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 6px rgba(46,204,113,0.6)',
          }}>
            ✓
          </span>
        ) : null}

        {/* Shiny star */}
        {sticker.isShiny && (
          <span style={{ position: 'absolute', bottom: '5px', right: '5px', zIndex: 10, fontSize: '10px', color: '#FFD700', textShadow: '0 0 6px rgba(255,215,0,0.8)' }}>★</span>
        )}
      </div>

      {/* ── Info row ── */}
      <div style={{ padding: '6px 8px 7px' }}>
        <p style={{ fontSize: '9.5px', fontWeight: 600, color: owned ? '#F0F4FF' : '#4A5A7A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '2px' }}>
          {isBadge ? (sticker.teamName ?? '') : sticker.player?.name}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '8px', color: '#4A5A7A' }}>
            {isBadge ? 'Écusson' : sticker.player?.position}
          </span>
          {sticker.isShiny && (
            <span style={{ fontSize: '7px', fontWeight: 700, color: '#C9A227', letterSpacing: '0.5px' }}>SHINY</span>
          )}
        </div>
      </div>
    </div>
  );
};
