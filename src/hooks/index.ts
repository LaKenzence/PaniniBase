import { useMemo } from 'react';
import { EDITIONS, STICKERS_BY_EDITION } from '../data/stickers';
import { useCollectionStore } from '../store';
import type { Sticker, AlbumFilter } from '../types';

// ─── Global stats across all editions ────────────────────────────────────────

export function useGlobalStats() {
  const { collection } = useCollectionStore();

  return useMemo(() => {
    const totalStickers = EDITIONS.reduce((sum, e) => sum + e.totalStickers, 0);
    const totalCatalogued = Object.values(STICKERS_BY_EDITION).reduce((sum, arr) => sum + arr.length, 0);
    const totalOwned = Object.values(collection).filter((e) => e.owned).length;
    const totalDupes = Object.values(collection).reduce((sum, e) => sum + e.duplicates, 0);
    return { totalStickers, totalCatalogued, totalOwned, totalDupes };
  }, [collection]);
}

// ─── Per-edition stats ────────────────────────────────────────────────────────

export function useEditionStats(editionId: string) {
  const { isOwned, getDuplicates } = useCollectionStore();
  const stickers = STICKERS_BY_EDITION[editionId] ?? [];
  const edition = EDITIONS.find((e) => e.id === editionId)!;

  return useMemo(() => {
    const catalogued = stickers.length;
    const owned = stickers.filter((s) => isOwned(editionId, s.number)).length;
    const dupes = stickers.reduce((sum, s) => sum + getDuplicates(editionId, s.number), 0);
    const missing = catalogued - owned;
    const pct = catalogued > 0 ? Math.round((owned / edition.totalStickers) * 100) : 0;
    return { catalogued, owned, missing, dupes, pct, total: edition.totalStickers };
  }, [editionId, stickers, edition, isOwned, getDuplicates]);
}

// ─── Per-team stats within an album ──────────────────────────────────────────

export function useTeamStats(editionId: string) {
  const { isOwned } = useCollectionStore();
  const stickers = STICKERS_BY_EDITION[editionId] ?? [];

  return useMemo(() => {
    const teams: Record<string, { total: number; owned: number; flag: string }> = {};
    for (const s of stickers) {
      const team = s.teamName ?? s.player?.nationality ?? 'Inconnu';
      const flag = s.player?.flag ?? '';
      if (!teams[team]) teams[team] = { total: 0, owned: 0, flag };
      teams[team].total++;
      if (isOwned(editionId, s.number)) teams[team].owned++;
    }
    return Object.entries(teams).map(([name, data]) => ({ name, ...data }));
  }, [editionId, stickers, isOwned]);
}

// ─── Filtered stickers for album view ────────────────────────────────────────

export function useFilteredStickers(editionId: string, filter: AlbumFilter, search: string, teamFilter: string | null) {
  const { isOwned, getDuplicates } = useCollectionStore();
  const stickers = STICKERS_BY_EDITION[editionId] ?? [];

  return useMemo(() => {
    return stickers.filter((s: Sticker) => {
      if (filter === 'owned' && !isOwned(editionId, s.number)) return false;
      if (filter === 'missing' && isOwned(editionId, s.number)) return false;
      if (filter === 'dupes' && getDuplicates(editionId, s.number) === 0) return false;
      if (teamFilter && s.teamName !== teamFilter && s.player?.nationality !== teamFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const matchName = s.player?.name.toLowerCase().includes(q);
        const matchNum = String(s.number).includes(q);
        const matchTeam = s.teamName?.toLowerCase().includes(q);
        if (!matchName && !matchNum && !matchTeam) return false;
      }
      return true;
    });
  }, [editionId, stickers, filter, search, teamFilter, isOwned, getDuplicates]);
}

// ─── Neighbor stickers (for detail panel) ────────────────────────────────────

export function useNeighborStickers(editionId: string, number: number, count = 5) {
  const stickers = STICKERS_BY_EDITION[editionId] ?? [];
  return useMemo(() => {
    const sorted = [...stickers].sort((a, b) => a.number - b.number);
    const idx = sorted.findIndex((s) => s.number === number);
    if (idx === -1) return [];
    const start = Math.max(0, idx - Math.floor(count / 2));
    return sorted.slice(start, start + count);
  }, [editionId, number, stickers, count]);
}
