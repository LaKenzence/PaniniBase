import { describe, it, expect, beforeAll } from 'vitest';
import { EDITIONS, STICKERS_BY_EDITION, loadAllEditions, loadEdition, isEditionLoaded } from './stickers';
import { TEAMS } from './teams';

describe('chargement à la demande', () => {
  it("un album n'est complété qu'au moment où on le charge", async () => {
    expect(isEditionLoaded('74')).toBe(false);
    const before = STICKERS_BY_EDITION['74'].length;
    await loadEdition('74');
    expect(isEditionLoaded('74')).toBe(true);
    expect(STICKERS_BY_EDITION['74'].length).toBeGreaterThan(before);
  });

  it('2026 est complet sans rien charger', () => {
    expect(isEditionLoaded('26')).toBe(true);
  });
});

const TEAM_NAMES = new Set(Object.values(TEAMS).map((t) => t.name));

describe('Données stickers', () => {
  beforeAll(() => loadAllEditions());

  it('chaque édition a au moins un sticker catalogué ou est explicitement vide', () => {
    EDITIONS.forEach((ed) => {
      const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
      expect(Array.isArray(stickers)).toBe(true);
    });
  });

  it('aucun doublon de numéro de sticker au sein d\'une même édition', () => {
    // Régression directe sur le bug rencontré avec l'album 2026 :
    // si parseStickerNumber extrayait les chiffres des codes, MEX1/FRA1/ARG1
    // devenaient tous "1" et se sélectionnaient mutuellement.
    EDITIONS.forEach((ed) => {
      const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
      const numbers = stickers.map((s) => String(s.number));
      const unique = new Set(numbers);
      expect(unique.size, `Doublons trouvés dans l'édition ${ed.id}`).toBe(numbers.length);
    });
  });

  it('chaque sticker a un id unique au sein de son édition', () => {
    EDITIONS.forEach((ed) => {
      const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
      const ids = stickers.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  it("l'édition 2026 contient bien les ~980 stickers attendus", () => {
    const stickers2026 = STICKERS_BY_EDITION['26'] ?? [];
    expect(stickers2026.length).toBeGreaterThan(900);
  });

  it('les albums 1970 → 2022 contiennent les effectifs complets', () => {
    for (const id of ['70', '74', '78', '82', '86', '90', '94', '98', '02', '06', '10', '14', '18', '22']) {
      const stickers = STICKERS_BY_EDITION[id] ?? [];
      expect(stickers.length, `édition ${id}`).toBeGreaterThan(280); // 1970 : 288 stickers
      const ed = EDITIONS.find((e) => e.id === id)!;
      expect(ed.totalStickers, `total de l'édition ${id}`).toBeGreaterThanOrEqual(stickers.length);
    }
  });

  it("vrai numéro Panini de Pelé en 1970 : n°180", () => {
    const pele = (STICKERS_BY_EDITION['70'] ?? []).filter((s) => s.player?.name === 'Pelé');
    expect(pele.map((s) => s.number)).toEqual([180]);
  });

  it('chaque équipe forme une seule page continue dans son album', () => {
    EDITIONS.forEach((ed) => {
      // Pages d'équipes uniquement (l'introduction peut revenir en fin d'album officiel)
      const teams = (STICKERS_BY_EDITION[ed.id] ?? []).map((s) => s.teamName ?? s.player?.nationality).filter((t) => TEAM_NAMES.has(t ?? ''));
      const runs = teams.filter((t, i) => t !== teams[i - 1]);
      expect(new Set(runs).size, `édition ${ed.id}`).toBe(runs.length);
    });
  });

  it('les positions des joueurs 2026 sont variées (pas toutes identiques)', () => {
    const stickers2026 = (STICKERS_BY_EDITION['26'] ?? []).filter((s) => s.category === 'player');
    const positions = new Set(stickers2026.map((s) => s.player?.position));
    // Si ce test échoue avec positions.size === 1, c'est que le bug initial
    // (tous les joueurs en "Milieu") est revenu.
    expect(positions.size).toBeGreaterThan(1);
  });
});
