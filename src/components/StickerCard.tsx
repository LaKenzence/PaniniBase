import React, { useEffect, useRef, useState } from 'react';
import type { Sticker } from '../types';
import { useCollectionStore } from '../store/index';
import { BG } from '../data/stickers';
import { C } from '../theme';
import { useT, stickerName } from '../i18n';

interface Props {
  sticker: Sticker;
  selected?: boolean;
  onClick: () => void;
}

/** Code équipe affiché en haut du sticker : "br" → "BR", "mx2" → "MX". */
const teamCode = (colKey?: string) => (colKey ?? '').replace(/\d+$/, '').toUpperCase().slice(0, 3);

/** Nom façon Panini : nom de famille en majuscules ("Pelé" reste "PELÉ"). */
const shortName = (name?: string) => (name ?? '').split(' ').pop()!.toUpperCase();

/** Silhouette de joueur générique (pas de photo = pas de souci de droits). */
const Silhouette: React.FC<{ dim?: boolean }> = ({ dim }) => (
  <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '78%', opacity: dim ? 0.35 : 1 }} aria-hidden>
    <defs>
      <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(255,255,255,0.32)" />
        <stop offset="1" stopColor="rgba(255,255,255,0.08)" />
      </linearGradient>
    </defs>
    {/* léger contour sombre : reste visible sur les drapeaux clairs (Mexique, Argentine…) */}
    <circle cx="50" cy="38" r="17" fill="url(#sil)" stroke="rgba(0,0,0,0.16)" strokeWidth="1.2" />
    <path d="M14 100 C14 74 30 60 50 60 C70 60 86 74 86 100 Z" fill="url(#sil)" stroke="rgba(0,0,0,0.16)" strokeWidth="1.2" />
    {/* col du maillot */}
    <path d="M42 60 L50 70 L58 60" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinejoin="round" />
  </svg>
);

export const StickerCard: React.FC<Props> = ({ sticker, selected, onClick }) => {
  const isOwned = useCollectionStore((s) => s.isOwned);
  const getDuplicates = useCollectionStore((s) => s.getDuplicates);

  const owned = isOwned(sticker.editionId, sticker.number);
  const dupes = getDuplicates(sticker.editionId, sticker.number);
  const bg = BG[sticker.player?.colKey ?? ''] ?? 'linear-gradient(135deg,#0d1a3a,#1a2f6b)';
  const isBadge = sticker.category === 'badge';
  const hasImage = !!sticker.imageUrl;
  const code = teamCode(sticker.player?.colKey);
  const t = useT();
  // Joueur : nom de famille façon Panini ; sticker spécial (stade, trophée…) : nom complet
  const label = isBadge ? t(sticker.teamName ?? '') : sticker.category === 'player' ? shortName(sticker.player?.name) : (sticker.player?.name ?? '');

  // Carte utilisable au clavier et lisible par les lecteurs d'écran
  const a11y = {
    role: 'button',
    tabIndex: 0,
    'data-sticker': String(sticker.number),
    'aria-pressed': !!selected,
    'aria-label': [sticker.code ?? `#${sticker.number}`, sticker.player || isBadge ? stickerName(sticker, t) : t('Sticker spécial'), owned ? (dupes > 0 ? t('possédé, {n} doublon|possédé, {n} doublons', { n: dupes }) : t('possédé')) : t('manquant')].join(', '),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      e.stopPropagation(); // sinon Espace coche aussi le sticker déjà sélectionné (raccourci de l'album)
      onClick();
    },
  } as const;

  // ── Pop animation au changement de statut ────────────────────────────
  const prevOwned = useRef(owned);
  const [justChanged, setJustChanged] = useState(false);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (prevOwned.current !== owned) {
      setJustChanged(true);
      const t = setTimeout(() => setJustChanged(false), 450);
      prevOwned.current = owned;
      return () => clearTimeout(t);
    }
  }, [owned]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setGlareX(px * 100);
    setGlareY(py * 100);
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return; // reflet oui, inclinaison non
    setTiltX(-(py - 0.5) * 12);
    setTiltY((px - 0.5) * 12);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    setTiltX(0);
    setTiltY(0);
    setGlareX(50);
    setGlareY(50);
  };

  const ring = selected ? C.red : dupes > 0 ? C.gold : null;

  // ── Emplacement vide (sticker manquant) : comme une case d'album ─────
  if (!owned) {
    return (
      <div
        {...a11y}
        onClick={onClick}
        className={justChanged ? 'sticker-pop' : ''}
        style={{
          position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: '10px', cursor: 'pointer',
          background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0 6px, transparent 6px 12px), #0A1220',
          border: `1.5px dashed ${selected ? C.red : 'rgba(255,255,255,0.14)'}`,
          boxShadow: selected ? `0 0 0 1px ${C.red}, 0 6px 18px rgba(231,76,60,0.3)` : 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', transition: 'border-color 0.15s, background 0.15s',
        }}
        onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
        onMouseLeave={(e) => { if (!selected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
      >
        <span style={{ position: 'absolute', top: '6px', left: '7px', fontSize: '11px', filter: 'grayscale(0.5)', opacity: 0.85 }}>{sticker.player?.flag}</span>
        {sticker.isShiny && <span style={{ position: 'absolute', top: '5px', right: '7px', fontSize: '11px', color: 'rgba(255,215,0,0.7)' }}>★</span>}
        <span style={{ fontSize: sticker.code ? 'clamp(13px, 18%, 20px)' : 'clamp(20px, 30%, 34px)', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: sticker.code ? '0' : '-1px', lineHeight: 1, whiteSpace: 'nowrap' }}>
          {sticker.code ?? sticker.number}
        </span>
        <span style={{ position: 'absolute', bottom: '7px', left: '6px', right: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.62)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {isBadge ? t('Écusson') : label}
        </span>
      </div>
    );
  }

  // ── Sticker collé ────────────────────────────────────────────────────
  return (
    <div
      {...a11y}
      onClick={onClick}
      className={justChanged ? 'sticker-pop' : ''}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
        background: hasImage ? '#000' : bg,
        // Liseré blanc façon sticker + ombre "collé sur la page"
        boxShadow: [
          'inset 0 0 0 3px rgba(255,255,255,0.92)',
          ring ? `0 0 0 2px ${ring}` : '',
          hovering ? '0 14px 30px rgba(0,0,0,0.55)' : '0 3px 10px rgba(0,0,0,0.45)',
        ].filter(Boolean).join(', '),
        transform: hovering
          ? `perspective(500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-3px) scale(1.04)`
          : 'none',
        transition: hovering
          ? 'transform 0.08s linear, box-shadow 0.15s'
          : 'transform 0.35s cubic-bezier(0.23,1,0.32,1), box-shadow 0.2s',
        zIndex: hovering ? 2 : 'auto',
      }}
    >
      <div className={justChanged ? 'sticker-just-owned' : ''} style={{ position: 'absolute', inset: 0 }}>
        {hasImage ? (
          // Photo cadrée sur le visage (haut de l'image), sous les bandeaux du sticker
          <img src={sticker.imageUrl} alt={sticker.player?.name ?? ''} loading="lazy" decoding="async" referrerPolicy="no-referrer"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 18%', display: 'block' }} />
        ) : isBadge ? (
          // Écusson : drapeau dans un blason doré
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '62%', aspectRatio: '5/6', display: 'flex', alignItems: 'center', justifyContent: 'center',
              clipPath: 'polygon(50% 0, 100% 12%, 100% 58%, 50% 100%, 0 58%, 0 12%)',
              background: `linear-gradient(160deg, ${C.goldLight}, ${C.gold} 55%, #8a6e16)`,
            }}>
              <div style={{
                width: '86%', height: '88%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                clipPath: 'polygon(50% 0, 100% 12%, 100% 58%, 50% 100%, 0 58%, 0 12%)', background: 'rgba(7,12,24,0.85)',
                fontSize: '24px',
              }}>
                {sticker.player?.flag}
              </div>
            </div>
          </div>
        ) : (
          <Silhouette />
        )}

        {/* Sheen diagonal */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 45%)', pointerEvents: 'none' }} />

        {/* Bandeau haut : drapeau + code équipe / numéro */}
        <div style={{ position: 'absolute', top: '6px', left: '7px', right: '7px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 800, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.7)', letterSpacing: '0.5px' }}>
            <span style={{ fontSize: '12px' }}>{sticker.player?.flag}</span>{code}
          </span>
          <span style={{ fontSize: '11px', fontWeight: 900, padding: '1px 5px', borderRadius: '5px', background: 'rgba(0,0,0,0.55)', color: '#fff' }}>
            {sticker.code ?? sticker.number}
          </span>
        </div>

        {/* Bandeau nom, comme sur un vrai sticker */}
        <div style={{
          position: 'absolute', left: '3px', right: '3px', bottom: '3px', zIndex: 3, padding: '3px 5px 4px',
          background: sticker.isShiny ? `linear-gradient(90deg, ${C.goldLight}, ${C.gold})` : 'rgba(255,255,255,0.94)',
          borderRadius: '0 0 7px 7px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 900, color: '#0A1220', letterSpacing: '0.3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.35 }}>
            {label}
          </div>
        </div>

        {/* Reflet qui suit la souris */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.28), transparent 60%)`,
          opacity: hovering ? 1 : 0, transition: 'opacity 0.2s', mixBlendMode: 'overlay',
        }} />

        {/* Holographique shiny : toujours un peu visible, fort au survol */}
        {sticker.isShiny && (
          <div className="sticker-holo-layer" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4,
            background: `linear-gradient(${110 + glareX}deg, rgba(255,0,150,0.28), rgba(0,200,255,0.25) 30%, rgba(255,215,0,0.32) 55%, rgba(150,0,255,0.25) 80%)`,
            backgroundSize: '200% 200%',
            opacity: hovering ? 0.85 : 0.35,
            transition: 'opacity 0.25s', mixBlendMode: 'color-dodge',
          }} />
        )}
      </div>

      {/* Doublons */}
      {dupes > 0 && (
        <span style={{ position: 'absolute', top: '24px', right: '6px', zIndex: 10, padding: '1px 6px', borderRadius: '10px', background: C.gold, fontSize: '11px', fontWeight: 900, color: '#000', boxShadow: '0 0 8px rgba(201,162,39,0.8)' }}>
          +{dupes}
        </span>
      )}
    </div>
  );
};
