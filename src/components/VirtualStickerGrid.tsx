import React, { useRef, useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Sticker } from '../types';
import { StickerCard } from './StickerCard';
import { useCollectionStore } from '../store/index';
import { C } from '../theme';
import { useT } from '../i18n';

const MIN_CARD_WIDTH = 92;
const GAP = 10;
const HEADER_HEIGHT = 52;
const LONG_PRESS_MS = 450;

interface Props {
  stickers: Sticker[];
  selectMode: boolean;
  selected: Set<string>;
  selectedStickerNumber: string | number | null;
  onCardClick: (s: Sticker) => void;
  /** Appui long (mobile) : ajoute le sticker ou un doublon. */
  onLongPress?: (s: Sticker) => void;
  /** Range les stickers par équipe, avec une "page" et sa progression par équipe. */
  groupByTeam?: boolean;
  /** Progression réelle par équipe (tout l'album, pas seulement les stickers filtrés). */
  teamTotals?: Record<string, { owned: number; total: number }>;
}

export interface VirtualStickerGridHandle {
  scrollToTeam: (team: string) => void;
}

type Row =
  | { kind: 'header'; team: string; flag: string; owned: number; total: number }
  | { kind: 'cards'; stickers: Sticker[] };

const teamOf = (s: Sticker) => s.teamName ?? s.player?.nationality ?? 'Autres';

/**
 * Grille de stickers virtualisée (lignes virtualisées uniquement — chaque ligne
 * ne contient que quelques colonnes, pas besoin de virtualiser les colonnes).
 * Ne monte dans le DOM que les lignes visibles + une marge. Indispensable pour
 * l'album 2026 (980 stickers) afin de garder un scroll fluide, surtout sur mobile.
 */
export const VirtualStickerGrid = forwardRef<VirtualStickerGridHandle, Props>(({ stickers, selectMode, selected, selectedStickerNumber, onCardClick, onLongPress, groupByTeam, teamTotals }, ref) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const [width, setWidth] = useState(0);
  const collection = useCollectionStore((s) => s.collection);

  // Mesure la largeur du conteneur pour calculer le nombre de colonnes responsive
  useEffect(() => {
    if (!parentRef.current) return;
    const el = parentRef.current;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    observer.observe(el);
    setWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const columnCount = width > 0 ? Math.max(1, Math.floor(width / (MIN_CARD_WIDTH + GAP))) : 1;
  const columnWidth = width > 0 ? width / columnCount : MIN_CARD_WIDTH;
  const cardRowHeight = (columnWidth - GAP) * (4 / 3) + GAP; // aspect-ratio 3/4

  // Découpe en lignes : un en-tête par équipe (groupes consécutifs = ordre de l'album), puis ses cartes
  const rows = useMemo<Row[]>(() => {
    const chunk = (list: Sticker[]) => {
      const out: Row[] = [];
      for (let i = 0; i < list.length; i += columnCount) out.push({ kind: 'cards', stickers: list.slice(i, i + columnCount) });
      return out;
    };
    if (!groupByTeam) return chunk(stickers);

    const groups: Array<{ team: string; list: Sticker[] }> = [];
    for (const s of stickers) {
      const team = teamOf(s);
      const last = groups[groups.length - 1];
      if (last && last.team === team) last.list.push(s);
      else groups.push({ team, list: [s] });
    }
    return groups.flatMap(({ team, list }) => {
      const t = teamTotals?.[team];
      const owned = t ? t.owned : list.filter((s) => collection[`${s.editionId}-${s.number}`]?.owned).length;
      return [{ kind: 'header' as const, team, flag: list[0].player?.flag ?? '', owned, total: t ? t.total : list.length }, ...chunk(list)];
    });
  }, [stickers, columnCount, groupByTeam, collection, teamTotals]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => (rows[i]?.kind === 'header' ? HEADER_HEIGHT : cardRowHeight),
    overscan: 4,
  });

  // La hauteur des lignes change avec la largeur : on remesure
  useEffect(() => { virtualizer.measure(); }, [cardRowHeight, rows]);

  useImperativeHandle(ref, () => ({
    scrollToTeam: (team) => {
      const i = rows.findIndex((r) => r.kind === 'header' && r.team === team);
      if (i !== -1) virtualizer.scrollToIndex(i, { align: 'start', behavior: 'smooth' });
    },
  }), [rows, virtualizer]);

  // ── Appui long ──────────────────────────────────────────────────────
  const pressTimer = useRef<number | null>(null);
  const pressStart = useRef<{ x: number; y: number } | null>(null);
  const longPressed = useRef(false);
  const cancelPress = () => { if (pressTimer.current) window.clearTimeout(pressTimer.current); pressTimer.current = null; };
  const startPress = (e: React.PointerEvent, s: Sticker) => {
    longPressed.current = false;
    if (!onLongPress || selectMode || e.pointerType === 'mouse') return;
    pressStart.current = { x: e.clientX, y: e.clientY };
    cancelPress();
    pressTimer.current = window.setTimeout(() => {
      longPressed.current = true;
      navigator.vibrate?.(20);
      onLongPress(s);
    }, LONG_PRESS_MS);
  };
  const movePress = (e: React.PointerEvent) => {
    const p = pressStart.current;
    if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 8) cancelPress(); // c'est un scroll, pas un appui
  };

  return (
    <div ref={parentRef} style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>
        {width > 0 && virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          if (!row) return null;
          const base: React.CSSProperties = {
            position: 'absolute', top: 0, left: 0, width: '100%',
            transform: `translateY(${virtualRow.start}px)`, height: `${virtualRow.size}px`, boxSizing: 'border-box',
          };

          if (row.kind === 'header') {
            const pct = row.total ? Math.round((row.owned / row.total) * 100) : 0;
            const done = row.owned === row.total;
            return (
              <div key={virtualRow.key} style={{ ...base, display: 'flex', alignItems: 'flex-end', padding: `0 ${GAP / 2}px 8px` }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', borderBottom: `1px solid ${done ? 'rgba(201,162,39,0.35)' : 'rgba(255,255,255,0.07)'}`, paddingBottom: '7px' }}>
                  <span style={{ fontSize: '20px', lineHeight: 1 }}>{row.flag}</span>
                  <span className="section-title">{t(row.team)}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: done ? C.gold : C.textSecondary }}>
                    {row.owned}/{row.total}{done ? ' ✓' : ''}
                  </span>
                  <div style={{ marginLeft: 'auto', width: '90px', height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: done ? C.gold : C.green, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={virtualRow.key} style={{ ...base, display: 'flex', gap: `${GAP}px`, padding: `${GAP / 2}px` }}>
              {row.stickers.map((s) => (
                <div
                  key={s.id}
                  style={{ width: `${columnWidth - GAP}px`, flexShrink: 0, position: 'relative', touchAction: 'manipulation', WebkitUserSelect: 'none', userSelect: 'none' }}
                  onPointerDown={(e) => startPress(e, s)}
                  onPointerMove={movePress}
                  onPointerUp={cancelPress}
                  onPointerLeave={cancelPress}
                  onPointerCancel={cancelPress}
                  onContextMenu={(e) => { if (onLongPress) e.preventDefault(); }}
                  onClick={() => { if (longPressed.current) { longPressed.current = false; return; } onCardClick(s); }}
                >
                  <StickerCard
                    sticker={s}
                    selected={selectMode ? selected.has(s.id) : String(s.number) === String(selectedStickerNumber)}
                    onClick={() => {}}
                  />
                  {selectMode && (
                    <div style={{
                      position: 'absolute', top: '5px', left: '5px', zIndex: 10,
                      width: '18px', height: '18px', borderRadius: '5px',
                      background: selected.has(s.id) ? C.gold : 'rgba(0,0,0,0.6)',
                      border: `2px solid ${selected.has(s.id) ? C.gold : 'rgba(255,255,255,0.4)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', color: '#000', fontWeight: 800,
                    }}>
                      {selected.has(s.id) ? '✓' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
});
