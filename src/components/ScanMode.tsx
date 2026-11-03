import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Check, ChevronRight, Zap, Undo2 } from 'lucide-react';
import { STICKERS_BY_EDITION, BG } from '../data/stickers';
import { useCollectionStore } from '../store/index';
import { haptic } from '../lib/haptic';
import type { Sticker } from '../types';
import { C } from '../theme';
import { useT, stickerName } from '../i18n';

interface Props {
  editionId: string;
  onClose: () => void;
}

/**
 * Mode scan rapide — vue plein écran optimisée mobile pour cocher les stickers
 * vite quand tu ouvres des pochettes. Swipe gauche = possédé, droite = passer,
 * ou tape les boutons. Affiche uniquement les stickers non encore possédés.
 */
export const ScanMode: React.FC<Props> = ({ editionId, onClose }) => {
  const { isOwned, setOwned } = useCollectionStore();
  const t = useT();

  // Liste figée à l'ouverture : si elle était recalculée à chaque rendu, cocher
  // un sticker le retirerait de la liste ET avancerait l'index → le suivant serait sauté.
  const [missing] = useState(() => (STICKERS_BY_EDITION[editionId] ?? []).filter(
    (s) => !isOwned(editionId, s.number)
  ));

  const [index, setIndex] = useState(0);
  const [checked, setChecked] = useState(0);
  const [animDir, setAnimDir] = useState<'left' | 'right' | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const sticker: Sticker | undefined = missing[index];
  const bg = sticker ? (BG[sticker.player?.colKey ?? ''] ?? 'linear-gradient(135deg,#0d1a3a,#1a2f6b)') : '';
  const progress = missing.length > 0 ? Math.round((index / missing.length) * 100) : 100;

  // ── Naviguer au suivant ──────────────────────────────────────────────────
  // Historique des choix, pour « Annuler » (true = marqué possédé, false = passé)
  const history = useRef<boolean[]>([]);

  const goNext = useCallback((markOwned: boolean) => {
    if (!sticker || animDir) return; // ignore un 2e tap pendant l'animation
    history.current.push(markOwned);
    if (markOwned) {
      setOwned(editionId, sticker.number, true);
      haptic();
      setChecked((c) => c + 1);
      setAnimDir('left');
    } else {
      setAnimDir('right');
    }
    setTimeout(() => {
      setIndex((i) => i + 1);
      setAnimDir(null);
    }, 220);
  }, [sticker, editionId, setOwned, animDir]);

  // ── Revenir sur le dernier choix ─────────────────────────────────────────
  const goBack = useCallback(() => {
    if (animDir || index === 0) return;
    const wasMarked = history.current.pop();
    const prev = missing[index - 1];
    if (wasMarked && prev) {
      setOwned(editionId, prev.number, false);
      setChecked((c) => c - 1);
    }
    setIndex((i) => i - 1);
  }, [animDir, index, missing, editionId, setOwned]);

  // ── Raccourcis clavier ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === ' ') { e.preventDefault(); goNext(true); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(false); }
      if (e.key === 'Backspace' || ((e.ctrlKey || e.metaKey) && e.key === 'z')) { e.preventDefault(); goBack(); }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goBack, onClose]);

  // ── Swipe touch ───────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 50) return; // trop petit ou vertical
    goNext(dx < 0); // swipe gauche = possédé, swipe droite = passer
  };

  if (missing.length === 0) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: C.bgBase, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ fontSize: '56px' }}>🎉</div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: C.gold }}>{t('Album complété !')}</h2>
        <p style={{ fontSize: '13px', color: C.textSecondary }}>{t('Tu possèdes tous les stickers de cet album.')}</p>
        <button className="btn-tactile" onClick={onClose} style={{ marginTop: '8px', padding: '12px 28px', borderRadius: '12px', background: C.gold, color: '#000', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
          {t('Fermer')}
        </button>
      </div>
    );
  }

  if (!sticker) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: C.bgBase, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: C.textPrimary }}>{t('Scan terminé !')}</h2>
        <p style={{ fontSize: '13px', color: C.textSecondary }}>
          {t('{n} sticker ajouté à ta collection.|{n} stickers ajoutés à ta collection.', { n: checked })}
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button className="btn-tactile" onClick={goBack} style={{ padding: '12px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: C.textSecondary, fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            {t('↶ Revenir')}
          </button>
          <button className="btn-tactile" onClick={onClose} style={{ padding: '12px 28px', borderRadius: '12px', background: C.gold, color: '#000', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
            {t('Terminer')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 500, background: C.bgBase, display: 'flex', flexDirection: 'column', userSelect: 'none' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Header ── */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: C.bgCard, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={16} color={C.gold} />
          <span style={{ fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>{t('Scan rapide')}</span>
        </div>
        <span style={{ fontSize: '12px', color: C.textTertiary }}>
          {index + 1} / {missing.length}
          {checked > 0 && <span style={{ color: C.green, marginLeft: '8px' }}>+{checked} ✓</span>}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={goBack} disabled={index === 0} aria-label={t('Revenir au sticker précédent')} style={{ height: '40px', padding: '0 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: index === 0 ? C.textTertiary : C.textSecondary, opacity: index === 0 ? 0.4 : 1, cursor: index === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600 }}>
            <Undo2 size={15} /> {t('Annuler')}
          </button>
          <button onClick={onClose} aria-label={t('Fermer le scan rapide')} style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: C.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Barre de progression ── */}
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: C.gold, transition: 'width 0.3s ease' }} />
      </div>

      {/* ── Carte sticker ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div
          style={{
            width: '220px',
            aspectRatio: '3/4',
            borderRadius: '20px',
            background: sticker.imageUrl ? '#000' : bg,
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            transform: animDir === 'left' ? 'translateX(-120%) rotate(-8deg)' : animDir === 'right' ? 'translateX(120%) rotate(8deg)' : 'none',
            transition: animDir ? 'transform 0.22s ease-in' : 'none',
          }}
        >
          {sticker.imageUrl ? (
            <img src={sticker.imageUrl} alt={sticker.player?.name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 55%)' }} />
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', marginBottom: '12px' }}>
                {sticker.player?.flag}
              </div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', textAlign: 'center', padding: '0 16px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                {stickerName(sticker, t)}
              </p>
              {sticker.player?.club && (
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginTop: '4px' }}>{sticker.player.club}</p>
              )}
            </>
          )}
          <span style={{ position: 'absolute', top: '10px', left: '12px', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', background: 'rgba(0,0,0,0.5)', padding: '2px 7px', borderRadius: '6px' }}>
            #{sticker.number}
          </span>
          {sticker.isShiny && (
            <span style={{ position: 'absolute', top: '10px', right: '12px', fontSize: '16px', color: C.shiny, filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.8))' }}>★</span>
          )}
          {sticker.player?.position && (
            <span style={{ position: 'absolute', bottom: '10px', left: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.4)', padding: '2px 7px', borderRadius: '4px' }}>
              {t(sticker.player.position)}
            </span>
          )}
        </div>
      </div>

      {/* ── Hint de swipe ── */}
      <div style={{ flexShrink: 0, textAlign: 'center', paddingBottom: '8px' }}>
        <p style={{ fontSize: '11px', color: C.textTertiary }}>{t('← Swipe gauche = possédé · Swipe droite = passer →')}</p>
      </div>

      {/* ── Boutons ── */}
      <div style={{ flexShrink: 0, display: 'flex', gap: '16px', padding: '16px 24px calc(32px + env(safe-area-inset-bottom))' }}>
        <button
          className="btn-tactile"
          onClick={() => goNext(false)}
          aria-label={t('Passer ce sticker')}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '18px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: C.textSecondary, fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
        >
          <ChevronRight size={20} /> {t('Passer')}
        </button>
        <button
          className="btn-tactile"
          onClick={() => goNext(true)}
          aria-label={t('Marquer comme possédé')}
          style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '18px', borderRadius: '16px', background: 'rgba(46,204,113,0.15)', border: `2px solid ${C.green}`, color: C.green, fontSize: '16px', fontWeight: 800, cursor: 'pointer' }}
        >
          <Check size={20} /> {t("Je l'ai !")}
        </button>
      </div>
    </div>
  );
};
