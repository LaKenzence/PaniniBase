import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { STICKERS_BY_EDITION, EDITIONS } from '../data/stickers';
import { useEditions, useDataVersion } from '../hooks/useEditionData';
import { useDebounce } from '../hooks/useDebounce';
import { useUIStore } from '../store/index';
import { C } from '../theme';
import { useT, albumName } from '../i18n';

// Comparaison sans accents ni majuscules : « mbappe » trouve « Mbappé », et les
// deux graphies présentes dans les données sont regroupées sous un même joueur.
const fold = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

interface Props {
  /** Focus automatique à l'ouverture (barre de recherche mobile) */
  autoFocus?: boolean;
  /** Appelé après un choix, un clic extérieur ou Échap (pour refermer la barre mobile) */
  onDone?: () => void;
}

export const GlobalSearch: React.FC<Props> = ({ autoFocus, onDone }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);
  const [open, setOpen]   = useState(false);
  const { goAlbum } = useUIStore();
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); onDone?.(); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Raccourci clavier Ctrl+K / Cmd+K pour focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        (ref.current?.querySelector('input') as HTMLInputElement)?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Les effectifs de tous les albums ne sont chargés qu'à la première recherche
  useEditions(debouncedQuery.trim().length >= 2 ? 'all' : null);
  const version = useDataVersion();

  const results = React.useMemo(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) return [];
    const q = fold(debouncedQuery.trim());
    const hits: Array<{ editionId: string; editionLabel: string; stickerNumber: string | number; code?: string; name: string; team: string; pos?: string; flag: string }> = [];
    for (const ed of EDITIONS) {
      const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
      for (const s of stickers) {
        if (!s.player) continue;
        const nameMatch = fold(s.player.name).includes(q);
        const teamMatch = fold(s.player.nationality).includes(q) || fold(t(s.player.nationality)).includes(q);
        const numMatch  = String(s.number).toLowerCase() === q || (!!s.code && fold(s.code).replace(/\s/g, '') === q.replace(/\s/g, ''));
        if (nameMatch || teamMatch || numMatch) {
          hits.push({ editionId: ed.id, editionLabel: albumName(ed.label, t), stickerNumber: s.number, code: s.code, name: s.player.name, team: t(s.player.nationality), pos: s.player.position, flag: s.player.flag });
        }
      }
    }
    const grouped: Record<string, typeof hits> = {};
    for (const h of hits) {
      const k = fold(h.name);
      if (!grouped[k]) grouped[k] = [];
      grouped[k].push(h);
    }
    // Clé d'affichage : la graphie avec accents si elle existe (« Mbappé » plutôt que « Mbappe »)
    return Object.values(grouped).slice(0, 6).map((items) => [items.find((h) => fold(h.name) !== h.name.toLowerCase())?.name ?? items[0].name, items] as const);
  }, [debouncedQuery, version, t]);

  const handleSelect = (editionId: string, stickerNumber: string | number) => {
    goAlbum(editionId, { sticker: stickerNumber });
    setOpen(false);
    setQuery('');
    onDone?.();
  };

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, maxWidth: onDone ? 'none' : '300px' }}>
      {/* Input */}
      <div style={{ position: 'relative' }}>
        <Search size={13} color={C.textTertiary} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query && setOpen(true)}
          onKeyDown={(e) => { if (e.key === 'Escape') { setQuery(''); setOpen(false); e.currentTarget.blur(); onDone?.(); } }}
          autoFocus={autoFocus}
          placeholder={onDone ? t('Joueur, équipe, numéro…') : t('Rechercher…')}
          aria-label={t('Rechercher un joueur, une équipe ou un numéro dans tous les albums')}
          style={{
            width: '100%', paddingLeft: '30px', paddingRight: '10px',
            paddingTop: onDone ? '10px' : '7px', paddingBottom: onDone ? '10px' : '7px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.09)',
            background: 'rgba(255,255,255,0.05)',
            color: C.textPrimary, fontSize: '12px', outline: 'none',
            transition: 'border-color 0.15s',
            boxSizing: 'border-box',
          }}
          onFocusCapture={(e) => (e.currentTarget.style.borderColor = C.gold)}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
        />
        {query ? (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            aria-label={t('Effacer la recherche')}
            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.textTertiary, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <X size={13} />
          </button>
        ) : !onDone && (
          <kbd className="search-kbd" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', fontFamily: 'inherit', color: C.textTertiary, padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }}>Ctrl K</kbd>
        )}
      </div>

      {/* Dropdown */}
      {open && debouncedQuery.length >= 2 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, minWidth: onDone ? 0 : '300px',
          background: C.glassStrong, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px', boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
          zIndex: 200, overflow: 'hidden', maxHeight: '360px', overflowY: 'auto',
        }}>
          {/* Gold line */}
          <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />

          {results.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: C.textTertiary }}>
              {t('Aucun résultat pour « {q} »', { q: query })}
            </div>
          ) : (
            results.map(([name, items]) => (
              <div key={name}>
                {/* Player header */}
                <div style={{ padding: '8px 14px 4px', fontSize: '11px', color: C.textTertiary, textTransform: 'uppercase', letterSpacing: '0.8px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px' }}>{items[0].flag}</span>
                  <span style={{ fontWeight: 700, color: C.textSecondary }}>{name}</span>
                  <span style={{ marginLeft: 'auto', color: C.textTertiary }}>{items.length > 1 ? t('{n} albums', { n: items.length }) : t('1 album')}</span>
                </div>
                {/* Edition items */}
                {items.map((item) => (
                  <button
                    key={`${item.editionId}-${item.stickerNumber}`}
                    onClick={() => handleSelect(item.editionId, item.stickerNumber)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '9px 14px', cursor: 'pointer', textAlign: 'left',
                      background: 'transparent', border: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.editionLabel}
                      </div>
                      <div style={{ fontSize: '11px', color: C.textTertiary, marginTop: '1px' }}>
                        {item.team}{item.pos ? ` · ${t(item.pos)}` : ''}
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: C.gold, background: 'rgba(201,162,39,0.12)', padding: '2px 7px', borderRadius: '6px', flexShrink: 0 }}>
                      {item.code ?? `#${item.stickerNumber}`}
                    </span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
