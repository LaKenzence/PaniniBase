import { describe, it, expect, beforeAll } from 'vitest';
import { STICKERS_BY_EDITION, loadAllEditions } from './stickers';
import { SQUAD_SIZES } from './squads';
import { CHECKLIST_SIZES } from './checklists';
import { TEAMS } from './teams';

// Effectifs bruts, album par album (les mêmes fichiers que ceux chargés par l'appli)
const SQUADS = Object.fromEntries(Object.entries(import.meta.glob<Record<string, string>>('./squads/*.ts', { eager: true, import: 'default' }))
  .map(([file, squads]) => [file.match(/(\d\d)\.ts$/)![1], squads] as const)
  // Les albums avec checklist Panini (2002–2022) n'ont qu'une partie de l'effectif : voir checklists.test.ts
  .filter(([ed]) => !CHECKLIST_SIZES[ed]));

beforeAll(() => loadAllEditions());

const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\bjr\b\.?/g, 'junior');
const last = (s: string) => norm(s).split(/\s+/).pop()!;

// Pour chaque album 1970–2022 et chaque équipe : les joueurs de l'album et de l'effectif officiel
const allTeams = () => Object.entries(SQUADS).flatMap(([ed, byTeam]) =>
  Object.entries(byTeam).map(([code, str]) => ({
    ed, code,
    squad: str.split(';').map((p) => p.split('|')[2]),
    album: (STICKERS_BY_EDITION[ed] ?? []).filter((s) => s.teamName === TEAMS[code].name && s.category !== 'badge').map((s) => s.player?.name ?? ''),
  })),
);

describe('effectifs dans les albums 1970–2022', () => {
  let teams: ReturnType<typeof allTeams> = [];
  beforeAll(() => { teams = allTeams(); });

  it('chaque album chargé a la taille annoncée au démarrage', () => {
    for (const [ed, size] of Object.entries(SQUAD_SIZES)) if (!CHECKLIST_SIZES[ed]) expect(STICKERS_BY_EDITION[ed].length, `album ${ed}`).toBe(size);
  });

  it('chaque joueur de l\'effectif officiel a son sticker', () => {
    const missing = teams.flatMap(({ ed, code, squad, album }) =>
      squad.filter((p) => !album.some((a) => norm(a).includes(last(p).slice(0, 5)))).map((p) => `${ed} ${code} ${p}`));
    expect(missing).toEqual([]);
  });

  it("aucun joueur hors de l'effectif officiel (sélectionneur, blessé, non retenu…)", () => {
    const intruders = teams.flatMap(({ ed, code, squad, album }) =>
      album.filter((a) => !squad.some((p) => norm(p).includes(last(a).slice(0, 5)) || norm(a).includes(last(p).slice(0, 5)))).map((a) => `${ed} ${code} ${a}`));
    expect(intruders).toEqual([]);
  });

  it('pas de joueur en double (sauf vrais homonymes de l\'effectif)', () => {
    const dups = teams.flatMap(({ ed, code, squad, album }) => {
      const count = (list: string[], n: string) => list.filter((x) => norm(x) === norm(n)).length;
      return [...new Set(album)].filter((a) => count(album, a) > Math.max(1, count(squad, a))).map((a) => `${ed} ${code} ${a}`);
    });
    expect(dups).toEqual([]);
  });

  it('autant de joueurs que dans l\'effectif officiel', () => {
    const off = teams.filter(({ squad, album }) => squad.length !== album.length).map(({ ed, code, squad, album }) => `${ed} ${code} ${album.length}/${squad.length}`);
    expect(off).toEqual([]);
  });
});
