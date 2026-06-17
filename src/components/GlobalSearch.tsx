import React, { useState, useRef, useEffect } from 'react';
import { STICKERS_BY_EDITION, EDITIONS } from '../data/stickers';
import { useUIStore } from '../store/index';

export const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen]   = useState(false);
  const { goAlbum, selectSticker } = useUIStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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

  const results = React.useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    const hits: Array<{ editionId: string; editionLabel: string; stickerNumber: string | number; name: string; team: string; pos: string; flag: string }> = [];
    for (const ed of EDITIONS) {
      const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
      for (const s of stickers) {
        if (!s.player) continue;
        const nameMatch = s.player.name.toLowerCase().includes(q);
        const teamMatch = s.player.nationality.toLowerCase().includes(q);
        const numMatch  = String(s.number).toLowerCase() === q;
        if (nameMatch || teamMatch || numMatch) {
          hits.push({ editionId: ed.id, editionLabel: ed.label, stickerNumber: s.number, name: s.player.name, team: s.player.nationality, pos: s.player.position, flag: s.player.flag });
        }
      }
    }
    const grouped: Record<string, typeof hits> = {};
    for (const h of hits) {
      if (!grouped[h.name]) grouped[h.name] = [];
      grouped[h.name].push(h);
    }
    return Object.entries(grouped).slice(0, 6);
  }, [query]);

  const handleSelect = (editionId: string, stickerNumber: string | number) => {
    goAlbum(editionId);
    setTimeout(() => selectSticker(stickerNumber as number), 50);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
      {/* Input */}
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', pointerEvents: 'none', color: '#4A5A7A' }}>🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query && setOpen(true)}
          placeholder="Joueur, équipe, numéro... (Ctrl+K)"
          style={{
            width: '100%', paddingLeft: '30px', paddingRight: '10px',
            paddingTop: '7px', paddingBottom: '7px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.09)',
            background: 'rgba(255,255,255,0.05)',
            color: '#F0F4FF', fontSize: '12px', outline: 'none',
            transition: 'border-color 0.15s',
            boxSizing: 'border-box',
          }}
          onFocusCapture={(e) => (e.currentTarget.style.borderColor = '#C9A227')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4A5A7A', cursor: 'pointer', fontSize: '14px', lineHeight: 1 }}
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && query.length >= 2 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#0D1526', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px', boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
          zIndex: 200, overflow: 'hidden', maxHeight: '360px', overflowY: 'auto',
        }}>
          {/* Gold line */}
          <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #C9A227, transparent)' }} />

          {results.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#4A5A7A' }}>
              Aucun résultat pour « {query} »
            </div>
          ) : (
            results.map(([name, items]) => (
              <div key={name}>
                {/* Player header */}
                <div style={{ padding: '8px 14px 4px', fontSize: '10px', color: '#4A5A7A', textTransform: 'uppercase', letterSpacing: '0.8px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px' }}>{items[0].flag}</span>
                  <span style={{ fontWeight: 700, color: '#8A9BBF' }}>{name}</span>
                  <span style={{ marginLeft: 'auto', color: '#4A5A7A' }}>{items.length} album{items.length > 1 ? 's' : ''}</span>
                </div>
                {/* Edition items */}
                {items.map((item) => (
                  <div
                    key={`${item.editionId}-${item.stickerNumber}`}
                    onClick={() => handleSelect(item.editionId, item.stickerNumber)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '9px 14px', cursor: 'pointer',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: '#F0F4FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.editionLabel}
                      </div>
                      <div style={{ fontSize: '10px', color: '#4A5A7A', marginTop: '1px' }}>
                        {item.team} · {item.pos}
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#C9A227', background: 'rgba(201,162,39,0.12)', padding: '2px 7px', borderRadius: '6px', flexShrink: 0 }}>
                      #{item.stickerNumber}
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
