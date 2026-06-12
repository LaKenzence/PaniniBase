import React from 'react';
import type { Sticker } from '../types';
import { useCollectionStore, useUIStore } from '../store';
import { BG, STICKERS_BY_EDITION } from '../data/stickers';
import { useNeighborStickers } from '../hooks';

interface Props {
  editionId: string;
  sticker: Sticker | null;
  onClose: () => void;
}

export const DetailPanel: React.FC<Props> = ({ editionId, sticker, onClose }) => {
  const { isOwned, setOwned, getDuplicates, setDuplicates } = useCollectionStore();
  const { goPlayer, selectSticker } = useUIStore();
  const neighbors = useNeighborStickers(editionId, sticker?.number ?? 0, 5);

  if (!sticker) {
    return (
      <div
        className="flex-shrink-0 flex flex-col items-center justify-center text-center p-6"
        style={{
          width: '200px',
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ fontSize: '36px', opacity: 0.12, marginBottom: '10px' }}>👆</div>
        <p style={{ fontSize: '10.5px', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
          Clique sur un sticker pour voir ses détails
        </p>
      </div>
    );
  }

  const owned = isOwned(editionId, sticker.number);
  const dupes = getDuplicates(editionId, sticker.number);
  const bg = BG[sticker.player?.colKey ?? ''] ?? 'linear-gradient(135deg,#0d1a3a,#1a2f6b)';
  const isBadge = sticker.category === 'badge';

  return (
    <div
      className="flex-shrink-0 overflow-y-auto slide-in"
      style={{
        width: '210px',
        background: 'var(--bg-card)',
        borderLeft: '1px solid var(--border-subtle)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Détail
        </span>
        <button
          onClick={onClose}
          style={{
            fontSize: '16px',
            color: 'var(--text-tertiary)',
            lineHeight: 1,
            padding: '2px 4px',
            borderRadius: '4px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
        >
          ×
        </button>
      </div>

      <div className="p-3">
        {/* Big sticker visual */}
        <div
          className="mx-auto rounded-xl overflow-hidden relative flex flex-col items-center justify-center mb-3"
          style={{
            width: '88px',
            aspectRatio: '3/4',
            background: bg,
            boxShadow: owned
              ? `0 4px 20px rgba(0,0,0,0.5), 0 0 0 1.5px ${dupes > 0 ? 'var(--gold)' : 'var(--green)'}`
              : '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.13) 0%,transparent 55%)' }} />
          <span
            className="absolute top-1.5 left-2"
            style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(0,0,0,0.4)', padding: '1px 4px', borderRadius: '4px' }}
          >
            #{sticker.number}
          </span>
          {sticker.isShiny && (
            <span className="absolute top-1.5 right-2" style={{ fontSize: '10px', color: '#FFD700', textShadow: '0 0 6px rgba(255,215,0,0.8)' }}>★</span>
          )}
          {isBadge ? (
            <span style={{ fontSize: '32px' }}>{sticker.player?.flag}</span>
          ) : (
            <>
              <div
                className="flex items-center justify-center mb-1"
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)', fontSize: '22px' }}
              >
                {sticker.player?.flag}
              </div>
              <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: 600, textAlign: 'center', padding: '0 6px' }}>
                {sticker.player?.name}
              </span>
            </>
          )}
          {!owned && (
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />
          )}
        </div>

        {/* Info */}
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
          {sticker.player?.name}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          {sticker.player?.nationality} · {isBadge ? 'Écusson' : sticker.player?.position}
        </div>

        {/* Rows */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: '12px' }}>
          {[
            ['N° sticker', `#${sticker.number}`],
            ...(!isBadge ? [
              ['N° maillot', `#${sticker.player?.jerseyNumber}`],
              ['Club', sticker.player?.club ?? ''],
            ] : []),
            ['Type', sticker.isShiny ? '⭐ Shiny' : isBadge ? 'Écusson' : 'Joueur'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between items-center"
              style={{ padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}
            >
              <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{label}</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Own button */}
        <button
          onClick={() => setOwned(editionId, sticker.number, !owned)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '10px',
            fontSize: '11.5px',
            fontWeight: 600,
            border: `1px solid ${owned ? 'var(--green)' : 'var(--border-default)'}`,
            background: owned ? 'rgba(46,204,113,0.12)' : 'var(--bg-elevated)',
            color: owned ? 'var(--green)' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          {owned ? '✓ Dans ma collection' : '+ Ajouter'}
        </button>

        {/* Duplicates */}
        {owned && (
          <div className="flex items-center gap-2 mt-2.5">
            <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Doublons</span>
            <div className="flex items-center gap-1.5 ml-auto">
              {[
                { op: -1, label: '−' },
                { op: 1,  label: '+' },
              ].map(({ op, label }, i) => (
                <button
                  key={op}
                  onClick={() => setDuplicates(editionId, sticker.number, op)}
                  style={{
                    width: '24px', height: '24px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    lineHeight: 1,
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
              <span style={{ fontSize: '12px', fontWeight: 700, color: dupes > 0 ? 'var(--gold)' : 'var(--text-secondary)', minWidth: '16px', textAlign: 'center' }}>
                {dupes}
              </span>
            </div>
          </div>
        )}

        {/* Neighbors */}
        {neighbors.length > 0 && (
          <div className="mt-4">
            <p style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              Stickers voisins
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {neighbors.map((nb) => {
                const nbBg = BG[nb.player?.colKey ?? ''] ?? 'linear-gradient(135deg,#0d1a3a,#1a2f6b)';
                const nbOwned = isOwned(editionId, nb.number);
                const isCurrent = nb.number === sticker.number;
                return (
                  <div
                    key={nb.number}
                    onClick={() => selectSticker(nb.number)}
                    className="flex-shrink-0 cursor-pointer rounded-lg overflow-hidden"
                    style={{
                      width: '44px',
                      border: `1px solid ${isCurrent ? 'var(--gold)' : nbOwned ? 'var(--green)' : 'var(--border-subtle)'}`,
                      transition: 'border-color 0.12s',
                    }}
                  >
                    <div
                      className="w-full relative flex items-center justify-center"
                      style={{ aspectRatio: '3/4', background: nbBg }}
                    >
                      <span className="absolute top-0.5 left-0.5" style={{ fontSize: '6px', color: 'rgba(255,255,255,0.8)', background: 'rgba(0,0,0,0.4)', padding: '1px 2px', borderRadius: '2px' }}>
                        {nb.number}
                      </span>
                      <span style={{ fontSize: '14px' }}>{nb.player?.flag}</span>
                    </div>
                    <div style={{ padding: '2px 3px' }}>
                      <p style={{ fontSize: '6.5px', color: 'var(--text-tertiary)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {nb.player?.name.split(' ').pop()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Player link */}
        {sticker.player?.playerKey && (
          <button
            onClick={() => goPlayer(sticker.player!.playerKey!)}
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '7px',
              borderRadius: '10px',
              fontSize: '10.5px',
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.12s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.background = 'var(--bg-elevated)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            👤 Toutes ses apparitions Panini
          </button>
        )}
      </div>
    </div>
  );
};
