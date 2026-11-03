import { describe, it, expect, beforeEach } from 'vitest';
import { useCollectionStore, sanitizeCollection } from './index';

// Comme collectionStore.test.ts : pas d'utilisateur connecté, donc aucun appel Supabase.

describe('import de collection', () => {
  beforeEach(() => {
    useCollectionStore.setState({ collection: {}, history: [], future: [], pendingSync: {} });
  });

  it('écarte les entrées mal formées et ré-indexe les clés', () => {
    const clean = sanitizeCollection({
      'mauvaise-cle': { stickerEditionId: '26', stickerNumber: 'MEX1', owned: true, duplicates: 2 },
      x: { stickerEditionId: '26', owned: true },          // pas de numéro
      y: 'pas un objet',
      z: { stickerEditionId: '70', stickerNumber: 5, owned: false, duplicates: 4 }, // doublons sans le posséder
    });
    expect(clean).toEqual({
      '26-MEX1': { stickerEditionId: '26', stickerNumber: 'MEX1', owned: true, duplicates: 2 },
      '70-5': { stickerEditionId: '70', stickerNumber: 5, owned: false, duplicates: 0 },
    });
  });

  it('refuse un JSON qui n\'est pas une collection', () => {
    const { importCollection } = useCollectionStore.getState();
    expect(importCollection('[1,2,3]')).toBe(false);
    expect(importCollection('{pas du json')).toBe(false);
    expect(importCollection('{"26-1":{"stickerEditionId":"26","stickerNumber":1,"owned":true,"duplicates":0}}')).toBe(true);
    expect(useCollectionStore.getState().isOwned('26', 1)).toBe(true);
  });
});

describe('applyTrade', () => {
  beforeEach(() => {
    useCollectionStore.setState({ collection: {}, history: [], future: [], pendingSync: {} });
  });

  it('retire un doublon par sticker donné et ajoute les stickers reçus', () => {
    const s = useCollectionStore.getState();
    s.setOwned('26', 'MEX1', true);
    s.setDuplicates('26', 'MEX1', 2);
    s.setOwned('26', 'BRA3', true);

    const n = useCollectionStore.getState().applyTrade(
      [{ editionId: '26', number: 'MEX1' }],
      [{ editionId: '26', number: 'FRA7' }, { editionId: '26', number: 'BRA3' }],
    );
    const after = useCollectionStore.getState();
    expect(n).toBe(3);
    expect(after.getDuplicates('26', 'MEX1')).toBe(1);
    expect(after.isOwned('26', 'FRA7')).toBe(true);
    expect(after.getDuplicates('26', 'BRA3')).toBe(1); // déjà possédé → devient un doublon
  });

  it('ne donne jamais un sticker sans doublon', () => {
    const s = useCollectionStore.getState();
    s.setOwned('26', 'MEX1', true);
    const n = useCollectionStore.getState().applyTrade([{ editionId: '26', number: 'MEX1' }], []);
    expect(n).toBe(0);
    expect(useCollectionStore.getState().isOwned('26', 'MEX1')).toBe(true);
  });

  it('peut être annulé', () => {
    const s = useCollectionStore.getState();
    s.applyTrade([], [{ editionId: '26', number: 'FRA7' }]);
    useCollectionStore.getState().undo();
    expect(useCollectionStore.getState().isOwned('26', 'FRA7')).toBe(false);
  });
});
