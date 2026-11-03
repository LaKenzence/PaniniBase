import React from 'react';
import { Lock } from 'lucide-react';
import type { Badge } from '../hooks/useBadges';
import { C } from '../theme';
import { t } from '../i18n';

/** "3 / 50" → 0.06 ; utilisé pour la petite barre sous un trophée verrouillé. */
const progressRatio = (p?: string) => {
  const m = p?.match(/(\d+)\s*\/\s*(\d+)/);
  return m ? Math.min(1, Number(m[1]) / Number(m[2])) : 0;
};

/**
 * Vitrine de trophées : les badges débloqués brillent sur l'étagère,
 * les autres restent verrouillés avec leur progression.
 */
export const TrophyShelf: React.FC<{ badges: Badge[]; compact?: boolean }> = ({ badges, compact }) => {
  const earned = badges.filter((b) => b.earned).length;
  return (
    <div style={{ background: `linear-gradient(180deg, ${C.bgCard}, #0A1220)`, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: compact ? '14px 14px 0' : '18px 18px 0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: C.textPrimary }}>{t('🏆 Vitrine')}</h3>
        <span style={{ fontSize: '11px', color: C.textTertiary }}><b style={{ color: C.gold }}>{earned}</b> / {badges.length} {t('trophées')}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${compact ? 92 : 120}px, 1fr))`, gap: '10px', paddingBottom: '14px' }}>
        {badges.map(({ id, Icon, title, description, earned: ok, progress }) => (
          <div key={id} title={description} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
            <div className={ok ? 'trophy-earned' : ''} style={{
              position: 'relative', width: compact ? '52px' : '64px', height: compact ? '52px' : '64px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: ok ? `radial-gradient(circle at 35% 30%, ${C.goldLight}, ${C.gold} 55%, #6b540f)` : 'rgba(255,255,255,0.04)',
              border: ok ? '2px solid rgba(255,230,150,0.6)' : '1.5px dashed rgba(255,255,255,0.14)',
              boxShadow: ok ? '0 0 22px rgba(201,162,39,0.45), inset 0 -4px 10px rgba(0,0,0,0.25)' : 'none',
              color: ok ? '#2a1f05' : 'rgba(255,255,255,0.25)',
            }}>
              <Icon size={compact ? 22 : 26} strokeWidth={2.2} />
              {!ok && (
                <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '20px', height: '20px', borderRadius: '50%', background: C.bgElevated, border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textTertiary }}>
                  <Lock size={10} />
                </span>
              )}
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: ok ? C.textPrimary : C.textTertiary, lineHeight: 1.2 }}>{title}</span>
            {!compact && <span style={{ fontSize: '11px', color: C.textTertiary, lineHeight: 1.35 }}>{description}{!ok && progress ? ` · ${progress}` : ''}</span>}
            {!ok && progress && (
              <div style={{ width: '70%', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressRatio(progress) * 100}%`, background: C.gold }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* L'étagère */}
      <div style={{ height: '8px', margin: '0 -18px', background: 'linear-gradient(180deg, #3a2a10, #1e1608)', boxShadow: '0 -2px 6px rgba(0,0,0,0.4)' }} />
    </div>
  );
};
