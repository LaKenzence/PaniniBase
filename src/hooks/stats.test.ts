import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditionStats, useTeamStats } from './index';
import { useCollectionStore } from '../store/index';
import { STICKERS_BY_EDITION } from '../data/stickers';

// Régression : les compteurs restaient à 0 après avoir ajouté un sticker,
// car les calculs ne se relançaient pas quand la collection changeait.
describe('statistiques en direct', () => {
  beforeEach(() => {
    useCollectionStore.setState({ collection: {}, history: [], future: [], pendingSync: {} });
  });

  it('useEditionStats suit les ajouts', () => {
    const first = STICKERS_BY_EDITION['70'][0];
    const { result } = renderHook(() => useEditionStats('70'));
    expect(result.current.owned).toBe(0);
    act(() => useCollectionStore.getState().setOwned('70', first.number, true));
    expect(result.current.owned).toBe(1);
  });

  it('useTeamStats suit les ajouts', () => {
    const first = STICKERS_BY_EDITION['70'][0];
    const team = first.teamName ?? first.player?.nationality;
    const { result } = renderHook(() => useTeamStats('70'));
    act(() => useCollectionStore.getState().setOwned('70', first.number, true));
    expect(result.current.find((t) => t.name === team)?.owned).toBe(1);
  });
});
