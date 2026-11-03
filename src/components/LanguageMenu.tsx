import React, { useEffect, useRef, useState } from 'react';
import { Globe } from 'lucide-react';
import { LANGS, useLangStore, useT } from '../i18n';
import { C } from '../theme';

/** Sélecteur de langue de l'en-tête (drapeau de la langue active). */
export const LanguageMenu: React.FC = () => {
  const { lang, setLang } = useLangStore();
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open]);

  const current = LANGS.find((l) => l.id === lang)!;

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        className="btn-tactile"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('Langue')}
        aria-haspopup="menu"
        aria-expanded={open}
        title={t('Langue')}
        style={{ display: 'flex', alignItems: 'center', gap: '5px', height: '36px', padding: '0 9px', borderRadius: '10px', background: open ? 'rgba(201,162,39,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${open ? 'rgba(201,162,39,0.3)' : 'rgba(255,255,255,0.1)'}`, color: C.textSecondary, cursor: 'pointer' }}
      >
        <Globe size={14} /><span style={{ fontSize: '14px', lineHeight: 1 }}>{current.flag}</span>
      </button>
      {open && (
        <div role="menu" className="popover-in" style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 100, minWidth: '160px', padding: '6px', background: C.bgElevated, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
          {LANGS.map((l) => (
            <button
              key={l.id}
              role="menuitemradio"
              aria-checked={l.id === lang}
              onClick={() => { setLang(l.id); setOpen(false); }}
              style={{ width: '100%', minHeight: '40px', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 10px', borderRadius: '8px', border: 'none', background: l.id === lang ? 'rgba(201,162,39,0.1)' : 'transparent', color: l.id === lang ? C.gold : C.textPrimary, fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '16px' }}>{l.flag}</span>{l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
