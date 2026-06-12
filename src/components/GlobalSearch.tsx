import React, { useState, useRef, useEffect } from 'react';
import { STICKERS_BY_EDITION, EDITIONS } from '../data/stickers';
import { useUIStore } from '../store';

export const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { goAlbum, selectSticker } = useUIStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const hits: Array<{ editionId: string; editionLabel: string; stickerNumber: number; name: string; team: string; pos: string; flag: string }> = [];
    for (const ed of EDITIONS) {
      const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
      for (const s of stickers) {
        if (!s.player) continue;
        const nameMatch = s.player.name.toLowerCase().includes(q);
        const teamMatch = s.player.nationality.toLowerCase().includes(q);
        const numMatch = String(s.number) === q;
        if (nameMatch || teamMatch || numMatch) {
          hits.push({ editionId: ed.id, editionLabel: ed.label, stickerNumber: s.number, name: s.player.name, team: s.player.nationality, pos: s.player.position, flag: s.player.flag });
        }
      }
    }
    // Group by player name, limit to 5 players
    const grouped: Record<string, typeof hits> = {};
    for (const h of hits) {
      if (!grouped[h.name]) grouped[h.name] = [];
      grouped[h.name].push(h);
    }
    return Object.entries(grouped).slice(0, 5);
  }, [query]);

  const handleSelect = (editionId: string, stickerNumber: number) => {
    goAlbum(editionId);
    setTimeout(() => selectSticker(stickerNumber), 50);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} className="relative flex-1 max-w-xs">
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] text-sm pointer-events-none">🔍</span>
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => query && setOpen(true)}
        placeholder="Joueur, numéro, équipe..."
        className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[var(--color-border-secondary)] bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] text-[12px] outline-none focus:border-[var(--color-border-primary)]"
      />
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-[var(--color-background-primary)] border border-[var(--color-border-secondary)] rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
          {results.map(([name, items]) => (
            <div key={name}>
              <div className="px-3 py-1.5 text-[9.5px] text-[var(--color-text-tertiary)] uppercase tracking-wider bg-[var(--color-background-secondary)]">
                {name}
              </div>
              {items.map((item) => (
                <div
                  key={`${item.editionId}-${item.stickerNumber}`}
                  onClick={() => handleSelect(item.editionId, item.stickerNumber)}
                  className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-[var(--color-background-secondary)] border-b border-[var(--color-border-tertiary)] last:border-0"
                >
                  <span className="text-lg">{item.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-[var(--color-text-primary)]">{item.editionLabel}</div>
                    <div className="text-[10px] text-[var(--color-text-tertiary)]">{item.team} · {item.pos}</div>
                  </div>
                  <span className="text-[10.5px] font-medium text-[var(--red)] bg-red-50 px-1.5 py-0.5 rounded">#{item.stickerNumber}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {open && query && results.length === 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-[var(--color-background-primary)] border border-[var(--color-border-secondary)] rounded-xl shadow-xl z-50 p-3">
          <p className="text-[11px] text-[var(--color-text-tertiary)] text-center">Aucun résultat</p>
        </div>
      )}
    </div>
  );
};
