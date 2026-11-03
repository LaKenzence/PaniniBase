import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { useT } from '../i18n';
import { C } from '../theme';

interface Team { name: string; flag: string; owned: number; total: number }

interface Props {
  teams: Team[];
  onPick: (team: string) => void;
  onClose: () => void;
}

/** Progression équipe par équipe, les plus proches de la fin en premier. */
export const TeamProgress: React.FC<Props> = ({ teams, onPick, onClose }) => {
  const t = useT();
  const [hideDone, setHideDone] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const sorted = useMemo(() => {
    const left = (x: Team) => x.total - x.owned;
    // Équipes commencées et presque finies d'abord, puis non commencées, puis terminées
    return [...teams]
      .filter((x) => !hideDone || left(x) > 0)
      .sort((a, b) => {
        const doneA = left(a) === 0, doneB = left(b) === 0;
        if (doneA !== doneB) return doneA ? 1 : -1;
        const startedA = a.owned > 0, startedB = b.owned > 0;
        if (startedA !== startedB) return startedA ? -1 : 1;
        return left(a) - left(b) || a.name.localeCompare(b.name);
      });
  }, [teams, hideDone]);

  const doneCount = teams.filter((x) => x.owned === x.total).length;

  return (
    <div role="dialog" aria-modal="true" aria-label={t('Progression par équipe')} onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(4,8,20,0.8)', backdropFilter: 'blur(6px)' }}>
      <div className="popover-in" style={{ width: '100%', maxWidth: '440px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', background: C.bgCard, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: C.textPrimary, margin: 0 }}>{t('Progression par équipe')}</h2>
            <p style={{ fontSize: '11.5px', color: C.textTertiary, margin: '2px 0 0' }}>{t('{done} / {total} équipes complètes', { done: doneCount, total: teams.length })}</p>
          </div>
          <button className="btn-tactile" onClick={onClose} aria-label={t('Fermer')} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: C.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '12px', color: C.textSecondary, cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} style={{ accentColor: C.gold }} />
          {t('Masquer les équipes complètes')}
        </label>

        <div style={{ overflowY: 'auto', padding: '8px' }}>
          {sorted.map((team) => {
            const pct = team.total ? Math.round((team.owned / team.total) * 100) : 0;
            const left = team.total - team.owned;
            const color = left === 0 ? C.gold : pct >= 75 ? C.green : pct > 0 ? C.blue : 'rgba(255,255,255,0.25)';
            return (
              <button
                key={team.name}
                onClick={() => onPick(team.name)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', minHeight: '48px', padding: '6px 10px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{team.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t(team.name)}</span>
                    <span style={{ fontSize: '11.5px', color: left === 0 ? C.gold : C.textSecondary, flexShrink: 0 }}>
                      {left === 0 ? t('✓ Complète') : left <= 3 && team.owned > 0 ? t('plus que {n}', { n: left }) : `${team.owned}/${team.total}`}
                    </span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
