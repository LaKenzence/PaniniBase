import React, { useState } from 'react';
import type { Sticker } from '../types';
import { useCollectionStore, useUIStore } from '../store/index';
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
  const [lightbox, setLightbox] = useState(false);

  if (!sticker) {
    return (
      <div style={{ width: '200px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px', background: '#0D1526', borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize: '36px', opacity: 0.1, marginBottom: '10px' }}>👆</div>
        <p style={{ fontSize: '11px', color: '#4A5A7A', lineHeight: 1.5 }}>Clique sur un sticker<br />pour voir ses détails</p>
        <p style={{ fontSize: '9px', color: '#4A5A7A', marginTop: '8px', opacity: 0.6 }}>Espace = ✓/✕</p>
      </div>
    );
  }

  const owned  = isOwned(editionId, sticker.number);
  const dupes  = getDuplicates(editionId, sticker.number);
  const bg     = BG[sticker.player?.colKey ?? ''] ?? 'linear-gradient(135deg,#0d1a3a,#1a2f6b)';
  const isBadge = sticker.category === 'badge';
  const hasImage = !!sticker.imageUrl;

  return (
    <>
      {/* ── Lightbox image ── */}
      {lightbox && hasImage && (
        <div
          onClick={() => setLightbox(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}
        >
          <img src={sticker.imageUrl} alt={sticker.player?.name} style={{ maxHeight: '85vh', maxWidth: '85vw', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }} />
          <button onClick={() => setLightbox(false)} style={{ position: 'absolute', top: '16px', right: '16px', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
      )}

      <div style={{ width: '210px', flexShrink: 0, overflowY: 'auto', background: '#0D1526', borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#4A5A7A', textTransform: 'uppercase', letterSpacing: '1px' }}>Détail</span>
          <button onClick={onClose} style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#4A5A7A', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        <div style={{ padding: '14px' }}>
          {/* Sticker visual — cliquable si image */}
          <div
            onClick={() => hasImage && setLightbox(true)}
            style={{
              margin: '0 auto 14px', width: '100px', aspectRatio: '3/4',
              borderRadius: '12px', overflow: 'hidden', position: 'relative',
              background: hasImage ? '#000' : bg,
              cursor: hasImage ? 'zoom-in' : 'default',
              boxShadow: owned
                ? `0 4px 20px rgba(0,0,0,0.5), 0 0 0 2px ${dupes > 0 ? '#C9A227' : '#2ECC71'}`
                : '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => hasImage && (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => hasImage && (e.currentTarget.style.transform = 'scale(1)')}
          >
            {hasImage ? (
              <>
                <img src={sticker.imageUrl} alt={sticker.player?.name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: owned ? 'none' : 'grayscale(50%) brightness(0.6)' }} />
                {/* Zoom hint */}
                <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', padding: '2px 4px', fontSize: '9px', color: 'rgba(255,255,255,0.7)' }}>🔍</div>
              </>
            ) : (
              <>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(255,255,255,0.13) 0%,transparent 55%)' }} />
                {isBadge
                  ? <span style={{ fontSize: '36px', position: 'relative', zIndex: 1 }}>{sticker.player?.flag}</span>
                  : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '6px' }}>{sticker.player?.flag}</div>
                      <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.9)', fontWeight: 600, textAlign: 'center', padding: '0 8px' }}>{sticker.player?.name}</span>
                    </div>
                }
                {!owned && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />}
              </>
            )}
            <span style={{ position: 'absolute', top: '5px', left: '6px', zIndex: 10, fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', background: 'rgba(0,0,0,0.5)', padding: '1px 5px', borderRadius: '4px' }}>#{sticker.number}</span>
            {sticker.isShiny && <span style={{ position: 'absolute', top: '5px', right: '6px', zIndex: 10, fontSize: '11px', color: '#FFD700', textShadow: '0 0 6px rgba(255,215,0,0.8)' }}>★</span>}
          </div>

          {/* Name */}
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#F0F4FF', margin: '0 0 3px', lineHeight: 1.2 }}>{sticker.player?.name}</p>
          <p style={{ fontSize: '11px', color: '#4A5A7A', margin: '0 0 14px' }}>{sticker.player?.nationality} · {isBadge ? 'Écusson' : sticker.player?.position}</p>

          {/* Info rows */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: '14px' }}>
            {[
              ['N° sticker', `#${sticker.number}`],
              ...(!isBadge ? [['N° maillot', `#${sticker.player?.jerseyNumber}`], ['Club', sticker.player?.club || '—']] : []),
              ['Type', sticker.isShiny ? '⭐ Shiny' : isBadge ? 'Écusson' : 'Joueur'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '10px', color: '#4A5A7A' }}>{label}</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#8A9BBF' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Own button */}
          <button
            onClick={() => setOwned(editionId, sticker.number, !owned)}
            style={{ width: '100%', padding: '9px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, border: `1px solid ${owned ? '#2ECC71' : 'rgba(255,255,255,0.1)'}`, background: owned ? 'rgba(46,204,113,0.1)' : 'rgba(255,255,255,0.04)', color: owned ? '#2ECC71' : '#8A9BBF', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxSizing: 'border-box' }}
          >
            {owned ? '✓ Dans ma collection' : '+ Ajouter'}
          </button>

          {/* Duplicates */}
          {owned && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
              <span style={{ fontSize: '10px', color: '#4A5A7A', flex: 1 }}>Doublons</span>
              <button onClick={() => setDuplicates(editionId, sticker.number, -1)} style={{ width: '26px', height: '26px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#F0F4FF', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ fontSize: '13px', fontWeight: 700, color: dupes > 0 ? '#C9A227' : '#4A5A7A', minWidth: '20px', textAlign: 'center' }}>{dupes}</span>
              <button onClick={() => setDuplicates(editionId, sticker.number, 1)} style={{ width: '26px', height: '26px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#F0F4FF', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
          )}

          {/* Neighbors */}
          {neighbors.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '9px', color: '#4A5A7A', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Stickers voisins</p>
              <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                {neighbors.map((nb) => {
                  const nbBg = BG[nb.player?.colKey ?? ''] ?? 'linear-gradient(135deg,#0d1a3a,#1a2f6b)';
                  const nbOwned = isOwned(editionId, nb.number);
                  const isCurrent = nb.id === sticker.id;
                  return (
                    <div key={nb.id} onClick={() => selectSticker(nb.number as number)} style={{ flexShrink: 0, width: '44px', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${isCurrent ? '#C9A227' : nbOwned ? '#2ECC71' : 'rgba(255,255,255,0.07)'}` }}>
                      <div style={{ aspectRatio: '3/4', background: nb.imageUrl ? '#000' : nbBg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        {nb.imageUrl
                          ? <img src={nb.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: nbOwned ? 'none' : 'grayscale(60%) brightness(0.5)' }} />
                          : <span style={{ fontSize: '16px' }}>{nb.player?.flag}</span>
                        }
                        <span style={{ position: 'absolute', top: '1px', left: '2px', fontSize: '6px', color: 'rgba(255,255,255,0.8)', background: 'rgba(0,0,0,0.5)', padding: '1px 2px', borderRadius: '2px' }}>{nb.number}</span>
                      </div>
                      <div style={{ padding: '2px 3px', background: '#0D1526' }}>
                        <p style={{ fontSize: '6.5px', color: '#4A5A7A', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{nb.player?.name.split(' ').pop()}</p>
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
              style={{ width: '100%', marginTop: '12px', padding: '8px', borderRadius: '10px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', color: '#8A9BBF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.12s', boxSizing: 'border-box' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              👤 Toutes ses apparitions
            </button>
          )}
        </div>
      </div>
    </>
  );
};
