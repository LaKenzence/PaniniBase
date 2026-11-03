import React, { forwardRef } from 'react';
import { C } from '../theme';
import { t } from '../i18n';

interface Props {
  hostFlag: string;
  label: string;
  year: number;
  pct: number;
  owned: number;
  total: number;
}

/**
 * Carte visuelle utilisée UNIQUEMENT pour la capture d'image (html2canvas).
 * Toujours dans le DOM mais positionnée hors écran — jamais affichée
 * directement à l'utilisateur.
 */
export const ShareCard = forwardRef<HTMLDivElement, Props>(({ hostFlag, label, year, pct, owned, total }, ref) => {
  const color = pct === 100 ? C.gold : pct > 75 ? C.green : pct > 40 ? C.blue : C.red;

  return (
    <div
      ref={ref}
      style={{
        width: '600px',
        height: '750px',
        background: `linear-gradient(160deg, #0F1E3A 0%, ${C.bgBase} 100%)`,
        position: 'relative',
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Bandeau doré décoratif */}
      <div style={{ position: 'absolute', top: 0, left: '60px', right: '60px', height: '3px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />

      {/* Logo + wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '40px' }}>
        <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(201,162,39,0.15)', border: '2px solid rgba(201,162,39,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>⚽</div>
        <span style={{ fontSize: '26px', fontWeight: 800, color: C.textPrimary, letterSpacing: '-0.5px' }}>
          Panini<span style={{ color: C.gold }}>Base</span>
        </span>
      </div>

      {/* Flag + album */}
      <div style={{ fontSize: '64px', marginBottom: '12px' }}>{hostFlag}</div>
      <div style={{ fontSize: '22px', fontWeight: 700, color: C.textPrimary, marginBottom: '4px', textAlign: 'center' }}>{label}</div>
      <div style={{ fontSize: '14px', color: C.textSecondary, marginBottom: '36px' }}>{year}</div>

      {/* Grand pourcentage */}
      <div style={{ fontSize: '110px', fontWeight: 800, color, lineHeight: 1, letterSpacing: '-3px', marginBottom: '8px' }}>
        {pct}%
      </div>
      <div style={{ fontSize: '15px', color: C.textSecondary, marginBottom: '32px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
        {t("de l'album complété")}
      </div>

      {/* Barre de progression */}
      <div style={{ width: '420px', height: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: '28px' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '6px' }} />
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '40px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: C.green }}>{owned}</div>
          <div style={{ fontSize: '11px', color: C.textTertiary, textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '4px' }}>{t('Possédés')}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: C.textSecondary }}>{total}</div>
          <div style={{ fontSize: '11px', color: C.textTertiary, textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '4px' }}>{t('Total album')}</div>
        </div>
      </div>

      {/* Tagline */}
      <div style={{ position: 'absolute', bottom: '40px', fontSize: '13px', color: C.textTertiary }}>
        {t('Rejoins-moi sur PaniniBase ⚽')}
      </div>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';
