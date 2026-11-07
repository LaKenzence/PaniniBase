import React, { useState } from 'react';
import type { Sticker } from '../types';
import { useCollectionStore, useUIStore } from '../store/index';
import { BG, getPhoto } from '../data/stickers';
import { useNeighborStickers } from '../hooks';
import { X, Plus, Minus, ZoomIn, Heart, User as UserIcon } from 'lucide-react';
import { StickerCard } from './StickerCard';
import { useTilt } from '../hooks/useTilt';
import { haptic } from '../lib/haptic';
import { C } from '../theme';
import { useT, stickerName } from '../i18n';
import { clickable } from '../lib/a11y';

interface Props {
  editionId: string;
  sticker: Sticker | null;
  onClose: () => void;
}


// ── Lightbox avec le même effet 3D, en grand ──────────────────────────────
const LightboxTilt: React.FC<{ imageUrl: string; alt: string; isShiny?: boolean; onClose: () => void }> = ({ imageUrl, alt, isShiny, onClose }) => {
  const { ref: tiltRef, tilt, handlers: tiltHandlers } = useTilt(10);
  const t = useT();
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}
    >
      <div
        ref={tiltRef}
        {...tiltHandlers}
        style={{ perspective: '1000px', maxHeight: '85vh', maxWidth: '85vw' }}
      >
        <div style={{
          position: 'relative', borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: tilt.active ? 'transform 0.06s linear' : 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)',
        }}>
          <img src={imageUrl} alt={alt} style={{ display: 'block', maxHeight: '85vh', maxWidth: '85vw', objectFit: 'contain' }} />
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.45), transparent 55%)`,
            opacity: tilt.active ? 0.7 : 0, transition: 'opacity 0.25s', mixBlendMode: 'overlay',
          }} />
          {isShiny && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `linear-gradient(${tilt.glareX * 2.8}deg, rgba(255,0,150,0.2), rgba(0,200,255,0.18), rgba(255,215,0,0.25), rgba(150,0,255,0.18))`,
              opacity: tilt.active ? 0.5 : 0, transition: 'opacity 0.25s', mixBlendMode: 'color-dodge',
            }} />
          )}
        </div>
      </div>
      <button onClick={onClose} aria-label={t("Fermer l'aperçu de l'image")} style={{ position: 'absolute', top: '16px', right: '16px', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
    </div>
  );
};

export const DetailPanel: React.FC<Props> = ({ editionId, sticker, onClose }) => {
  const { isOwned, setOwned, getDuplicates, setDuplicates, isFavorite, toggleFavorite } = useCollectionStore();
  const { goPlayer, selectSticker } = useUIStore();
  const neighbors = useNeighborStickers(editionId, sticker?.number ?? 0, 5);
  const [lightbox, setLightbox] = useState(false);
  const t = useT();

  if (!sticker) {
    return (
      <div style={{ width: '200px', height: '100%', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px', background: C.glass, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderLeft: '1px solid rgba(255,255,255,0.07)', boxSizing: 'border-box' }}>
        <div style={{ fontSize: '36px', opacity: 0.1, marginBottom: '10px' }}>👆</div>
        <p style={{ fontSize: '11px', color: C.textTertiary, lineHeight: 1.5 }}>{t('Clique sur un sticker pour voir ses détails')}</p>
        <p style={{ fontSize: '11px', color: C.textTertiary, marginTop: '8px', opacity: 0.6 }}>{t('Espace = ✓/✕')}</p>
      </div>
    );
  }

  const owned  = isOwned(editionId, sticker.number);
  const dupes  = getDuplicates(editionId, sticker.number);
  const isBadge = sticker.category === 'badge';
  const hasImage = !!sticker.imageUrl;
  const photo = getPhoto(sticker);

  return (
    <>
      {/* ── Lightbox image ── */}
      {lightbox && hasImage && (
        <LightboxTilt
          imageUrl={sticker.imageUrl!}
          alt={sticker.player?.name ?? ''}
          isShiny={sticker.isShiny}
          onClose={() => setLightbox(false)}
        />
      )}

      <div style={{ width: '210px', height: '100%', flexShrink: 0, overflowY: 'auto', background: 'rgba(10,13,34,0.78)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderLeft: '1px solid rgba(255,255,255,0.07)', boxSizing: 'border-box' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: C.textTertiary, textTransform: 'uppercase', letterSpacing: '1px' }}>{t('Détail')}</span>
          <button onClick={onClose} aria-label={t('Fermer le détail')} style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: C.textTertiary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={15} /></button>
        </div>

        <div style={{ padding: '14px' }}>
          {/* Sticker visual — inclinaison 3D façon carte holographique */}
          <div
            onClick={() => hasImage && setLightbox(true)}
            style={{ position: 'relative', margin: '0 auto 16px', width: '140px', cursor: hasImage ? 'zoom-in' : 'default' }}
          >
            <StickerCard key={sticker.id} sticker={sticker} onClick={() => {}} />
            {hasImage && <div style={{ position: 'absolute', bottom: '30px', right: '8px', zIndex: 11, background: 'rgba(0,0,0,0.5)', borderRadius: '4px', padding: '2px 4px', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center' }}><ZoomIn size={12} /></div>}
          </div>

          {/* Crédits de la photo (obligatoires pour les images Wikimedia Commons) */}
          {photo && (
            <p style={{ margin: '-8px 0 14px', textAlign: 'center', fontSize: '11px', color: C.textTertiary, lineHeight: 1.4 }}>
              📷 <a href={photo.source} target="_blank" rel="noopener noreferrer" style={{ color: C.textSecondary }}>{photo.author}</a>
              {' · '}
              {photo.licenseUrl
                ? <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.textSecondary }}>{photo.license}</a>
                : photo.license}
              {' · Wikimedia Commons'}
            </p>
          )}

          {/* Name + favori */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', margin: '0 0 3px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: C.textPrimary, lineHeight: 1.2, margin: 0 }}>{sticker.player?.name}</p>
            {sticker.player?.playerKey && (
              <button
                className="btn-tactile"
                onClick={() => toggleFavorite(sticker.player!.playerKey!)}
                aria-label={isFavorite(sticker.player!.playerKey!) ? t('Retirer des favoris') : t('Ajouter aux favoris')}
                style={{
                  width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isFavorite(sticker.player!.playerKey!) ? 'rgba(231,76,60,0.12)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isFavorite(sticker.player!.playerKey!) ? 'rgba(231,76,60,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: isFavorite(sticker.player!.playerKey!) ? C.red : C.textTertiary,
                  cursor: 'pointer',
                }}
              >
                <Heart size={12} fill={isFavorite(sticker.player!.playerKey!) ? C.red : 'none'} />
              </button>
            )}
          </div>
          <p style={{ fontSize: '11px', color: C.textTertiary, margin: '0 0 14px' }}>{[sticker.player?.nationality && t(sticker.player.nationality), isBadge ? t('Écusson') : sticker.player?.position && t(sticker.player.position)].filter(Boolean).join(' · ')}</p>

          {/* Info rows */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: '14px' }}>
            {[
              [t('N° sticker'), `#${sticker.number}`],
              ...(sticker.code ? [[t('Code Panini'), sticker.code]] : []),
              ...(sticker.player?.jerseyNumber != null ? [[t('N° maillot'), `#${sticker.player.jerseyNumber}`]] : []),
              ...(sticker.category === 'player' && sticker.player?.club ? [[t('Club'), sticker.player.club]] : []),
              [t('Type'), sticker.isShiny ? 'Shiny ★' : isBadge ? t('Écusson') : sticker.category === 'player' ? t('Joueur') : t('Sticker spécial')],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '11px', color: C.textTertiary }}>{label}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: C.textSecondary }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Own button */}
          <button
            onClick={() => { setOwned(editionId, sticker.number, !owned); if (!owned) haptic(); }}
            className={owned ? '' : 'btn-gold'} style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, border: owned ? `1px solid ${C.green}` : 'none', background: owned ? 'rgba(46,204,113,0.1)' : undefined, color: owned ? C.green : undefined, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxSizing: 'border-box' }}
          >
            {owned ? t('✓ Dans ma collection') : t('+ Ajouter')}
          </button>

          {/* Duplicates */}
          {owned && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
              <span style={{ fontSize: '11px', color: C.textTertiary, flex: 1 }}>{t('Doublons')}</span>
              <button onClick={() => setDuplicates(editionId, sticker.number, -1)} aria-label={t('Retirer un doublon')} style={{ width: '36px', height: '36px', borderRadius: '9px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: C.textPrimary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={15} /></button>
              <span style={{ fontSize: '13px', fontWeight: 700, color: dupes > 0 ? C.gold : C.textTertiary, minWidth: '20px', textAlign: 'center' }}>{dupes}</span>
              <button onClick={() => setDuplicates(editionId, sticker.number, 1)} aria-label={t('Ajouter un doublon')} style={{ width: '36px', height: '36px', borderRadius: '9px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: C.textPrimary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={15} /></button>
            </div>
          )}

          {/* Neighbors */}
          {neighbors.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '11px', color: C.textTertiary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{t('Stickers voisins')}</p>
              <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                {neighbors.map((nb) => {
                  const nbBg = BG[nb.player?.colKey ?? ''] ?? 'linear-gradient(135deg,#0d1a3a,#1a2f6b)';
                  const nbOwned = isOwned(editionId, nb.number);
                  const isCurrent = nb.id === sticker.id;
                  return (
                    <div key={nb.id} {...clickable(() => selectSticker(nb.number as number), `${nb.code ?? `#${nb.number}`} ${stickerName(nb, t)}`)} aria-current={isCurrent || undefined} style={{ flexShrink: 0, width: '44px', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${isCurrent ? C.gold : nbOwned ? C.green : 'rgba(255,255,255,0.07)'}` }}>
                      <div style={{ aspectRatio: '3/4', background: nb.imageUrl ? '#000' : nbBg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        {nb.imageUrl
                          ? <img src={nb.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: nbOwned ? 'none' : 'grayscale(60%) brightness(0.5)' }} />
                          : <span style={{ fontSize: '16px' }}>{nb.player?.flag}</span>
                        }
                        <span style={{ position: 'absolute', top: '1px', left: '2px', fontSize: '6px', color: 'rgba(255,255,255,0.8)', background: 'rgba(0,0,0,0.5)', padding: '1px 2px', borderRadius: '2px' }}>{nb.number}</span>
                      </div>
                      <div style={{ padding: '2px 3px', background: C.glass, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                        <p style={{ fontSize: '6.5px', color: C.textTertiary, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{nb.player?.name.split(' ').pop()}</p>
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
              style={{ width: '100%', marginTop: '12px', padding: '8px', borderRadius: '10px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', color: C.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.12s', boxSizing: 'border-box' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              <UserIcon size={15} /> {t('Toutes ses apparitions')}
            </button>
          )}
        </div>
      </div>
    </>
  );
};
