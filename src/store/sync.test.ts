import { describe, it, expect, beforeEach, vi } from 'vitest';

// Faux client Supabase : chaque test choisit ce que renvoie upsert().
const { upsert } = vi.hoisted(() => ({ upsert: vi.fn() }));
vi.mock('../lib/supabase', () => ({
  supabase: { from: () => ({ upsert }), rpc: vi.fn() },
}));

import { useCollectionStore, useAuthStore } from './index';

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('synchronisation de la collection (hors ligne)', () => {
  beforeEach(() => {
    upsert.mockReset();
    useAuthStore.setState({ user: { id: 'u1' } as any });
    useCollectionStore.setState({ collection: {}, history: [], future: [], pendingSync: {} });
  });

  it("n'ajoute rien à la file quand l'envoi réussit", async () => {
    upsert.mockResolvedValue({ error: null });
    useCollectionStore.getState().setOwned('70', 1, true);
    await flush();
    expect(useCollectionStore.getState().pendingSync).toEqual({});
  });

  it('met la modification en attente si Supabase renvoie une erreur', async () => {
    upsert.mockResolvedValue({ error: { message: 'boom' } });
    useCollectionStore.getState().setOwned('70', 1, true);
    await flush();
    expect(useCollectionStore.getState().pendingSync['70-1']).toEqual({ editionId: '70', number: 1, owned: true, duplicates: 0 });
  });

  it('met la modification en attente si le réseau est coupé', async () => {
    upsert.mockRejectedValue(new TypeError('Failed to fetch'));
    useCollectionStore.getState().setOwned('70', 1, true);
    await flush();
    expect(useCollectionStore.getState().pendingSync['70-1']).toBeDefined();
  });

  it('retire de la file une modification qui finit par passer', async () => {
    upsert.mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValue({ error: null });
    useCollectionStore.getState().setOwned('70', 1, true);
    await flush();
    useCollectionStore.getState().setOwned('70', 1, false);
    await flush();
    expect(useCollectionStore.getState().pendingSync).toEqual({});
  });

  it('retrySync renvoie la file et ne garde que les échecs', async () => {
    useCollectionStore.setState({
      pendingSync: {
        '70-1': { editionId: '70', number: 1, owned: true, duplicates: 0 },
        '70-2': { editionId: '70', number: 2, owned: true, duplicates: 1 },
      },
    });
    upsert.mockResolvedValueOnce({ error: null }).mockResolvedValueOnce({ error: { message: 'boom' } });
    await useCollectionStore.getState().retrySync();
    expect(Object.keys(useCollectionStore.getState().pendingSync)).toEqual(['70-2']);
  });

  it("n'envoie rien quand personne n'est connecté", async () => {
    useAuthStore.setState({ user: null });
    useCollectionStore.getState().setOwned('70', 1, true);
    await flush();
    expect(upsert).not.toHaveBeenCalled();
  });
});
