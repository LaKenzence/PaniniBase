import { describe, it, expect, beforeAll } from 'vitest';
import { STICKERS_BY_EDITION, EDITIONS, PLAYERS, loadAllEditions } from './stickers';
import { CHECKLIST_SIZES } from './checklists';
import { useCollectionStore } from '../store/index';

describe('albums 2002–2022 : checklists officielles Panini', () => {
  beforeAll(() => loadAllEditions());

  const norm = (s = '') => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const find = (ed: string, name: string) => (STICKERS_BY_EDITION[ed] ?? []).find((s) => norm(s.player?.name) === norm(name));

  it('chaque album a exactement la taille de sa checklist', () => {
    for (const [ed, size] of Object.entries(CHECKLIST_SIZES)) {
      expect(STICKERS_BY_EDITION[ed].length, `album ${ed}`).toBe(size);
      expect(EDITIONS.find((e) => e.id === ed)!.totalStickers, `total ${ed}`).toBe(size);
    }
  });

  it('numéros uniques et dans l’ordre de l’album', () => {
    for (const ed of Object.keys(CHECKLIST_SIZES)) {
      const nums = STICKERS_BY_EDITION[ed].map((s) => s.number);
      expect(new Set(nums).size, `album ${ed}`).toBe(nums.length);
      expect(nums, `album ${ed}`).toEqual([...nums].sort((a, b) => a - b));
    }
  });

  it('vrais numéros Panini', () => {
    expect(find('18', 'Kylian Mbappé')?.number).toBe(209);
    expect(find('06', 'Zinedine Zidane')?.number).toBe(467);
    expect(find('22', 'Kylian Mbappé')?.code).toBe('FRA 19');
  });

  it('les joueurs gardent poste et fiche joueur', () => {
    for (const ed of Object.keys(CHECKLIST_SIZES)) {
      const players = STICKERS_BY_EDITION[ed].filter((s) => s.category === 'player');
      const withPos = players.filter((s) => s.player?.position).length;
      expect(withPos / players.length, `album ${ed} : postes retrouvés`).toBeGreaterThan(0.65); // le reste : joueurs imprimés mais pas retenus, équipes éliminées en qualifications (1974, 1978)
    }
    expect(find('18', 'Kylian Mbappé')?.player?.playerKey).toBe('mbappe');
  });

  it('relie un joueur d’une Coupe du Monde à l’autre, même écrit autrement', () => {
    const keyOf = (ed: string, re: RegExp) => STICKERS_BY_EDITION[ed].find((s) => re.test(s.player?.name ?? ''))?.player?.playerKey;
    // « Lionel Andres Messi » (2006) = « Lionel Messi »
    const messi = new Set(['06', '10', '14', '18', '22'].map((ed) => keyOf(ed, /^Lionel (Andres )?Messi$/)));
    expect(messi.size).toBe(1);
    expect(PLAYERS[[...messi][0]!].editionIds).toEqual(expect.arrayContaining(['06', '10', '14', '18', '22']));
    // « Heung-min Son » = « Heungmin Son » = « Son Heung-Min »
    expect(new Set(['14', '18', '22', '26'].map((ed) => keyOf(ed, /Heung-?min/i))).size).toBe(1);
  });

  it('ne confond pas deux homonymes de prénoms différents', () => {
    const kims = STICKERS_BY_EDITION['26'].filter((s) => s.teamName === 'Corée du Sud' && /Kim$/.test(s.player?.name ?? ''));
    expect(new Set(kims.map((s) => s.player?.playerKey)).size).toBe(kims.length);
  });
});

describe('conversion des collections cochées avec les anciens numéros', () => {
  it('déplace chaque sticker coché vers son numéro officiel', () => {
    const { renumberEdition } = useCollectionStore.getState();
    useCollectionStore.setState({
      collection: {
        '18-10': { stickerEditionId: '18', stickerNumber: 10, owned: true, duplicates: 1 },
        '18-999': { stickerEditionId: '18', stickerNumber: 999, owned: true, duplicates: 0 },
        '70-21': { stickerEditionId: '70', stickerNumber: 21, owned: true, duplicates: 0 },
      },
      pendingRenumber: ['18'],
    });
    renumberEdition('18', new Map([[10, 209]]));
    const { collection, pendingRenumber } = useCollectionStore.getState();
    expect(collection).toEqual({
      '18-209': { stickerEditionId: '18', stickerNumber: 209, owned: true, duplicates: 1 },
      '70-21': { stickerEditionId: '70', stickerNumber: 21, owned: true, duplicates: 0 },
    });
    expect(pendingRenumber).toEqual([]);
  });

  it('ne touche à rien sur une collection déjà aux nouveaux numéros', () => {
    useCollectionStore.setState({ collection: { '18-10': { stickerEditionId: '18', stickerNumber: 10, owned: true, duplicates: 0 } }, pendingRenumber: [] });
    useCollectionStore.getState().renumberEdition('18', new Map([[10, 209]]));
    expect(Object.keys(useCollectionStore.getState().collection)).toEqual(['18-10']);
  });
});
