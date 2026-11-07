import { describe, it, expect, beforeEach } from 'vitest';
import { useCollectionStore } from './index';

// Note : useAuthStore.user reste `null` par défaut dans cet environnement de
// test (on n'appelle jamais init()), donc pushToSupabase() s'arrête avant
// toute requête réseau réelle vers Supabase. Ces tests sont 100% locaux.

describe('useCollectionStore', () => {
  beforeEach(() => {
    useCollectionStore.setState({ collection: {}, history: [], future: [], pendingSync: {} });
  });

  it('marque un sticker comme possédé', () => {
    useCollectionStore.getState().setOwned('26', 'MEX1', true);
    expect(useCollectionStore.getState().isOwned('26', 'MEX1')).toBe(true);
  });

  it('retirer un sticker possédé remet les doublons à 0', () => {
    const { setOwned, setDuplicates, getDuplicates } = useCollectionStore.getState();
    setOwned('26', 'MEX1', true);
    setDuplicates('26', 'MEX1', 2);
    expect(getDuplicates('26', 'MEX1')).toBe(2);

    setOwned('26', 'MEX1', false);
    expect(getDuplicates('26', 'MEX1')).toBe(0);
  });

  it('les doublons ne peuvent pas descendre sous 0', () => {
    const { setOwned, setDuplicates, getDuplicates } = useCollectionStore.getState();
    setOwned('26', 'MEX1', true);
    setDuplicates('26', 'MEX1', -5);
    expect(getDuplicates('26', 'MEX1')).toBe(0);
  });

  it('setDuplicates est ignoré si le sticker n\'est pas possédé', () => {
    const { setDuplicates, getDuplicates } = useCollectionStore.getState();
    setDuplicates('26', 'MEX1', 3);
    expect(getDuplicates('26', 'MEX1')).toBe(0);
  });

  it('undo annule la dernière action', () => {
    const { setOwned, undo, isOwned } = useCollectionStore.getState();
    setOwned('26', 'MEX1', true);
    expect(isOwned('26', 'MEX1')).toBe(true);

    undo();
    expect(useCollectionStore.getState().isOwned('26', 'MEX1')).toBe(false);
  });

  it('redo rétablit une action annulée', () => {
    const { setOwned, undo, redo } = useCollectionStore.getState();
    setOwned('26', 'MEX1', true);
    undo();
    expect(useCollectionStore.getState().isOwned('26', 'MEX1')).toBe(false);

    redo();
    expect(useCollectionStore.getState().isOwned('26', 'MEX1')).toBe(true);
  });

  it('une nouvelle action après un undo efface le futur (redo impossible)', () => {
    const { setOwned, undo, canRedo } = useCollectionStore.getState();
    setOwned('26', 'MEX1', true);
    undo();
    expect(useCollectionStore.getState().canRedo()).toBe(true);

    setOwned('26', 'MEX2', true);
    expect(useCollectionStore.getState().canRedo()).toBe(false);
  });

  it('deux stickers de codes différents ("MEX1" et "FRA1") restent bien distincts', () => {
    // Régression directe : si la clé interne ne distinguait pas correctement
    // les éditions/codes, cocher MEX1 aurait pu affecter FRA1 par erreur.
    const { setOwned, isOwned } = useCollectionStore.getState();
    setOwned('26', 'MEX1', true);
    setOwned('26', 'FRA1', false);
    expect(isOwned('26', 'MEX1')).toBe(true);
    expect(isOwned('26', 'FRA1')).toBe(false);
  });

  it('exportCollection puis importCollection restaure le même état', () => {
    const { setOwned, setDuplicates, exportCollection, importCollection, isOwned, getDuplicates } = useCollectionStore.getState();
    setOwned('26', 'MEX1', true);
    setDuplicates('26', 'MEX1', 3);

    const json = exportCollection();
    useCollectionStore.setState({ collection: {} });
    expect(useCollectionStore.getState().isOwned('26', 'MEX1')).toBe(false);

    const ok = importCollection(json);
    expect(ok).toBe(true);
    expect(useCollectionStore.getState().isOwned('26', 'MEX1')).toBe(true);
    expect(useCollectionStore.getState().getDuplicates('26', 'MEX1')).toBe(3);
  });

  it('importCollection renvoie false sur un JSON invalide', () => {
    const ok = useCollectionStore.getState().importCollection('{ ceci n\'est pas du JSON');
    expect(ok).toBe(false);
  });
});
