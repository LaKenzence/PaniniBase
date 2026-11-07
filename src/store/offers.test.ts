import { describe, it, expect, beforeEach, vi } from 'vitest';

// Supabase simulé : from(...).select().order().limit() renvoie les lignes de `rows`,
// insert() et rpc() renvoient ce qu'on leur demande.
const { rpc, rows, insert } = vi.hoisted(() => ({ rpc: vi.fn(), rows: { data: [] as any[] }, insert: vi.fn() }));
vi.mock('../lib/supabase', () => {
  const query: any = { select: () => query, order: () => query, limit: async () => ({ data: rows.data, error: null }), insert, upsert: () => ({ then: () => {} }) };
  return { supabase: { from: () => query, rpc } };
});

import { useOffersStore, useAuthStore, useCollectionStore, offerFromRow, offersWaitingForMe } from './index';

const row = (over: Partial<Record<string, any>> = {}) => ({
  id: 'o1', from_user: 'alice', to_user: 'bob', status: 'accepted', from_done: false, to_done: false, created_at: '2026-11-03',
  give: [{ editionId: '18', number: 209 }], receive: [{ editionId: '18', number: 10 }],
  from_profile: { username: 'Alice' }, to_profile: { username: 'Bob' }, ...over,
});

describe('propositions d’échange', () => {
  it('chacun voit ce qu’il donne et ce qu’il reçoit', () => {
    const forAlice = offerFromRow(row(), 'alice');
    const forBob = offerFromRow(row(), 'bob');
    expect(forAlice).toMatchObject({ mine: true, otherName: 'Bob', give: [{ number: 209 }], receive: [{ number: 10 }] });
    expect(forBob).toMatchObject({ mine: false, otherName: 'Alice', give: [{ number: 10 }], receive: [{ number: 209 }] });
  });

  it('compte ce qui attend une action de ma part', () => {
    const offers = [
      offerFromRow(row({ id: 'a', status: 'proposed' }), 'bob'),               // à accepter ou refuser
      offerFromRow(row({ id: 'b', status: 'proposed' }), 'alice'),             // j'attends sa réponse
      offerFromRow(row({ id: 'c', status: 'accepted' }), 'alice'),             // à confirmer
      offerFromRow(row({ id: 'd', status: 'accepted', from_done: true }), 'alice'), // déjà confirmé
      offerFromRow(row({ id: 'e', status: 'done' }), 'alice'),
    ];
    expect(offersWaitingForMe(offers)).toBe(2);
  });

  describe('confirmer un échange', () => {
    beforeEach(() => {
      rpc.mockReset();
      useAuthStore.setState({ user: { id: 'bob' } as any });
      useCollectionStore.setState({ collection: {}, history: [], future: [], pendingSync: {} });
      useCollectionStore.getState().setOwned('18', 10, true);
      useCollectionStore.getState().setDuplicates('18', 10, 1);
      rows.data = [row()];
    });

    it('met ma collection à jour à ma première confirmation', async () => {
      await useOffersStore.getState().loadOffers();
      rpc.mockResolvedValue({ data: true, error: null });
      await useOffersStore.getState().confirm('o1');
      expect(rpc).toHaveBeenCalledWith('confirm_trade_offer', { offer_id: 'o1' });
      const c = useCollectionStore.getState();
      expect(c.getDuplicates('18', 10)).toBe(0); // Bob donne son doublon du n°10
      expect(c.isOwned('18', 209)).toBe(true);   // et reçoit le n°209
    });

    it('ne touche pas deux fois à la collection', async () => {
      await useOffersStore.getState().loadOffers();
      rpc.mockResolvedValue({ data: false, error: null }); // déjà confirmé (autre appareil)
      await useOffersStore.getState().confirm('o1');
      expect(useCollectionStore.getState().isOwned('18', 209)).toBe(false);
    });
  });

  it('envoie une proposition au nom de l’utilisateur connecté', async () => {
    useAuthStore.setState({ user: { id: 'alice' } as any });
    insert.mockResolvedValue({ error: null });
    const ok = await useOffersStore.getState().propose('bob', [{ editionId: '18', number: 209 }], []);
    expect(ok).toBe(true);
    expect(insert).toHaveBeenCalledWith({ from_user: 'alice', to_user: 'bob', give: [{ editionId: '18', number: 209 }], receive: [] });
  });
});
