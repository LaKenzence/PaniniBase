import { describe, it, expect, beforeEach, vi } from 'vitest';

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('../lib/supabase', () => ({
  supabase: { from: vi.fn(), rpc },
}));

import { useTradesStore, useAuthStore } from './index';

describe('useTradesStore', () => {
  beforeEach(() => {
    rpc.mockReset();
    useAuthStore.setState({ user: { id: 'u1' } as any });
    useTradesStore.setState({ matches: [], matchesLoading: false });
  });

  describe('fetchTradeByToken', () => {
    it("renvoie l'annonce correspondant au code", async () => {
      rpc.mockResolvedValue({ data: [{ have_stickers: [{ editionId: '70', number: 3 }], want_stickers: [], username: 'kenzo' }], error: null });
      const res = await useTradesStore.getState().fetchTradeByToken('a3f9bc');
      expect(rpc).toHaveBeenCalledWith('get_trade_by_token', { token: 'a3f9bc' });
      expect(res).toEqual({ have: [{ editionId: '70', number: 3 }], want: [], username: 'kenzo' });
    });

    it('renvoie null pour un code inconnu', async () => {
      rpc.mockResolvedValue({ data: [], error: null });
      expect(await useTradesStore.getState().fetchTradeByToken('zzz')).toBeNull();
    });

    it('renvoie null en cas d’erreur', async () => {
      rpc.mockResolvedValue({ data: null, error: { message: 'boom' } });
      expect(await useTradesStore.getState().fetchTradeByToken('a3f9bc')).toBeNull();
    });
  });

  describe('findMatches', () => {
    it('transforme les lignes Supabase en matches', async () => {
      rpc.mockResolvedValue({
        data: [{ matched_user_id: 'u2', username: 'lea', share_token: 't2', they_can_give: [{ editionId: '70', number: 1 }], you_can_give: null, match_score: 4 }],
        error: null,
      });
      const matches = await useTradesStore.getState().findMatches();
      expect(rpc).toHaveBeenCalledWith('find_trade_matches', { current_user_id: 'u1' });
      expect(matches).toEqual([{ userId: 'u2', username: 'lea', shareToken: 't2', theyCanGive: [{ editionId: '70', number: 1 }], youCanGive: [], matchScore: 4 }]);
      expect(useTradesStore.getState()).toMatchObject({ matches, matchesLoading: false });
    });

    it('arrête le chargement en cas d’erreur', async () => {
      rpc.mockResolvedValue({ data: null, error: { message: 'boom' } });
      expect(await useTradesStore.getState().findMatches()).toEqual([]);
      expect(useTradesStore.getState().matchesLoading).toBe(false);
    });

    it('ne fait rien sans utilisateur connecté', async () => {
      useAuthStore.setState({ user: null });
      expect(await useTradesStore.getState().findMatches()).toEqual([]);
      expect(rpc).not.toHaveBeenCalled();
    });
  });
});
