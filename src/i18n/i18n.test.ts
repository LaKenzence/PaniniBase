import { describe, it, expect } from 'vitest';
import { en } from './en';
import { es } from './es';
import { translate, albumName } from './index';
import { EDITIONS, STICKERS_BY_EDITION, PLAYERS, loadAllEditions } from '../data/stickers';
import { TEAMS_EN, TEAMS_ES } from './teams';

// Toutes les sources de l'appli, en texte brut (hors données et tests)
const sources = import.meta.glob(['../**/*.{ts,tsx}', '!../data/**', '!../**/*.test.*', '!./**'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const usedKeys = () => {
  const keys = new Set<string>();
  for (const src of Object.values(sources)) {
    for (const m of src.matchAll(/\b(?:t|tr)\(\s*(['"])((?:\\.|(?!\1).)*)\1/g)) keys.add(m[2].replace(/\\(['"])/g, '$1'));
  }
  // Textes passés à t() via une variable : raccourcis, visite guidée, postes
  const shortcuts = sources['../components/ShortcutsHelp.tsx'];
  for (const m of shortcuts.matchAll(/desc: (['"])((?:(?!\1).)*)\1/g)) keys.add(m[2]);
  keys.add('Espace');
  const tour = sources['../components/OnboardingTour.tsx'];
  for (const m of tour.matchAll(/(?:title|desc): (['"])((?:(?!\1).)*)\1/g)) keys.add(m[2]);
  ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'].forEach((k) => keys.add(k));
  keys.add('Écusson {team}'); // stickerName(), dans i18n/index.ts
  // Noms d'albums (albumName) et pays hôtes
  for (const ed of EDITIONS) {
    keys.add(ed.hostCountry);
    keys.add(ed.label.replace(/ \d{4}$/, ''));
  }
  return keys;
};

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');

describe('traductions', () => {
  const keys = usedKeys();

  it.each([['en', en], ['es', es]] as const)('%s : chaque texte de l’appli est traduit', (_, dict) => {
    const missing = [...keys].filter((k) => !(k in dict));
    expect(missing).toEqual([]);
  });

  it.each([['en', en], ['es', es]] as const)('%s : pas de traduction orpheline', (_, dict) => {
    const orphans = Object.keys(dict).filter((k) => !keys.has(k));
    expect(orphans).toEqual([]);
  });

  it.each([['en', en], ['es', es]] as const)('%s : mêmes variables et mêmes formes plurielles que le français', (_, dict) => {
    const bad = Object.entries(dict).filter(([fr, tr]) => placeholders(fr) !== placeholders(tr) || fr.includes('|') !== tr.includes('|'));
    expect(bad).toEqual([]);
  });

  it('chaque équipe et nationalité des données est traduite', async () => {
    await loadAllEditions();
    const teams = new Set<string>();
    for (const ed of EDITIONS) for (const s of STICKERS_BY_EDITION[ed.id] ?? []) {
      if (s.teamName) teams.add(s.teamName);
      if (s.player?.nationality) teams.add(s.player.nationality);
    }
    for (const p of Object.values(PLAYERS)) teams.add(p.nationality);
    expect([...teams].filter((x) => !(x in TEAMS_EN))).toEqual([]);
    expect([...teams].filter((x) => !(x in TEAMS_ES))).toEqual([]);
  }, 60_000);

  it('choisit le pluriel selon la langue', () => {
    const k = '{n} doublon|{n} doublons';
    expect(translate('fr', k, { n: 0 })).toBe('0 doublon');
    expect(translate('fr', k, { n: 2 })).toBe('2 doublons');
    expect(translate('en', k, { n: 0 })).toBe('0 duplicates');
    expect(translate('en', k, { n: 1 })).toBe('1 duplicate');
  });

  it('traduit le pays d’un nom d’album et garde l’année', () => {
    expect(albumName('Mexique 1970', (s) => translate('en', s))).toBe('Mexico 1970');
    expect(albumName('USA/Canada/Mexique 2026', (s) => translate('es', s))).toBe('EE. UU./Canadá/México 2026');
  });

  it('retombe sur le français pour un texte inconnu', () => {
    expect(translate('en', 'Texte absent du dictionnaire')).toBe('Texte absent du dictionnaire');
  });
});
