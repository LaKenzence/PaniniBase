import React, { useEffect, useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { C } from '../theme';
import { useT } from '../i18n';

const SHORTCUTS = [
  { keys: ['Espace'], desc: 'Cocher / décocher le sticker sélectionné' },
  { keys: ['←', '→'], desc: 'Sticker précédent / suivant' },
  { keys: ['Ctrl', 'Z'], desc: 'Annuler la dernière action' },
  { keys: ['Ctrl', 'Y'], desc: 'Rétablir' },
  { keys: ['S'], desc: 'Activer / désactiver la sélection multiple' },
  { keys: ['Esc'], desc: 'Fermer le détail ou un panneau ouvert' },
  { keys: ['Ctrl', 'K'], desc: 'Ouvrir la recherche globale' },
  { keys: ['?'], desc: "Afficher cette aide" },
];

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: '26px', height: '24px', padding: '0 6px',
    borderRadius: '6px', background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)', borderBottom: '2px solid rgba(255,255,255,0.2)',
    fontSize: '11px', fontWeight: 700, color: C.textPrimary, fontFamily: 'inherit',
  }}>
    {children}
  </kbd>
);

/**
 * Petite fenêtre listant tous les raccourcis clavier de l'app.
 * S'ouvre avec la touche "?", se ferme avec Échap ou en cliquant à côté.
 */
export const ShortcutsHelp: React.FC = () => {
  const [open, setOpen] = useState(false);
  const t = useT();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '?') { e.preventDefault(); setOpen((v) => !v); }
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(4,8,20,0.85)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div style={{ width: '100%', maxWidth: '360px', background: C.glassStrong, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
        <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Keyboard size={16} color={C.gold} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>{t('Raccourcis clavier')}</span>
          </div>
          <button onClick={() => setOpen(false)} aria-label={t('Fermer')} style={{ width: '26px', height: '26px', borderRadius: '7px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: C.textTertiary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} />
          </button>
        </div>
        <div style={{ padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {SHORTCUTS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: C.textSecondary }}>{t(s.desc)}</span>
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                {s.keys.map((k, j) => (
                  <React.Fragment key={j}>
                    <Kbd>{t(k)}</Kbd>
                    {j < s.keys.length - 1 && <span style={{ color: C.textTertiary, fontSize: '11px', alignSelf: 'center' }}>+</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          <p style={{ fontSize: '11px', color: C.textTertiary, marginTop: '4px' }}>
            {t("Ces raccourcis ne fonctionnent qu'avec un clavier (sur ordinateur).")}
          </p>
        </div>
      </div>
    </div>
  );
};
