import type { Edition, Sticker, Player, StickerCategory } from '../types';
import { SQUAD_SIZES } from './squads';
import { CHECKLIST_SIZES } from './checklists';
import { TEAMS, TEAM_GRADIENTS } from './teams';
import { PHOTOS, type PlayerPhoto } from './photos';

// ─── Gradient palette ────────────────────────────────────────────────────────

export const BG: Record<string, string> = {
  fr: 'linear-gradient(160deg,#002395 0%,#002395 50%,#ED2939 100%)',
  br: 'linear-gradient(160deg,#009c3b 0%,#009c3b 50%,#FFDF00 100%)',
  de: 'linear-gradient(160deg,#222 0%,#C00 50%,#FFCE00 100%)',
  ar: 'linear-gradient(160deg,#74ACDF 0%,#fff 50%,#74ACDF 100%)',
  it: 'linear-gradient(160deg,#009246 0%,#fff 50%,#CE2B37 100%)',
  nl: 'linear-gradient(160deg,#AE1C28 0%,#fff 50%,#21468B 100%)',
  es: 'linear-gradient(160deg,#c60b1e 0%,#ffc400 50%,#c60b1e 100%)',
  cr: 'linear-gradient(160deg,#D21034 0%,#fff 50%,#0E3A8C 100%)',
  pt: 'linear-gradient(160deg,#006600 0%,#C00 50%,#003399 100%)',
  en: 'linear-gradient(160deg,#C8102E 0%,#fff 50%,#012169 100%)',
  jp: 'linear-gradient(160deg,#BC002D 0%,#fff 50%,#003087 100%)',
  za: 'linear-gradient(160deg,#007A4D 0%,#FFB612 50%,#DE3831 100%)',
  ru: 'linear-gradient(160deg,#fff 0%,#0039A6 50%,#D52B1E 100%)',
  qa: 'linear-gradient(160deg,#8D1B3D 0%,#fff 50%,#8D1B3D 100%)',
  us: 'linear-gradient(160deg,#002868 0%,#fff 50%,#BF0A30 100%)',
  be: 'linear-gradient(160deg,#000 0%,#FAE042 50%,#EF3340 100%)',
  mx: 'linear-gradient(160deg,#006847 0%,#fff 50%,#CE1126 100%)',
  ma: 'linear-gradient(160deg,#C1272D 0%,#006233 50%,#C1272D 100%)',
  sn: 'linear-gradient(160deg,#00853F 0%,#FDEF42 50%,#E31B23 100%)',
  gh: 'linear-gradient(160deg,#006B3F 0%,#FCD116 50%,#CE1126 100%)',
  cm: 'linear-gradient(160deg,#007A5E 0%,#CE1126 50%,#FCD116 100%)',
  ng: 'linear-gradient(160deg,#008751 0%,#fff 50%,#008751 100%)',
  au: 'linear-gradient(160deg,#00008B 0%,#fff 50%,#FF0000 100%)',
  kr: 'linear-gradient(160deg,#003478 0%,#fff 50%,#CD2E3A 100%)',
  ir: 'linear-gradient(160deg,#239f40 0%,#fff 50%,#DA0000 100%)',
  ec: 'linear-gradient(160deg,#FFD100 0%,#003580 50%,#E30613 100%)',
  pl: 'linear-gradient(160deg,#fff 0%,#DC143C 50%,#fff 100%)',
  ch: 'linear-gradient(160deg,#DA0001 0%,#fff 50%,#DA0001 100%)',
  dk: 'linear-gradient(160deg,#C60C30 0%,#fff 50%,#C60C30 100%)',
  uy: 'linear-gradient(160deg,#5EB6E4 0%,#fff 50%,#5EB6E4 100%)',
  mx2: 'linear-gradient(160deg,#006847 0%,#fff 50%,#CE1126 100%)',
  ca: 'linear-gradient(160deg,#FF0000 0%,#fff 50%,#FF0000 100%)',
  tr: 'linear-gradient(160deg,#E30A17 0%,#fff 50%,#E30A17 100%)',
  ro: 'linear-gradient(160deg,#002B7F 0%,#FCD116 50%,#CE1126 100%)',
  ye: 'linear-gradient(160deg,#CE1126 0%,#fff 50%,#007A3D 100%)',
  bul: 'linear-gradient(160deg,#FFFFFF 0%,#009B74 50%,#D62612 100%)',
  cs: 'linear-gradient(160deg,#D7141A 0%,#fff 50%,#11457E 100%)',
};

// ─── Editions ────────────────────────────────────────────────────────────────

export const EDITIONS: Edition[] = [
  { id: '70', year: 1970, label: 'Mexique 1970',             hostCountry: 'Mexique',           hostFlag: '🇲🇽', totalStickers: 271, bgGradient: BG.mx,  colKey: 'mx'  },
  { id: '74', year: 1974, label: 'Allemagne 1974',           hostCountry: 'Allemagne',          hostFlag: '🇩🇪', totalStickers: 388, bgGradient: BG.de,  colKey: 'de'  },
  { id: '78', year: 1978, label: 'Argentine 1978',           hostCountry: 'Argentine',          hostFlag: '🇦🇷', totalStickers: 396, bgGradient: BG.ar,  colKey: 'ar'  },
  { id: '82', year: 1982, label: 'Espagne 1982',             hostCountry: 'Espagne',            hostFlag: '🇪🇸', totalStickers: 438, bgGradient: BG.es,  colKey: 'es'  },
  { id: '86', year: 1986, label: 'Mexique 1986',             hostCountry: 'Mexique',            hostFlag: '🇲🇽', totalStickers: 427, bgGradient: BG.mx,  colKey: 'mx'  },
  { id: '90', year: 1990, label: 'Italie 1990',              hostCountry: 'Italie',             hostFlag: '🇮🇹', totalStickers: 455, bgGradient: BG.it,  colKey: 'it'  },
  { id: '94', year: 1994, label: 'États-Unis 1994',          hostCountry: 'États-Unis',         hostFlag: '🇺🇸', totalStickers: 476, bgGradient: BG.us,  colKey: 'us'  },
  { id: '98', year: 1998, label: 'France 1998',              hostCountry: 'France',             hostFlag: '🇫🇷', totalStickers: 400, bgGradient: BG.fr,  colKey: 'fr'  },
  { id: '02', year: 2002, label: 'Corée-Japon 2002',         hostCountry: 'Corée/Japon',        hostFlag: '🇯🇵', totalStickers: 384, bgGradient: BG.jp,  colKey: 'jp'  },
  { id: '06', year: 2006, label: 'Allemagne 2006',           hostCountry: 'Allemagne',          hostFlag: '🇩🇪', totalStickers: 598, bgGradient: BG.de,  colKey: 'de'  },
  { id: '10', year: 2010, label: 'Afrique du Sud 2010',      hostCountry: 'Afrique du Sud',     hostFlag: '🇿🇦', totalStickers: 638, bgGradient: BG.za,  colKey: 'za'  },
  { id: '14', year: 2014, label: 'Brésil 2014',              hostCountry: 'Brésil',             hostFlag: '🇧🇷', totalStickers: 640, bgGradient: BG.br,  colKey: 'br'  },
  { id: '18', year: 2018, label: 'Russie 2018',              hostCountry: 'Russie',             hostFlag: '🇷🇺', totalStickers: 682, bgGradient: BG.ru,  colKey: 'ru'  },
  { id: '22', year: 2022, label: 'Qatar 2022',               hostCountry: 'Qatar',              hostFlag: '🇶🇦', totalStickers: 670, bgGradient: BG.qa,  colKey: 'qa'  },
  { id: '26', year: 2026, label: 'USA/Canada/Mexique 2026',  hostCountry: 'USA/Canada/Mexique', hostFlag: '🌎',  totalStickers: 1034, bgGradient: BG.us,  colKey: 'us'  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extrait uniquement les chiffres d'un suffixe ou identifiant.
 * Exemple : "MEX14" ou "MEX14s" renvoie le nombre 14.
 * Si aucun chiffre n'est trouvé (ex: "FWC"), renvoie 0.
 */
const parseStickerNumber = (n: string | number): number => {
  if (typeof n === 'number') return n;
  const match = n.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

// Numéro = position dans l'album ; le code imprimé (« MEX 14 ») est gardé dans `code`
const withSequentialNumbers = (stickers: Sticker[]): Sticker[] =>
  stickers.map((s, i) => ({ ...s, number: i + 1, code: prettyCode(s.id.slice(s.id.indexOf('-') + 1)) }));

/** « MEX14 » → « MEX 14 » ; « 00 » reste « 00 ». */
const prettyCode = (raw: string) => raw.replace(/^([A-Z]+)(\d+)$/, '$1 $2');

const mkPlayer = (
  editionId: string, 
  n: string | number, 
  name: string, 
  team: string,
  flag: string, 
  colKey: string, 
  pos: 'Gardien' | 'Défenseur' | 'Milieu' | 'Attaquant',
  jersey: number, 
  club: string, 
  playerKey?: string, 
  isShiny = false, 
  imageUrl?: string
): Sticker => ({
  id: `${editionId}-${n}`,
  editionId,
  number: parseStickerNumber(n),
  category: isShiny ? 'shiny' : 'player',
  isShiny,
  imageUrl,
  player: { name, nationality: team, flag, position: pos, jerseyNumber: jersey, club, colKey, playerKey: playerKey ?? slugifyName(name) },
  teamName: team,
});

const mkBadge = (editionId: string, n: string | number, teamName: string, flag: string, colKey: string): Sticker => ({
  id: `${editionId}-${n}`,
  editionId,
  number: parseStickerNumber(n),
  category: 'badge',
  isShiny: false,
  teamName,
  player: { name: `Écusson ${teamName}`, nationality: teamName, flag, colKey },
});

const mkSpecial = (
  editionId: string, 
  idSuffix: string | number, 
  name: string, 
  category: StickerCategory, 
  teamName: string, 
  flag: string, 
  colKey: string,
  imageUrl?: string
): Sticker => ({
  id: `${editionId}-${idSuffix}`,
  editionId,
  number: parseStickerNumber(idSuffix),
  category,
  isShiny: category === 'shiny',
  imageUrl,
  teamName,
  player: { name, nationality: teamName, flag, colKey },
});

const slugifyName = (name: string): string =>
  name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // enlève les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
// ─── Stickers data ───────────────────────────────────────────────────────────

export const STICKERS_BY_EDITION: Record<string, Sticker[]> = {

  // ── 1970 Mexique ──────────────────────────────────────────────────────────
  '70': [
    mkBadge('70', 1, 'Mexique', '🇲🇽', 'mx'),
    mkPlayer('70', 2,  'Ignacio Calderón',   'Mexique',  '🇲🇽', 'mx', 'Gardien',   1, 'Cruz Azul'),
    mkPlayer('70', 3,  'Gustavo Peña',       'Mexique',  '🇲🇽', 'mx', 'Milieu',    5, 'Cruz Azul'),
    mkPlayer('70', 4,  'Javier Valdivia',    'Mexique',  '🇲🇽', 'mx', 'Défenseur', 3, 'Guadalajara'),
    mkBadge('70', 20, 'Brésil', '🇧🇷', 'br'),
    mkPlayer('70', 21, 'Pelé',               'Brésil',   '🇧🇷', 'br', 'Attaquant', 10,'Santos',      'pele', true),
    mkPlayer('70', 22, 'Rivelino',           'Brésil',   '🇧🇷', 'br', 'Milieu',    11,'Corinthians'),
    mkPlayer('70', 23, 'Tostão',             'Brésil',   '🇧🇷', 'br', 'Attaquant', 9, 'Cruzeiro'),
    mkPlayer('70', 24, 'Jairzinho',          'Brésil',   '🇧🇷', 'br', 'Attaquant', 8, 'Botafogo'),
    mkPlayer('70', 25, 'Carlos Alberto',     'Brésil',   '🇧🇷', 'br', 'Défenseur', 6, 'Santos'),
    mkBadge('70', 40, 'Italie', '🇮🇹', 'it'),
    mkPlayer('70', 41, 'Gigi Riva',          'Italie',   '🇮🇹', 'it', 'Attaquant', 11,'Cagliari'),
    mkPlayer('70', 42, 'Sandro Mazzola',     'Italie',   '🇮🇹', 'it', 'Milieu',    10,'Inter'),
    mkPlayer('70', 43, 'Roberto Boninsegna', 'Italie',   '🇮🇹', 'it', 'Attaquant', 9, 'Inter'),
    mkBadge('70', 55, 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('70', 56, 'Gerd Müller',        'Allemagne','🇩🇪', 'de', 'Attaquant', 13,'Bayern M.',   'gerdmuller', true),
    mkPlayer('70', 57, 'Franz Beckenbauer',  'Allemagne','🇩🇪', 'de', 'Défenseur', 5, 'Bayern M.',   'beckenbauer'),
    mkPlayer('70', 58, 'Uwe Seeler',         'Allemagne','🇩🇪', 'de', 'Attaquant', 9, 'Hamburg'),
    mkBadge('70', 70, 'Uruguay', '🇺🇾', 'uy'),
    mkPlayer('70', 71, 'Luis Cubilla',       'Uruguay',  '🇺🇾', 'uy', 'Attaquant', 7, 'Nacional'),
    mkPlayer('70', 72, 'Pedro Rocha',        'Uruguay',  '🇺🇾', 'uy', 'Milieu',    10,'Peñarol'),
    mkBadge('70', 80, 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en'),
    mkPlayer('70', 81, 'Bobby Charlton',     'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Milieu',   9, 'Man Utd'),
    mkPlayer('70', 82, 'Geoff Hurst',        'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Attaquant',10,'West Ham'),
    mkPlayer('70', 83, 'Bobby Moore',        'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Défenseur',6, 'West Ham'),
  ],

  // ── 1974 Allemagne ────────────────────────────────────────────────────────
  '74': [
    mkBadge('74', 1, 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('74', 2,  'Franz Beckenbauer',  'Allemagne','🇩🇪', 'de', 'Défenseur', 5, 'Bayern M.', 'beckenbauer', true),
    mkPlayer('74', 3,  'Gerd Müller',        'Allemagne','🇩🇪', 'de', 'Attaquant', 13,'Bayern M.', 'gerdmuller'),
    mkPlayer('74', 4,  'Sepp Maier',         'Allemagne','🇩🇪', 'de', 'Gardien',   1, 'Bayern M.'),
    mkPlayer('74', 5,  'Paul Breitner',      'Allemagne','🇩🇪', 'de', 'Défenseur', 3, 'Bayern M.'),
    mkPlayer('74', 6,  'Bernd Hölzenbein',   'Allemagne','🇩🇪', 'de', 'Attaquant', 11,'Eintracht'),
    mkBadge('74', 20, 'Pays-Bas', '🇳🇱', 'nl'),
    mkPlayer('74', 21, 'Johan Cruyff',       'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 14,'Barcelone',  'cruyff', true),
    mkPlayer('74', 22, 'Johan Neeskens',     'Pays-Bas', '🇳🇱', 'nl', 'Milieu',    8, 'Ajax'),
    mkPlayer('74', 23, 'Rob Rensenbrink',    'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 11,'Anderlecht'),
    mkBadge('74', 35, 'Brésil', '🇧🇷', 'br'),
    mkPlayer('74', 36, 'Rivelino',           'Brésil',   '🇧🇷', 'br', 'Milieu',    11,'Fluminense'),
    mkPlayer('74', 37, 'Leivinha',           'Brésil',   '🇧🇷', 'br', 'Milieu',    10,'Atletico-MG'),
    mkBadge('74', 50, 'Italie', '🇮🇹', 'it'),
    mkPlayer('74', 51, 'Dino Zoff',          'Italie',   '🇮🇹', 'it', 'Gardien',   1, 'Juventus'),
    mkPlayer('74', 52, 'Romeo Benetti',      'Italie',   '🇮🇹', 'it', 'Milieu',    6, 'Milan'),
    mkBadge('74', 65, 'Pologne', '🇵🇱', 'pl'),
    mkPlayer('74', 66, 'Grzegorz Lato',      'Pologne',  '🇵🇱', 'pl', 'Attaquant', 7, 'Stal Mielec'),
    mkPlayer('74', 67, 'Kazimierz Deyna',    'Pologne',  '🇵🇱', 'pl', 'Milieu',    10,'Legia Varsovie'),
    mkBadge('74', 80, 'Argentine', '🇦🇷', 'ar'),
    mkPlayer('74', 81, 'Mario Kempes',       'Argentine','🇦🇷', 'ar', 'Attaquant', 10,'Valencia'),
    mkPlayer('74', 82, 'René Houseman',      'Argentine','🇦🇷', 'ar', 'Attaquant', 7, 'Huracán'),
  ],

  // ── 1978 Argentine ────────────────────────────────────────────────────────
  '78': [
    mkBadge('78', 1, 'Argentine', '🇦🇷', 'ar'),
    mkPlayer('78', 2,  'Mario Kempes',       'Argentine','🇦🇷', 'ar', 'Attaquant', 10,'Valencia',    'kempes', true),
    mkPlayer('78', 3,  'Daniel Passarella',  'Argentine','🇦🇷', 'ar', 'Défenseur', 6, 'River Plate'),
    mkPlayer('78', 4,  'Osvaldo Ardiles',    'Argentine','🇦🇷', 'ar', 'Milieu',    1, 'Huracán'),
    mkPlayer('78', 5,  'Leopoldo Luque',     'Argentine','🇦🇷', 'ar', 'Attaquant', 9, 'River Plate'),
    mkBadge('78', 20, 'Pays-Bas', '🇳🇱', 'nl'),
    mkPlayer('78', 21, 'Rob Rensenbrink',    'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 11,'Anderlecht', undefined, true),
    mkPlayer('78', 22, 'Johan Neeskens',     'Pays-Bas', '🇳🇱', 'nl', 'Milieu',    8, 'Barcelone'),
    mkPlayer('78', 23, 'Ruud Krol',          'Pays-Bas', '🇳🇱', 'nl', 'Défenseur', 3, 'Ajax'),
    mkBadge('78', 35, 'Brésil', '🇧🇷', 'br'),
    mkPlayer('78', 36, 'Zico',               'Brésil',   '🇧🇷', 'br', 'Milieu',    10,'Flamengo',    'zico', true),
    mkPlayer('78', 37, 'Rivelino',           'Brésil',   '🇧🇷', 'br', 'Milieu',    11,'Fluminense'),
    mkBadge('78', 50, 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('78', 51, 'Karl-Heinz Rummenigge','Allemagne','🇩🇪','de', 'Attaquant', 11,'Bayern M.',  'rummenigge'),
    mkPlayer('78', 52, 'Sepp Maier',         'Allemagne','🇩🇪', 'de', 'Gardien',   1, 'Bayern M.'),
    mkBadge('78', 65, 'Italie', '🇮🇹', 'it'),
    mkPlayer('78', 66, 'Paolo Rossi',        'Italie',   '🇮🇹', 'it', 'Attaquant', 9, 'Vicenza',     'paolorossi'),
    mkPlayer('78', 67, 'Dino Zoff',          'Italie',   '🇮🇹', 'it', 'Gardien',   1, 'Juventus'),
    mkBadge('78', 80, 'Pologne', '🇵🇱', 'pl'),
    mkPlayer('78', 81, 'Grzegorz Lato',      'Pologne',  '🇵🇱', 'pl', 'Attaquant', 7, 'Stal Mielec'),
    mkPlayer('78', 82, 'Zbigniew Boniek',    'Pologne',  '🇵🇱', 'pl', 'Attaquant', 10,'Widzew'),
  ],

  // ── 1982 Espagne ──────────────────────────────────────────────────────────
  '82': [
    mkBadge('82', 1, 'Italie', '🇮🇹', 'it'),
    mkPlayer('82', 2,  'Paolo Rossi',        'Italie',   '🇮🇹', 'it', 'Attaquant', 9, 'Juventus',    'paolorossi', true),
    mkPlayer('82', 3,  'Dino Zoff',          'Italie',   '🇮🇹', 'it', 'Gardien',   1, 'Juventus'),
    mkPlayer('82', 4,  'Marco Tardelli',     'Italie',   '🇮🇹', 'it', 'Milieu',    14,'Juventus'),
    mkPlayer('82', 5,  'Giancarlo Antognoni','Italie',   '🇮🇹', 'it', 'Milieu',    10,'Fiorentina'),
    mkPlayer('82', 6,  'Bruno Conti',        'Italie',   '🇮🇹', 'it', 'Milieu',    7, 'Roma'),
    mkBadge('82', 30, 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('82', 31, 'Karl-Heinz Rummenigge','Allemagne','🇩🇪','de','Attaquant', 11,'Bayern M.', 'rummenigge', true),
    mkPlayer('82', 32, 'Paul Breitner',      'Allemagne','🇩🇪', 'de', 'Milieu',    3, 'Bayern M.'),
    mkPlayer('82', 33, 'Klaus Fischer',      'Allemagne','🇩🇪', 'de', 'Attaquant', 9, 'Schalke'),
    mkBadge('82', 55, 'Brésil', '🇧🇷', 'br'),
    mkPlayer('82', 56, 'Zico',               'Brésil',   '🇧🇷', 'br', 'Milieu',    10,'Flamengo',    'zico', true),
    mkPlayer('82', 57, 'Falcão',             'Brésil',   '🇧🇷', 'br', 'Milieu',    5, 'Roma'),
    mkPlayer('82', 58, 'Sócrates',           'Brésil',   '🇧🇷', 'br', 'Milieu',    8, 'Corinthians'),
    mkPlayer('82', 59, 'Éder',               'Brésil',   '🇧🇷', 'br', 'Attaquant', 9, 'Atlético-MG'),
    mkBadge('82', 80, 'Argentine', '🇦🇷', 'ar'),
    mkPlayer('82', 81, 'Diego Maradona',     'Argentine','🇦🇷', 'ar', 'Milieu',    10,'Barcelone',   'maradona', true),
    mkPlayer('82', 82, 'Daniel Passarella',  'Argentine','🇦🇷', 'ar', 'Défenseur', 6, 'River Plate'),
    mkBadge('82', 100, 'France', '🇫🇷', 'fr'),
    mkPlayer('82', 101, 'Michel Platini',    'France',   '🇫🇷', 'fr', 'Milieu',    10,'Juventus',    'platini', true),
    mkPlayer('82', 102, 'Alain Giresse',     'France',   '🇫🇷', 'fr', 'Milieu',    8, 'Bordeaux'),
    mkPlayer('82', 103, 'Didier Six',        'France',   '🇫🇷', 'fr', 'Attaquant', 11,'Stuttgart'),
    mkBadge('82', 120, 'Espagne', '🇪🇸', 'es'),
    mkPlayer('82', 121, 'Roberto López Ufarte','Espagne','🇪🇸', 'es', 'Milieu',    7, 'Real Sociedad'),
    mkPlayer('82', 122, 'Jesús Zamora',      'Espagne',  '🇪🇸', 'es', 'Défenseur', 4, 'Real Madrid'),
    mkBadge('82', 140, 'Pologne', '🇵🇱', 'pl'),
    mkPlayer('82', 141, 'Zbigniew Boniek',   'Pologne',  '🇵🇱', 'pl', 'Attaquant', 11,'Juventus'),
    mkPlayer('82', 142, 'Grzegorz Lato',     'Pologne',  '🇵🇱', 'pl', 'Attaquant', 7, 'Atlanta'),
  ],

  // ── 1986 Mexique ──────────────────────────────────────────────────────────
  '86': [
    mkBadge('86', 1, 'Argentine', '🇦🇷', 'ar'),
    mkPlayer('86', 2,  'Diego Maradona',     'Argentine','🇦🇷', 'ar', 'Milieu',    10,'Napoli',      'maradona', true),
    mkPlayer('86', 3,  'Jorge Burruchaga',   'Argentine','🇦🇷', 'ar', 'Milieu',    7, 'Nantes'),
    mkPlayer('86', 4,  'Jorge Valdano',      'Argentine','🇦🇷', 'ar', 'Attaquant', 11,'Real Madrid'),
    mkPlayer('86', 5,  'Daniel Passarella',  'Argentine','🇦🇷', 'ar', 'Défenseur', 6, 'Fiorentina'),
    mkBadge('86', 25, 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('86', 26, 'Lothar Matthäus',    'Allemagne','🇩🇪', 'de', 'Milieu',    10,'Bayern M.', 'lothar', true),
    mkPlayer('86', 27, 'Karl-Heinz Rummenigge','Allemagne','🇩🇪','de','Attaquant',11,'Inter',     'rummenigge'),
    mkPlayer('86', 28, 'Rudi Völler',        'Allemagne','🇩🇪', 'de', 'Attaquant', 9, 'Werder'),
    mkBadge('86', 50, 'France', '🇫🇷', 'fr'),
    mkPlayer('86', 51, 'Michel Platini',     'France',   '🇫🇷', 'fr', 'Milieu',    10,'Juventus',   'platini', true),
    mkPlayer('86', 52, 'Jean Tigana',        'France',   '🇫🇷', 'fr', 'Milieu',    6, 'Lyon'),
    mkPlayer('86', 53, 'Alain Giresse',      'France',   '🇫🇷', 'fr', 'Milieu',    8, 'Marseille'),
    mkBadge('86', 70, 'Brésil', '🇧🇷', 'br'),
    mkPlayer('86', 71, 'Zico',               'Brésil',   '🇧🇷', 'br', 'Milieu',    10,'Udinese',    'zico'),
    mkPlayer('86', 72, 'Sócrates',           'Brésil',   '🇧🇷', 'br', 'Milieu',    8, 'Fiorentina'),
    mkPlayer('86', 73, 'Careca',             'Brésil',   '🇧🇷', 'br', 'Attaquant', 9, 'São Paulo'),
    mkBadge('86', 90, 'Mexique', '🇲🇽', 'mx'),
    mkPlayer('86', 91, 'Hugo Sánchez',       'Mexique',  '🇲🇽', 'mx', 'Attaquant', 9, 'Real Madrid'),
    mkBadge('86', 105, 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en'),
    mkPlayer('86', 106, 'Gary Lineker',      'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en','Attaquant', 10,'Everton', 'lineker', true),
    mkPlayer('86', 107, 'Bryan Robson',      'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en','Milieu',    7, 'Man Utd'),
    mkBadge('86', 120, 'Espagne', '🇪🇸', 'es'),
    mkPlayer('86', 121, 'Emilio Butragueño', 'Espagne',  '🇪🇸', 'es', 'Attaquant', 7, 'Real Madrid'),
    mkPlayer('86', 122, 'Míchel',            'Espagne',  '🇪🇸', 'es', 'Milieu',    8, 'Real Madrid'),
    mkBadge('86', 135, 'Uruguay', '🇺🇾', 'uy'),
    mkPlayer('86', 136, 'Enzo Francescoli',  'Uruguay',  '🇺🇾', 'uy', 'Attaquant', 10,'River Plate', 'francescoli'),
  ],

  // ── 1990 Italie ───────────────────────────────────────────────────────────
  '90': [
    mkBadge('90', 1, 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('90', 2,  'Lothar Matthäus',    'Allemagne','🇩🇪', 'de', 'Milieu',    10,'Inter',       'lothar', true),
    mkPlayer('90', 3,  'Rudi Völler',        'Allemagne','🇩🇪', 'de', 'Attaquant', 9, 'Marseille'),
    mkPlayer('90', 4,  'Jürgen Klinsmann',   'Allemagne','🇩🇪', 'de', 'Attaquant', 18,'Inter'),
    mkPlayer('90', 5,  'Andreas Brehme',     'Allemagne','🇩🇪', 'de', 'Défenseur', 3, 'Inter'),
    mkBadge('90', 25, 'Argentine', '🇦🇷', 'ar'),
    mkPlayer('90', 26, 'Diego Maradona',     'Argentine','🇦🇷', 'ar', 'Milieu',    10,'Napoli',      'maradona', true),
    mkPlayer('90', 27, 'Gabriel Calderón',   'Argentine','🇦🇷', 'ar', 'Milieu',    8, 'PSG'),
    mkBadge('90', 45, 'Italie', '🇮🇹', 'it'),
    mkPlayer('90', 46, 'Roberto Mancini',    'Italie',   '🇮🇹', 'it', 'Attaquant', 10,'Sampdoria'),
    mkPlayer('90', 47, 'Roberto Baggio',     'Italie',   '🇮🇹', 'it', 'Attaquant', 20,'Fiorentina',  'rbaggio', true),
    mkPlayer('90', 48, 'Salvatore Schillaci','Italie',   '🇮🇹', 'it', 'Attaquant', 9, 'Juventus'),
    mkBadge('90', 65, 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en'),
    mkPlayer('90', 66, 'Gary Lineker',       'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en','Attaquant',10,'Tottenham',  'lineker'),
    mkPlayer('90', 67, 'Peter Shilton',      'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en','Gardien',   1, 'Derby County'),
    mkBadge('90', 80, 'Brésil', '🇧🇷', 'br'),
    mkPlayer('90', 81, 'Careca',             'Brésil',   '🇧🇷', 'br', 'Attaquant', 9, 'Napoli'),
    mkPlayer('90', 82, 'Dunga',              'Brésil',   '🇧🇷', 'br', 'Milieu',    8, 'Stuttgart'),
    mkBadge('90', 95, 'Pays-Bas', '🇳🇱', 'nl'),
    mkPlayer('90', 96, 'Marco van Basten',   'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 9, 'AC Milan',    'vanbasten', true),
    mkPlayer('90', 97, 'Ruud Gullit',        'Pays-Bas', '🇳🇱', 'nl', 'Milieu',    10,'AC Milan'),
    mkPlayer('90', 98, 'Frank Rijkaard',     'Pays-Bas', '🇳🇱', 'nl', 'Milieu',    6, 'AC Milan'),
    mkBadge('90', 110, 'Yougoslavie', '🇾🇺', 'bul'),
    mkPlayer('90', 111, 'Dragan Stojković',  'Yougoslavie','🇾🇺','bul','Milieu',   10,'Étoile Rouge'),
    mkPlayer('90', 112, 'Robert Prosinečki', 'Yougoslavie','🇾🇺','bul','Milieu',   8, 'Étoile Rouge'),
    mkBadge('90', 125, 'URSS', '🇷🇺', 'ru'),
    mkPlayer('90', 126, 'Oleg Protasov',     'URSS',     '🇷🇺', 'ru', 'Attaquant', 9, 'Dynamo Kiev'),
    mkBadge('90', 138, 'Irlande', '🇮🇪', 'en'),
  ],

  // ── 1994 États-Unis ───────────────────────────────────────────────────────
  '94': [
    mkBadge('94', 1, 'Brésil', '🇧🇷', 'br'),
    mkPlayer('94', 2,  'Romário',            'Brésil',   '🇧🇷', 'br', 'Attaquant', 11,'PSV',         'romario', true),
    mkPlayer('94', 3,  'Bebeto',             'Brésil',   '🇧🇷', 'br', 'Attaquant', 9, 'Deportivo'),
    mkPlayer('94', 4,  'Mauro Silva',        'Brésil',   '🇧🇷', 'br', 'Milieu',    5, 'Deportivo'),
    mkPlayer('94', 5,  'Mazinho',            'Brésil',   '🇧🇷', 'br', 'Milieu',    6, 'Palmeiras'),
    mkBadge('94', 25, 'Italie', '🇮🇹', 'it'),
    mkPlayer('94', 26, 'Roberto Baggio',     'Italie',   '🇮🇹', 'it', 'Attaquant', 10,'Juventus',    'rbaggio', true),
    mkPlayer('94', 27, 'Demetrio Albertini', 'Italie',   '🇮🇹', 'it', 'Milieu',    8, 'AC Milan'),
    mkPlayer('94', 28, 'Gianfranco Zola',    'Italie',   '🇮🇹', 'it', 'Milieu',    9, 'Napoli'),
    mkBadge('94', 45, 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('94', 46, 'Lothar Matthäus',    'Allemagne','🇩🇪', 'de', 'Milieu',    10,'Bayern M.', 'lothar'),
    mkPlayer('94', 47, 'Jürgen Klinsmann',   'Allemagne','🇩🇪', 'de', 'Attaquant', 18,'Monaco'),
    mkBadge('94', 60, 'Roumanie', '🇷🇴', 'ro'),
    mkPlayer('94', 61, 'Gheorghe Hagi',      'Roumanie', '🇷🇴', 'ro', 'Milieu',    10,'Brescia',     'hagi', true),
    mkPlayer('94', 62, 'Florin Răducioiu',   'Roumanie', '🇷🇴', 'ro', 'Attaquant', 9, 'Espagnol'),
    mkBadge('94', 75, 'Bulgarie', '🇧🇬', 'bul'),
    mkPlayer('94', 76, 'Hristo Stoichkov',   'Bulgarie', '🇧🇬', 'bul','Attaquant', 8, 'Barcelone',   'stoichkov', true),
    mkPlayer('94', 77, 'Krasimir Balakov',   'Bulgarie', '🇧🇬', 'bul','Milieu',    10,'Sporting CP'),
    mkBadge('94', 88, 'Argentine', '🇦🇷', 'ar'),
    mkPlayer('94', 89, 'Diego Maradona',     'Argentine','🇦🇷', 'ar', 'Milieu',    10,'Newell\'s',   'maradona'),
    mkPlayer('94', 90, 'Gabriel Batistuta',  'Argentine','🇦🇷', 'ar', 'Attaquant', 9, 'Fiorentina',  'batistuta'),
    mkBadge('94', 105, 'Suède', '🇸🇪', 'ch'),
    mkPlayer('94', 106, 'Tomas Brolin',      'Suède',    '🇸🇪', 'ch', 'Attaquant', 11,'Parme'),
    mkPlayer('94', 107, 'Martin Dahlin',     'Suède',    '🇸🇪', 'ch', 'Attaquant', 9, 'Mönchengladbach'),
    mkBadge('94', 118, 'Mexique', '🇲🇽', 'mx'),
    mkPlayer('94', 119, 'Hugo Sánchez',      'Mexique',  '🇲🇽', 'mx', 'Attaquant', 9, 'America'),
    mkBadge('94', 130, 'Nigéria', '🇳🇬', 'ng'),
    mkPlayer('94', 131, 'Rashidi Yekini',    'Nigéria',  '🇳🇬', 'ng', 'Attaquant', 9, 'Sporting CP'),
    mkPlayer('94', 132, 'Jay-Jay Okocha',    'Nigéria',  '🇳🇬', 'ng', 'Milieu',    10,'Eintracht',  'okocha', true),
    mkBadge('94', 142, 'Russie', '🇷🇺', 'ru'),
    mkPlayer('94', 143, 'Oleg Salenko',      'Russie',   '🇷🇺', 'ru', 'Attaquant', 9, 'Valencia'),
    mkBadge('94', 153, 'Colombie', '🇨🇴', 'ma'),
    mkPlayer('94', 154, 'Carlos Valderrama', 'Colombie', '🇨🇴', 'ma', 'Milieu',    10,'Junior'),
    mkPlayer('94', 155, 'Faustino Asprilla', 'Colombie', '🇨🇴', 'ma', 'Attaquant', 11,'Parme'),
    mkBadge('94', 165, 'Corée du Sud', '🇰🇷', 'kr'),
    mkPlayer('94', 166, 'Choi Yong-soo',     'Corée du Sud','🇰🇷','kr','Attaquant', 9,'Seongnam'),
    mkBadge('94', 175, 'États-Unis', '🇺🇸', 'us'),
    mkPlayer('94', 176, 'Tab Ramos',         'États-Unis','🇺🇸','us', 'Milieu',    7, 'Betis'),
    mkPlayer('94', 177, 'Cobi Jones',        'États-Unis','🇺🇸','us', 'Milieu',    11,'Coventry'),
    mkPlayer('94', 178, 'Eric Wynalda',      'États-Unis','🇺🇸','us', 'Attaquant', 9, 'FC Saarbrücken'),
    mkBadge('94', 188, 'Espagne', '🇪🇸', 'es'),
    mkPlayer('94', 189, 'Luis Enrique',      'Espagne',  '🇪🇸', 'es', 'Milieu',    21,'Real Madrid'),
    mkPlayer('94', 190, 'Julio Salinas',     'Espagne',  '🇪🇸', 'es', 'Attaquant', 10,'Barcelone'),
  ],

  // ── 1998 France ───────────────────────────────────────────────────────────
  '98': [
    mkBadge('98', 0, 'France', '🇫🇷', 'fr'),
    mkPlayer('98', 1,  'Fabien Barthez',     'France',   '🇫🇷', 'fr', 'Gardien',   1,  'Monaco'),
    mkPlayer('98', 2,  'Lilian Thuram',      'France',   '🇫🇷', 'fr', 'Défenseur', 15, 'Parme'),
    mkPlayer('98', 3,  'Marcel Desailly',    'France',   '🇫🇷', 'fr', 'Défenseur', 5,  'AC Milan'),
    mkPlayer('98', 4,  'Zinédine Zidane',    'France',   '🇫🇷', 'fr', 'Milieu',    10, 'Juventus',   'zidane', true),
    mkPlayer('98', 5,  'Thierry Henry',      'France',   '🇫🇷', 'fr', 'Attaquant', 12, 'Monaco',     'henry'),
    mkPlayer('98', 6,  'Didier Deschamps',   'France',   '🇫🇷', 'fr', 'Milieu',    7,  'Juventus'),
    mkPlayer('98', 7,  'Emmanuel Petit',     'France',   '🇫🇷', 'fr', 'Milieu',    17, 'Arsenal'),
    mkPlayer('98', 8,  'David Trezeguet',    'France',   '🇫🇷', 'fr', 'Attaquant', 20, 'Monaco'),
    mkPlayer('98', 9,  'Youri Djorkaeff',    'France',   '🇫🇷', 'fr', 'Milieu',    8,  'PSG'),
    mkPlayer('98', 10, 'Laurent Blanc',      'France',   '🇫🇷', 'fr', 'Défenseur', 4,  'Marseille'),
    mkPlayer('98', 11, 'Patrick Vieira',     'France',   '🇫🇷', 'fr', 'Milieu',    6,  'Arsenal'),
    mkBadge('98', 59, 'Brésil', '🇧🇷', 'br'),
    mkPlayer('98', 60, 'Ronaldo',            'Brésil',   '🇧🇷', 'br', 'Attaquant', 9,  'Inter Milan','ronaldo', true),
    mkPlayer('98', 61, 'Roberto Carlos',     'Brésil',   '🇧🇷', 'br', 'Défenseur', 6,  'Real Madrid'),
    mkPlayer('98', 62, 'Rivaldo',            'Brésil',   '🇧🇷', 'br', 'Milieu',    10, 'Barcelone'),
    mkPlayer('98', 64, 'Cafu',               'Brésil',   '🇧🇷', 'br', 'Défenseur', 2,  'Roma'),
    mkPlayer('98', 65, 'Bebeto',             'Brésil',   '🇧🇷', 'br', 'Attaquant', 15, 'Vasco'),
    mkPlayer('98', 66, 'Denilson',           'Brésil',   '🇧🇷', 'br', 'Milieu',    7,  'Betis'),
    mkBadge('98', 119, 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('98', 120, 'Oliver Bierhoff',   'Allemagne','🇩🇪', 'de', 'Attaquant', 9,  'Udinese'),
    mkPlayer('98', 121, 'Lothar Matthäus',   'Allemagne','🇩🇪', 'de', 'Milieu',    10, 'Bayern M.', 'lothar'),
    mkPlayer('98', 122, 'Jürgen Klinsmann',  'Allemagne','🇩🇪', 'de', 'Attaquant', 18, 'Sampdoria'),
    mkPlayer('98', 123, 'Oliver Kahn',       'Allemagne','🇩🇪', 'de', 'Gardien',   1,  'Bayern M.'),
    mkBadge('98', 179, 'Argentine', '🇦🇷', 'ar'),
    mkPlayer('98', 180, 'Gabriel Batistuta', 'Argentine','🇦🇷', 'ar', 'Attaquant', 9,  'Fiorentina', 'batistuta'),
    mkPlayer('98', 181, 'Diego Simeone',     'Argentine','🇦🇷', 'ar', 'Milieu',    7,  'Inter Milan'),
    mkPlayer('98', 182, 'Ariel Ortega',      'Argentine','🇦🇷', 'ar', 'Milieu',    10, 'Valencia'),
    mkBadge('98', 239, 'Italie', '🇮🇹', 'it'),
    mkPlayer('98', 240, 'Roberto Baggio',    'Italie',   '🇮🇹', 'it', 'Attaquant', 10, 'Bologna',   'rbaggio'),
    mkPlayer('98', 241, 'Alessandro Del Piero','Italie', '🇮🇹', 'it', 'Attaquant', 20, 'Juventus'),
    mkPlayer('98', 242, 'Christian Vieri',   'Italie',   '🇮🇹', 'it', 'Attaquant', 18, 'Lazio'),
    mkPlayer('98', 243, 'Gianluigi Buffon',  'Italie',   '🇮🇹', 'it', 'Gardien',   1,  'Parme'),
    mkBadge('98', 299, 'Pays-Bas', '🇳🇱', 'nl'),
    mkPlayer('98', 300, 'Dennis Bergkamp',   'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 10, 'Arsenal',   'bergkamp', true),
    mkPlayer('98', 301, 'Patrick Kluivert',  'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 9,  'Barcelone'),
    mkPlayer('98', 302, 'Marc Overmars',     'Pays-Bas', '🇳🇱', 'nl', 'Milieu',    11, 'Arsenal'),
    mkBadge('98', 359, 'Croatie', '🇭🇷', 'cr'),
    mkPlayer('98', 360, 'Davor Šuker',       'Croatie',  '🇭🇷', 'cr', 'Attaquant', 9,  'Real Madrid'),
    mkPlayer('98', 361, 'Zvonimir Boban',    'Croatie',  '🇭🇷', 'cr', 'Milieu',    10, 'AC Milan'),
    mkBadge('98', 419, 'Espagne', '🇪🇸', 'es'),
    mkPlayer('98', 420, 'Raúl González',     'Espagne',  '🇪🇸', 'es', 'Attaquant', 7,  'Real Madrid', 'raul'),
    mkPlayer('98', 421, 'Fernando Hierro',   'Espagne',  '🇪🇸', 'es', 'Défenseur', 6,  'Real Madrid'),
  ],

  // ── 2002 Corée-Japon ─────────────────────────────────────────────────────
  '02': [
    mkBadge('02', 1, 'Brésil', '🇧🇷', 'br'),
    mkPlayer('02', 2,  'Ronaldo',            'Brésil',   '🇧🇷', 'br', 'Attaquant', 9,  'Inter Milan','ronaldo', true),
    mkPlayer('02', 3,  'Ronaldinho',         'Brésil',   '🇧🇷', 'br', 'Milieu',    11, 'PSG',        'ronaldinho', true),
    mkPlayer('02', 4,  'Roberto Carlos',     'Brésil',   '🇧🇷', 'br', 'Défenseur', 6,  'Real Madrid'),
    mkPlayer('02', 5,  'Rivaldo',            'Brésil',   '🇧🇷', 'br', 'Milieu',    10, 'Barcelone'),
    mkPlayer('02', 6,  'Kaká',               'Brésil',   '🇧🇷', 'br', 'Milieu',    8,  'São Paulo',  'kaka'),
    mkPlayer('02', 7,  'Cafu',               'Brésil',   '🇧🇷', 'br', 'Défenseur', 2,  'Roma'),
    mkBadge('02', 40, 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('02', 41, 'Oliver Kahn',        'Allemagne','🇩🇪', 'de', 'Gardien',   1,  'Bayern M.', undefined, true),
    mkPlayer('02', 42, 'Michael Ballack',    'Allemagne','🇩🇪', 'de', 'Milieu',    13, 'Bayer Lev.'),
    mkPlayer('02', 43, 'Miroslav Klose',     'Allemagne','🇩🇪', 'de', 'Attaquant', 11, 'Kaiserslautern', 'klose'),
    mkBadge('02', 75, 'France', '🇫🇷', 'fr'),
    mkPlayer('02', 76, 'Zinédine Zidane',    'France',   '🇫🇷', 'fr', 'Milieu',    10, 'Real Madrid','zidane', true),
    mkPlayer('02', 77, 'Thierry Henry',      'France',   '🇫🇷', 'fr', 'Attaquant', 12, 'Arsenal',    'henry'),
    mkPlayer('02', 78, 'Patrick Vieira',     'France',   '🇫🇷', 'fr', 'Milieu',    6,  'Arsenal'),
    mkBadge('02', 110, 'Argentine', '🇦🇷', 'ar'),
    mkPlayer('02', 111, 'Gabriel Batistuta', 'Argentine','🇦🇷', 'ar', 'Attaquant', 9,  'Roma',       'batistuta'),
    mkPlayer('02', 112, 'Hernán Crespo',     'Argentine','🇦🇷', 'ar', 'Attaquant', 11, 'Lazio'),
    mkBadge('02', 145, 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en'),
    mkPlayer('02', 146, 'David Beckham',     'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en','Milieu',    7,  'Man Utd', 'beckham', true),
    mkPlayer('02', 147, 'Michael Owen',      'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en','Attaquant', 10, 'Liverpool'),
    mkBadge('02', 180, 'Corée du Sud', '🇰🇷', 'kr'),
    mkPlayer('02', 181, 'Park Ji-sung',      'Corée du Sud','🇰🇷','kr','Milieu',   7,  'PSV'),
    mkPlayer('02', 182, 'Ahn Jung-hwan',     'Corée du Sud','🇰🇷','kr','Attaquant',11, 'Perugia'),
    mkBadge('02', 215, 'Sénégal', '🇸🇳', 'sn'),
    mkPlayer('02', 216, 'El Hadji Diouf',    'Sénégal',  '🇸🇳', 'sn', 'Attaquant', 11,'Lens'),
    mkPlayer('02', 217, 'Salif Diao',        'Sénégal',  '🇸🇳', 'sn', 'Milieu',    8, 'Lens'),
    mkBadge('02', 230, 'Turquie', '🇹🇷', 'tr'),
    mkPlayer('02', 231, 'Hakan Şükür',       'Turquie',  '🇹🇷', 'tr', 'Attaquant', 9, 'Galatasaray'),
    mkPlayer('02', 232, 'İlhan Mansız',      'Turquie',  '🇹🇷', 'tr', 'Attaquant', 10,'Beşiktaş'),
  ],

  // ── 2006 Allemagne ────────────────────────────────────────────────────────
  '06': [
    mkBadge('06', 0, 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('06', 1,  'Jens Lehmann',       'Allemagne','🇩🇪', 'de', 'Gardien',   1,  'Arsenal'),
    mkPlayer('06', 2,  'Michael Ballack',    'Allemagne','🇩🇪', 'de', 'Milieu',    13, 'Chelsea'),
    mkPlayer('06', 3,  'Miroslav Klose',     'Allemagne','🇩🇪', 'de', 'Attaquant', 11, 'Werder',     'klose'),
    mkPlayer('06', 4,  'Lukas Podolski',     'Allemagne','🇩🇪', 'de', 'Attaquant', 20, 'Cologne'),
    mkPlayer('06', 5,  'Philipp Lahm',       'Allemagne','🇩🇪', 'de', 'Défenseur', 16, 'Bayern M.', 'lahm'),
    mkPlayer('06', 6,  'Per Mertesacker',    'Allemagne','🇩🇪', 'de', 'Défenseur', 17, 'Hanovre'),
    mkBadge('06', 49, 'Brésil', '🇧🇷', 'br'),
    mkPlayer('06', 50, 'Ronaldo',            'Brésil',   '🇧🇷', 'br', 'Attaquant', 9,  'Real Madrid','ronaldo', true),
    mkPlayer('06', 51, 'Ronaldinho',         'Brésil',   '🇧🇷', 'br', 'Milieu',    10, 'Barcelone',  'ronaldinho', true),
    mkPlayer('06', 52, 'Kaká',               'Brésil',   '🇧🇷', 'br', 'Milieu',    8,  'AC Milan',   'kaka'),
    mkPlayer('06', 53, 'Adriano',            'Brésil',   '🇧🇷', 'br', 'Attaquant', 11, 'Inter Milan'),
    mkPlayer('06', 54, 'Roberto Carlos',     'Brésil',   '🇧🇷', 'br', 'Défenseur', 6,  'Real Madrid'),
    mkBadge('06', 99, 'France', '🇫🇷', 'fr'),
    mkPlayer('06', 100, 'Zinédine Zidane',   'France',   '🇫🇷', 'fr', 'Milieu',    10, 'Real Madrid','zidane', true),
    mkPlayer('06', 101, 'Thierry Henry',     'France',   '🇫🇷', 'fr', 'Attaquant', 12, 'Arsenal',    'henry'),
    mkPlayer('06', 102, 'Patrick Vieira',    'France',   '🇫🇷', 'fr', 'Milieu',    4,  'Juventus'),
    mkPlayer('06', 103, 'Franck Ribéry',     'France',   '🇫🇷', 'fr', 'Milieu',    7,  'Marseille',  'ribery'),
    mkPlayer('06', 104, 'William Gallas',    'France',   '🇫🇷', 'fr', 'Défenseur', 3,  'Chelsea'),
    mkBadge('06', 149, 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en'),
    mkPlayer('06', 150, 'Wayne Rooney',      'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Attaquant', 9, 'Man Utd'),
    mkPlayer('06', 151, 'Steven Gerrard',    'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Milieu',    4, 'Liverpool'),
    mkPlayer('06', 152, 'Frank Lampard',     'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Milieu',    8, 'Chelsea'),
    mkPlayer('06', 153, 'Michael Owen',      'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Attaquant',10, 'Newcastle'),
    mkBadge('06', 199, 'Italie', '🇮🇹', 'it'),
    mkPlayer('06', 200, 'Gianluigi Buffon',  'Italie',   '🇮🇹', 'it', 'Gardien',   1,  'Juventus'),
    mkPlayer('06', 201, 'Fabio Cannavaro',   'Italie',   '🇮🇹', 'it', 'Défenseur', 5,  'Juventus'),
    mkPlayer('06', 202, 'Francesco Totti',   'Italie',   '🇮🇹', 'it', 'Milieu',    10, 'Roma'),
    mkPlayer('06', 203, 'Andrea Pirlo',      'Italie',   '🇮🇹', 'it', 'Milieu',    21, 'AC Milan',   'pirlo'),
    mkPlayer('06', 204, 'Alessandro Del Piero','Italie', '🇮🇹', 'it', 'Attaquant', 7,  'Juventus'),
    mkBadge('06', 249, 'Argentine', '🇦🇷', 'ar'),
    mkPlayer('06', 250, 'Lionel Messi',      'Argentine','🇦🇷', 'ar', 'Attaquant', 19, 'Barcelone',  'messi', true),
    mkPlayer('06', 251, 'Hernán Crespo',     'Argentine','🇦🇷', 'ar', 'Attaquant', 11, 'Chelsea'),
    mkPlayer('06', 252, 'Javier Saviola',    'Argentine','🇦🇷', 'ar', 'Attaquant', 10, 'Barcelone'),
    mkBadge('06', 299, 'Portugal', '🇵🇹', 'pt'),
    mkPlayer('06', 300, 'Cristiano Ronaldo', 'Portugal', '🇵🇹', 'pt', 'Attaquant', 17, 'Man Utd',    'cr7', true),
    mkPlayer('06', 301, 'Luís Figo',         'Portugal', '🇵🇹', 'pt', 'Milieu',    7,  'Inter Milan'),
    mkPlayer('06', 302, 'Deco',              'Portugal', '🇵🇹', 'pt', 'Milieu',    11, 'Barcelone'),
    mkBadge('06', 349, 'Espagne', '🇪🇸', 'es'),
    mkPlayer('06', 350, 'Raúl González',     'Espagne',  '🇪🇸', 'es', 'Attaquant', 7,  'Real Madrid', 'raul'),
    mkPlayer('06', 351, 'Fernando Torres',   'Espagne',  '🇪🇸', 'es', 'Attaquant', 19, 'Atlético',   'ftorres'),
    mkPlayer('06', 352, 'David Villa',       'Espagne',  '🇪🇸', 'es', 'Attaquant', 21, 'Valencia',   'villa'),
  ],

  // ── 2010 Afrique du Sud ───────────────────────────────────────────────────
  '10': [
    mkBadge('10', 1, 'Espagne', '🇪🇸', 'es'),
    mkPlayer('10', 2,  'Iker Casillas',      'Espagne',  '🇪🇸', 'es', 'Gardien',   1,  'Real Madrid', undefined, true),
    mkPlayer('10', 3,  'David Villa',        'Espagne',  '🇪🇸', 'es', 'Attaquant', 7,  'Valencia',   'villa'),
    mkPlayer('10', 4,  'Fernando Torres',    'Espagne',  '🇪🇸', 'es', 'Attaquant', 9,  'Liverpool',  'ftorres'),
    mkPlayer('10', 5,  'Xavi Hernández',     'Espagne',  '🇪🇸', 'es', 'Milieu',    8,  'Barcelone',  'xavi'),
    mkPlayer('10', 6,  'Andrés Iniesta',     'Espagne',  '🇪🇸', 'es', 'Milieu',    6,  'Barcelone',  'iniesta', true),
    mkPlayer('10', 7,  'Carles Puyol',       'Espagne',  '🇪🇸', 'es', 'Défenseur', 5,  'Barcelone'),
    mkPlayer('10', 8,  'Sergio Ramos',       'Espagne',  '🇪🇸', 'es', 'Défenseur', 15, 'Real Madrid'),
    mkBadge('10', 49, 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('10', 50, 'Miroslav Klose',     'Allemagne','🇩🇪', 'de', 'Attaquant', 11, 'Werder',     'klose'),
    mkPlayer('10', 51, 'Philipp Lahm',       'Allemagne','🇩🇪', 'de', 'Défenseur', 16, 'Bayern M.', 'lahm'),
    mkPlayer('10', 52, 'Thomas Müller',      'Allemagne','🇩🇪', 'de', 'Attaquant', 13, 'Bayern M.',  'muller', true),
    mkPlayer('10', 53, 'Bastian Schweinsteiger','Allemagne','🇩🇪','de','Milieu',  31, 'Bayern M.'),
    mkBadge('10', 99, 'Brésil', '🇧🇷', 'br'),
    mkPlayer('10', 100, 'Kaká',              'Brésil',   '🇧🇷', 'br', 'Milieu',    8,  'Real Madrid','kaka'),
    mkPlayer('10', 101, 'Robinho',           'Brésil',   '🇧🇷', 'br', 'Attaquant', 10, 'Man City'),
    mkPlayer('10', 102, 'Elano',             'Brésil',   '🇧🇷', 'br', 'Milieu',    7,  'Galatasaray'),
    mkPlayer('10', 103, 'Maicon',            'Brésil',   '🇧🇷', 'br', 'Défenseur', 2,  'Inter Milan'),
    mkBadge('10', 149, 'Argentine', '🇦🇷', 'ar'),
    mkPlayer('10', 150, 'Lionel Messi',      'Argentine','🇦🇷', 'ar', 'Attaquant', 10, 'Barcelone',  'messi', true),
    mkPlayer('10', 151, 'Carlos Tevez',      'Argentine','🇦🇷', 'ar', 'Attaquant', 10, 'Man City'),
    mkBadge('10', 199, 'France', '🇫🇷', 'fr'),
    mkPlayer('10', 200, 'Franck Ribéry',     'France',   '🇫🇷', 'fr', 'Milieu',    7,  'Bayern M.',  'ribery'),
    mkPlayer('10', 201, 'Thierry Henry',     'France',   '🇫🇷', 'fr', 'Attaquant', 12, 'Barcelone',  'henry'),
    mkPlayer('10', 202, 'Florent Malouda',   'France',   '🇫🇷', 'fr', 'Milieu',    11, 'Chelsea'),
    mkBadge('10', 249, 'Portugal', '🇵🇹', 'pt'),
    mkPlayer('10', 250, 'Cristiano Ronaldo', 'Portugal', '🇵🇹', 'pt', 'Attaquant', 7,  'Real Madrid','cr7', true),
    mkBadge('10', 299, 'Uruguay', '🇺🇾', 'uy'),
    mkPlayer('10', 300, 'Diego Forlán',      'Uruguay',  '🇺🇾', 'uy', 'Attaquant', 10, 'Atlético',  'forlan', true),
    mkPlayer('10', 301, 'Luis Suárez',       'Uruguay',  '🇺🇾', 'uy', 'Attaquant', 9,  'Ajax',       'suarez'),
    mkBadge('10', 349, 'Ghana', '🇬🇭', 'gh'),
    mkPlayer('10', 350, 'Kevin-Prince Boateng','Ghana',  '🇬🇭', 'gh', 'Milieu',    10, 'Portsmouth'),
    mkPlayer('10', 351, 'Asamoah Gyan',      'Ghana',    '🇬🇭', 'gh', 'Attaquant', 3,  'Rennes'),
    mkBadge('10', 362, 'Pays-Bas', '🇳🇱', 'nl'),
    mkPlayer('10', 363, 'Arjen Robben',      'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 11, 'Bayern M.',  'robben', true),
    mkPlayer('10', 364, 'Wesley Sneijder',   'Pays-Bas', '🇳🇱', 'nl', 'Milieu',    10, 'Inter Milan'),
    mkPlayer('10', 365, 'Dirk Kuyt',         'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 9,  'Liverpool'),
  ],

  // ── 2014 Brésil ───────────────────────────────────────────────────────────
  '14': [
    mkBadge('14', 1, 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('14', 2,  'Manuel Neuer',       'Allemagne','🇩🇪', 'de', 'Gardien',   1,  'Bayern M.',  'neuer', true),
    mkPlayer('14', 3,  'Philipp Lahm',       'Allemagne','🇩🇪', 'de', 'Défenseur', 16, 'Bayern M.', 'lahm'),
    mkPlayer('14', 4,  'Thomas Müller',      'Allemagne','🇩🇪', 'de', 'Attaquant', 13, 'Bayern M.',  'muller'),
    mkPlayer('14', 5,  'Miroslav Klose',     'Allemagne','🇩🇪', 'de', 'Attaquant', 11, 'Lazio',      'klose'),
    mkPlayer('14', 6,  'Toni Kroos',         'Allemagne','🇩🇪', 'de', 'Milieu',    18, 'Bayern M.'),
    mkPlayer('14', 7,  'Mats Hummels',       'Allemagne','🇩🇪', 'de', 'Défenseur', 5,  'Dortmund'),
    mkBadge('14', 49, 'Argentine', '🇦🇷', 'ar'),
    mkPlayer('14', 50, 'Lionel Messi',       'Argentine','🇦🇷', 'ar', 'Attaquant', 10, 'Barcelone',  'messi', true),
    mkPlayer('14', 51, 'Ángel Di María',     'Argentine','🇦🇷', 'ar', 'Milieu',    7,  'Real Madrid'),
    mkPlayer('14', 52, 'Gonzalo Higuaín',    'Argentine','🇦🇷', 'ar', 'Attaquant', 9,  'Napoli'),
    mkBadge('14', 99, 'Brésil', '🇧🇷', 'br'),
    mkPlayer('14', 100, 'Neymar Jr',         'Brésil',   '🇧🇷', 'br', 'Attaquant', 10, 'Barcelone',  'neymar', true),
    mkPlayer('14', 101, 'Oscar',             'Brésil',   '🇧🇷', 'br', 'Milieu',    11, 'Chelsea'),
    mkPlayer('14', 102, 'David Luiz',        'Brésil',   '🇧🇷', 'br', 'Défenseur', 4,  'Chelsea'),
    mkPlayer('14', 103, 'Thiago Silva',      'Brésil',   '🇧🇷', 'br', 'Défenseur', 3,  'PSG'),
    mkBadge('14', 149, 'France', '🇫🇷', 'fr'),
    mkPlayer('14', 150, 'Karim Benzema',     'France',   '🇫🇷', 'fr', 'Attaquant', 10, 'Real Madrid', 'benzema'),
    mkPlayer('14', 151, 'Antoine Griezmann', 'France',   '🇫🇷', 'fr', 'Attaquant', 7,  'Real Sociedad','griezmann'),
    mkPlayer('14', 152, 'Paul Pogba',        'France',   '🇫🇷', 'fr', 'Milieu',    6,  'Juventus'),
    mkBadge('14', 199, 'Espagne', '🇪🇸', 'es'),
    mkPlayer('14', 200, 'Xavi Hernández',    'Espagne',  '🇪🇸', 'es', 'Milieu',    8,  'Barcelone',  'xavi'),
    mkPlayer('14', 201, 'Andrés Iniesta',    'Espagne',  '🇪🇸', 'es', 'Milieu',    6,  'Barcelone',  'iniesta'),
    mkPlayer('14', 202, 'David Villa',       'Espagne',  '🇪🇸', 'es', 'Attaquant', 7,  'Atlético',   'villa'),
    mkBadge('14', 249, 'Portugal', '🇵🇹', 'pt'),
    mkPlayer('14', 250, 'Cristiano Ronaldo', 'Portugal', '🇵🇹', 'pt', 'Attaquant', 7,  'Real Madrid','cr7', true),
    mkPlayer('14', 251, 'Nani',              'Portugal', '🇵🇹', 'pt', 'Milieu',    17, 'Man Utd'),
    mkPlayer('14', 252, 'Pepe',              'Portugal', '🇵🇹', 'pt', 'Défenseur', 3,  'Real Madrid'),
    mkBadge('14', 299, 'Colombie', '🇨🇴', 'ma'),
    mkPlayer('14', 300, 'James Rodríguez',   'Colombie', '🇨🇴', 'ma', 'Milieu',    10, 'Monaco',     'james', true),
    mkBadge('14', 349, 'Uruguay', '🇺🇾', 'uy'),
    mkPlayer('14', 350, 'Luis Suárez',       'Uruguay',  '🇺🇾', 'uy', 'Attaquant', 9,  'Liverpool',  'suarez', true),
    mkPlayer('14', 351, 'Edinson Cavani',    'Uruguay',  '🇺🇾', 'uy', 'Attaquant', 7,  'PSG',        'cavani'),
    mkBadge('14', 399, 'Belgique', '🇧🇪', 'be'),
    mkPlayer('14', 400, 'Kevin De Bruyne',   'Belgique', '🇧🇪', 'be', 'Milieu',    7,  'Wolfsburg',  'kdb'),
    mkPlayer('14', 401, 'Eden Hazard',       'Belgique', '🇧🇪', 'be', 'Milieu',    10, 'Chelsea'),
    mkPlayer('14', 402, 'Romelu Lukaku',     'Belgique', '🇧🇪', 'be', 'Attaquant', 9,  'Everton'),
    mkBadge('14', 449, 'Pays-Bas', '🇳🇱', 'nl'),
    mkPlayer('14', 450, 'Arjen Robben',      'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 11, 'Bayern M.',  'robben', true),
    mkPlayer('14', 451, 'Robin van Persie',  'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 9,  'Man Utd'),
    mkPlayer('14', 452, 'Wesley Sneijder',   'Pays-Bas', '🇳🇱', 'nl', 'Milieu',    10, 'Galatasaray'),
  ],

  // ── 2018 Russie ───────────────────────────────────────────────────────────
  '18': [
    // France (1-48)
    mkBadge('18', 1, 'France', '🇫🇷', 'fr'),
    mkPlayer('18', 2,  'Hugo Lloris',        'France',   '🇫🇷', 'fr', 'Gardien',   1,  'Tottenham'),
    mkPlayer('18', 3,  'Benjamin Pavard',    'France',   '🇫🇷', 'fr', 'Défenseur', 2,  'Stuttgart'),
    mkPlayer('18', 4,  'Raphael Varane',     'France',   '🇫🇷', 'fr', 'Défenseur', 4,  'Real Madrid'),
    mkPlayer('18', 5,  'Samuel Umtiti',      'France',   '🇫🇷', 'fr', 'Défenseur', 5,  'Barcelone'),
    mkPlayer('18', 6,  'Lucas Hernández',    'France',   '🇫🇷', 'fr', 'Défenseur', 21, 'Atlético'),
    mkPlayer('18', 7,  'N\'Golo Kanté',      'France',   '🇫🇷', 'fr', 'Milieu',    13, 'Chelsea'),
    mkPlayer('18', 8,  'Paul Pogba',         'France',   '🇫🇷', 'fr', 'Milieu',    6,  'Man Utd'),
    mkPlayer('18', 9,  'Blaise Matuidi',     'France',   '🇫🇷', 'fr', 'Milieu',    14, 'Juventus'),
    mkPlayer('18', 10, 'Kylian Mbappé',      'France',   '🇫🇷', 'fr', 'Attaquant', 10, 'PSG',        'mbappe', true),
    mkPlayer('18', 11, 'Antoine Griezmann',  'France',   '🇫🇷', 'fr', 'Attaquant', 7,  'Atlético',   'griezmann'),
    mkPlayer('18', 12, 'Olivier Giroud',     'France',   '🇫🇷', 'fr', 'Attaquant', 9,  'Chelsea'),
    mkPlayer('18', 13, 'Ousmane Dembélé',    'France',   '🇫🇷', 'fr', 'Milieu',    11, 'Barcelone'),
    mkPlayer('18', 14, 'Corentin Tolisso',   'France',   '🇫🇷', 'fr', 'Milieu',    12, 'Bayern M.'),
    // Croatie (49-98)
    mkBadge('18', 49, 'Croatie', '🇭🇷', 'cr'),
    mkPlayer('18', 50, 'Luka Modrić',        'Croatie',  '🇭🇷', 'cr', 'Milieu',    10, 'Real Madrid','modric', true),
    mkPlayer('18', 51, 'Ivan Rakitić',       'Croatie',  '🇭🇷', 'cr', 'Milieu',    7,  'Barcelone'),
    mkPlayer('18', 52, 'Mario Mandžukić',    'Croatie',  '🇭🇷', 'cr', 'Attaquant', 17, 'Juventus'),
    mkPlayer('18', 53, 'Ivan Perišić',       'Croatie',  '🇭🇷', 'cr', 'Milieu',    4,  'Inter Milan'),
    mkPlayer('18', 54, 'Dejan Lovren',       'Croatie',  '🇭🇷', 'cr', 'Défenseur', 6,  'Liverpool'),
    mkPlayer('18', 55, 'Marcelo Brozović',   'Croatie',  '🇭🇷', 'cr', 'Milieu',    11, 'Inter Milan'),
    mkPlayer('18', 56, 'Ante Rebić',         'Croatie',  '🇭🇷', 'cr', 'Attaquant', 18, 'Frankfurt'),
    mkPlayer('18', 57, 'Danijel Subašić',    'Croatie',  '🇭🇷', 'cr', 'Gardien',   1,  'Monaco'),
    // Belgique (99-148)
    mkBadge('18', 99, 'Belgique', '🇧🇪', 'be'),
    mkPlayer('18', 100, 'Kevin De Bruyne',   'Belgique', '🇧🇪', 'be', 'Milieu',    7,  'Man City',   'kdb'),
    mkPlayer('18', 101, 'Eden Hazard',       'Belgique', '🇧🇪', 'be', 'Milieu',    10, 'Chelsea'),
    mkPlayer('18', 102, 'Romelu Lukaku',     'Belgique', '🇧🇪', 'be', 'Attaquant', 9,  'Man Utd'),
    mkPlayer('18', 103, 'Thibaut Courtois',  'Belgique', '🇧🇪', 'be', 'Gardien',   1,  'Real Madrid'),
    mkPlayer('18', 104, 'Vincent Kompany',   'Belgique', '🇧🇪', 'be', 'Défenseur', 4,  'Man City'),
    mkPlayer('18', 105, 'Jan Vertonghen',    'Belgique', '🇧🇪', 'be', 'Défenseur', 5,  'Tottenham'),
    mkPlayer('18', 106, 'Toby Alderweireld', 'Belgique', '🇧🇪', 'be', 'Défenseur', 2,  'Tottenham'),
    mkPlayer('18', 107, 'Dries Mertens',     'Belgique', '🇧🇪', 'be', 'Attaquant', 14, 'Napoli'),
    mkPlayer('18', 108, 'Axel Witsel',       'Belgique', '🇧🇪', 'be', 'Milieu',    6,  'Dortmund'),
    // Angleterre (149-198)
    mkBadge('18', 149, 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en'),
    mkPlayer('18', 150, 'Harry Kane',        'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Attaquant', 9,  'Tottenham', 'kane', true),
    mkPlayer('18', 151, 'Raheem Sterling',   'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Attaquant', 7,  'Man City'),
    mkPlayer('18', 152, 'Dele Alli',         'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Milieu',   20,  'Tottenham'),
    mkPlayer('18', 153, 'Jordan Henderson',  'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Milieu',   8,   'Liverpool'),
    mkPlayer('18', 154, 'John Stones',       'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Défenseur',5,  'Man City'),
    mkPlayer('18', 155, 'Kyle Walker',       'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Défenseur',2,  'Man City'),
    mkPlayer('18', 156, 'Marcus Rashford',   'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Attaquant',19,  'Man Utd'),
    mkPlayer('18', 157, 'Jesse Lingard',     'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Milieu',   11,  'Man Utd'),
    // Brésil (199-248)
    mkBadge('18', 199, 'Brésil', '🇧🇷', 'br'),
    mkPlayer('18', 200, 'Neymar Jr',         'Brésil',   '🇧🇷', 'br', 'Attaquant', 10, 'PSG',        'neymar', true),
    mkPlayer('18', 201, 'Philippe Coutinho', 'Brésil',   '🇧🇷', 'br', 'Milieu',    11, 'Barcelone'),
    mkPlayer('18', 202, 'Gabriel Jesus',     'Brésil',   '🇧🇷', 'br', 'Attaquant', 9,  'Man City'),
    mkPlayer('18', 203, 'Willian',           'Brésil',   '🇧🇷', 'br', 'Milieu',    19, 'Chelsea'),
    mkPlayer('18', 204, 'Casemiro',          'Brésil',   '🇧🇷', 'br', 'Milieu',    5,  'Real Madrid'),
    mkPlayer('18', 205, 'Thiago Silva',      'Brésil',   '🇧🇷', 'br', 'Défenseur', 3,  'PSG'),
    mkPlayer('18', 206, 'Alisson',           'Brésil',   '🇧🇷', 'br', 'Gardien',   1,  'Roma'),
    mkPlayer('18', 207, 'Marcelo',           'Brésil',   '🇧🇷', 'br', 'Défenseur', 12, 'Real Madrid'),
    mkPlayer('18', 208, 'Fernandinho',       'Brésil',   '🇧🇷', 'br', 'Milieu',    14, 'Man City'),
    // Argentine (249-298)
    mkBadge('18', 249, 'Argentine', '🇦🇷', 'ar'),
    mkPlayer('18', 250, 'Lionel Messi',      'Argentine','🇦🇷', 'ar', 'Attaquant', 10, 'Barcelone',  'messi', true),
    mkPlayer('18', 251, 'Gonzalo Higuaín',   'Argentine','🇦🇷', 'ar', 'Attaquant', 9,  'Juventus'),
    mkPlayer('18', 252, 'Paulo Dybala',      'Argentine','🇦🇷', 'ar', 'Milieu',    21, 'Juventus'),
    mkPlayer('18', 253, 'Ángel Di María',    'Argentine','🇦🇷', 'ar', 'Milieu',    11, 'PSG'),
    mkPlayer('18', 254, 'Sergio Agüero',     'Argentine','🇦🇷', 'ar', 'Attaquant', 19, 'Man City'),
    mkPlayer('18', 255, 'Javier Mascherano', 'Argentine','🇦🇷', 'ar', 'Milieu',    14, 'Hebei'),
    // Portugal (299-348)
    mkBadge('18', 299, 'Portugal', '🇵🇹', 'pt'),
    mkPlayer('18', 300, 'Cristiano Ronaldo', 'Portugal', '🇵🇹', 'pt', 'Attaquant', 7,  'Real Madrid','cr7', true),
    mkPlayer('18', 301, 'Pepe',              'Portugal', '🇵🇹', 'pt', 'Défenseur', 3,  'Besiktas'),
    mkPlayer('18', 302, 'Ricardo Quaresma', 'Portugal', '🇵🇹', 'pt', 'Milieu',    20, 'Besiktas'),
    mkPlayer('18', 303, 'Bruno Fernandes',   'Portugal', '🇵🇹', 'pt', 'Milieu',    8,  'Sporting CP'),
    mkPlayer('18', 304, 'João Moutinho',     'Portugal', '🇵🇹', 'pt', 'Milieu',    8,  'Monaco'),
    mkPlayer('18', 305, 'Rui Patrício',      'Portugal', '🇵🇹', 'pt', 'Gardien',   1,  'Sporting CP'),
    // Espagne (349-398)
    mkBadge('18', 349, 'Espagne', '🇪🇸', 'es'),
    mkPlayer('18', 350, 'Sergio Ramos',      'Espagne',  '🇪🇸', 'es', 'Défenseur', 15, 'Real Madrid'),
    mkPlayer('18', 351, 'David de Gea',      'Espagne',  '🇪🇸', 'es', 'Gardien',   1,  'Man Utd'),
    mkPlayer('18', 352, 'Andrés Iniesta',    'Espagne',  '🇪🇸', 'es', 'Milieu',    6,  'Barcelone',  'iniesta'),
    mkPlayer('18', 353, 'Isco',              'Espagne',  '🇪🇸', 'es', 'Milieu',    22, 'Real Madrid'),
    mkPlayer('18', 354, 'David Silva',       'Espagne',  '🇪🇸', 'es', 'Milieu',    21, 'Man City'),
    mkPlayer('18', 355, 'Diego Costa',       'Espagne',  '🇪🇸', 'es', 'Attaquant', 9,  'Atlético'),
    mkPlayer('18', 356, 'Thiago Alcântara',  'Espagne',  '🇪🇸', 'es', 'Milieu',    8,  'Bayern M.'),
    // Allemagne (399-448)
    mkBadge('18', 399, 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('18', 400, 'Manuel Neuer',      'Allemagne','🇩🇪', 'de', 'Gardien',   1,  'Bayern M.',  'neuer'),
    mkPlayer('18', 401, 'Toni Kroos',        'Allemagne','🇩🇪', 'de', 'Milieu',    8,  'Real Madrid'),
    mkPlayer('18', 402, 'Thomas Müller',     'Allemagne','🇩🇪', 'de', 'Attaquant', 13, 'Bayern M.',  'muller'),
    mkPlayer('18', 403, 'Mesut Özil',        'Allemagne','🇩🇪', 'de', 'Milieu',    10, 'Arsenal'),
    mkPlayer('18', 404, 'Marco Reus',        'Allemagne','🇩🇪', 'de', 'Milieu',    11, 'Dortmund'),
    mkPlayer('18', 405, 'Mats Hummels',      'Allemagne','🇩🇪', 'de', 'Défenseur', 5,  'Bayern M.'),
    mkPlayer('18', 406, 'Jérôme Boateng',    'Allemagne','🇩🇪', 'de', 'Défenseur', 17, 'Bayern M.'),
    // Uruguay (449-498)
    mkBadge('18', 449, 'Uruguay', '🇺🇾', 'uy'),
    mkPlayer('18', 450, 'Luis Suárez',       'Uruguay',  '🇺🇾', 'uy', 'Attaquant', 9,  'Barcelone',  'suarez', true),
    mkPlayer('18', 451, 'Edinson Cavani',    'Uruguay',  '🇺🇾', 'uy', 'Attaquant', 7,  'PSG',        'cavani'),
    mkPlayer('18', 452, 'Diego Godín',       'Uruguay',  '🇺🇾', 'uy', 'Défenseur', 3,  'Atlético'),
    // Russie (499-530)
    mkBadge('18', 499, 'Russie', '🇷🇺', 'ru'),
    mkPlayer('18', 500, 'Igor Akinfeev',     'Russie',   '🇷🇺', 'ru', 'Gardien',   1,  'CSKA Moscou'),
    mkPlayer('18', 501, 'Denis Cheryshev',   'Russie',   '🇷🇺', 'ru', 'Milieu',    6,  'Valencia', undefined, true),
    mkPlayer('18', 502, 'Artem Dzyuba',      'Russie',   '🇷🇺', 'ru', 'Attaquant', 22, 'Zenit'),
  ],

  // ── 2022 Qatar ────────────────────────────────────────────────────────────
  '22': [
    // Argentine (1-55)
    mkBadge('22', 1, 'Argentine', '🇦🇷', 'ar'),
    mkPlayer('22', 2,  'Lionel Messi',       'Argentine','🇦🇷', 'ar', 'Attaquant', 10, 'PSG',        'messi', true),
    mkPlayer('22', 3,  'Ángel Di María',     'Argentine','🇦🇷', 'ar', 'Milieu',    11, 'Juventus'),
    mkPlayer('22', 4,  'Julián Álvarez',     'Argentine','🇦🇷', 'ar', 'Attaquant', 9,  'Man City'),
    mkPlayer('22', 5,  'Paulo Dybala',       'Argentine','🇦🇷', 'ar', 'Attaquant', 21, 'Roma'),
    mkPlayer('22', 6,  'Rodrigo De Paul',    'Argentine','🇦🇷', 'ar', 'Milieu',    7,  'Atlético'),
    mkPlayer('22', 7,  'Emiliano Martínez',  'Argentine','🇦🇷', 'ar', 'Gardien',   23, 'Aston Villa'),
    mkPlayer('22', 8,  'Nicolás Otamendi',   'Argentine','🇦🇷', 'ar', 'Défenseur', 19, 'Benfica'),
    mkPlayer('22', 9,  'Leandro Paredes',    'Argentine','🇦🇷', 'ar', 'Milieu',    5,  'Juventus'),
    mkPlayer('22', 10, 'Enzo Fernández',     'Argentine','🇦🇷', 'ar', 'Milieu',    24, 'Benfica'),
    mkPlayer('22', 11, 'Alexis Mac Allister','Argentine','🇦🇷', 'ar', 'Milieu',    20, 'Brighton'),
    // France (56-110)
    mkBadge('22', 56, 'France', '🇫🇷', 'fr'),
    mkPlayer('22', 57, 'Kylian Mbappé',      'France',   '🇫🇷', 'fr', 'Attaquant', 10, 'PSG',        'mbappe', true),
    mkPlayer('22', 58, 'Antoine Griezmann',  'France',   '🇫🇷', 'fr', 'Attaquant', 7,  'Atlético',   'griezmann'),
    mkPlayer('22', 59, 'Olivier Giroud',     'France',   '🇫🇷', 'fr', 'Attaquant', 9,  'AC Milan'),
    mkPlayer('22', 60, 'Ousmane Dembélé',    'France',   '🇫🇷', 'fr', 'Milieu',    11, 'PSG'),
    mkPlayer('22', 61, 'Raphaël Varane',     'France',   '🇫🇷', 'fr', 'Défenseur', 4,  'Man Utd'),
    mkPlayer('22', 62, 'Aurélien Tchouaméni','France',   '🇫🇷', 'fr', 'Milieu',    8,  'Real Madrid'),
    mkPlayer('22', 63, 'Jules Koundé',       'France',   '🇫🇷', 'fr', 'Défenseur', 5,  'Barcelone'),
    mkPlayer('22', 64, 'Dayot Upamecano',    'France',   '🇫🇷', 'fr', 'Défenseur', 15, 'Bayern M.'),
    mkPlayer('22', 65, 'Adrien Rabiot',      'France',   '🇫🇷', 'fr', 'Milieu',    14, 'Juventus'),
    mkPlayer('22', 66, 'Hugo Lloris',        'France',   '🇫🇷', 'fr', 'Gardien',   1,  'Tottenham'),
    // Croatie (111-160)
    mkBadge('22', 111, 'Croatie', '🇭🇷', 'cr'),
    mkPlayer('22', 112, 'Luka Modrić',       'Croatie',  '🇭🇷', 'cr', 'Milieu',    10, 'Real Madrid','modric', true),
    mkPlayer('22', 113, 'Ivan Perišić',      'Croatie',  '🇭🇷', 'cr', 'Milieu',    4,  'Tottenham'),
    mkPlayer('22', 114, 'Marcelo Brozović',  'Croatie',  '🇭🇷', 'cr', 'Milieu',    11, 'Inter Milan'),
    mkPlayer('22', 115, 'Lovro Majer',       'Croatie',  '🇭🇷', 'cr', 'Milieu',    7,  'Rennes'),
    mkPlayer('22', 116, 'Mateo Kovačić',     'Croatie',  '🇭🇷', 'cr', 'Milieu',    8,  'Man City'),
    mkPlayer('22', 117, 'Dejan Lovren',      'Croatie',  '🇭🇷', 'cr', 'Défenseur', 6,  'Zenit'),
    mkPlayer('22', 118, 'Dominik Livaković', 'Croatie',  '🇭🇷', 'cr', 'Gardien',   1,  'Dinamo Zagreb'),
    // Maroc (161-210)
    mkBadge('22', 161, 'Maroc', '🇲🇦', 'ma'),
    mkPlayer('22', 162, 'Achraf Hakimi',     'Maroc',    '🇲🇦', 'ma', 'Défenseur', 2,  'PSG',        'hakimi', true),
    mkPlayer('22', 163, 'Hakim Ziyech',      'Maroc',    '🇲🇦', 'ma', 'Milieu',    7,  'Chelsea'),
    mkPlayer('22', 164, 'Youssef En-Nesyri', 'Maroc',    '🇲🇦', 'ma', 'Attaquant', 19, 'Séville'),
    mkPlayer('22', 165, 'Sofyan Amrabat',    'Maroc',    '🇲🇦', 'ma', 'Milieu',    4,  'Fiorentina'),
    mkPlayer('22', 166, 'Noussair Mazraoui', 'Maroc',    '🇲🇦', 'ma', 'Défenseur', 12, 'Ajax'),
    mkPlayer('22', 167, 'Yassine Bounou',    'Maroc',    '🇲🇦', 'ma', 'Gardien',   1,  'Séville'),
    mkPlayer('22', 168, 'Sofiane Boufal',    'Maroc',    '🇲🇦', 'ma', 'Milieu',    10, 'Angers'),
    // Portugal (211-260)
    mkBadge('22', 211, 'Portugal', '🇵🇹', 'pt'),
    mkPlayer('22', 212, 'Cristiano Ronaldo', 'Portugal', '🇵🇹', 'pt', 'Attaquant', 7,  'Man Utd',    'cr7', true),
    mkPlayer('22', 213, 'Bruno Fernandes',   'Portugal', '🇵🇹', 'pt', 'Milieu',    8,  'Man Utd'),
    mkPlayer('22', 214, 'João Félix',        'Portugal', '🇵🇹', 'pt', 'Attaquant', 11, 'Atlético'),
    mkPlayer('22', 216, 'Bernardo Silva',    'Portugal', '🇵🇹', 'pt', 'Milieu',    20, 'Man City'),
    mkPlayer('22', 217, 'Rúben Neves',       'Portugal', '🇵🇹', 'pt', 'Milieu',    8,  'Wolverhampton'),
    mkPlayer('22', 218, 'Rafael Leão',       'Portugal', '🇵🇹', 'pt', 'Attaquant', 17, 'AC Milan'),
    // Angleterre (261-310)
    mkBadge('22', 261, 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en'),
    mkPlayer('22', 262, 'Harry Kane',        'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Attaquant', 9,  'Tottenham', 'kane', true),
    mkPlayer('22', 263, 'Jude Bellingham',   'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Milieu',   22,  'Dortmund',  'bellingham', true),
    mkPlayer('22', 264, 'Phil Foden',        'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Milieu',   47,  'Man City',  'foden'),
    mkPlayer('22', 265, 'Bukayo Saka',       'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Milieu',   7,   'Arsenal'),
    mkPlayer('22', 266, 'Raheem Sterling',   'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Attaquant',10,  'Chelsea'),
    mkPlayer('22', 267, 'Jordan Pickford',   'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Gardien',  1,   'Everton'),
    mkPlayer('22', 268, 'Mason Mount',       'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Milieu',   19,  'Chelsea'),
    mkPlayer('22', 269, 'Marcus Rashford',   'Angleterre','🏴󠁧󠁢󠁥󠁮󠁧󠁿','en', 'Attaquant',11,  'Man Utd'),
    // Brésil (311-360)
    mkBadge('22', 311, 'Brésil', '🇧🇷', 'br'),
    mkPlayer('22', 312, 'Neymar Jr',         'Brésil',   '🇧🇷', 'br', 'Attaquant', 10, 'PSG',        'neymar', true),
    mkPlayer('22', 313, 'Vinícius Jr',       'Brésil',   '🇧🇷', 'br', 'Attaquant', 20, 'Real Madrid','vini', true),
    mkPlayer('22', 314, 'Rodrygo',           'Brésil',   '🇧🇷', 'br', 'Attaquant', 11, 'Real Madrid'),
    mkPlayer('22', 315, 'Richarlison',       'Brésil',   '🇧🇷', 'br', 'Attaquant', 9,  'Tottenham'),
    mkPlayer('22', 316, 'Lucas Paquetá',     'Brésil',   '🇧🇷', 'br', 'Milieu',    10, 'Lyon'),
    mkPlayer('22', 317, 'Casemiro',          'Brésil',   '🇧🇷', 'br', 'Milieu',    5,  'Man Utd'),
    mkPlayer('22', 318, 'Alisson',           'Brésil',   '🇧🇷', 'br', 'Gardien',   1,  'Liverpool'),
    mkPlayer('22', 319, 'Thiago Silva',      'Brésil',   '🇧🇷', 'br', 'Défenseur', 3,  'Chelsea'),
    mkPlayer('22', 320, 'Éder Militão',      'Brésil',   '🇧🇷', 'br', 'Défenseur', 4,  'Real Madrid'),
    // Pays-Bas (361-410)
    mkBadge('22', 361, 'Pays-Bas', '🇳🇱', 'nl'),
    mkPlayer('22', 362, 'Virgil van Dijk',   'Pays-Bas', '🇳🇱', 'nl', 'Défenseur', 4,  'Liverpool',  'vandijk', true),
    mkPlayer('22', 363, 'Memphis Depay',     'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 10, 'Barcelone'),
    mkPlayer('22', 364, 'Cody Gakpo',        'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 11, 'PSV'),
    mkPlayer('22', 365, 'Frenkie de Jong',   'Pays-Bas', '🇳🇱', 'nl', 'Milieu',    21, 'Barcelone'),
    mkPlayer('22', 366, 'Daley Blind',       'Pays-Bas', '🇳🇱', 'nl', 'Défenseur', 17, 'Ajax'),
    mkPlayer('22', 367, 'Andries Noppert',   'Pays-Bas', '🇳🇱', 'nl', 'Gardien',   1,  'Heerenveen'),
    // Espagne (411-460)
    mkBadge('22', 411, 'Espagne', '🇪🇸', 'es'),
    mkPlayer('22', 412, 'Pedri',             'Espagne',  '🇪🇸', 'es', 'Milieu',    26, 'Barcelone', 'pedri', true),
    mkPlayer('22', 413, 'Gavi',              'Espagne',  '🇪🇸', 'es', 'Milieu',    9,  'Barcelone', 'gavi', true),
    mkPlayer('22', 414, 'Ferran Torres',     'Espagne',  '🇪🇸', 'es', 'Attaquant', 11, 'Barcelone'),
    mkPlayer('22', 415, 'Dani Olmo',         'Espagne',  '🇪🇸', 'es', 'Milieu',    7,  'Leipzig'),
    mkPlayer('22', 416, 'Álvaro Morata',     'Espagne',  '🇪🇸', 'es', 'Attaquant', 9,  'Atlético'),
    mkPlayer('22', 417, 'Unai Simón',        'Espagne',  '🇪🇸', 'es', 'Gardien',   1,  'Athletic Bilbao'),
    mkPlayer('22', 418, 'Rodri',             'Espagne',  '🇪🇸', 'es', 'Milieu',    16, 'Man City'),
    // Sénégal (461-490)
    mkBadge('22', 461, 'Sénégal', '🇸🇳', 'sn'),
    mkPlayer('22', 463, 'Édouard Mendy',     'Sénégal',  '🇸🇳', 'sn', 'Gardien',   1,  'Chelsea'),
    mkPlayer('22', 464, 'Kalidou Koulibaly', 'Sénégal',  '🇸🇳', 'sn', 'Défenseur', 3,  'Napoli'),
    // Équateur (491-510)
    mkBadge('22', 491, 'Équateur', '🇪🇨', 'ec'),
    mkPlayer('22', 492, 'Enner Valencia',    'Équateur', '🇪🇨', 'ec', 'Attaquant', 13, 'Fenerbahçe'),
    mkPlayer('22', 493, 'Piero Hincapié',    'Équateur', '🇪🇨', 'ec', 'Défenseur', 16, 'Leverkusen'),
    // Danemark (511-540)
    mkBadge('22', 511, 'Danemark', '🇩🇰', 'dk'),
    mkPlayer('22', 512, 'Christian Eriksen', 'Danemark', '🇩🇰', 'dk', 'Milieu',    10, 'Man Utd'),
    mkPlayer('22', 513, 'Pierre-Emile Højbjerg','Danemark','🇩🇰','dk','Milieu',   23, 'Tottenham'),
    // Suisse (541-560)
    mkBadge('22', 541, 'Suisse', '🇨🇭', 'ch'),
    mkPlayer('22', 542, 'Granit Xhaka',      'Suisse',   '🇨🇭', 'ch', 'Milieu',    10, 'Arsenal'),
    mkPlayer('22', 543, 'Xherdan Shaqiri',   'Suisse',   '🇨🇭', 'ch', 'Milieu',    23, 'Chicago Fire'),
    // Allemagne (561-610)
    mkBadge('22', 561, 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('22', 562, 'Jamal Musiala',     'Allemagne','🇩🇪', 'de', 'Milieu',    14, 'Bayern M.',  'musiala', true),
    mkPlayer('22', 563, 'Kai Havertz',       'Allemagne','🇩🇪', 'de', 'Milieu',    19, 'Chelsea'),
    mkPlayer('22', 564, 'Serge Gnabry',      'Allemagne','🇩🇪', 'de', 'Milieu',    20, 'Bayern M.'),
    mkPlayer('22', 565, 'Thomas Müller',     'Allemagne','🇩🇪', 'de', 'Attaquant', 13, 'Bayern M.',  'muller'),
    mkPlayer('22', 566, 'Manuel Neuer',      'Allemagne','🇩🇪', 'de', 'Gardien',   1,  'Bayern M.',  'neuer'),
    mkPlayer('22', 567, 'Joshua Kimmich',    'Allemagne','🇩🇪', 'de', 'Milieu',    6,  'Bayern M.'),
    // Cameroun (611-630)
    mkBadge('22', 611, 'Cameroun', '🇨🇲', 'cm'),
    mkPlayer('22', 612, 'Vincent Aboubakar', 'Cameroun', '🇨🇲', 'cm', 'Attaquant', 10, 'Al-Nassr'),
    mkPlayer('22', 613, 'André Onana',       'Cameroun', '🇨🇲', 'cm', 'Gardien',   1,  'Inter Milan'),
    // Qatar (631-670) - Hôte
    mkBadge('22', 631, 'Qatar', '🇶🇦', 'qa'),
    mkPlayer('22', 632, 'Akram Afif',        'Qatar',    '🇶🇦', 'qa', 'Milieu',    11, 'Al-Sadd'),
    mkPlayer('22', 633, 'Almoez Ali',        'Qatar',    '🇶🇦', 'qa', 'Attaquant', 19, 'Al-Duhail'),
  ],

  // ── 2026 USA/Canada/Mexique ───────────────────────────────────────────────────
  '26': withSequentialNumbers([
    // ── Stickers spéciaux FWC ──
    mkSpecial('26', '00', 'Panini Logo', 'logo', 'We Are Panini', '🌎', 'us'),
    mkSpecial('26', 'FWC1', 'Official Emblem 1', 'special', 'FIFA World Cup 2026', '🌎', 'us'),
    mkSpecial('26', 'FWC2', 'Official Emblem 2', 'special', 'FIFA World Cup 2026', '🌎', 'us'),
    mkSpecial('26', 'FWC3', 'Official Mascots', 'special', 'FIFA World Cup 2026', '🌎', 'us'),
    mkSpecial('26', 'FWC4', 'Official Slogan', 'special', 'FIFA World Cup 2026', '🌎', 'us'),
    mkSpecial('26', 'FWC5', 'Official Ball', 'special', 'FIFA World Cup 2026', '🌎', 'us'),
    mkSpecial('26', 'FWC6', 'Canada Host Cities', 'special', 'Host Countries and Cities', '🌎', 'us'),
    mkSpecial('26', 'FWC7', 'Mexico Host Cities', 'special', 'Host Countries and Cities', '🌎', 'us'),
    mkSpecial('26', 'FWC8', 'USA Host Cities', 'special', 'Host Countries and Cities', '🌎', 'us'),

    // ── Mexique ──
    mkBadge('26', 'MEX1', 'Mexique', '🇲🇽', 'mx'),
    mkPlayer('26', 'MEX2', 'Luis Malagón', 'Mexique', '🇲🇽', 'mx', 'Gardien', 1, 'Club América'),
    mkPlayer('26', 'MEX3', 'Johan Vásquez', 'Mexique', '🇲🇽', 'mx', 'Défenseur', 5, 'Genoa'),
    mkPlayer('26', 'MEX4', 'Jorge Sánchez', 'Mexique', '🇲🇽', 'mx', 'Défenseur', 19, 'Cruz Azul'),
    mkPlayer('26', 'MEX5', 'César Montes', 'Mexique', '🇲🇽', 'mx', 'Défenseur', 3, 'Lokomotiv Moscou'),
    mkPlayer('26', 'MEX6', 'Jesús Gallardo', 'Mexique', '🇲🇽', 'mx', 'Défenseur', 17, 'Toluca'),
    mkPlayer('26', 'MEX7', 'Israel Reyes', 'Mexique', '🇲🇽', 'mx', 'Défenseur', 4, 'Club América'),
    mkPlayer('26', 'MEX8', 'Diego Lainez', 'Mexique', '🇲🇽', 'mx', 'Milieu', 10, 'Tigres UANL'),
    mkPlayer('26', 'MEX9', 'Carlos Rodríguez', 'Mexique', '🇲🇽', 'mx', 'Milieu', 8, 'Cruz Azul'),
    mkPlayer('26', 'MEX10', 'Edson Álvarez', 'Mexique', '🇲🇽', 'mx', 'Milieu', 4, 'West Ham United'),
    mkPlayer('26', 'MEX11', 'Orbelín Pineda', 'Mexique', '🇲🇽', 'mx', 'Milieu', 17, 'AEK Athènes'),
    mkPlayer('26', 'MEX12', 'Marcel Ruiz', 'Mexique', '🇲🇽', 'mx', 'Milieu', 14, 'Toluca'),
    mkSpecial('26', 'MEX13', 'Photo Mexique', 'special', 'Mexique', '🇲🇽', 'mx'), // Plus de poste "Gardien" ici !
    mkPlayer('26', 'MEX14', 'Érick Sánchez', 'Mexique', '🇲🇽', 'mx', 'Milieu', 14, 'Club América'),
    mkPlayer('26', 'MEX15', 'Hirving Lozano', 'Mexique', '🇲🇽', 'mx', 'Attaquant', 22, 'San Diego FC'),
    mkPlayer('26', 'MEX16', 'Santiago Giménez', 'Mexique', '🇲🇽', 'mx', 'Attaquant', 11, 'Feyenoord'),
    mkPlayer('26', 'MEX17', 'Raúl Jiménez', 'Mexique', '🇲🇽', 'mx', 'Attaquant', 9, 'Fulham'),
    mkPlayer('26', 'MEX18', 'Alexis Vega', 'Mexique', '🇲🇽', 'mx', 'Attaquant', 10, 'Toluca'),
    mkPlayer('26', 'MEX19', 'Roberto Alvarado', 'Mexique', '🇲🇽', 'mx', 'Attaquant', 25, 'Guadalajara'),
    mkPlayer('26', 'MEX20', 'César Huerta', 'Mexique', '🇲🇽', 'mx', 'Attaquant', 21, 'Pumas UNAM'),
    // ── Afrique du Sud ──
    mkBadge('26', 'RSA1', 'Afrique du Sud', '🇿🇦', 'za'),
    mkPlayer('26', 'RSA2', 'Ronwen Williams', 'Afrique du Sud', '🇿🇦', 'za', 'Gardien', 1, 'Mamelodi Sundowns'),
    mkPlayer('26', 'RSA3', 'Sipho Chaine', 'Afrique du Sud', '🇿🇦', 'za', 'Gardien', 22, 'Orlando Pirates'),
    mkPlayer('26', 'RSA4', 'Aubrey Modiba', 'Afrique du Sud', '🇿🇦', 'za', 'Défenseur', 7, 'Mamelodi Sundowns'),
    mkPlayer('26', 'RSA5', 'Samukele Kabini', 'Afrique du Sud', '🇿🇦', 'za', 'Défenseur', 3, 'Orlando Pirates'),
    mkPlayer('26', 'RSA6', 'Mbekezeli Mbokazi', 'Afrique du Sud', '🇿🇦', 'za', 'Défenseur', 2, 'Orlando Pirates'),
    mkPlayer('26', 'RSA7', 'Khulumani Ndamane', 'Afrique du Sud', '🇿🇦', 'za', 'Défenseur', 19, 'Kaizer Chiefs'),
    mkPlayer('26', 'RSA8', 'Siyabonga Ngezana', 'Afrique du Sud', '🇿🇦', 'za', 'Défenseur', 3, 'FCSB'),
    mkPlayer('26', 'RSA9', 'Khuliso Mudau', 'Afrique du Sud', '🇿🇦', 'za', 'Défenseur', 2, 'Mamelodi Sundowns'),
    mkPlayer('26', 'RSA10', 'Nkosinathi Sibisi', 'Afrique du Sud', '🇿🇦', 'za', 'Défenseur', 5, 'Orlando Pirates'),
    mkPlayer('26', 'RSA11', 'Teboho Mokoena', 'Afrique du Sud', '🇿🇦', 'za', 'Milieu', 4, 'Mamelodi Sundowns'),
    mkPlayer('26', 'RSA12', 'Thalente Mbatha', 'Afrique du Sud', '🇿🇦', 'za', 'Milieu', 16, 'Orlando Pirates'),
    mkSpecial('26', 'RSA13', 'Photo Afrique du Sud', 'special', 'Afrique du Sud', '🇿🇦', 'za'),
    mkPlayer('26', 'RSA14', 'Bathusi Aubaas', 'Afrique du Sud', '🇿🇦', 'za', 'Milieu', 15, 'Mamelodi Sundowns'),
    mkPlayer('26', 'RSA15', 'Yaya Sithole', 'Afrique du Sud', '🇿🇦', 'za', 'Milieu', 13, 'Gil Vicente'),
    mkPlayer('26', 'RSA16', 'Sipho Mbule', 'Afrique du Sud', '🇿🇦', 'za', 'Milieu', 10, 'Sekhukhune United'),
    mkPlayer('26', 'RSA17', 'Lyle Foster', 'Afrique du Sud', '🇿🇦', 'za', 'Attaquant', 9, 'Burnley'),
    mkPlayer('26', 'RSA18', 'Iqraam Rayners', 'Afrique du Sud', '🇿🇦', 'za', 'Attaquant', 11, 'Mamelodi Sundowns'),
    mkPlayer('26', 'RSA19', 'Mohau Nkota', 'Afrique du Sud', '🇿🇦', 'za', 'Attaquant', 23, 'Orlando Pirates'),
    mkPlayer('26', 'RSA20', 'Oswin Appollis', 'Afrique du Sud', '🇿🇦', 'za', 'Attaquant', 17, 'Polokwane City'),
    // ── Corée du Sud ──
    mkBadge('26', 'KOR1', 'Corée du Sud', '🇰🇷', 'kr'),
    mkPlayer('26', 'KOR2', 'Hyeonwoo Jo', 'Corée du Sud', '🇰🇷', 'kr', 'Gardien', 21, 'Ulsan HD'),
    mkPlayer('26', 'KOR3', 'Seunggyu Kim', 'Corée du Sud', '🇰🇷', 'kr', 'Gardien', 1, 'Al-Shabab'),
    mkPlayer('26', 'KOR4', 'Minjae Kim', 'Corée du Sud', '🇰🇷', 'kr', 'Défenseur', 4, 'Bayern Munich'),
    mkPlayer('26', 'KOR5', 'Yumin Cho', 'Corée du Sud', '🇰🇷', 'kr', 'Défenseur', 20, 'Sharjah FC'),
    mkPlayer('26', 'KOR6', 'Youngwoo Seol', 'Corée du Sud', '🇰🇷', 'kr', 'Défenseur', 22, 'Étoile Rouge de Belgrade'),
    mkPlayer('26', 'KOR7', 'Hanbeom Lee', 'Corée du Sud', '🇰🇷', 'kr', 'Défenseur', 2, 'FC Midtjylland'),
    mkPlayer('26', 'KOR8', 'Taeseok Lee', 'Corée du Sud', '🇰🇷', 'kr', 'Défenseur', 13, 'Pohang Steelers'),
    mkPlayer('26', 'KOR9', 'Myungjae Lee', 'Corée du Sud', '🇰🇷', 'kr', 'Défenseur', 23, 'Ulsan HD'),
    mkPlayer('26', 'KOR10', 'Jaesung Lee', 'Corée du Sud', '🇰🇷', 'kr', 'Milieu', 10, 'Mayence 05'),
    mkPlayer('26', 'KOR11', 'Inbeom Hwang', 'Corée du Sud', '🇰🇷', 'kr', 'Milieu', 6, 'Feyenoord'),
    mkPlayer('26', 'KOR12', 'Kangin Lee', 'Corée du Sud', '🇰🇷', 'kr', 'Milieu', 18, 'Paris Saint-Germain'),
    mkSpecial('26', 'KOR13', 'Photo Corée du Sud', 'special', 'Corée du Sud', '🇰🇷', 'kr'),
    mkPlayer('26', 'KOR14', 'Seungho Paik', 'Corée du Sud', '🇰🇷', 'kr', 'Milieu', 8, 'Birmingham City'),
    mkPlayer('26', 'KOR15', 'Jens Castrop', 'Corée du Sud', '🇰🇷', 'kr', 'Milieu', 15, 'FC Nuremberg'),
    mkPlayer('26', 'KOR16', 'Donggyeong Lee', 'Corée du Sud', '🇰🇷', 'kr', 'Milieu', 25, 'Suwon FC'),
    mkPlayer('26', 'KOR17', 'Guesung Cho', 'Corée du Sud', '🇰🇷', 'kr', 'Attaquant', 9, 'FC Midtjylland'),
    mkPlayer('26', 'KOR18', 'Heungmin Son', 'Corée du Sud', '🇰🇷', 'kr', 'Attaquant', 7, 'Tottenham Hotspur', 'son'),
    mkPlayer('26', 'KOR19', 'Heechan Hwang', 'Corée du Sud', '🇰🇷', 'kr', 'Attaquant', 11, 'Wolverhampton'),
    mkPlayer('26', 'KOR20', 'Hyeongyu Oh', 'Corée du Sud', '🇰🇷', 'kr', 'Attaquant', 19, 'KRC Genk'),
    // ── Tchéquie ──
    mkBadge('26', 'CZE1', 'Tchéquie', '🇨🇿', 'cs'),
    mkPlayer('26', 'CZE2', 'Matej Kovar', 'Tchéquie', '🇨🇿', 'cs', 'Gardien', 1, 'Bayer Leverkusen'),
    mkPlayer('26', 'CZE3', 'Jindrich Stanek', 'Tchéquie', '🇨🇿', 'cs', 'Gardien', 16, 'Slavia Prague'),
    mkPlayer('26', 'CZE4', 'Ladislav Krejci', 'Tchéquie', '🇨🇿', 'cs', 'Défenseur', 4, 'Gérone FC'),
    mkPlayer('26', 'CZE5', 'Vladimir Coufal', 'Tchéquie', '🇨🇿', 'cs', 'Défenseur', 5, 'West Ham United'),
    mkPlayer('26', 'CZE6', 'Jaroslav Zeleny', 'Tchéquie', '🇨🇿', 'cs', 'Défenseur', 22, 'Sparta Prague'),
    mkPlayer('26', 'CZE7', 'Tomas Holes', 'Tchéquie', '🇨🇿', 'cs', 'Défenseur', 3, 'Slavia Prague'),
    mkPlayer('26', 'CZE8', 'David Zima', 'Tchéquie', '🇨🇿', 'cs', 'Défenseur', 2, 'Slavia Prague'),
    mkPlayer('26', 'CZE9', 'Michal Sadilek', 'Tchéquie', '🇨🇿', 'cs', 'Milieu', 21, 'FC Twente'),
    mkPlayer('26', 'CZE10', 'Lukas Provod', 'Tchéquie', '🇨🇿', 'cs', 'Milieu', 14, 'Slavia Prague'),
    mkPlayer('26', 'CZE11', 'Lukas Cerv', 'Tchéquie', '🇨🇿', 'cs', 'Milieu', 6, 'Viktoria Plzen'),
    mkPlayer('26', 'CZE12', 'Tomas Soucek', 'Tchéquie', '🇨🇿', 'cs', 'Milieu', 22, 'West Ham United'),
    mkSpecial('26', 'CZE13', 'Photo Tchéquie', 'special', 'Tchéquie', '🇨🇿', 'cs'),
    mkPlayer('26', 'CZE14', 'Pavel Sulc', 'Tchéquie', '🇨🇿', 'cs', 'Milieu', 18, 'Viktoria Plzen'),
    mkPlayer('26', 'CZE15', 'Matej Vydra', 'Tchéquie', '🇨🇿', 'cs', 'Attaquant', 20, 'Viktoria Plzen'),
    mkPlayer('26', 'CZE16', 'Vasil Kusej', 'Tchéquie', '🇨🇿', 'cs', 'Attaquant', 17, 'Mlada Boleslav'),
    mkPlayer('26', 'CZE17', 'Tomas Chory', 'Tchéquie', '🇨🇿', 'cs', 'Attaquant', 19, 'Slavia Prague'),
    mkPlayer('26', 'CZE18', 'Vaclav Cerny', 'Tchéquie', '🇨🇿', 'cs', 'Attaquant', 7, 'Rangers FC'),
    mkPlayer('26', 'CZE19', 'Adam Hlozek', 'Tchéquie', '🇨🇿', 'cs', 'Attaquant', 9, 'TSG Hoffenheim'),
    mkPlayer('26', 'CZE20', 'Patrik Schick', 'Tchéquie', '🇨🇿', 'cs', 'Attaquant', 10, 'Bayer Leverkusen'),
mkBadge('26', 'CAN1', 'Canada', '🇨🇦', 'ca'),
    mkPlayer('26', 'CAN2', 'Dayne St. Clair', 'Canada', '🇨🇦', 'ca', 'Gardien', 1, 'Minnesota United'),
    mkPlayer('26', 'CAN3', 'Alphonso Davies', 'Canada', '🇨🇦', 'ca', 'Défenseur', 19, 'Bayern Munich', 'davies'),
    mkPlayer('26', 'CAN4', 'Alistair Johnston', 'Canada', '🇨🇦', 'ca', 'Défenseur', 2, 'Celtic Glasgow'),
    mkPlayer('26', 'CAN5', 'Samuel Adekugbe', 'Canada', '🇨🇦', 'ca', 'Défenseur', 3, 'Vancouver Whitecaps'),
    mkPlayer('26', 'CAN6', 'Richie Laryea', 'Canada', '🇨🇦', 'ca', 'Défenseur', 22, 'Toronto FC'),
    mkPlayer('26', 'CAN7', 'Derek Cornelius', 'Canada', '🇨🇦', 'ca', 'Défenseur', 13, 'Olympique de Marseille'),
    mkPlayer('26', 'CAN8', 'Moïse Bombito', 'Canada', '🇨🇦', 'ca', 'Défenseur', 15, 'OGC Nice'),
    mkPlayer('26', 'CAN9', 'Kamal Miller', 'Canada', '🇨🇦', 'ca', 'Défenseur', 4, 'Portland Timbers'),
    mkPlayer('26', 'CAN10', 'Stephen Eustáquio', 'Canada', '🇨🇦', 'ca', 'Milieu', 7, 'FC Porto'),
    mkPlayer('26', 'CAN11', 'Ismaël Koné', 'Canada', '🇨🇦', 'ca', 'Milieu', 8, 'Olympique de Marseille'),
    mkPlayer('26', 'CAN12', 'Jonathan Osorio', 'Canada', '🇨🇦', 'ca', 'Milieu', 21, 'Toronto FC'),
    mkSpecial('26', 'CAN13', 'Photo Canada', 'special', 'Canada', '🇨🇦', 'ca'),
    mkPlayer('26', 'CAN14', 'Jacob Shaffelburg', 'Canada', '🇨🇦', 'ca', 'Milieu', 14, 'Nashville SC'),
    mkPlayer('26', 'CAN15', 'Mathieu Choinière', 'Canada', '🇨🇦', 'ca', 'Milieu', 29, 'Grasshopper Zurich'),
    mkPlayer('26', 'CAN16', 'Niko Sigur', 'Canada', '🇨🇦', 'ca', 'Milieu', 24, 'Hajduk Split'),
    mkPlayer('26', 'CAN17', 'Tajon Buchanan', 'Canada', '🇨🇦', 'ca', 'Milieu', 17, 'Inter Milan'),
    mkPlayer('26', 'CAN18', 'Liam Millar', 'Canada', '🇨🇦', 'ca', 'Milieu', 11, 'Hull City'),
    mkPlayer('26', 'CAN19', 'Cyle Larin', 'Canada', '🇨🇦', 'ca', 'Attaquant', 9, 'Majorque'),
    mkPlayer('26', 'CAN20', 'Jonathan David', 'Canada', '🇨🇦', 'ca', 'Attaquant', 10, 'Lille OSC'),
// ── Bosnia and Herzegovina ──
    mkBadge('26', 'BIH1', 'Bosnie-Herzégovine', '🇧🇦', 'ba'),
    mkPlayer('26', 'BIH2', 'Nikola Vasilj', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Gardien', 1, 'Sankt Pauli'),
    mkPlayer('26', 'BIH3', 'Amar Dedić', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Défenseur', 2, 'Red Bull Salzbourg'),
    mkPlayer('26', 'BIH4', 'Sead Kolasinac', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Défenseur', 5, 'Atalanta Bergame'),
    mkPlayer('26', 'BIH5', 'Tarik Muharemovic', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Défenseur', 3, 'Sassuolo'),
    mkPlayer('26', 'BIH6', 'Nihad Mujakic', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Défenseur', 16, 'Partizan Belgrade'),
    mkPlayer('26', 'BIH7', 'Nikola Katic', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Défenseur', 4, 'FC Zürich'),
    mkPlayer('26', 'BIH8', 'Amir Hadziahmetovic', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Milieu', 21, 'Çaykur Rizespor'),
    mkPlayer('26', 'BIH9', 'Benjamin Tahirovic', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Milieu', 8, 'Ajax Amsterdam'),
    mkPlayer('26', 'BIH10', 'Armin Gigovic', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Milieu', 18, 'Holstein Kiel'),
    mkPlayer('26', 'BIH11', 'Ivan Sunjic', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Milieu', 17, 'Paphos FC'),
    mkPlayer('26', 'BIH12', 'Ivan Basic', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Milieu', 10, 'Orenbourg'),
    mkSpecial('26', 'BIH13', 'Photo Bosnie-Herzégovine', 'special', 'Bosnie-Herzégovine', '🇧🇦', 'ba'),
    mkPlayer('26', 'BIH14', 'Dzenis Burnic', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Milieu', 7, 'Karlsruher SC'),
    mkPlayer('26', 'BIH15', 'Esmir Bajraktarevic', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Attaquant', 14, 'New England Revolution'),
    mkPlayer('26', 'BIH16', 'Amar Memic', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Milieu', 23, 'Bravo'),
    mkPlayer('26', 'BIH17', 'Ermedin Demirovic', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Attaquant', 11, 'VfB Stuttgart'),
    mkPlayer('26', 'BIH18', 'Edin Dzeko', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Attaquant', 11, 'Fenerbahçe', 'dzeko'),
    mkPlayer('26', 'BIH19', 'Samed Bazdar', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Attaquant', 19, 'Saragosse'),
    mkPlayer('26', 'BIH20', 'Haris Tabakovic', 'Bosnie-Herzégovine', '🇧🇦', 'ba', 'Attaquant', 9, 'Hoffenheim'),
// ── Qatar ──
    mkBadge('26', 'QAT1', 'Qatar', '🇶🇦', 'qa'),
    mkPlayer('26', 'QAT2', 'Meshaal Barsham', 'Qatar', '🇶🇦', 'qa', 'Gardien', 22, 'Al-Sadd'),
    mkPlayer('26', 'QAT3', 'Sultan Albrake', 'Qatar', '🇶🇦', 'qa', 'Défenseur', 18, 'Al-Duhail'),
    mkPlayer('26', 'QAT4', 'Lucas Mendes', 'Qatar', '🇶🇦', 'qa', 'Défenseur', 3, 'Al-Wakrah'),
    mkPlayer('26', 'QAT5', 'Homam Ahmed', 'Qatar', '🇶🇦', 'qa', 'Défenseur', 14, 'Al-Gharafa'),
    mkPlayer('26', 'QAT6', 'Boualem Khoukhi', 'Qatar', '🇶🇦', 'qa', 'Défenseur', 16, 'Al-Sadd'),
    mkPlayer('26', 'QAT7', 'Pedro Miguel', 'Qatar', '🇶🇦', 'qa', 'Défenseur', 2, 'Al-Sadd'),
    mkPlayer('26', 'QAT8', 'Tarek Salman', 'Qatar', '🇶🇦', 'qa', 'Défenseur', 5, 'Al-Sadd'),
    mkPlayer('26', 'QAT9', 'Mohammed Mannai', 'Qatar', '🇶🇦', 'qa', 'Milieu', 15, 'Al-Markhiya'),
    mkPlayer('26', 'QAT10', 'Karim Boudiaf', 'Qatar', '🇶🇦', 'qa', 'Milieu', 12, 'Al-Duhail'),
    mkPlayer('26', 'QAT11', 'Assim Madibo', 'Qatar', '🇶🇦', 'qa', 'Milieu', 23, 'Al-Gharafa'),
    mkPlayer('26', 'QAT12', 'Hamed Fatehi', 'Qatar', '🇶🇦', 'qa', 'Milieu', 6, 'Al-Arabi'),
    mkSpecial('26', 'QAT13', 'Photo Qatar', 'special', 'Qatar', '🇶🇦', 'qa'),
    mkPlayer('26', 'QAT14', 'Mohammed Waad', 'Qatar', '🇶🇦', 'qa', 'Milieu', 4, 'Al-Sadd'),
    mkPlayer('26', 'QAT15', 'Abdulaziz Hatem', 'Qatar', '🇶🇦', 'qa', 'Milieu', 6, 'Al-Rayyan'),
    mkPlayer('26', 'QAT16', 'Hassan Al-Haydos', 'Qatar', '🇶🇦', 'qa', 'Milieu', 10, 'Al-Sadd'),
    mkPlayer('26', 'QAT17', 'Edmilson Junior', 'Qatar', '🇶🇦', 'qa', 'Attaquant', 7, 'Al-Duhail'),
    mkPlayer('26', 'QAT18', 'Akram Hassan Afif', 'Qatar', '🇶🇦', 'qa', 'Attaquant', 11, 'Al-Sadd'),
    mkPlayer('26', 'QAT19', 'Ahmed Al-Ganehi', 'Qatar', '🇶🇦', 'qa', 'Attaquant', 17, 'Al-Gharafa'),
    mkPlayer('26', 'QAT20', 'Almoez Ali', 'Qatar', '🇶🇦', 'qa', 'Attaquant', 19, 'Al-Duhail'),
    // ── Suisse ──
    mkBadge('26', 'SUI1', 'Suisse', '🇨🇭', 'ch'),
    mkPlayer('26', 'SUI2', 'Gregor Kobel', 'Suisse', '🇨🇭', 'ch', 'Gardien', 1, 'Borussia Dortmund'),
    mkPlayer('26', 'SUI3', 'Yvon Mvogo', 'Suisse', '🇨🇭', 'ch', 'Gardien', 12, 'FC Lorient'),
    mkPlayer('26', 'SUI4', 'Manuel Akanji', 'Suisse', '🇨🇭', 'ch', 'Défenseur', 5, 'Manchester City'),
    mkPlayer('26', 'SUI5', 'Ricardo Rodríguez', 'Suisse', '🇨🇭', 'ch', 'Défenseur', 13, 'Real Betis'),
    mkPlayer('26', 'SUI6', 'Nico Elvedi', 'Suisse', '🇨🇭', 'ch', 'Défenseur', 4, 'Borussia Mönchengladbach'),
    mkPlayer('26', 'SUI7', 'Aurèle Amenda', 'Suisse', '🇨🇭', 'ch', 'Défenseur', 2, 'Eintracht Francfort'),
    mkPlayer('26', 'SUI8', 'Silvan Widmer', 'Suisse', '🇨🇭', 'ch', 'Défenseur', 3, 'Mayence 05'),
    mkPlayer('26', 'SUI9', 'Granit Xhaka', 'Suisse', '🇨🇭', 'ch', 'Milieu', 10, 'Bayer Leverkusen'),
    mkPlayer('26', 'SUI10', 'Denis Zakaria', 'Suisse', '🇨🇭', 'ch', 'Milieu', 6, 'AS Monaco'),
    mkPlayer('26', 'SUI11', 'Remo Freuler', 'Suisse', '🇨🇭', 'ch', 'Milieu', 8, 'Bologne'),
    mkPlayer('26', 'SUI12', 'Fabian Rieder', 'Suisse', '🇨🇭', 'ch', 'Milieu', 26, 'VfB Stuttgart'),
    mkSpecial('26', 'SUI13', 'Photo Suisse', 'special', 'Suisse', '🇨🇭', 'ch'),
    mkPlayer('26', 'SUI14', 'Ardon Jashari', 'Suisse', '🇨🇭', 'ch', 'Milieu', 14, 'Club Bruges'),
    mkPlayer('26', 'SUI15', 'Johan Manzambi', 'Suisse', '🇨🇭', 'ch', 'Milieu', 24, 'Schalke 04'),
    mkPlayer('26', 'SUI16', 'Michel Aebischer', 'Suisse', '🇨🇭', 'ch', 'Milieu', 20, 'Bologne'),
    mkPlayer('26', 'SUI17', 'Breel Embolo', 'Suisse', '🇨🇭', 'ch', 'Attaquant', 7, 'AS Monaco'),
    mkPlayer('26', 'SUI18', 'Ruben Vargas', 'Suisse', '🇨🇭', 'ch', 'Attaquant', 11, 'Augsbourg'),
    mkPlayer('26', 'SUI19', 'Dan Ndoye', 'Suisse', '🇨🇭', 'ch', 'Attaquant', 19, 'Bologne'),
    mkPlayer('26', 'SUI20', 'Zeki Amdouni', 'Suisse', '🇨🇭', 'ch', 'Attaquant', 25, 'Benfica'),
    // ── Brésil ──
    mkBadge('26', 'BRA1', 'Brésil', '🇧🇷', 'br'),
    mkPlayer('26', 'BRA2', 'Alisson', 'Brésil', '🇧🇷', 'br', 'Gardien', 1, 'Liverpool'),
    mkPlayer('26', 'BRA3', 'Bento', 'Brésil', '🇧🇷', 'br', 'Gardien', 12, 'Al-Nassr'),
    mkPlayer('26', 'BRA4', 'Marquinhos', 'Brésil', '🇧🇷', 'br', 'Défenseur', 4, 'Paris Saint-Germain'),
    mkPlayer('26', 'BRA5', 'Éder Militão', 'Brésil', '🇧🇷', 'br', 'Défenseur', 3, 'Real Madrid'),
    mkPlayer('26', 'BRA6', 'Gabriel Magalhães', 'Brésil', '🇧🇷', 'br', 'Défenseur', 14, 'Arsenal'),
    mkPlayer('26', 'BRA7', 'Danilo', 'Brésil', '🇧🇷', 'br', 'Défenseur', 2, 'Juventus'),
    mkPlayer('26', 'BRA8', 'Wesley', 'Brésil', '🇧🇷', 'br', 'Défenseur', 16, 'Flamengo'),
    mkPlayer('26', 'BRA9', 'Lucas Paquetá', 'Brésil', '🇧🇷', 'br', 'Milieu', 8, 'West Ham United'),
    mkPlayer('26', 'BRA10', 'Casemiro', 'Brésil', '🇧🇷', 'br', 'Milieu', 5, 'Manchester United'),
    mkPlayer('26', 'BRA11', 'Bruno Guimarães', 'Brésil', '🇧🇷', 'br', 'Milieu', 17, 'Newcastle'),
    mkPlayer('26', 'BRA12', 'Luiz Henrique', 'Brésil', '🇧🇷', 'br', 'Attaquant', 21, 'Botafogo'),
    mkSpecial('26', 'BRA13', 'Photo Brésil', 'special', 'Brésil', '🇧🇷', 'br'),
    mkPlayer('26', 'BRA14', 'Vinicius Júnior', 'Brésil', '🇧🇷', 'br', 'Attaquant', 7, 'Real Madrid', 'vinicius'),
    mkPlayer('26', 'BRA15', 'Rodrygo', 'Brésil', '🇧🇷', 'br', 'Attaquant', 10, 'Real Madrid'),
    mkPlayer('26', 'BRA16', 'João Pedro', 'Brésil', '🇧🇷', 'br', 'Attaquant', 19, 'Brighton'),
    mkPlayer('26', 'BRA17', 'Matheus Cunha', 'Brésil', '🇧🇷', 'br', 'Attaquant', 9, 'Wolverhampton'),
    mkPlayer('26', 'BRA18', 'Gabriel Martinelli', 'Brésil', '🇧🇷', 'br', 'Attaquant', 22, 'Arsenal'),
    mkPlayer('26', 'BRA19', 'Raphinha', 'Brésil', '🇧🇷', 'br', 'Attaquant', 11, 'FC Barcelone'),
    mkPlayer('26', 'BRA20', 'Estêvão', 'Brésil', '🇧🇷', 'br', 'Attaquant', 20, 'Palmeiras'),
    // ── Maroc ──
    mkBadge('26', 'MAR1', 'Maroc', '🇲🇦', 'ma'),
    mkPlayer('26', 'MAR2', 'Yassine Bounou', 'Maroc', '🇲🇦', 'ma', 'Gardien', 1, 'Al-Hilal'),
    mkPlayer('26', 'MAR3', 'Munir El Kajoui', 'Maroc', '🇲🇦', 'ma', 'Gardien', 12, 'RS Berkane'),
    mkPlayer('26', 'MAR4', 'Achraf Hakimi', 'Maroc', '🇲🇦', 'ma', 'Défenseur', 2, 'Paris Saint-Germain', 'hakimi'),
    mkPlayer('26', 'MAR5', 'Noussair Mazraoui', 'Maroc', '🇲🇦', 'ma', 'Défenseur', 3, 'Manchester United'),
    mkPlayer('26', 'MAR6', 'Nayef Aguerd', 'Maroc', '🇲🇦', 'ma', 'Défenseur', 5, 'Real Sociedad'),
    mkPlayer('26', 'MAR7', 'Romain Saïss', 'Maroc', '🇲🇦', 'ma', 'Défenseur', 6, 'Al-Sadd'),
    mkPlayer('26', 'MAR8', 'Jawad El Yamiq', 'Maroc', '🇲🇦', 'ma', 'Défenseur', 18, 'Al-Wehda'),
    mkPlayer('26', 'MAR9', 'Adam Masina', 'Maroc', '🇲🇦', 'ma', 'Défenseur', 3, 'Torino'),
    mkPlayer('26', 'MAR10', 'Sofyan Amrabat', 'Maroc', '🇲🇦', 'ma', 'Milieu', 4, 'Fenerbahçe'),
    mkPlayer('26', 'MAR11', 'Azzedine Ounahi', 'Maroc', '🇲🇦', 'ma', 'Milieu', 8, 'Panathinaïkos'),
    mkPlayer('26', 'MAR12', 'Eliesse Ben Seghir', 'Maroc', '🇲🇦', 'ma', 'Milieu', 20, 'AS Monaco'),
    mkSpecial('26', 'MAR13', 'Photo Maroc', 'special', 'Maroc', '🇲🇦', 'ma'),
    mkPlayer('26', 'MAR14', 'Bilal El Khannouss', 'Maroc', '🇲🇦', 'ma', 'Milieu', 23, 'Leicester City'),
    mkPlayer('26', 'MAR15', 'Ismael Saibari', 'Maroc', '🇲🇦', 'ma', 'Milieu', 11, 'PSV Eindhoven'),
    mkPlayer('26', 'MAR16', 'Youssef En-Nesyri', 'Maroc', '🇲🇦', 'ma', 'Attaquant', 19, 'Fenerbahçe'),
    mkPlayer('26', 'MAR17', 'Abde Ezzalzouli', 'Maroc', '🇲🇦', 'ma', 'Attaquant', 16, 'Real Betis'),
    mkPlayer('26', 'MAR18', 'Soufiane Rahimi', 'Maroc', '🇲🇦', 'ma', 'Attaquant', 9, 'Al-Ain'),
    mkPlayer('26', 'MAR19', 'Brahim Diaz', 'Maroc', '🇲🇦', 'ma', 'Attaquant', 10, 'Real Madrid'),
    mkPlayer('26', 'MAR20', 'Ayoub El Kaabi', 'Maroc', '🇲🇦', 'ma', 'Attaquant', 14, 'Olympiakos'),
    // ── Haiti ──
    mkBadge('26', 'HAI1', 'Haïti', '🇭🇹', 'ht'),
    mkPlayer('26', 'HAI2', 'Johny Placide', 'Haïti', '🇭🇹', 'ht', 'Gardien', 1, 'Bastia'),
    mkPlayer('26', 'HAI3', 'Carlens Arcus', 'Haïti', '🇭🇹', 'ht', 'Défenseur', 2, 'Angers SCO'),
    mkPlayer('26', 'HAI4', 'Martin Expérience', 'Haïti', '🇭🇹', 'ht', 'Défenseur', 17, 'Nancy'),
    mkPlayer('26', 'HAI5', 'Jean-Kevin Duverne', 'Haïti', '🇭🇹', 'ht', 'Défenseur', 22, 'FC Nantes'),
    mkPlayer('26', 'HAI6', 'Ricardo Adé', 'Haïti', '🇭🇹', 'ht', 'Défenseur', 4, 'LDU Quito'),
    mkPlayer('26', 'HAI7', 'Duke Lacroix', 'Haïti', '🇭🇹', 'ht', 'Défenseur', 3, 'Colorado Springs Switchbacks'),
    mkPlayer('26', 'HAI8', 'Garven Metusala', 'Haïti', '🇭🇹', 'ht', 'Défenseur', 6, 'FC Forge'),
    mkPlayer('26', 'HAI9', 'Hannes Delcroix', 'Haïti', '🇭🇹', 'ht', 'Défenseur', 5, 'Burnley'),
    mkPlayer('26', 'HAI10', 'Leverton Pierre', 'Haïti', '🇭🇹', 'ht', 'Milieu', 19, 'Châteauroux'),
    mkPlayer('26', 'HAI11', 'Danley Jean Jacques', 'Haïti', '🇭🇹', 'ht', 'Milieu', 14, 'Portland Timbers'),
    mkPlayer('26', 'HAI12', 'Jean-Ricner Bellegarde', 'Haïti', '🇭🇹', 'ht', 'Milieu', 8, 'Wolverhampton'),
    mkSpecial('26', 'HAI13', 'Photo Haïti', 'special', 'Haïti', '🇭🇹', 'ht'),
    mkPlayer('26', 'HAI14', 'Christopher Attys', 'Haïti', '🇭🇹', 'ht', 'Milieu', 18, 'Triestina'),
    mkPlayer('26', 'HAI15', 'Derrick Etienne Jr.', 'Haïti', '🇭🇹', 'ht', 'Milieu', 11, 'Toronto FC'),
    mkPlayer('26', 'HAI16', 'Josue Casimir', 'Haïti', '🇭🇹', 'ht', 'Attaquant', 7, 'Le Havre AC'),
    mkPlayer('26', 'HAI17', 'Ruben Providence', 'Haïti', '🇭🇹', 'ht', 'Attaquant', 15, 'Alverca'),
    mkPlayer('26', 'HAI18', 'Duckens Nazon', 'Haïti', '🇭🇹', 'ht', 'Attaquant', 9, 'Kayserispor'),
    mkPlayer('26', 'HAI19', 'Louicius Deedson', 'Haïti', '🇭🇹', 'ht', 'Attaquant', 20, 'OB Odense'),
    mkPlayer('26', 'HAI20', 'Frantzdy Pierrot', 'Haïti', '🇭🇹', 'ht', 'Attaquant', 20, 'AEK Athènes'),
    // ── Écosse ──
    mkBadge('26', 'SCO1', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc'),
    mkPlayer('26', 'SCO2', 'Angus Gunn', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Gardien', 1, 'Norwich City'),
    mkPlayer('26', 'SCO3', 'Jack Hendry', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Défenseur', 13, 'Al-Ettifaq'),
    mkPlayer('26', 'SCO4', 'Kieran Tierney', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Défenseur', 6, 'Arsenal'),
    mkPlayer('26', 'SCO5', 'Aaron Hickey', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Défenseur', 2, 'Brentford'),
    mkPlayer('26', 'SCO6', 'Andrew Robertson', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Défenseur', 3, 'Liverpool'),
    mkPlayer('26', 'SCO7', 'Scott McKenna', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Défenseur', 5, 'Las Palmas'),
    mkPlayer('26', 'SCO8', 'John Souttar', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Défenseur', 15, 'Glasgow Rangers'),
    mkPlayer('26', 'SCO9', 'Anthony Ralston', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Défenseur', 2, 'Celtic Glasgow'),
    mkPlayer('26', 'SCO10', 'Grant Hanley', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Défenseur', 5, 'Norwich City'),
    mkPlayer('26', 'SCO11', 'Scott McTominay', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Milieu', 4, 'Naples'),
    mkPlayer('26', 'SCO12', 'Billy Gilmour', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Milieu', 8, 'Naples'),
    mkSpecial('26', 'SCO13', 'Photo Écosse', 'special', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc'),
    mkPlayer('26', 'SCO14', 'Lewis Ferguson', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Milieu', 18, 'Bologne FC'),
    mkPlayer('26', 'SCO15', 'Ryan Christie', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Milieu', 11, 'Bournemouth'),
    mkPlayer('26', 'SCO16', 'Kenny McLean', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Milieu', 23, 'Norwich City'),
    mkPlayer('26', 'SCO17', 'John McGinn', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Milieu', 7, 'Aston Villa'),
    mkPlayer('26', 'SCO18', 'Lyndon Dykes', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Attaquant', 9, 'Birmingham City'),
    mkPlayer('26', 'SCO19', 'Che Adams', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Attaquant', 10, 'Torino'),
    mkPlayer('26', 'SCO20', 'Ben Gannon-Doak', 'Écosse', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sc', 'Attaquant', 17, 'Middlesbrough'),
    // ── États-Unis ──
    mkBadge('26', 'USA1', 'États-Unis', '🇺🇸', 'us'),
    mkPlayer('26', 'USA2', 'Matt Freese', 'États-Unis', '🇺🇸', 'us', 'Gardien', 1, 'New York City FC'),
    mkPlayer('26', 'USA3', 'Chris Richards', 'États-Unis', '🇺🇸', 'us', 'Défenseur', 3, 'Crystal Palace'),
    mkPlayer('26', 'USA4', 'Tim Ream', 'États-Unis', '🇺🇸', 'us', 'Défenseur', 13, 'Charlotte FC'),
    mkPlayer('26', 'USA5', 'Mark McKenzie', 'États-Unis', '🇺🇸', 'us', 'Défenseur', 4, 'Toulouse FC'),
    mkPlayer('26', 'USA6', 'Alex Freeman', 'États-Unis', '🇺🇸', 'us', 'Défenseur', 2, 'Orlando City'),
    mkPlayer('26', 'USA7', 'Antonee Robinson', 'États-Unis', '🇺🇸', 'us', 'Défenseur', 5, 'Fulham'),
    mkPlayer('26', 'USA8', 'Tyler Adams', 'États-Unis', '🇺🇸', 'us', 'Milieu', 4, 'Bournemouth'),
    mkPlayer('26', 'USA9', 'Tanner Tessmann', 'États-Unis', '🇺🇸', 'us', 'Milieu', 14, 'Olympique Lyonnais'),
    mkPlayer('26', 'USA10', 'Weston McKennie', 'États-Unis', '🇺🇸', 'us', 'Milieu', 8, 'Juventus'),
    mkPlayer('26', 'USA11', 'Cristian Roldan', 'États-Unis', '🇺🇸', 'us', 'Milieu', 16, 'Seattle Sounders'),
    mkPlayer('26', 'USA12', 'Timothy Weah', 'États-Unis', '🇺🇸', 'us', 'Attaquant', 22, 'Juventus'),
    mkSpecial('26', 'USA13', 'Photo États-Unis', 'special', 'États-Unis', '🇺🇸', 'us'),
    mkPlayer('26', 'USA14', 'Diego Luna', 'États-Unis', '🇺🇸', 'us', 'Milieu', 26, 'Real Salt Lake'),
    mkPlayer('26', 'USA15', 'Malik Tillman', 'États-Unis', '🇺🇸', 'us', 'Milieu', 17, 'PSV Eindhoven'),
    mkPlayer('26', 'USA16', 'Christian Pulisic', 'États-Unis', '🇺🇸', 'us', 'Attaquant', 10, 'AC Milan'),
    mkPlayer('26', 'USA17', 'Brenden Aaronson', 'États-Unis', '🇺🇸', 'us', 'Milieu', 11, 'Leeds United'),
    mkPlayer('26', 'USA18', 'Ricardo Pepi', 'États-Unis', '🇺🇸', 'us', 'Attaquant', 9, 'PSV Eindhoven'),
    mkPlayer('26', 'USA19', 'Haji Wright', 'États-Unis', '🇺🇸', 'us', 'Attaquant', 19, 'Coventry City'),
    mkPlayer('26', 'USA20', 'Folarin Balogun', 'États-Unis', '🇺🇸', 'us', 'Attaquant', 20, 'AS Monaco'),
    // ── Paraguay ──
    mkBadge('26', 'PAR1', 'Paraguay', '🇵🇾', 'py'),
    mkPlayer('26', 'PAR2', 'Roberto Fernández', 'Paraguay', '🇵🇾', 'py', 'Gardien', 12, 'Botafogo'),
    mkPlayer('26', 'PAR3', 'Orlando Gill', 'Paraguay', '🇵🇾', 'py', 'Gardien', 1, 'Sportivo San Lorenzo'),
    mkPlayer('26', 'PAR4', 'Gustavo Gómez', 'Paraguay', '🇵🇾', 'py', 'Défenseur', 15, 'Palmeiras'),
    mkPlayer('26', 'PAR5', 'Fabián Balbuena', 'Paraguay', '🇵🇾', 'py', 'Défenseur', 6, 'Dynamo Moscou'),
    mkPlayer('26', 'PAR6', 'Juan José Cáceres', 'Paraguay', '🇵🇾', 'py', 'Défenseur', 2, 'Lanús'),
    mkPlayer('26', 'PAR7', 'Omar Alderete', 'Paraguay', '🇵🇾', 'py', 'Défenseur', 3, 'Getafe'),
    mkPlayer('26', 'PAR8', 'Junior Alonso', 'Paraguay', '🇵🇾', 'py', 'Défenseur', 14, 'Atlético Mineiro'),
    mkPlayer('26', 'PAR9', 'Mathías Villasanti', 'Paraguay', '🇵🇾', 'py', 'Milieu', 23, 'Grêmio'),
    mkPlayer('26', 'PAR10', 'Diego Gómez', 'Paraguay', '🇵🇾', 'py', 'Milieu', 8, 'Inter Miami'),
    mkPlayer('26', 'PAR11', 'Damián Bobadilla', 'Paraguay', '🇵🇾', 'py', 'Milieu', 16, 'São Paulo'),
    mkPlayer('26', 'PAR12', 'Andrés Cubas', 'Paraguay', '🇵🇾', 'py', 'Milieu', 26, 'Vancouver Whitecaps'),
    mkSpecial('26', 'PAR13', 'Photo Paraguay', 'special', 'Paraguay', '🇵🇾', 'py'),
    mkPlayer('26', 'PAR14', 'Matías Galarza Fonda', 'Paraguay', '🇵🇾', 'py', 'Milieu', 18, 'Talleres'),
    mkPlayer('26', 'PAR15', 'Julio Enciso', 'Paraguay', '🇵🇾', 'py', 'Attaquant', 19, 'Brighton'),
    mkPlayer('26', 'PAR16', 'Alejandro Romero Gamarra', 'Paraguay', '🇵🇾', 'py', 'Milieu', 10, 'Al-Ain'),
    mkPlayer('26', 'PAR17', 'Miguel Almirón', 'Paraguay', '🇵🇾', 'py', 'Attaquant', 10, 'Newcastle United'),
    mkPlayer('26', 'PAR18', 'Ramón Sosa', 'Paraguay', '🇵🇾', 'py', 'Attaquant', 24, 'Nottingham Forest'),
    mkPlayer('26', 'PAR19', 'Ángel Romero', 'Paraguay', '🇵🇾', 'py', 'Attaquant', 11, 'Corinthians'),
    mkPlayer('26', 'PAR20', 'Antonio Sanabria', 'Paraguay', '🇵🇾', 'py', 'Attaquant', 9, 'Torino'),
    // ── Australie ──
    mkBadge('26', 'AUS1', 'Australie', '🇦🇺', 'au'),
    mkPlayer('26', 'AUS2', 'Mathew Ryan', 'Australie', '🇦🇺', 'au', 'Gardien', 1, 'AS Rome'),
    mkPlayer('26', 'AUS3', 'Joe Gauci', 'Australie', '🇦🇺', 'au', 'Gardien', 18, 'Aston Villa'),
    mkPlayer('26', 'AUS4', 'Harry Souttar', 'Australie', '🇦🇺', 'au', 'Défenseur', 19, 'Sheffield United'),
    mkPlayer('26', 'AUS5', 'Alessandro Circati', 'Australie', '🇦🇺', 'au', 'Défenseur', 3, 'Parme'),
    mkPlayer('26', 'AUS6', 'Jordan Bos', 'Australie', '🇦🇺', 'au', 'Défenseur', 5, 'KVC Westerlo'),
    mkPlayer('26', 'AUS7', 'Aziz Behich', 'Australie', '🇦🇺', 'au', 'Défenseur', 16, 'Melbourne City'),
    mkPlayer('26', 'AUS8', 'Cameron Burgess', 'Australie', '🇦🇺', 'au', 'Défenseur', 21, 'Ipswich Town'),
    mkPlayer('26', 'AUS9', 'Lewis Miller', 'Australie', '🇦🇺', 'au', 'Défenseur', 2, 'Hibernian'),
    mkPlayer('26', 'AUS10', 'Milos Degenek', 'Australie', '🇦🇺', 'au', 'Défenseur', 2, 'Étoile Rouge de Belgrade'),
    mkPlayer('26', 'AUS11', 'Jackson Irvine', 'Australie', '🇦🇺', 'au', 'Milieu', 22, 'Sankt Pauli'),
    mkPlayer('26', 'AUS12', 'Riley McGree', 'Australie', '🇦🇺', 'au', 'Milieu', 14, 'Middlesbrough'),
    mkSpecial('26', 'AUS13', 'Photo Australie', 'special', 'Australie', '🇦🇺', 'au'),
    mkPlayer('26', 'AUS14', 'Aiden O\'Neill', 'Australie', '🇦🇺', 'au', 'Milieu', 13, 'Standard de Liège'),
    mkPlayer('26', 'AUS15', 'Connor Metcalfe', 'Australie', '🇦🇺', 'au', 'Milieu', 8, 'Sankt Pauli'),
    mkPlayer('26', 'AUS16', 'Patrick Yazbek', 'Australie', '🇦🇺', 'au', 'Milieu', 6, 'Nashville SC'),
    mkPlayer('26', 'AUS17', 'Craig Goodwin', 'Australie', '🇦🇺', 'au', 'Attaquant', 23, 'Al-Wehda'),
    mkPlayer('26', 'AUS18', 'Kusini Yengi', 'Australie', '🇦🇺', 'au', 'Attaquant', 9, 'Portsmouth'),
    mkPlayer('26', 'AUS19', 'Nestory Irankunda', 'Australie', '🇦🇺', 'au', 'Attaquant', 7, 'Bayern Munich'),
    mkPlayer('26', 'AUS20', 'Mohamed Touré', 'Australie', '🇦🇺', 'au', 'Attaquant', 17, 'Randers FC'),
    // ── Türkiye ──
    mkBadge('26', 'TUR1', 'Türkiye', '🇹🇷', 'tr'),
    mkPlayer('26', 'TUR2', 'Uğurcan Çakır', 'Türkiye', '🇹🇷', 'tr', 'Gardien', 1, 'Trabzonspor'),
    mkPlayer('26', 'TUR3', 'Mert Muldur', 'Türkiye', '🇹🇷', 'tr', 'Défenseur', 18, 'Fenerbahçe'),
    mkPlayer('26', 'TUR4', 'Zeki Celik', 'Türkiye', '🇹🇷', 'tr', 'Défenseur', 2, 'AS Rome'),
    mkPlayer('26', 'TUR5', 'Abdulkerim Bardakci', 'Türkiye', '🇹🇷', 'tr', 'Défenseur', 14, 'Galatasaray'),
    mkPlayer('26', 'TUR6', 'Caglar Soyuncu', 'Türkiye', '🇹🇷', 'tr', 'Défenseur', 4, 'Fenerbahçe'),
    mkPlayer('26', 'TUR7', 'Merih Demiral', 'Türkiye', '🇹🇷', 'tr', 'Défenseur', 3, 'Al-Ahli FC'),
    mkPlayer('26', 'TUR8', 'Ferdi Kadioglu', 'Türkiye', '🇹🇷', 'tr', 'Défenseur', 20, 'Brighton'),
    mkPlayer('26', 'TUR9', 'Kaan Ayhan', 'Türkiye', '🇹🇷', 'tr', 'Défenseur', 22, 'Galatasaray'),
    mkPlayer('26', 'TUR10', 'Ismail Yuksek', 'Türkiye', '🇹🇷', 'tr', 'Milieu', 16, 'Fenerbahçe'),
    mkPlayer('26', 'TUR11', 'Hakan Calhanoglu', 'Türkiye', '🇹🇷', 'tr', 'Milieu', 10, 'Inter Milan'),
    mkPlayer('26', 'TUR12', 'Orkun Kokcu', 'Türkiye', '🇹🇷', 'tr', 'Milieu', 6, 'Benfica Lisbonne'),
    mkSpecial('26', 'TUR13', 'Photo Türkiye', 'special', 'Türkiye', '🇹🇷', 'tr'),
    mkPlayer('26', 'TUR14', 'Arda Guler', 'Türkiye', '🇹🇷', 'tr', 'Milieu', 8, 'Real Madrid'),
    mkPlayer('26', 'TUR15', 'Irfan Can Kahveci', 'Türkiye', '🇹🇷', 'tr', 'Milieu', 17, 'Fenerbahçe'),
    mkPlayer('26', 'TUR16', 'Yunus Akgun', 'Türkiye', '🇹🇷', 'tr', 'Milieu', 7, 'Galatasaray'),
    mkPlayer('26', 'TUR17', 'Can Uzun', 'Türkiye', '🇹🇷', 'tr', 'Milieu', 11, 'Eintracht Francfort'),
    mkPlayer('26', 'TUR18', 'Barış Alper Yılmaz', 'Türkiye', '🇹🇷', 'tr', 'Attaquant', 21, 'Galatasaray'),
    mkPlayer('26', 'TUR19', 'Kerem Akturkoglu', 'Türkiye', '🇹🇷', 'tr', 'Attaquant', 7, 'Benfica Lisbonne'),
    mkPlayer('26', 'TUR20', 'Kenan Yıldız', 'Türkiye', '🇹🇷', 'tr', 'Attaquant', 19, 'Juventus'),
    // ── Allemagne ──
    mkBadge('26', 'GER1', 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('26', 'GER2', 'Marc-André ter Stegen', 'Allemagne', '🇩🇪', 'de', 'Gardien', 1, 'FC Barcelone'),
    mkPlayer('26', 'GER3', 'Jonathan Tah', 'Allemagne', '🇩🇪', 'de', 'Défenseur', 4, 'Bayer Leverkusen'),
    mkPlayer('26', 'GER4', 'David Raum', 'Allemagne', '🇩🇪', 'de', 'Défenseur', 3, 'RB Leipzig'),
    mkPlayer('26', 'GER5', 'Nico Schlotterbeck', 'Allemagne', '🇩🇪', 'de', 'Défenseur', 15, 'Borussia Dortmund'),
    mkPlayer('26', 'GER6', 'Antonio Rüdiger', 'Allemagne', '🇩🇪', 'de', 'Défenseur', 2, 'Real Madrid'),
    mkPlayer('26', 'GER7', 'Waldemar Anton', 'Allemagne', '🇩🇪', 'de', 'Défenseur', 16, 'Borussia Dortmund'),
    mkPlayer('26', 'GER8', 'Ridle Baku', 'Allemagne', '🇩🇪', 'de', 'Défenseur', 20, 'VfL Wolfsbourg'),
    mkPlayer('26', 'GER9', 'Maximilian Mittelstädt', 'Allemagne', '🇩🇪', 'de', 'Défenseur', 22, 'VfB Stuttgart'),
    mkPlayer('26', 'GER10', 'Joshua Kimmich', 'Allemagne', '🇩🇪', 'de', 'Milieu', 6, 'Bayern Munich'),
    mkPlayer('26', 'GER11', 'Florian Wirtz', 'Allemagne', '🇩🇪', 'de', 'Milieu', 17, 'Bayer Leverkusen', 'wirtz'),
    mkPlayer('26', 'GER12', 'Felix Nmecha', 'Allemagne', '🇩🇪', 'de', 'Milieu', 18, 'Borussia Dortmund'),
    mkSpecial('26', 'GER13', 'Photo Allemagne', 'special', 'Allemagne', '🇩🇪', 'de'),
    mkPlayer('26', 'GER14', 'Leon Goretzka', 'Allemagne', '🇩🇪', 'de', 'Milieu', 8, 'Bayern Munich'),
    mkPlayer('26', 'GER15', 'Jamal Musiala', 'Allemagne', '🇩🇪', 'de', 'Milieu', 10, 'Bayern Munich', 'musiala'),
    mkPlayer('26', 'GER16', 'Serge Gnabry', 'Allemagne', '🇩🇪', 'de', 'Attaquant', 20, 'Bayern Munich'),
    mkPlayer('26', 'GER17', 'Kai Havertz', 'Allemagne', '🇩🇪', 'de', 'Attaquant', 7, 'Arsenal'),
    mkPlayer('26', 'GER18', 'Leroy Sané', 'Allemagne', '🇩🇪', 'de', 'Attaquant', 19, 'Bayern Munich'),
    mkPlayer('26', 'GER19', 'Karim Adeyemi', 'Allemagne', '🇩🇪', 'de', 'Attaquant', 23, 'Borussia Dortmund'),
    mkPlayer('26', 'GER20', 'Nick Woltemade', 'Allemagne', '🇩🇪', 'de', 'Attaquant', 21, 'VfB Stuttgart'),
    // ── Curaçao ──
    mkBadge('26', 'CUW1', 'Curaçao', '🇨🇼', 'cw'),
    mkPlayer('26', 'CUW2', 'Eloy Room', 'Curaçao', '🇨🇼', 'cw', 'Gardien', 1, 'Vitesse Arnhem'),
    mkPlayer('26', 'CUW3', 'Armando Obispo', 'Curaçao', '🇨🇼', 'cw', 'Défenseur', 4, 'PSV Eindhoven'),
    mkPlayer('26', 'CUW4', 'Sherel Floranus', 'Curaçao', '🇨🇼', 'cw', 'Défenseur', 2, 'Al-Nojoom'),
    mkPlayer('26', 'CUW5', 'Jurien Gaari', 'Curaçao', '🇨🇼', 'cw', 'Défenseur', 3, 'RKC Waalwijk'),
    mkPlayer('26', 'CUW6', 'Joshua Brenet', 'Curaçao', '🇨🇼', 'cw', 'Défenseur', 5, 'Sans club'),
    mkPlayer('26', 'CUW7', 'Roshon van Eijma', 'Curaçao', '🇨🇼', 'cw', 'Défenseur', 6, 'RKC Waalwijk'),
    mkPlayer('26', 'CUW8', 'Shurandy Sambo', 'Curaçao', '🇨🇼', 'cw', 'Défenseur', 12, 'Burnley'),
    mkPlayer('26', 'CUW9', 'Livano Comenencia', 'Curaçao', '🇨🇼', 'cw', 'Défenseur', 13, 'Juventus Next Gen'),
    mkPlayer('26', 'CUW10', 'Godfried Roemeratoe', 'Curaçao', '🇨🇼', 'cw', 'Milieu', 8, 'RKC Waalwijk'),
    mkPlayer('26', 'CUW11', 'Juninho Bacuna', 'Curaçao', '🇨🇼', 'cw', 'Milieu', 7, 'Al-Wahda'),
    mkPlayer('26', 'CUW12', 'Leandro Bacuna', 'Curaçao', '🇨🇼', 'cw', 'Milieu', 10, 'FC Groningue'),
    mkSpecial('26', 'CUW13', 'Photo Curaçao', 'special', 'Curaçao', '🇨🇼', 'cw'),
    mkPlayer('26', 'CUW14', 'Tahith Chong', 'Curaçao', '🇨🇼', 'cw', 'Milieu', 14, 'Luton Town'),
    mkPlayer('26', 'CUW15', 'Kenji Gorré', 'Curaçao', '🇨🇼', 'cw', 'Milieu', 11, 'Umm Salal'),
    mkPlayer('26', 'CUW16', 'Jearl Margaritha', 'Curaçao', '🇨🇼', 'cw', 'Attaquant', 17, 'Phoenix Rising'),
    mkPlayer('26', 'CUW17', 'Jurgen Locadia', 'Curaçao', '🇨🇼', 'cw', 'Attaquant', 9, 'Inter de de Escaldes'),
    mkPlayer('26', 'CUW18', 'Jeremy Antonisse', 'Curaçao', '🇨🇼', 'cw', 'Attaquant', 19, 'Moreirense'),
    mkPlayer('26', 'CUW19', 'Gervane Kastaneer', 'Curaçao', '🇨🇼', 'cw', 'Attaquant', 20, 'Castellón'),
    mkPlayer('26', 'CUW20', 'Sontje Hansen', 'Curaçao', '🇨🇼', 'cw', 'Attaquant', 21, 'NEC Nimègue'),
    // ── Côte d'Ivoire ──
    mkBadge('26', 'CIV1', 'Côte d\'Ivoire', '🇨🇮', 'ci'),
    mkPlayer('26', 'CIV2', 'Yahia Fofana', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Gardien', 1, 'Angers SCO'),
    mkPlayer('26', 'CIV3', 'Ghislain Konan', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Défenseur', 3, 'Al-Fayha'),
    mkPlayer('26', 'CIV4', 'Wilfried Singo', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Défenseur', 21, 'AS Monaco'),
    mkPlayer('26', 'CIV5', 'Odilon Kossounou', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Défenseur', 7, 'Atalanta Bergame'),
    mkPlayer('26', 'CIV6', 'Evan Ndicka', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Défenseur', 21, 'AS Rome'),
    mkPlayer('26', 'CIV7', 'Willy Boly', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Défenseur', 12, 'Nottingham Forest'),
    mkPlayer('26', 'CIV8', 'Emmanuel Agbadou', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Défenseur', 5, 'Stade de Reims'),
    mkPlayer('26', 'CIV9', 'Ousmane Diomande', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Défenseur', 2, 'Sporting CP'),
    mkPlayer('26', 'CIV10', 'Franck Kessié', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Milieu', 8, 'Al-Ahli FC'),
    mkPlayer('26', 'CIV11', 'Seko Fofana', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Milieu', 6, 'Al-Ettifaq'),
    mkPlayer('26', 'CIV12', 'Ibrahim Sangaré', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Milieu', 18, 'Nottingham Forest'),
    mkSpecial('26', 'CIV13', 'Photo Côte d\'Ivoire', 'special', 'Côte d\'Ivoire', '🇨🇮', 'ci'),
    mkPlayer('26', 'CIV14', 'Jean-Philippe Gbamin', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Milieu', 25, 'FC Nantes'),
    mkPlayer('26', 'CIV15', 'Amad Diallo', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Attaquant', 15, 'Manchester United'),
    mkPlayer('26', 'CIV16', 'Sébastien Haller', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Attaquant', 22, 'CD Leganés'),
    mkPlayer('26', 'CIV17', 'Simon Adingra', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Attaquant', 24, 'Brighton'),
    mkPlayer('26', 'CIV18', 'Yan Diomande', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Attaquant', 11, 'ASEC Mimosas'),
    mkPlayer('26', 'CIV19', 'Evann Guessand', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Attaquant', 9, 'OGC Nice'),
    mkPlayer('26', 'CIV20', 'Oumar Diakité', 'Côte d\'Ivoire', '🇨🇮', 'ci', 'Attaquant', 14, 'Stade de Reims'),
    // ── Équateur ──
    mkBadge('26', 'ECU1', 'Équateur', '🇪🇨', 'ec'),
    mkPlayer('26', 'ECU2', 'Hernán Galíndez', 'Équateur', '🇪🇨', 'ec', 'Gardien', 1, 'Huracán'),
    mkPlayer('26', 'ECU3', 'Gonzalo Valle', 'Équateur', '🇪🇨', 'ec', 'Gardien', 12, 'LDU Quito'),
    mkPlayer('26', 'ECU4', 'Piero Hincapié', 'Équateur', '🇪🇨', 'ec', 'Défenseur', 3, 'Bayer Leverkusen'),
    mkPlayer('26', 'ECU5', 'Pervis Estupiñán', 'Équateur', '🇪🇨', 'ec', 'Défenseur', 7, 'Brighton'),
    mkPlayer('26', 'ECU6', 'Willian Pacho', 'Équateur', '🇪🇨', 'ec', 'Défenseur', 6, 'Paris Saint-Germain'),
    mkPlayer('26', 'ECU7', 'Ángelo Preciado', 'Équateur', '🇪🇨', 'ec', 'Défenseur', 17, 'Sparta Prague'),
    mkPlayer('26', 'ECU8', 'Joel Ordóñez', 'Équateur', '🇪🇨', 'ec', 'Défenseur', 2, 'Club Bruges'),
    mkPlayer('26', 'ECU9', 'Moisés Caicedo', 'Équateur', '🇪🇨', 'ec', 'Milieu', 23, 'Chelsea'),
    mkPlayer('26', 'ECU10', 'Alan Franco', 'Équateur', '🇪🇨', 'ec', 'Milieu', 21, 'Atlético Mineiro'),
    mkPlayer('26', 'ECU11', 'Kendry Páez', 'Équateur', '🇪🇨', 'ec', 'Milieu', 10, 'Independiente del Valle'),
    mkPlayer('26', 'ECU12', 'Pedro Vite', 'Équateur', '🇪🇨', 'ec', 'Milieu', 8, 'Vancouver Whitecaps'),
    mkSpecial('26', 'ECU13', 'Photo Équateur', 'special', 'Équateur', '🇪🇨', 'ec'),
    mkPlayer('26', 'ECU14', 'John Yeboah', 'Équateur', '🇪🇨', 'ec', 'Milieu', 14, 'Venezia FC'),
    mkPlayer('26', 'ECU15', 'Leonardo Campana', 'Équateur', '🇪🇨', 'ec', 'Attaquant', 9, 'Inter Miami'),
    mkPlayer('26', 'ECU16', 'Gonzalo Plata', 'Équateur', '🇪🇨', 'ec', 'Attaquant', 19, 'Flamengo'),
    mkPlayer('26', 'ECU17', 'Nilson Angulo', 'Équateur', '🇪🇨', 'ec', 'Attaquant', 15, 'Anderlecht'),
    mkPlayer('26', 'ECU18', 'Alan Minda', 'Équateur', '🇪🇨', 'ec', 'Attaquant', 11, 'Cercle Bruges'),
    mkPlayer('26', 'ECU19', 'Kevin Rodríguez', 'Équateur', '🇪🇨', 'ec', 'Attaquant', 13, 'Union Saint-Gilloise'),
    mkPlayer('26', 'ECU20', 'Enner Valencia', 'Équateur', '🇪🇨', 'ec', 'Attaquant', 13, 'Internacional'),
    // ── Pays-Bas ──
    // ── Pays-Bas ──
    mkBadge('26', 'NED1', 'Pays-Bas', '🇳🇱', 'nl'),
    mkPlayer('26', 'NED2', 'Bart Verbruggen', 'Pays-Bas', '🇳🇱', 'nl', 'Gardien', 1, 'Brighton'),
    mkPlayer('26', 'NED3', 'Virgil van Dijk', 'Pays-Bas', '🇳🇱', 'nl', 'Défenseur', 4, 'Liverpool', 'vandijk'),
    mkPlayer('26', 'NED4', 'Micky van de Ven', 'Pays-Bas', '🇳🇱', 'nl', 'Défenseur', 15, 'Tottenham Hotspur'),
    mkPlayer('26', 'NED5', 'Jurriën Timber', 'Pays-Bas', '🇳🇱', 'nl', 'Défenseur', 2, 'Arsenal'),
    mkPlayer('26', 'NED6', 'Denzel Dumfries', 'Pays-Bas', '🇳🇱', 'nl', 'Défenseur', 22, 'Inter Milan'),
    mkPlayer('26', 'NED7', 'Nathan Aké', 'Pays-Bas', '🇳🇱', 'nl', 'Défenseur', 5, 'Manchester City'),
    mkPlayer('26', 'NED8', 'Jeremie Frimpong', 'Pays-Bas', '🇳🇱', 'nl', 'Défenseur', 12, 'Bayer Leverkusen'),
    mkPlayer('26', 'NED9', 'Jan Paul van Hecke', 'Pays-Bas', '🇳🇱', 'nl', 'Défenseur', 3, 'Brighton'),
    mkPlayer('26', 'NED10', 'Tijjani Reijnders', 'Pays-Bas', '🇳🇱', 'nl', 'Milieu', 14, 'AC Milan'),
    mkPlayer('26', 'NED11', 'Ryan Gravenberch', 'Pays-Bas', '🇳🇱', 'nl', 'Milieu', 6, 'Liverpool'),
    mkPlayer('26', 'NED12', 'Teun Koopmeiners', 'Pays-Bas', '🇳🇱', 'nl', 'Milieu', 20, 'Juventus'),
    mkSpecial('26', 'NED13', 'Photo Pays-Bas', 'special', 'Pays-Bas', '🇳🇱', 'nl'),
    mkPlayer('26', 'NED14', 'Frenkie de Jong', 'Pays-Bas', '🇳🇱', 'nl', 'Milieu', 21, 'FC Barcelone'),
    mkPlayer('26', 'NED15', 'Xavi Simons', 'Pays-Bas', '🇳🇱', 'nl', 'Milieu', 7, 'RB Leipzig', 'xavisimons'),
    mkPlayer('26', 'NED16', 'Justin Kluivert', 'Pays-Bas', '🇳🇱', 'nl', 'Milieu', 18, 'Bournemouth'),
    mkPlayer('26', 'NED17', 'Memphis Depay', 'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 10, 'Corinthians'),
    mkPlayer('26', 'NED18', 'Donyell Malen', 'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 18, 'Borussia Dortmund'),
    mkPlayer('26', 'NED19', 'Wout Weghorst', 'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 9, 'Ajax Amsterdam'),
    mkPlayer('26', 'NED20', 'Cody Gakpo', 'Pays-Bas', '🇳🇱', 'nl', 'Attaquant', 11, 'Liverpool'),
    // ── Japon ──
    mkBadge('26', 'JPN1', 'Japon', '🇯🇵', 'jp'),
    mkPlayer('26', 'JPN2', 'Zion Suzuki', 'Japon', '🇯🇵', 'jp', 'Gardien', 1, 'Parme'),
    mkPlayer('26', 'JPN3', 'Henry Heroki Mochizuki', 'Japon', '🇯🇵', 'jp', 'Défenseur', 21, 'Machida Zelvia'),
    mkPlayer('26', 'JPN4', 'Ayumu Seko', 'Japon', '🇯🇵', 'jp', 'Défenseur', 4, 'Grasshopper Zurich'),
    mkPlayer('26', 'JPN5', 'Junnosuke Suzuki', 'Japon', '🇯🇵', 'jp', 'Défenseur', 2, 'Shonan Bellmare'),
    mkPlayer('26', 'JPN6', 'Shogo Taniguchi', 'Japon', '🇯🇵', 'jp', 'Défenseur', 3, 'Sint-Truiden'),
    mkPlayer('26', 'JPN7', 'Tsuyoshi Watanabe', 'Japon', '🇯🇵', 'jp', 'Défenseur', 22, 'La Gantoise'),
    mkPlayer('26', 'JPN8', 'Kaishu Sano', 'Japon', '🇯🇵', 'jp', 'Milieu', 6, 'Mayence 05'),
    mkPlayer('26', 'JPN9', 'Yuki Soma', 'Japon', '🇯🇵', 'jp', 'Milieu', 11, 'Machida Zelvia'),
    mkPlayer('26', 'JPN10', 'Ao Tanaka', 'Japon', '🇯🇵', 'jp', 'Milieu', 17, 'Leeds United'),
    mkPlayer('26', 'JPN11', 'Daichi Kamada', 'Japon', '🇯🇵', 'jp', 'Milieu', 8, 'Crystal Palace'),
    mkPlayer('26', 'JPN12', 'Takefusa Kubo', 'Japon', '🇯🇵', 'jp', 'Milieu', 20, 'Real Sociedad'),
    mkSpecial('26', 'JPN13', 'Photo Japon', 'special', 'Japon', '🇯🇵', 'jp'),
    mkPlayer('26', 'JPN14', 'Ritsu Doan', 'Japon', '🇯🇵', 'jp', 'Milieu', 10, 'Fribourg'),
    mkPlayer('26', 'JPN15', 'Keito Nakamura', 'Japon', '🇯🇵', 'jp', 'Milieu', 13, 'Stade de Reims'),
    mkPlayer('26', 'JPN16', 'Takumi Minamino', 'Japon', '🇯🇵', 'jp', 'Milieu', 14, 'AS Monaco'),
    mkPlayer('26', 'JPN17', 'Shuto Machino', 'Japon', '🇯🇵', 'jp', 'Attaquant', 19, 'Holstein Kiel'),
    mkPlayer('26', 'JPN18', 'Junya Ito', 'Japon', '🇯🇵', 'jp', 'Attaquant', 14, 'Stade de Reims'),
    mkPlayer('26', 'JPN19', 'Koki Ogawa', 'Japon', '🇯🇵', 'jp', 'Attaquant', 19, 'NEC Nimègue'),
    mkPlayer('26', 'JPN20', 'Ayase Ueda', 'Japon', '🇯🇵', 'jp', 'Attaquant', 9, 'Feyenoord Rotterdam'),
    // ── Suède ──
    mkBadge('26', 'SWE1', 'Suède', '🇸🇪', 'se'),
    mkPlayer('26', 'SWE2', 'Viktor Johansson', 'Suède', '🇸🇪', 'se', 'Gardien', 1, 'Stoke City'),
    mkPlayer('26', 'SWE3', 'Isak Hien', 'Suède', '🇸🇪', 'se', 'Défenseur', 4, 'Atalanta Bergame'),
    mkPlayer('26', 'SWE4', 'Gabriel Gudmundsson', 'Suède', '🇸🇪', 'se', 'Défenseur', 5, 'Lille OSC'),
    mkPlayer('26', 'SWE5', 'Emil Holm', 'Suède', '🇸🇪', 'se', 'Défenseur', 2, 'Bologne'),
    mkPlayer('26', 'SWE6', 'Victor Nilsson Lindelöf', 'Suède', '🇸🇪', 'se', 'Défenseur', 3, 'Manchester United'),
    mkPlayer('26', 'SWE7', 'Gustaf Lagerbielke', 'Suède', '🇸🇪', 'se', 'Défenseur', 13, 'FC Twente'),
    mkPlayer('26', 'SWE8', 'Lucas Bergvall', 'Suède', '🇸🇪', 'se', 'Milieu', 18, 'Tottenham Hotspur'),
    mkPlayer('26', 'SWE9', 'Hugo Larsson', 'Suède', '🇸🇪', 'se', 'Milieu', 8, 'Eintracht Francfort'),
    mkPlayer('26', 'SWE10', 'Jesper Karlström', 'Suède', '🇸🇪', 'se', 'Milieu', 6, 'Udinese'),
    mkPlayer('26', 'SWE11', 'Yasin Ayari', 'Suède', '🇸🇪', 'se', 'Milieu', 19, 'Brighton'),
    mkPlayer('26', 'SWE12', 'Mattias Svanberg', 'Suède', '🇸🇪', 'se', 'Milieu', 11, 'VfL Wolfsbourg'),
    mkSpecial('26', 'SWE13', 'Photo Suède', 'special', 'Suède', '🇸🇪', 'se'),
    mkPlayer('26', 'SWE14', 'Daniel Svensson', 'Suède', '🇸🇪', 'se', 'Milieu', 22, 'FC Nordsjælland'),
    mkPlayer('26', 'SWE15', 'Ken Sema', 'Suède', '🇸🇪', 'se', 'Milieu', 15, 'Watford'),
    mkPlayer('26', 'SWE16', 'Roony Bardghji', 'Suède', '🇸🇪', 'se', 'Milieu', 16, 'FC Copenhague'),
    mkPlayer('26', 'SWE17', 'Dejan Kulusevski', 'Suède', '🇸🇪', 'se', 'Milieu', 21, 'Tottenham Hotspur'),
    mkPlayer('26', 'SWE18', 'Anthony Elanga', 'Suède', '🇸🇪', 'se', 'Attaquant', 14, 'Nottingham Forest'),
    mkPlayer('26', 'SWE19', 'Alexander Isak', 'Suède', '🇸🇪', 'se', 'Attaquant', 9, 'Newcastle United'),
    mkPlayer('26', 'SWE20', 'Viktor Gyökeres', 'Suède', '🇸🇪', 'se', 'Attaquant', 17, 'Sporting CP'),
    // ── Tunisie ──
    mkBadge('26', 'TUN1', 'Tunisie', '🇹🇳', 'tn'),
    mkPlayer('26', 'TUN2', 'Bechir Ben Said', 'Tunisie', '🇹🇳', 'tn', 'Gardien', 16, 'Espérance de Tunis'),
    mkPlayer('26', 'TUN3', 'Aymen Dahmen', 'Tunisie', '🇹🇳', 'tn', 'Gardien', 1, 'CS Sfaxien'),
    mkPlayer('26', 'TUN4', 'Yan Valery', 'Tunisie', '🇹🇳', 'tn', 'Défenseur', 20, 'Sheffield Wednesday'),
    mkPlayer('26', 'TUN5', 'Montassar Talbi', 'Tunisie', '🇹🇳', 'tn', 'Défenseur', 4, 'FC Lorient'),
    mkPlayer('26', 'TUN6', 'Yassine Meriah', 'Tunisie', '🇹🇳', 'tn', 'Défenseur', 11, 'Espérance de Tunis'),
    mkPlayer('26', 'TUN7', 'Ali Abdi', 'Tunisie', '🇹🇳', 'tn', 'Défenseur', 2, 'OGC Nice'),
    mkPlayer('26', 'TUN8', 'Dylan Bronn', 'Tunisie', '🇹🇳', 'tn', 'Défenseur', 6, 'Salernitana'),
    mkPlayer('26', 'TUN9', 'Ellyes Skhiri', 'Tunisie', '🇹🇳', 'tn', 'Milieu', 17, 'Eintracht Francfort'),
    mkPlayer('26', 'TUN10', 'Aïssa Laïdouni', 'Tunisie', '🇹🇳', 'tn', 'Milieu', 14, 'Al-Wakrah'),
    mkPlayer('26', 'TUN11', 'Ferjani Sassi', 'Tunisie', '🇹🇳', 'tn', 'Milieu', 13, 'Al-Gharafa'),
    mkPlayer('26', 'TUN12', 'Mohamed Ali Ben Romdhane', 'Tunisie', '🇹🇳', 'tn', 'Milieu', 15, 'Ferencváros'),
    mkSpecial('26', 'TUN13', 'Photo Tunisie', 'special', 'Tunisie', '🇹🇳', 'tn'),
    mkPlayer('26', 'TUN14', 'Hannibal Mejbri', 'Tunisie', '🇹🇳', 'tn', 'Milieu', 10, 'Burnley'),
    mkPlayer('26', 'TUN15', 'Elias Achouri', 'Tunisie', '🇹🇳', 'tn', 'Attaquant', 7, 'FC Copenhague'),
    mkPlayer('26', 'TUN16', 'Elias Saad', 'Tunisie', '🇹🇳', 'tn', 'Attaquant', 18, 'Sankt Pauli'),
    mkPlayer('26', 'TUN17', 'Hazem Mastouri', 'Tunisie', '🇹🇳', 'tn', 'Attaquant', 9, 'Union Monastirienne'),
    mkPlayer('26', 'TUN18', 'Ismaël Gharbi', 'Tunisie', '🇹🇳', 'tn', 'Milieu', 21, 'Sporting Braga'),
    mkPlayer('26', 'TUN19', 'Sayfallah Ltaief', 'Tunisie', '🇹🇳', 'tn', 'Attaquant', 23, 'FC Twente'),
    mkPlayer('26', 'TUN20', 'Naïm Sliti', 'Tunisie', '🇹🇳', 'tn', 'Attaquant', 25, 'Al-Shamal'),
    // ── Belgique ──
    mkBadge('26', 'BEL1', 'Belgique', '🇧🇪', 'be'),
    mkPlayer('26', 'BEL2', 'Thibaut Courtois', 'Belgique', '🇧🇪', 'be', 'Gardien', 1, 'Real Madrid'),
    mkPlayer('26', 'BEL3', 'Arthur Theate', 'Belgique', '🇧🇪', 'be', 'Défenseur', 3, 'Eintracht Francfort'),
    mkPlayer('26', 'BEL4', 'Timothy Castagne', 'Belgique', '🇧🇪', 'be', 'Défenseur', 21, 'Fulham'),
    mkPlayer('26', 'BEL5', 'Zeno Debast', 'Belgique', '🇧🇪', 'be', 'Défenseur', 2, 'Sporting CP'),
    mkPlayer('26', 'BEL6', 'Brandon Mechele', 'Belgique', '🇧🇪', 'be', 'Défenseur', 4, 'Club Bruges'),
    mkPlayer('26', 'BEL7', 'Maxim De Cuyper', 'Belgique', '🇧🇪', 'be', 'Défenseur', 5, 'Club Bruges'),
    mkPlayer('26', 'BEL8', 'Thomas Meunier', 'Belgique', '🇧🇪', 'be', 'Défenseur', 15, 'Lille OSC'),
    mkPlayer('26', 'BEL9', 'Youri Tielemans', 'Belgique', '🇧🇪', 'be', 'Milieu', 8, 'Aston Villa'),
    mkPlayer('26', 'BEL10', 'Amadou Onana', 'Belgique', '🇧🇪', 'be', 'Milieu', 6, 'Aston Villa'),
    mkPlayer('26', 'BEL11', 'Nicolas Raskin', 'Belgique', '🇧🇪', 'be', 'Milieu', 19, 'Glasgow Rangers'),
    mkPlayer('26', 'BEL12', 'Alexis Saelemaekers', 'Belgique', '🇧🇪', 'be', 'Milieu', 17, 'AS Rome'),
    mkSpecial('26', 'BEL13', 'Photo Belgique', 'special', 'Belgique', '🇧🇪', 'be'),
    mkPlayer('26', 'BEL14', 'Hans Vanaken', 'Belgique', '🇧🇪', 'be', 'Milieu', 14, 'Club Bruges'),
    mkPlayer('26', 'BEL15', 'Kevin De Bruyne', 'Belgique', '🇧🇪', 'be', 'Milieu', 7, 'Manchester City', 'kdb'),
    mkPlayer('26', 'BEL16', 'Jérémy Doku', 'Belgique', '🇧🇪', 'be', 'Attaquant', 11, 'Manchester City'),
    mkPlayer('26', 'BEL17', 'Charles De Ketelaere', 'Belgique', '🇧🇪', 'be', 'Attaquant', 22, 'Atalanta Bergame'),
    mkPlayer('26', 'BEL18', 'Leandro Trossard', 'Belgique', '🇧🇪', 'be', 'Attaquant', 9, 'Arsenal'),
    mkPlayer('26', 'BEL19', 'Loïs Openda', 'Belgique', '🇧🇪', 'be', 'Attaquant', 20, 'RB Leipzig'),
    mkPlayer('26', 'BEL20', 'Romelu Lukaku', 'Belgique', '🇧🇪', 'be', 'Attaquant', 10, 'Naples'),
    // ── Égypte ──
mkBadge('26', 'EGY1', 'Égypte', '🇪🇬', 'eg'),
    mkPlayer('26', 'EGY2', 'Mohamed Elshenawy', 'Égypte', '🇪🇬', 'eg', 'Gardien', 1, 'Al Ahly'),
    mkPlayer('26', 'EGY3', 'Mohamed Hany', 'Égypte', '🇪🇬', 'eg', 'Défenseur', 3, 'Al Ahly'),
    mkPlayer('26', 'EGY4', 'Mohamed Hamdy', 'Égypte', '🇪🇬', 'eg', 'Défenseur', 13, 'Pyramids FC'),
    mkPlayer('26', 'EGY5', 'Yasser Ibrahim', 'Égypte', '🇪🇬', 'eg', 'Défenseur', 6, 'Al Ahly'),
    mkPlayer('26', 'EGY6', 'Khaled Sobhi', 'Égypte', '🇪🇬', 'eg', 'Défenseur', 15, 'Al Ahly'),
    mkPlayer('26', 'EGY7', 'Ramy Rabia', 'Égypte', '🇪🇬', 'eg', 'Défenseur', 5, 'Al Ahly'),
    mkPlayer('26', 'EGY8', 'Hossam Abdelmaguid', 'Égypte', '🇪🇬', 'eg', 'Défenseur', 2, 'Zamalek'),
    mkPlayer('26', 'EGY9', 'Ahmed Fatouh', 'Égypte', '🇪🇬', 'eg', 'Défenseur', 24, 'Zamalek'),
    mkPlayer('26', 'EGY10', 'Marwan Attia', 'Égypte', '🇪🇬', 'eg', 'Milieu', 14, 'Al Ahly'),
    mkPlayer('26', 'EGY11', 'Zizo', 'Égypte', '🇪🇬', 'eg', 'Milieu', 25, 'Zamalek'),
    mkPlayer('26', 'EGY12', 'Hamdy Fathy', 'Égypte', '🇪🇬', 'eg', 'Milieu', 5, 'Al-Wakrah'),
    mkSpecial('26', 'EGY13', 'Photo Égypte', 'special', 'Égypte', '🇪🇬', 'eg'),
    mkPlayer('26', 'EGY14', 'Mohanad Lasheen', 'Égypte', '🇪🇬', 'eg', 'Milieu', 20, 'Pyramids FC'),
    mkPlayer('26', 'EGY15', 'Emam Ashour', 'Égypte', '🇪🇬', 'eg', 'Milieu', 8, 'Al Ahly'),
    mkPlayer('26', 'EGY16', 'Osama Faisal', 'Égypte', '🇪🇬', 'eg', 'Attaquant', 9, 'National Bank of Egypt'),
    mkPlayer('26', 'EGY17', 'Mohamed Salah', 'Égypte', '🇪🇬', 'eg', 'Attaquant', 10, 'Liverpool'),
    mkPlayer('26', 'EGY18', 'Mostafa Mohamed', 'Égypte', '🇪🇬', 'eg', 'Attaquant', 11, 'FC Nantes'),
    mkPlayer('26', 'EGY19', 'Trezeguet', 'Égypte', '🇪🇬', 'eg', 'Attaquant', 7, 'Al-Rayyan'),
    mkPlayer('26', 'EGY20', 'Omar Marmoush', 'Égypte', '🇪🇬', 'eg', 'Attaquant', 22, 'Manchester City'),
    // ── Iran ──
    mkBadge('26', 'IRN1', 'Iran', '🇮🇷', 'ir'),
    mkPlayer('26', 'IRN2', 'Alireza Beiranvand', 'Iran', '🇮🇷', 'ir', 'Gardien', 1, 'Tractor SC'),
    mkPlayer('26', 'IRN3', 'Morteza Pouraliganji', 'Iran', '🇮🇷', 'ir', 'Défenseur', 8, 'Persepolis FC'),
    mkPlayer('26', 'IRN4', 'Ehsan Hajsafi', 'Iran', '🇮🇷', 'ir', 'Défenseur', 3, 'AEK Athènes'),
    mkPlayer('26', 'IRN5', 'Milad Mohammadi', 'Iran', '🇮🇷', 'ir', 'Défenseur', 5, 'Persepolis FC'),
    mkPlayer('26', 'IRN6', 'Shojae Khalilzadeh', 'Iran', '🇮🇷', 'ir', 'Défenseur', 4, 'Tractor SC'),
    mkPlayer('26', 'IRN7', 'Ramin Rezaeian', 'Iran', '🇮🇷', 'ir', 'Défenseur', 23, 'Esteghlal FC'),
    mkPlayer('26', 'IRN8', 'Hossein Kanaani', 'Iran', '🇮🇷', 'ir', 'Défenseur', 13, 'Persepolis FC'),
    mkPlayer('26', 'IRN9', 'Sadegh Moharrami', 'Iran', '🇮🇷', 'ir', 'Défenseur', 2, 'Dinamo Zagreb'),
    mkPlayer('26', 'IRN10', 'Saleh Hardani', 'Iran', '🇮🇷', 'ir', 'Défenseur', 11, 'Sepahan SC'),
    mkPlayer('26', 'IRN11', 'Saeed Ezatolahi', 'Iran', '🇮🇷', 'ir', 'Milieu', 6, 'Shabab Al-Ahli'),
    mkPlayer('26', 'IRN12', 'Saman Ghoddos', 'Iran', '🇮🇷', 'ir', 'Milieu', 14, 'Kalba FC'),
    mkSpecial('26', 'IRN13', 'Photo Iran', 'special', 'Iran', '🇮🇷', 'ir'),
    mkPlayer('26', 'IRN14', 'Omid Noorafkan', 'Iran', '🇮🇷', 'ir', 'Milieu', 21, 'Malavan FC'),
    mkPlayer('26', 'IRN15', 'Roozbeh Cheshmi', 'Iran', '🇮🇷', 'ir', 'Milieu', 15, 'Esteghlal FC'),
    mkPlayer('26', 'IRN16', 'Mohammad Mohebi', 'Iran', '🇮🇷', 'ir', 'Attaquant', 10, 'FC Rostov'),
    mkPlayer('26', 'IRN17', 'Sardar Azmoun', 'Iran', '🇮🇷', 'ir', 'Attaquant', 20, 'Shabab Al-Ahli'),
    mkPlayer('26', 'IRN18', 'Mehdi Taremi', 'Iran', '🇮🇷', 'ir', 'Attaquant', 9, 'Inter Milan'),
    mkPlayer('26', 'IRN19', 'Alireza Jahanbakhsh', 'Iran', '🇮🇷', 'ir', 'Attaquant', 7, 'Heerenveen'),
    mkPlayer('26', 'IRN20', 'Ali Gholizadeh', 'Iran', '🇮🇷', 'ir', 'Attaquant', 17, 'Lech Poznań'),
    // ── Nouvelle-Zélande ──
    mkBadge('26', 'NZL1', 'Nouvelle-Zélande', '🇳🇿', 'nz'),
    mkPlayer('26', 'NZL2', 'Max Crocombe', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Gardien', 1, 'Burton Albion'),
    mkPlayer('26', 'NZL3', 'Alex Paulsen', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Gardien', 12, 'Auckland FC'),
    mkPlayer('26', 'NZL4', 'Michael Boxall', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Défenseur', 4, 'Minnesota United'),
    mkPlayer('26', 'NZL5', 'Liberato Cacace', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Défenseur', 13, 'Empoli FC'),
    mkPlayer('26', 'NZL6', 'Tim Payne', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Défenseur', 2, 'Wellington Phoenix'),
    mkPlayer('26', 'NZL7', 'Tyler Bindon', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Défenseur', 3, 'Reading'),
    mkPlayer('26', 'NZL8', 'Francis de Vries', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Défenseur', 5, 'Auckland FC'),
    mkPlayer('26', 'NZL9', 'Finn Surman', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Défenseur', 15, 'Portland Timbers'),
    mkPlayer('26', 'NZL10', 'Joe Bell', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Milieu', 6, 'Viking FK'),
    mkPlayer('26', 'NZL11', 'Sarpreet Singh', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Milieu', 10, 'UD Leiria'),
    mkPlayer('26', 'NZL12', 'Ryan Thomas', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Milieu', 14, 'PEC Zwolle'),
    mkSpecial('26', 'NZL13', 'Photo Nouvelle-Zélande', 'special', 'Nouvelle-Zélande', '🇳🇿', 'nz'),
    mkPlayer('26', 'NZL14', 'Matthew Garbett', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Milieu', 8, 'NAC Breda'),
    mkPlayer('26', 'NZL15', 'Marko Stamenić', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Milieu', 19, 'Olympiakos'),
    mkPlayer('26', 'NZL16', 'Ben Old', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Milieu', 7, 'AS Saint-Étienne'),
    mkPlayer('26', 'NZL17', 'Chris Wood', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Attaquant', 9, 'Nottingham Forest'),
    mkPlayer('26', 'NZL18', 'Elijah Just', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Attaquant', 11, 'SK Porthus'),
    mkPlayer('26', 'NZL19', 'Callum McCowatt', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Attaquant', 17, 'Silkeborg IF'),
    mkPlayer('26', 'NZL20', 'Kosta Barbarouses', 'Nouvelle-Zélande', '🇳🇿', 'nz', 'Attaquant', 21, 'Wellington Phoenix'),
    // ── Espagne ──
    mkBadge('26', 'ESP1', 'Espagne', '🇪🇸', 'es'),
    mkPlayer('26', 'ESP2', 'Unai Simon', 'Espagne', '🇪🇸', 'es', 'Gardien', 23, 'Athletic Bilbao'),
    mkPlayer('26', 'ESP3', 'Robin Le Normand', 'Espagne', '🇪🇸', 'es', 'Défenseur', 3, 'Atlético de Madrid'),
    mkPlayer('26', 'ESP4', 'Aymeric Laporte', 'Espagne', '🇪🇸', 'es', 'Défenseur', 14, 'Al-Nassr'),
    mkPlayer('26', 'ESP5', 'Dean Huijsen', 'Espagne', '🇪🇸', 'es', 'Défenseur', 12, 'Bournemouth'),
    mkPlayer('26', 'ESP6', 'Pedro Porro', 'Espagne', '🇪🇸', 'es', 'Défenseur', 2, 'Tottenham Hotspur'),
    mkPlayer('26', 'ESP7', 'Dani Carvajal', 'Espagne', '🇪🇸', 'es', 'Défenseur', 2, 'Real Madrid'),
    mkPlayer('26', 'ESP8', 'Marc Cucurella', 'Espagne', '🇪🇸', 'es', 'Défenseur', 24, 'Chelsea'),
    mkPlayer('26', 'ESP9', 'Martín Zubimendi', 'Espagne', '🇪🇸', 'es', 'Milieu', 18, 'Real Sociedad'),
    mkPlayer('26', 'ESP10', 'Rodri', 'Espagne', '🇪🇸', 'es', 'Milieu', 16, 'Manchester City'),
    mkPlayer('26', 'ESP11', 'Pedri', 'Espagne', '🇪🇸', 'es', 'Milieu', 20, 'FC Barcelone', 'pedri'),
    mkPlayer('26', 'ESP12', 'Fabian Ruiz', 'Espagne', '🇪🇸', 'es', 'Milieu', 8, 'Paris Saint-Germain'),
    mkSpecial('26', 'ESP13', 'Photo Espagne', 'special', 'Espagne', '🇪🇸', 'es'),
    mkPlayer('26', 'ESP14', 'Mikel Merino', 'Espagne', '🇪🇸', 'es', 'Milieu', 6, 'Arsenal'),
    mkPlayer('26', 'ESP15', 'Lamine Yamal', 'Espagne', '🇪🇸', 'es', 'Attaquant', 19, 'FC Barcelone', 'yamal'),
    mkPlayer('26', 'ESP16', 'Dani Olmo', 'Espagne', '🇪🇸', 'es', 'Milieu', 10, 'FC Barcelone'),
    mkPlayer('26', 'ESP17', 'Nico Williams', 'Espagne', '🇪🇸', 'es', 'Attaquant', 17, 'Athletic Bilbao'),
    mkPlayer('26', 'ESP18', 'Ferran Torres', 'Espagne', '🇪🇸', 'es', 'Attaquant', 11, 'FC Barcelone', 'ftorres'),
    mkPlayer('26', 'ESP19', 'Álvaro Morata', 'Espagne', '🇪🇸', 'es', 'Attaquant', 7, 'AC Milan'),
    mkPlayer('26', 'ESP20', 'Mikel Oyarzabal', 'Espagne', '🇪🇸', 'es', 'Attaquant', 21, 'Real Sociedad'),
    // ── Cape Verde ──
    mkBadge('26', 'CPV1', 'Cap-Vert', '🇨🇻', 'cv'),
    mkPlayer('26', 'CPV2', 'Vozinha', 'Cap-Vert', '🇨🇻', 'cv', 'Gardien', 1, 'AS Trenčín'),
    mkPlayer('26', 'CPV3', 'Logan Costa', 'Cap-Vert', '🇨🇻', 'cv', 'Défenseur', 4, 'Villarreal'),
    mkPlayer('26', 'CPV4', 'Pico', 'Cap-Vert', '🇨🇻', 'cv', 'Défenseur', 3, 'Shamrock Rovers'),
    mkPlayer('26', 'CPV5', 'Diney', 'Cap-Vert', '🇨🇻', 'cv', 'Défenseur', 5, 'Al-Bataeh'),
    mkPlayer('26', 'CPV6', 'Steven Moreira', 'Cap-Vert', '🇨🇻', 'cv', 'Défenseur', 22, 'Columbus Crew'),
    mkPlayer('26', 'CPV7', 'Wagner Pina', 'Cap-Vert', '🇨🇻', 'cv', 'Défenseur', 19, 'Estoril-Praia'),
    mkPlayer('26', 'CPV8', 'Joao Paulo', 'Cap-Vert', '🇨🇻', 'cv', 'Défenseur', 16, 'Sheriff Tiraspol'),
    mkPlayer('26', 'CPV9', 'Yannick Semedo', 'Cap-Vert', '🇨🇻', 'cv', 'Milieu', 6, 'FC Vizela'),
    mkPlayer('26', 'CPV10', 'Kevin Pina', 'Cap-Vert', '🇨🇻', 'cv', 'Milieu', 26, 'FK Krasnodar'),
    mkPlayer('26', 'CPV11', 'Patrick Andrade', 'Cap-Vert', '🇨🇻', 'cv', 'Milieu', 18, 'Qarabag FK'),
    mkPlayer('26', 'CPV12', 'Jamiro Monteiro', 'Cap-Vert', '🇨🇻', 'cv', 'Milieu', 10, 'Zwolle'),
    mkSpecial('26', 'CPV13', 'Photo Cap-Vert', 'special', 'Cap-Vert', '🇨🇻', 'cv'),
    mkPlayer('26', 'CPV14', 'Deroy Duarte', 'Cap-Vert', '🇨🇻', 'cv', 'Milieu', 8, 'Ludogorets Razgrad'),
    mkPlayer('26', 'CPV15', 'Garry Rodrigues', 'Cap-Vert', '🇨🇻', 'cv', 'Attaquant', 11, 'Sivasspor'),
    mkPlayer('26', 'CPV16', 'Jovane Cabral', 'Cap-Vert', '🇨🇻', 'cv', 'Attaquant', 20, 'Göztepe'),
    mkPlayer('26', 'CPV17', 'Ryan Mendes', 'Cap-Vert', '🇨🇻', 'cv', 'Attaquant', 20, 'Al-Nasr Benghazi'),
    mkPlayer('26', 'CPV18', 'Dailon Livramento', 'Cap-Vert', '🇨🇻', 'cv', 'Attaquant', 9, 'Hellas Vérone'),
    mkPlayer('26', 'CPV19', 'Willy Semedo', 'Cap-Vert', '🇨🇻', 'cv', 'Attaquant', 7, 'Omonia Nicosie'),
    mkPlayer('26', 'CPV20', 'Bebe', 'Cap-Vert', '🇨🇻', 'cv', 'Attaquant', 21, 'Racing Ferrol'),
    // ── Arabie Saoudite ──
    mkBadge('26', 'KSA1', 'Arabie Saoudite', '🇸🇦', 'sa'),
    mkPlayer('26', 'KSA2', 'Nawaf Alaqidi', 'Arabie Saoudite', '🇸🇦', 'sa', 'Gardien', 22, 'Al-Nassr'),
    mkPlayer('26', 'KSA3', 'Abdulrahman Alsanbi', 'Arabie Saoudite', '🇸🇦', 'sa', 'Gardien', 1, 'Al-Ahli'),
    mkPlayer('26', 'KSA4', 'Saud Abdulhamid', 'Arabie Saoudite', '🇸🇦', 'sa', 'Défenseur', 12, 'AS Rome'),
    mkPlayer('26', 'KSA5', 'Nawaf Buwashl', 'Arabie Saoudite', '🇸🇦', 'sa', 'Défenseur', 2, 'Al-Nassr'),
    mkPlayer('26', 'KSA6', 'Jehad Thikri', 'Arabie Saoudite', '🇸🇦', 'sa', 'Défenseur', 4, 'Al-Qadsiah'),
    mkPlayer('26', 'KSA7', 'Moteb Alharbi', 'Arabie Saoudite', '🇸🇦', 'sa', 'Défenseur', 13, 'Al-Hilal'),
    mkPlayer('26', 'KSA8', 'Hassan Altambakti', 'Arabie Saoudite', '🇸🇦', 'sa', 'Défenseur', 17, 'Al-Hilal'),
    mkPlayer('26', 'KSA9', 'Musab Aljuwayr', 'Arabie Saoudite', '🇸🇦', 'sa', 'Milieu', 6, 'Al-Shabab'),
    mkPlayer('26', 'KSA10', 'Ziyad Aljohani', 'Arabie Saoudite', '🇸🇦', 'sa', 'Milieu', 15, 'Al-Ahli'),
    mkPlayer('26', 'KSA11', 'Abdullah Alkhaibari', 'Arabie Saoudite', '🇸🇦', 'sa', 'Milieu', 8, 'Al-Nassr'),
    mkPlayer('26', 'KSA12', 'Nasser Aldawsari', 'Arabie Saoudite', '🇸🇦', 'sa', 'Milieu', 16, 'Al-Hilal'),
    mkSpecial('26', 'KSA13', 'Photo Arabie Saoudite', 'special', 'Arabie Saoudite', '🇸🇦', 'sa'),
    mkPlayer('26', 'KSA14', 'Saleh Abu Alshamat', 'Arabie Saoudite', '🇸🇦', 'sa', 'Milieu', 3, 'Al-Qadsiah'),
    mkPlayer('26', 'KSA15', 'Marwan Alsahafi', 'Arabie Saoudite', '🇸🇦', 'sa', 'Attaquant', 20, 'Beerschot V.A.'),
    mkPlayer('26', 'KSA16', 'Salem Aldawsari', 'Arabie Saoudite', '🇸🇦', 'sa', 'Attaquant', 10, 'Al-Hilal'),
    mkPlayer('26', 'KSA17', 'Abdulrahman Alobud', 'Arabie Saoudite', '🇸🇦', 'sa', 'Attaquant', 19, 'Al-Ittihad'),
    mkPlayer('26', 'KSA18', 'Feras Albrikan', 'Arabie Saoudite', '🇸🇦', 'sa', 'Attaquant', 9, 'Al-Ahli'),
    mkPlayer('26', 'KSA19', 'Saleh Alshehri', 'Arabie Saoudite', '🇸🇦', 'sa', 'Attaquant', 11, 'Al-Ittihad'),
    mkPlayer('26', 'KSA20', 'Abdullah Alhamdan', 'Arabie Saoudite', '🇸🇦', 'sa', 'Attaquant', 14, 'Al-Hilal'),
    // ── Uruguay ──
    mkBadge('26', 'URU1', 'Uruguay', '🇺🇾', 'uy'),
    mkPlayer('26', 'URU2', 'Sergio Rochet', 'Uruguay', '🇺🇾', 'uy', 'Gardien', 1, 'Internacional'),
    mkPlayer('26', 'URU3', 'Santiago Mele', 'Uruguay', '🇺🇾', 'uy', 'Gardien', 23, 'Atlético Junior'),
    mkPlayer('26', 'URU4', 'Ronald Araujo', 'Uruguay', '🇺🇾', 'uy', 'Défenseur', 4, 'FC Barcelone'),
    mkPlayer('26', 'URU5', 'José María Giménez', 'Uruguay', '🇺🇾', 'uy', 'Défenseur', 2, 'Atlético de Madrid'),
    mkPlayer('26', 'URU6', 'Sebastian Caceres', 'Uruguay', '🇺🇾', 'uy', 'Défenseur', 3, 'Club América'),
    mkPlayer('26', 'URU7', 'Mathias Olivera', 'Uruguay', '🇺🇾', 'uy', 'Défenseur', 16, 'Naples'),
    mkPlayer('26', 'URU8', 'Guillermo Varela', 'Uruguay', '🇺🇾', 'uy', 'Défenseur', 6, 'Flamengo'),
    mkPlayer('26', 'URU9', 'Nahitan Nandez', 'Uruguay', '🇺🇾', 'uy', 'Défenseur', 8, 'Al-Qadsiah'),
    mkPlayer('26', 'URU10', 'Federico Valverde', 'Uruguay', '🇺🇾', 'uy', 'Milieu', 15, 'Real Madrid'),
    mkPlayer('26', 'URU11', 'Giorgian De Arrascaeta', 'Uruguay', '🇺🇾', 'uy', 'Milieu', 10, 'Flamengo'),
    mkPlayer('26', 'URU12', 'Rodrigo Bentancur', 'Uruguay', '🇺🇾', 'uy', 'Milieu', 6, 'Tottenham Hotspur'),
    mkSpecial('26', 'URU13', 'Photo Uruguay', 'special', 'Uruguay', '🇺🇾', 'uy'),
    mkPlayer('26', 'URU14', 'Manuel Ugarte', 'Uruguay', '🇺🇾', 'uy', 'Milieu', 5, 'Manchester United'),
    mkPlayer('26', 'URU15', 'Nicolás de la Cruz', 'Uruguay', '🇺🇾', 'uy', 'Milieu', 7, 'Flamengo'),
    mkPlayer('26', 'URU16', 'Maxi Araujo', 'Uruguay', '🇺🇾', 'uy', 'Attaquant', 20, 'Sporting CP'),
    mkPlayer('26', 'URU17', 'Darwin Núñez', 'Uruguay', '🇺🇾', 'uy', 'Attaquant', 19, 'Liverpool', 'darwin'),
    mkPlayer('26', 'URU18', 'Federico Viñas', 'Uruguay', '🇺🇾', 'uy', 'Attaquant', 18, 'Real Oviedo'),
    mkPlayer('26', 'URU19', 'Rodrigo Aguirre', 'Uruguay', '🇺🇾', 'uy', 'Attaquant', 9, 'Club América'),
    mkPlayer('26', 'URU20', 'Facundo Pellistri', 'Uruguay', '🇺🇾', 'uy', 'Attaquant', 11, 'Panaithinaïkos'),
// ── France ──
    mkBadge('26', 'FRA1', 'France', '🇫🇷', 'fr'),
    mkPlayer('26', 'FRA2', 'Mike Maignan', 'France', '🇫🇷', 'fr', 'Gardien', 16, 'AC Milan'),
    mkPlayer('26', 'FRA3', 'Theo Hernandez', 'France', '🇫🇷', 'fr', 'Défenseur', 22, 'AC Milan'),
    mkPlayer('26', 'FRA4', 'William Saliba', 'France', '🇫🇷', 'fr', 'Défenseur', 4, 'Arsenal'),
    mkPlayer('26', 'FRA5', 'Jules Kounde', 'France', '🇫🇷', 'fr', 'Défenseur', 5, 'FC Barcelone'),
    mkPlayer('26', 'FRA6', 'Ibrahima Konate', 'France', '🇫🇷', 'fr', 'Défenseur', 24, 'Liverpool'),
    mkPlayer('26', 'FRA7', 'Dayot Upamecano', 'France', '🇫🇷', 'fr', 'Défenseur', 4, 'Bayern Munich'),
    mkPlayer('26', 'FRA8', 'Lucas Digne', 'France', '🇫🇷', 'fr', 'Défenseur', 3, 'Aston Villa'),
    mkPlayer('26', 'FRA9', 'Aurélien Tchouaméni', 'France', '🇫🇷', 'fr', 'Milieu', 8, 'Real Madrid'),
    mkPlayer('26', 'FRA10', 'Eduardo Camavinga', 'France', '🇫🇷', 'fr', 'Milieu', 6, 'Real Madrid'),
    mkPlayer('26', 'FRA11', 'Manu Kone', 'France', '🇫🇷', 'fr', 'Milieu', 15, 'AS Rome'),
    mkPlayer('26', 'FRA12', 'Adrien Rabiot', 'France', '🇫🇷', 'fr', 'Milieu', 14, 'Olympique de Marseille'),
    mkSpecial('26', 'FRA13', 'Photo France', 'special', 'France', '🇫🇷', 'fr'),
    mkPlayer('26', 'FRA14', 'Michael Olise', 'France', '🇫🇷', 'fr', 'Attaquant', 7, 'Bayern Munich'),
    mkPlayer('26', 'FRA15', 'Ousmane Dembele', 'France', '🇫🇷', 'fr', 'Attaquant', 11, 'Paris Saint-Germain'),
    mkPlayer('26', 'FRA16', 'Bradley Barcola', 'France', '🇫🇷', 'fr', 'Attaquant', 20, 'Paris Saint-Germain'),
    mkPlayer('26', 'FRA17', 'Désiré Doué', 'France', '🇫🇷', 'fr', 'Milieu', 19, 'Paris Saint-Germain'),
    mkPlayer('26', 'FRA18', 'Kingsley Coman', 'France', '🇫🇷', 'fr', 'Attaquant', 20, 'Bayern Munich'),
    mkPlayer('26', 'FRA19', 'Hugo Ekitike', 'France', '🇫🇷', 'fr', 'Attaquant', 19, 'Eintracht Francfort'),
    mkPlayer('26', 'FRA20', 'Kylian Mbappe', 'France', '🇫🇷', 'fr', 'Attaquant', 10, 'Real Madrid', undefined, false, 'https://vaufybtidzejfoqgbpvo.supabase.co/storage/v1/object/public/stickers/mbappe.png'),
    // ── Sénégal ──
    mkBadge('26', 'SEN1', 'Sénégal', '🇸🇳', 'sn'),
    mkPlayer('26', 'SEN2', 'Édouard Mendy', 'Sénégal', '🇸🇳', 'sn', 'Gardien', 16, 'Al-Ahli FC'),
    mkPlayer('26', 'SEN3', 'Yehvann Diouf', 'Sénégal', '🇸🇳', 'sn', 'Gardien', 1, 'Stade de Reims'),
    mkPlayer('26', 'SEN4', 'Moussa Niakhaté', 'Sénégal', '🇸🇳', 'sn', 'Défenseur', 19, 'Olympique Lyonnais'),
    mkPlayer('26', 'SEN5', 'Abdoulaye Seck', 'Sénégal', '🇸🇳', 'sn', 'Défenseur', 4, 'Maccabi Haïfa'),
    mkPlayer('26', 'SEN6', 'Ismail Jakobs', 'Sénégal', '🇸🇳', 'sn', 'Défenseur', 14, 'Galatasaray'),
    mkPlayer('26', 'SEN7', 'El Hadji Malick Diouf', 'Sénégal', '🇸🇳', 'sn', 'Défenseur', 13, 'Slavia Prague'),
    mkPlayer('26', 'SEN8', 'Kalidou Koulibaly', 'Sénégal', '🇸🇳', 'sn', 'Défenseur', 3, 'Al-Hilal'),
    mkPlayer('26', 'SEN9', 'Idrissa Gana Gueye', 'Sénégal', '🇸🇳', 'sn', 'Milieu', 5, 'Everton'),
    mkPlayer('26', 'SEN10', 'Pape Matar Sarr', 'Sénégal', '🇸🇳', 'sn', 'Milieu', 17, 'Tottenham Hotspur'),
    mkPlayer('26', 'SEN11', 'Pape Gueye', 'Sénégal', '🇸🇳', 'sn', 'Milieu', 26, 'Villarreal'),
    mkPlayer('26', 'SEN12', 'Habib Diarra', 'Sénégal', '🇸🇳', 'sn', 'Milieu', 20, 'RC Strasbourg'),
    mkSpecial('26', 'SEN13', 'Photo Sénégal', 'special', 'Sénégal', '🇸🇳', 'sn'),
    mkPlayer('26', 'SEN14', 'Lamine Camara', 'Sénégal', '🇸🇳', 'sn', 'Milieu', 15, 'AS Monaco'),
    mkPlayer('26', 'SEN15', 'Sadio Mane', 'Sénégal', '🇸🇳', 'sn', 'Attaquant', 10, 'Al-Nassr'),
    mkPlayer('26', 'SEN16', 'Ismaïla Sarr', 'Sénégal', '🇸🇳', 'sn', 'Attaquant', 18, 'Crystal Palace'),
    mkPlayer('26', 'SEN17', 'Boulaye Dia', 'Sénégal', '🇸🇳', 'sn', 'Attaquant', 9, 'Lazio Rome'),
    mkPlayer('26', 'SEN18', 'Iliman Ndiaye', 'Sénégal', '🇸🇳', 'sn', 'Attaquant', 11, 'Everton'),
    mkPlayer('26', 'SEN19', 'Nicolas Jackson', 'Sénégal', '🇸🇳', 'sn', 'Attaquant', 7, 'Chelsea'),
    mkPlayer('26', 'SEN20', 'Krepin Diatta', 'Sénégal', '🇸🇳', 'sn', 'Attaquant', 21, 'AS Monaco'),
    // ── Irak ──
    mkBadge('26', 'IRQ1', 'Irak', '🇮🇶', 'iq'),
    mkPlayer('26', 'IRQ2', 'Jalal Hassan', 'Irak', '🇮🇶', 'iq', 'Gardien', 12, 'Al-Zawraa'),
    mkPlayer('26', 'IRQ3', 'Rebin Sulaka', 'Irak', '🇮🇶', 'iq', 'Défenseur', 4, 'Al-Shahania'),
    mkPlayer('26', 'IRQ4', 'Hussein Ali', 'Irak', '🇮🇶', 'iq', 'Défenseur', 3, 'Heerenveen'),
    mkPlayer('26', 'IRQ5', 'Akam Hashem', 'Irak', '🇮🇶', 'iq', 'Défenseur', 15, 'Erbil SC'),
    mkPlayer('26', 'IRQ6', 'Merchas Doski', 'Irak', '🇮🇶', 'iq', 'Défenseur', 23, 'Slovácko'),
    mkPlayer('26', 'IRQ7', 'Zaid Tahseen', 'Irak', '🇮🇶', 'iq', 'Défenseur', 2, 'Al-Talaba'),
    mkPlayer('26', 'IRQ8', 'Manaf Younis', 'Irak', '🇮🇶', 'iq', 'Défenseur', 5, 'Al-Shorta'),
    mkPlayer('26', 'IRQ9', 'Zidane Iqbal', 'Irak', '🇮🇶', 'iq', 'Milieu', 14, 'FC Utrecht'),
    mkPlayer('26', 'IRQ10', 'Amir Al-Ammari', 'Irak', '🇮🇶', 'iq', 'Milieu', 16, 'Cracovia'),
    mkPlayer('26', 'IRQ11', 'Ibrahim Bayesh', 'Irak', '🇮🇶', 'iq', 'Milieu', 8, 'Al-Quwa Al-Jawiya'),
    mkPlayer('26', 'IRQ12', 'Ali Jasim', 'Irak', '🇮🇶', 'iq', 'Milieu', 17, 'Côme 1907'),
    mkSpecial('26', 'IRQ13', 'Photo Irak', 'special', 'Irak', '🇮🇶', 'iq'),
    mkPlayer('26', 'IRQ14', 'Youssef Amyn', 'Irak', '🇮🇶', 'iq', 'Milieu', 7, 'Al-Wehda'),
    mkPlayer('26', 'IRQ15', 'Aimar Sher', 'Irak', '🇮🇶', 'iq', 'Milieu', 21, 'Sarpsborg 08'),
    mkPlayer('26', 'IRQ16', 'Marko Farji', 'Irak', '🇮🇶', 'iq', 'Milieu', 20, 'Strømsgodset'),
    mkPlayer('26', 'IRQ17', 'Osama Rashid', 'Irak', '🇮🇶', 'iq', 'Milieu', 6, 'Erbil SC'),
    mkPlayer('26', 'IRQ18', 'Ali Al-Hamadi', 'Irak', '🇮🇶', 'iq', 'Attaquant', 9, 'Ipswich Town'),
    mkPlayer('26', 'IRQ19', 'Aymen Hussein', 'Irak', '🇮🇶', 'iq', 'Attaquant', 18, 'Al-Khor'),
    mkPlayer('26', 'IRQ20', 'Mohanad Ali', 'Irak', '🇮🇶', 'iq', 'Attaquant', 10, 'Al-Shorta'),
    // ── Norvège ──
    mkBadge('26', 'NOR1', 'Norvège', '🇳🇴', 'no'),
    mkPlayer('26', 'NOR2', 'Ørjan Nyland', 'Norvège', '🇳🇴', 'no', 'Gardien', 1, 'Séville FC'),
    mkPlayer('26', 'NOR3', 'Julian Ryerson', 'Norvège', '🇳🇴', 'no', 'Défenseur', 14, 'Borussia Dortmund'),
    mkPlayer('26', 'NOR4', 'Leo Østigård', 'Norvège', '🇳🇴', 'no', 'Défenseur', 4, 'Stade Rennais'),
    mkPlayer('26', 'NOR5', 'Kristoffer Vassbakk Ajer', 'Norvège', '🇳🇴', 'no', 'Défenseur', 3, 'Brentford'),
    mkPlayer('26', 'NOR6', 'Marcus Holmgren Pedersen', 'Norvège', '🇳🇴', 'no', 'Défenseur', 22, 'Torino'),
    mkPlayer('26', 'NOR7', 'David Møller Wolfe', 'Norvège', '🇳🇴', 'no', 'Défenseur', 2, 'AZ Alkmaar'),
    mkPlayer('26', 'NOR8', 'Torbjørn Heggem', 'Norvège', '🇳🇴', 'no', 'Défenseur', 5, 'West Bromwich Albion'),
    mkPlayer('26', 'NOR9', 'Morten Thorsby', 'Norvège', '🇳🇴', 'no', 'Milieu', 21, 'Genoa'),
    mkPlayer('26', 'NOR10', 'Martin Ødegaard', 'Norvège', '🇳🇴', 'no', 'Milieu', 10, 'Arsenal'),
    mkPlayer('26', 'NOR11', 'Sander Berge', 'Norvège', '🇳🇴', 'no', 'Milieu', 8, 'Fulham'),
    mkPlayer('26', 'NOR12', 'Andreas Schjelderup', 'Norvège', '🇳🇴', 'no', 'Attaquant', 18, 'Benfica Lisbonne'),
    mkSpecial('26', 'NOR13', 'Photo Norvège', 'special', 'Norvège', '🇳🇴', 'no'),
    mkPlayer('26', 'NOR14', 'Patrick Berg', 'Norvège', '🇳🇴', 'no', 'Milieu', 6, 'Bodø/Glimt'),
    mkPlayer('26', 'NOR15', 'Erling Haaland', 'Norvège', '🇳🇴', 'no', 'Attaquant', 9, 'Manchester City'),
    mkPlayer('26', 'NOR16', 'Alexander Sørloth', 'Norvège', '🇳🇴', 'no', 'Attaquant', 7, 'Atlético de Madrid'),
    mkPlayer('26', 'NOR17', 'Aron Dønnum', 'Norvège', '🇳🇴', 'no', 'Attaquant', 11, 'Toulouse FC'),
    mkPlayer('26', 'NOR18', 'Jørgen Strand Larsen', 'Norvège', '🇳🇴', 'no', 'Attaquant', 19, 'Wolverhampton'),
    mkPlayer('26', 'NOR19', 'Antonio Nusa', 'Norvège', '🇳🇴', 'no', 'Attaquant', 20, 'RB Leipzig'),
    mkPlayer('26', 'NOR20', 'Oscar Bobb', 'Norvège', '🇳🇴', 'no', 'Attaquant', 23, 'Manchester City'),
    // ── Argentine ──
    mkBadge('26', 'ARG1', 'Argentine', '🇦🇷', 'ar'),
    mkPlayer('26', 'ARG2', 'Emiliano Martinez', 'Argentine', '🇦🇷', 'ar', 'Gardien', 23, 'Aston Villa'),
    mkPlayer('26', 'ARG3', 'Nahuel Molina', 'Argentine', '🇦🇷', 'ar', 'Défenseur', 26, 'Atlético de Madrid'),
    mkPlayer('26', 'ARG4', 'Cristian Romero', 'Argentine', '🇦🇷', 'ar', 'Défenseur', 13, 'Tottenham Hotspur'),
    mkPlayer('26', 'ARG5', 'Nicolas Otamendi', 'Argentine', '🇦🇷', 'ar', 'Défenseur', 19, 'Benfica Lisbonne'),
    mkPlayer('26', 'ARG6', 'Nicolas Tagliafico', 'Argentine', '🇦🇷', 'ar', 'Défenseur', 3, 'Olympique Lyonnais'),
    mkPlayer('26', 'ARG7', 'Leonardo Balerdi', 'Argentine', '🇦🇷', 'ar', 'Défenseur', 2, 'Olympique de Marseille'),
    mkPlayer('26', 'ARG8', 'Enzo Fernandez', 'Argentine', '🇦🇷', 'ar', 'Milieu', 24, 'Chelsea'),
    mkPlayer('26', 'ARG9', 'Alexis Mac Allister', 'Argentine', '🇦🇷', 'ar', 'Milieu', 20, 'Liverpool'),
    mkPlayer('26', 'ARG10', 'Rodrigo De Paul', 'Argentine', '🇦🇷', 'ar', 'Milieu', 7, 'Atlético de Madrid'),
    mkPlayer('26', 'ARG11', 'Exequiel Palacios', 'Argentine', '🇦🇷', 'ar', 'Milieu', 14, 'Bayer Leverkusen'),
    mkPlayer('26', 'ARG12', 'Leandro Paredes', 'Argentine', '🇦🇷', 'ar', 'Milieu', 5, 'AS Rome'),
    mkSpecial('26', 'ARG13', 'Photo Argentine', 'special', 'Argentine', '🇦🇷', 'ar'),
    mkPlayer('26', 'ARG14', 'Nico Paz', 'Argentine', '🇦🇷', 'ar', 'Milieu', 18, 'Côme 1907'),
    mkPlayer('26', 'ARG15', 'Franco Mastantuono', 'Argentine', '🇦🇷', 'ar', 'Milieu', 15, 'River Plate'),
    mkPlayer('26', 'ARG16', 'Nico Gonzalez', 'Argentine', '🇦🇷', 'ar', 'Attaquant', 15, 'Juventus'),
    mkPlayer('26', 'ARG17', 'Lionel Messi', 'Argentine', '🇦🇷', 'ar', 'Attaquant', 10, 'Inter Miami', 'messi'),
    mkPlayer('26', 'ARG18', 'Lautaro Martinez', 'Argentine', '🇦🇷', 'ar', 'Attaquant', 22, 'Inter Milan'),
    mkPlayer('26', 'ARG19', 'Julian Alvarez', 'Argentine', '🇦🇷', 'ar', 'Attaquant', 9, 'Atlético de Madrid'),
    mkPlayer('26', 'ARG20', 'Giuliano Simeone', 'Argentine', '🇦🇷', 'ar', 'Attaquant', 17, 'Atlético de Madrid'),
    // ── Algérie ──
    mkBadge('26', 'ALG1', 'Algérie', '🇩🇿', 'dz'),
    mkPlayer('26', 'ALG2', 'Alexis Guendouz', 'Algérie', '🇩🇿', 'dz', 'Gardien', 16, 'Persepolis FC'),
    mkPlayer('26', 'ALG3', 'Ramy Bensebaini', 'Algérie', '🇩🇿', 'dz', 'Défenseur', 21, 'Borussia Dortmund'),
    mkPlayer('26', 'ALG4', 'Youcef Atal', 'Algérie', '🇩🇿', 'dz', 'Défenseur', 20, 'Al-Sadd SC'),
    mkPlayer('26', 'ALG5', 'Rayan Aït-Nouri', 'Algérie', '🇩🇿', 'dz', 'Défenseur', 3, 'Wolverhampton'),
    mkPlayer('26', 'ALG6', 'Mohamed Amine Tougai', 'Algérie', '🇩🇿', 'dz', 'Défenseur', 2, 'Espérance de Tunis'),
    mkPlayer('26', 'ALG7', 'Aïssa Mandi', 'Algérie', '🇩🇿', 'dz', 'Défenseur', 4, 'Lille OSC'),
    mkPlayer('26', 'ALG8', 'Ismael Bennacer', 'Algérie', '🇩🇿', 'dz', 'Milieu', 22, 'AC Milan'),
    mkPlayer('26', 'ALG9', 'Houssem Aouar', 'Algérie', '🇩🇿', 'dz', 'Milieu', 11, 'Al-Ittihad'),
    mkPlayer('26', 'ALG10', 'Hicham Boudaoui', 'Algérie', '🇩🇿', 'dz', 'Milieu', 6, 'OGC Nice'),
    mkPlayer('26', 'ALG11', 'Ramiz Zerrouki', 'Algérie', '🇩🇿', 'dz', 'Milieu', 14, 'Feyenoord Rotterdam'),
    mkPlayer('26', 'ALG12', 'Nabil Bentaleb', 'Algérie', '🇩🇿', 'dz', 'Milieu', 19, 'Lille OSC'),
    mkSpecial('26', 'ALG13', 'Photo Algérie', 'special', 'Algérie', '🇩🇿', 'dz'),
    mkPlayer('26', 'ALG14', 'Farés Chaibi', 'Algérie', '🇩🇿', 'dz', 'Milieu', 8, 'Eintracht Francfort'),
    mkPlayer('26', 'ALG15', 'Riyad Mahrez', 'Algérie', '🇩🇿', 'dz', 'Attaquant', 7, 'Al-Ahli FC'),
    mkPlayer('26', 'ALG16', 'Said Benrahma', 'Algérie', '🇩🇿', 'dz', 'Attaquant', 10, 'Olympique Lyonnais'),
    mkPlayer('26', 'ALG17', 'Anis Hadj Moussa', 'Algérie', '🇩🇿', 'dz', 'Attaquant', 12, 'Feyenoord Rotterdam'),
    mkPlayer('26', 'ALG18', 'Amine Gouiri', 'Algérie', '🇩🇿', 'dz', 'Attaquant', 17, 'Stade Rennais'),
    mkPlayer('26', 'ALG19', 'Baghdad Bounedjah', 'Algérie', '🇩🇿', 'dz', 'Attaquant', 9, 'Al-Shamal SC'),
    mkPlayer('26', 'ALG20', 'Mohammed Amoura', 'Algérie', '🇩🇿', 'dz', 'Attaquant', 18, 'VfL Wolfsburg'),
    // ── Autriche ──
    mkBadge('26', 'AUT1', 'Autriche', '🇦🇹', 'at'),
    mkPlayer('26', 'AUT2', 'Alexander Schlager', 'Autriche', '🇦🇹', 'at', 'Gardien', 1, 'RB Salzbourg'),
    mkPlayer('26', 'AUT3', 'Patrick Pentz', 'Autriche', '🇦🇹', 'at', 'Gardien', 13, 'Brøndby IF'),
    mkPlayer('26', 'AUT4', 'David Alaba', 'Autriche', '🇦🇹', 'at', 'Défenseur', 8, 'Real Madrid'),
    mkPlayer('26', 'AUT5', 'Kevin Danso', 'Autriche', '🇦🇹', 'at', 'Défenseur', 4, 'RC Lens'),
    mkPlayer('26', 'AUT6', 'Philipp Lienhart', 'Autriche', '🇦🇹', 'at', 'Défenseur', 15, 'SC Fribourg'),
    mkPlayer('26', 'AUT7', 'Stefan Posch', 'Autriche', '🇦🇹', 'at', 'Défenseur', 5, 'Bologne FC'),
    mkPlayer('26', 'AUT8', 'Phillipp Mwene', 'Autriche', '🇦🇹', 'at', 'Défenseur', 16, 'FSV Mayence'),
    mkPlayer('26', 'AUT9', 'Alexander Prass', 'Autriche', '🇦🇹', 'at', 'Milieu', 18, 'TSG Hoffenheim'),
    mkPlayer('26', 'AUT10', 'Xaver Schlager', 'Autriche', '🇦🇹', 'at', 'Milieu', 4, 'RB Leipzig'),
    mkPlayer('26', 'AUT11', 'Marcel Sabitzer', 'Autriche', '🇦🇹', 'at', 'Milieu', 9, 'Borussia Dortmund'),
    mkPlayer('26', 'AUT12', 'Konrad Laimer', 'Autriche', '🇦🇹', 'at', 'Milieu', 20, 'Bayern Munich'),
    mkSpecial('26', 'AUT13', 'Photo Autriche', 'special', 'Autriche', '🇦🇹', 'at'),
    mkPlayer('26', 'AUT14', 'Florian Grillitsch', 'Autriche', '🇦🇹', 'at', 'Milieu', 6, 'TSG Hoffenheim'),
    mkPlayer('26', 'AUT15', 'Nicolas Seiwald', 'Autriche', '🇦🇹', 'at', 'Milieu', 6, 'RB Leipzig'),
    mkPlayer('26', 'AUT16', 'Romano Schmid', 'Autriche', '🇦🇹', 'at', 'Milieu', 19, 'Werder Brême'),
    mkPlayer('26', 'AUT17', 'Patrick Wimmer', 'Autriche', '🇦🇹', 'at', 'Attaquant', 23, 'VfL Wolfsburg'),
    mkPlayer('26', 'AUT18', 'Christoph Baumgartner', 'Autriche', '🇦🇹', 'at', 'Milieu', 19, 'RB Leipzig'),
    mkPlayer('26', 'AUT19', 'Michael Gregoritsch', 'Autriche', '🇦🇹', 'at', 'Attaquant', 11, 'SC Fribourg'),
    mkPlayer('26', 'AUT20', 'Marko Arnautović', 'Autriche', '🇦🇹', 'at', 'Attaquant', 7, 'Inter Milan'),
    // ── Jordan ──
    mkBadge('26', 'JOR1', 'Jordanie', '🇯🇴', 'jo'),
    mkPlayer('26', 'JOR2', 'Yazeed Abulaila', 'Jordanie', '🇯🇴', 'jo', 'Gardien', 1, 'Al-Hussein SC'),
    mkPlayer('26', 'JOR3', 'Ihsan Haddad', 'Jordanie', '🇯🇴', 'jo', 'Défenseur', 23, 'Al-Faisaly'),
    mkPlayer('26', 'JOR4', 'Mohammad Abu Hashish', 'Jordanie', '🇯🇴', 'jo', 'Défenseur', 3, 'Al-Wehdat'),
    mkPlayer('26', 'JOR5', 'Yazan Al-Arab', 'Jordanie', '🇯🇴', 'jo', 'Défenseur', 5, 'FC Séoul'),
    mkPlayer('26', 'JOR6', 'Abdallah Nasib', 'Jordanie', '🇯🇴', 'jo', 'Défenseur', 4, 'Al-Hussein SC'),
    mkPlayer('26', 'JOR7', 'Saleem Obaid', 'Jordanie', '🇯🇴', 'jo', 'Défenseur', 19, 'Al-Faisaly'),
    mkPlayer('26', 'JOR8', 'Mohammad Abualnadi', 'Jordanie', '🇯🇴', 'jo', 'Défenseur', 2, 'Al-Wehdat'),
    mkPlayer('26', 'JOR9', 'Ibrahim Saadeh', 'Jordanie', '🇯🇴', 'jo', 'Milieu', 8, 'Al-Khor SC'),
    mkPlayer('26', 'JOR10', 'Nizar Al-Rashdan', 'Jordanie', '🇯🇴', 'jo', 'Milieu', 21, 'Emirates Club'),
    mkPlayer('26', 'JOR11', 'Noor Al-Rawabdeh', 'Jordanie', '🇯🇴', 'jo', 'Milieu', 14, 'Selangor FC'),
    mkPlayer('26', 'JOR12', 'Mohannad Abu Taha', 'Jordanie', '🇯🇴', 'jo', 'Attaquant', 11, 'Al-Wehdat'),
    mkSpecial('26', 'JOR13', 'Photo Jordanie', 'special', 'Jordanie', '🇯🇴', 'jo'),
    mkPlayer('26', 'JOR14', 'Amer Jamous', 'Jordanie', '🇯🇴', 'jo', 'Milieu', 15, 'Al-Wehdat'),
    mkPlayer('26', 'JOR15', 'Mousa Al-Taamari', 'Jordanie', '🇯🇴', 'jo', 'Attaquant', 10, 'Montpellier HSC'),
    mkPlayer('26', 'JOR16', 'Yazan Al-Naimat', 'Jordanie', '🇯🇴', 'jo', 'Attaquant', 11, 'Al-Arabi SC'),
    mkPlayer('26', 'JOR17', 'Mahmoud Al-Mardi', 'Jordanie', '🇯🇴', 'jo', 'Attaquant', 13, 'Al-Hussein SC'),
    mkPlayer('26', 'JOR18', 'Ali Olwan', 'Jordanie', '🇯🇴', 'jo', 'Attaquant', 9, 'Al-Salmiya SC'),
    mkPlayer('26', 'JOR19', 'Mohammad Abu Zrayq', 'Jordanie', '🇯🇴', 'jo', 'Attaquant', 7, 'Al-Wehdat'),
    mkPlayer('26', 'JOR20', 'Ibrahim Sabra', 'Jordanie', '🇯🇴', 'jo', 'Attaquant', 18, 'Al-Wehdat'),
    // ── Portugal ──
    mkBadge('26', 'POR1', 'Portugal', '🇵🇹', 'pt'),
    mkPlayer('26', 'POR2', 'Diogo Costa', 'Portugal', '🇵🇹', 'pt', 'Gardien', 22, 'FC Porto'),
    mkPlayer('26', 'POR3', 'José Sá', 'Portugal', '🇵🇹', 'pt', 'Gardien', 12, 'Wolverhampton'),
    mkPlayer('26', 'POR4', 'Ruben Dias', 'Portugal', '🇵🇹', 'pt', 'Défenseur', 4, 'Manchester City'),
    mkPlayer('26', 'POR5', 'João Cancelo', 'Portugal', '🇵🇹', 'pt', 'Défenseur', 2, 'Al-Hilal'),
    mkPlayer('26', 'POR6', 'Diogo Dalot', 'Portugal', '🇵🇹', 'pt', 'Défenseur', 5, 'Manchester United'),
    mkPlayer('26', 'POR7', 'Nuno Mendes', 'Portugal', '🇵🇹', 'pt', 'Défenseur', 19, 'Paris Saint-Germain'),
    mkPlayer('26', 'POR8', 'Gonçalo Inácio', 'Portugal', '🇵🇹', 'pt', 'Défenseur', 14, 'Sporting CP'),
    mkPlayer('26', 'POR9', 'Bernardo Silva', 'Portugal', '🇵🇹', 'pt', 'Milieu', 10, 'Manchester City'),
    mkPlayer('26', 'POR10', 'Bruno Fernandes', 'Portugal', '🇵🇹', 'pt', 'Milieu', 8, 'Manchester United'),
    mkPlayer('26', 'POR11', 'Ruben Neves', 'Portugal', '🇵🇹', 'pt', 'Milieu', 18, 'Al-Hilal'),
    mkPlayer('26', 'POR12', 'Vitinha', 'Portugal', '🇵🇹', 'pt', 'Milieu', 23, 'Paris Saint-Germain'),
    mkSpecial('26', 'POR13', 'Photo Portugal', 'special', 'Portugal', '🇵🇹', 'pt'),
    mkPlayer('26', 'POR14', 'João Neves', 'Portugal', '🇵🇹', 'pt', 'Milieu', 15, 'Paris Saint-Germain'),
    mkPlayer('26', 'POR15', 'Cristiano Ronaldo', 'Portugal', '🇵🇹', 'pt', 'Attaquant', 7, 'Al-Nassr', 'cr7'),
    mkPlayer('26', 'POR16', 'Francisco Trincao', 'Portugal', '🇵🇹', 'pt', 'Attaquant', 11, 'Sporting CP'),
    mkPlayer('26', 'POR17', 'João Felix', 'Portugal', '🇵🇹', 'pt', 'Attaquant', 11, 'Chelsea'),
    mkPlayer('26', 'POR18', 'Gonçalo Ramos', 'Portugal', '🇵🇹', 'pt', 'Attaquant', 9, 'Paris Saint-Germain'),
    mkPlayer('26', 'POR19', 'Pedro Neto', 'Portugal', '🇵🇹', 'pt', 'Attaquant', 25, 'Chelsea'),
    mkPlayer('26', 'POR20', 'Rafael Leão', 'Portugal', '🇵🇹', 'pt', 'Attaquant', 17, 'AC Milan'),
    // ── Congo RD ──
    mkBadge('26', 'COD1', 'Congo RD', '🇨🇩', 'cd'),
    mkPlayer('26', 'COD2', 'Lionel Mpasi', 'Congo RD', '🇨🇩', 'cd', 'Gardien', 1, 'Rodez AF'),
    mkPlayer('26', 'COD3', 'Aaron Wan-Bissaka', 'Congo RD', '🇨🇩', 'cd', 'Défenseur', 2, 'West Ham United'),
    mkPlayer('26', 'COD4', 'Axel Tuanzebe', 'Congo RD', '🇨🇩', 'cd', 'Défenseur', 4, 'Ipswich Town'),
    mkPlayer('26', 'COD5', 'Arthur Masuaku', 'Congo RD', '🇨🇩', 'cd', 'Défenseur', 26, 'Beşiktaş JK'),
    mkPlayer('26', 'COD6', 'Chancel Mbemba', 'Congo RD', '🇨🇩', 'cd', 'Défenseur', 22, 'Olympique de Marseille'),
    mkPlayer('26', 'COD7', 'Joris Kayembe', 'Congo RD', '🇨🇩', 'cd', 'Défenseur', 12, 'KRC Genk'),
    mkPlayer('26', 'COD8', 'Charles Pickel', 'Congo RD', '🇨🇩', 'cd', 'Milieu', 18, 'Cremonese'),
    mkPlayer('26', 'COD9', 'Ngal\'ayel Mukau', 'Congo RD', '🇨🇩', 'cd', 'Milieu', 6, 'Lille OSC'),
    mkPlayer('26', 'COD10', 'Edo Kayembe', 'Congo RD', '🇨🇩', 'cd', 'Milieu', 8, 'Watford'),
    mkPlayer('26', 'COD11', 'Samuel Moutoussamy', 'Congo RD', '🇨🇩', 'cd', 'Milieu', 14, 'Sivasspor'),
    mkPlayer('26', 'COD12', 'Noah Sadiki', 'Congo RD', '🇨🇩', 'cd', 'Milieu', 21, 'Union Saint-Gilloise'),
    mkSpecial('26', 'COD13', 'Photo Congo RD', 'special', 'Congo RD', '🇨🇩', 'cd'),
    mkPlayer('26', 'COD14', 'Théo Bongonda', 'Congo RD', '🇨🇩', 'cd', 'Attaquant', 10, 'Spartak Moscou'),
    mkPlayer('26', 'COD15', 'Meschack Elia', 'Congo RD', '🇨🇩', 'cd', 'Attaquant', 13, 'Young Boys Berne'),
    mkPlayer('26', 'COD16', 'Yoane Wissa', 'Congo RD', '🇨🇩', 'cd', 'Attaquant', 20, 'Brentford'),
    mkPlayer('26', 'COD17', 'Brian Cipenga', 'Congo RD', '🇨🇩', 'cd', 'Attaquant', 7, 'Leixões SC'),
    mkPlayer('26', 'COD18', 'Fiston Mayele', 'Congo RD', '🇨🇩', 'cd', 'Attaquant', 19, 'Pyramids FC'),
    mkPlayer('26', 'COD19', 'Cédric Bakambu', 'Congo RD', '🇨🇩', 'cd', 'Attaquant', 9, 'Real Betis'),
    mkPlayer('26', 'COD20', 'Nathanaël Mbuku', 'Congo RD', '🇨🇩', 'cd', 'Attaquant', 11, 'Dinamo Zagreb'),
    // ── Ouzbékistan ──
    mkBadge('26', 'UZB1', 'Ouzbékistan', '🇺🇿', 'uz'),
    mkPlayer('26', 'UZB2', 'Utkir Yusupov', 'Ouzbékistan', '🇺🇿', 'uz', 'Gardien', 1, 'Foolad FC'),
    mkPlayer('26', 'UZB3', 'Farrukh Sayfiev', 'Ouzbékistan', '🇺🇿', 'uz', 'Défenseur', 13, 'FC Navbahor'),
    mkPlayer('26', 'UZB4', 'Sherzod Nasrullaev', 'Ouzbékistan', '🇺🇿', 'uz', 'Défenseur', 4, 'FC Nasaf'),
    mkPlayer('26', 'UZB5', 'Umar Eshmurodov', 'Ouzbékistan', '🇺🇿', 'uz', 'Défenseur', 5, 'Selangor FC'),
    mkPlayer('26', 'UZB6', 'Husniddin Aliqulov', 'Ouzbékistan', '🇺🇿', 'uz', 'Défenseur', 23, 'Çaykur Rizespor'),
    mkPlayer('26', 'UZB7', 'Rustam Ashurmatov', 'Ouzbékistan', '🇺🇿', 'uz', 'Défenseur', 3, 'Rubin Kazan'),
    mkPlayer('26', 'UZB8', 'Khojiakbar Alijonov', 'Ouzbékistan', '🇺🇿', 'uz', 'Défenseur', 2, 'Pakhtakor Tachkent'),
    mkPlayer('26', 'UZB9', 'Abdukodir Khusanov', 'Ouzbékistan', '🇺🇿', 'uz', 'Défenseur', 15, 'RC Lens'),
    mkPlayer('26', 'UZB10', 'Odiljon Hamrobekov', 'Ouzbékistan', '🇺🇿', 'uz', 'Milieu', 9, 'Navbahor Namangan'),
    mkPlayer('26', 'UZB11', 'Otabek Shukurov', 'Ouzbékistan', '🇺🇿', 'uz', 'Milieu', 7, 'Al-Fayha FC'),
    mkPlayer('26', 'UZB12', 'Jamshid Iskanderov', 'Ouzbékistan', '🇺🇿', 'uz', 'Milieu', 10, 'FC Navbahor'),
    mkSpecial('26', 'UZB13', 'Photo Ouzbékistan', 'special', 'Ouzbékistan', '🇺🇿', 'uz'),
    mkPlayer('26', 'UZB14', 'Azizbek Turgunboev', 'Ouzbékistan', '🇺🇿', 'uz', 'Milieu', 11, 'Sivasspor'),
    mkPlayer('26', 'UZB15', 'Khojimat Erkinov', 'Ouzbékistan', '🇺🇿', 'uz', 'Attaquant', 20, 'Al-Wahda FC'),
    mkPlayer('26', 'UZB16', 'Eldor Shomurodov', 'Ouzbékistan', '🇺🇿', 'uz', 'Attaquant', 14, 'AS Rome'),
    mkPlayer('26', 'UZB17', 'Oston Urunov', 'Ouzbékistan', '🇺🇿', 'uz', 'Attaquant', 11, 'Persepolis FC'),
    mkPlayer('26', 'UZB18', 'Jaloliddin Masharipov', 'Ouzbékistan', '🇺🇿', 'uz', 'Attaquant', 10, 'Esteghlal FC'),
    mkPlayer('26', 'UZB19', 'Igor Sergeev', 'Ouzbékistan', '🇺🇿', 'uz', 'Attaquant', 21, 'BG Pathum United'),
    mkPlayer('26', 'UZB20', 'Abbosbek Fayzullaev', 'Ouzbékistan', '🇺🇿', 'uz', 'Attaquant', 22, 'CSKA Moscou'),
    // ── Colombie ──
    mkBadge('26', 'COL1', 'Colombie', '🇨🇴', 'co'),
    mkPlayer('26', 'COL2', 'Camilo Vargas', 'Colombie', '🇨🇴', 'co', 'Gardien', 12, 'Atlas FC'),
    mkPlayer('26', 'COL3', 'David Ospina', 'Colombie', '🇨🇴', 'co', 'Gardien', 1, 'Atlético Nacional'),
    mkPlayer('26', 'COL4', 'Dávinson Sánchez', 'Colombie', '🇨🇴', 'co', 'Défenseur', 23, 'Galatasaray SK'),
    mkPlayer('26', 'COL5', 'Yerry Mina', 'Colombie', '🇨🇴', 'co', 'Défenseur', 13, 'Cagliari Calcio'),
    mkPlayer('26', 'COL6', 'Daniel Muñoz', 'Colombie', '🇨🇴', 'co', 'Défenseur', 21, 'Crystal Palace'),
    mkPlayer('26', 'COL7', 'Johan Mojica', 'Colombie', '🇨🇴', 'co', 'Défenseur', 17, 'RCD Majorque'),
    mkPlayer('26', 'COL8', 'Jhon Lucumí', 'Colombie', '🇨🇴', 'co', 'Défenseur', 3, 'Bologne FC'),
    mkPlayer('26', 'COL9', 'Santiago Arias', 'Colombie', '🇨🇴', 'co', 'Défenseur', 4, 'EC Bahia'),
    mkPlayer('26', 'COL10', 'Jefferson Lerma', 'Colombie', '🇨🇴', 'co', 'Milieu', 16, 'Crystal Palace'),
    mkPlayer('26', 'COL11', 'Kevin Castaño', 'Colombie', '🇨🇴', 'co', 'Milieu', 5, 'FK Krasnodar'),
    mkPlayer('26', 'COL12', 'Richard Ríos', 'Colombie', '🇨🇴', 'co', 'Milieu', 6, 'SE Palmeiras'),
    mkSpecial('26', 'COL13', 'Photo Colombie', 'special', 'Colombie', '🇨🇴', 'co'),
    mkPlayer('26', 'COL14', 'James Rodríguez', 'Colombie', '🇨🇴', 'co', 'Milieu', 10, 'Minnesota United', 'james'),
    mkPlayer('26', 'COL15', 'Juan Fernando Quintero', 'Colombie', '🇨🇴', 'co', 'Milieu', 20, 'Racing Club'),
    mkPlayer('26', 'COL16', 'Jorge Carrascal', 'Colombie', '🇨🇴', 'co', 'Milieu', 8, 'Dynamo Moscou'),
    mkPlayer('26', 'COL17', 'Jhon Arias', 'Colombie', '🇨🇴', 'co', 'Attaquant', 11, 'Fluminense FC'),
    mkPlayer('26', 'COL18', 'Jhon Córdoba', 'Colombie', '🇨🇴', 'co', 'Attaquant', 9, 'FK Krasnodar'),
    mkPlayer('26', 'COL19', 'Luis Suárez', 'Colombie', '🇨🇴', 'co', 'Attaquant', 19, 'UD Almería', 'suarez'),
    mkPlayer('26', 'COL20', 'Luis Díaz', 'Colombie', '🇨🇴', 'co', 'Attaquant', 7, 'Liverpool FC'),
    // ── Angleterre ──
    mkBadge('26', 'ENG1', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en'),
    mkPlayer('26', 'ENG2', 'Jordan Pickford', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Gardien', 1, 'Everton FC'),
    mkPlayer('26', 'ENG3', 'John Stones', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Défenseur', 5, 'Manchester City'),
    mkPlayer('26', 'ENG4', 'Marc Guéhi', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Défenseur', 6, 'Crystal Palace'),
    mkPlayer('26', 'ENG5', 'Ezri Konsa', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Défenseur', 14, 'Aston Villa'),
    mkPlayer('26', 'ENG6', 'Trent Alexander-Arnold', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Défenseur', 8, 'Liverpool FC'),
    mkPlayer('26', 'ENG7', 'Reece James', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Défenseur', 2, 'Chelsea FC'),
    mkPlayer('26', 'ENG8', 'Dan Burn', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Défenseur', 3, 'Newcastle United'),
    mkPlayer('26', 'ENG9', 'Jordan Henderson', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Milieu', 12, 'Ajax Amsterdam'),
    mkPlayer('26', 'ENG10', 'Declan Rice', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Milieu', 4, 'Arsenal FC'),
    mkPlayer('26', 'ENG11', 'Jude Bellingham', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Milieu', 10, 'Real Madrid', 'bellingham'),
    mkPlayer('26', 'ENG12', 'Cole Palmer', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Milieu', 24, 'Chelsea FC'),
    mkSpecial('26', 'ENG13', 'Photo Angleterre', 'special', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en'),
    mkPlayer('26', 'ENG14', 'Morgan Rogers', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Milieu', 19, 'Aston Villa'),
    mkPlayer('26', 'ENG15', 'Anthony Gordon', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Attaquant', 18, 'Newcastle United'),
    mkPlayer('26', 'ENG16', 'Phil Foden', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Attaquant', 11, 'Manchester City'),
    mkPlayer('26', 'ENG17', 'Bukayo Saka', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Attaquant', 7, 'Arsenal FC'),
    mkPlayer('26', 'ENG18', 'Harry Kane', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Attaquant', 9, 'Bayern Munich'),
    mkPlayer('26', 'ENG19', 'Marcus Rashford', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Attaquant', 17, 'Manchester United'),
    mkPlayer('26', 'ENG20', 'Ollie Watkins', 'Angleterre', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'en', 'Attaquant', 19, 'Aston Villa'),
    // ── Croatie ──
    mkBadge('26', 'CRO1', 'Croatie', '🇭🇷', 'cr'),
    mkPlayer('26', 'CRO2', 'Dominik Livaković', 'Croatie', '🇭🇷', 'cr', 'Gardien', 1, 'Fenerbahçe SK'),
    mkPlayer('26', 'CRO3', 'Duje Ćaleta-Car', 'Croatie', '🇭🇷', 'cr', 'Défenseur', 5, 'Olympique Lyonnais'),
    mkPlayer('26', 'CRO4', 'Joško Gvardiol', 'Croatie', '🇭🇷', 'cr', 'Défenseur', 4, 'Manchester City'),
    mkPlayer('26', 'CRO5', 'Josip Stanišić', 'Croatie', '🇭🇷', 'cr', 'Défenseur', 2, 'Bayern Munich'),
    mkPlayer('26', 'CRO6', 'Luka Vušković', 'Croatie', '🇭🇷', 'cr', 'Défenseur', 3, 'KVC Westerlo'),
    mkPlayer('26', 'CRO7', 'Josip Šutalo', 'Croatie', '🇭🇷', 'cr', 'Défenseur', 6, 'Ajax Amsterdam'),
    mkPlayer('26', 'CRO8', 'Kristijan Jakić', 'Croatie', '🇭🇷', 'cr', 'Milieu', 13, 'FC Augsbourg'),
    mkPlayer('26', 'CRO9', 'Luka Modrić', 'Croatie', '🇭🇷', 'cr', 'Milieu', 10, 'Real Madrid'),
    mkPlayer('26', 'CRO10', 'Mateo Kovačić', 'Croatie', '🇭🇷', 'cr', 'Milieu', 8, 'Manchester City'),
    mkPlayer('26', 'CRO11', 'Martin Baturina', 'Croatie', '🇭🇷', 'cr', 'Milieu', 16, 'Dinamo Zagreb'),
    mkPlayer('26', 'CRO12', 'Lovro Majer', 'Croatie', '🇭🇷', 'cr', 'Milieu', 7, 'VfL Wolfsburg'),
    mkSpecial('26', 'CRO13', 'Photo Croatie', 'special', 'Croatie', '🇭🇷', 'cr'),
    mkPlayer('26', 'CRO14', 'Mario Pašalić', 'Croatie', '🇭🇷', 'cr', 'Milieu', 15, 'Atalanta Bergame'),
    mkPlayer('26', 'CRO15', 'Petar Sučić', 'Croatie', '🇭🇷', 'cr', 'Milieu', 25, 'Dinamo Zagreb'),
    mkPlayer('26', 'CRO16', 'Ivan Perišić', 'Croatie', '🇭🇷', 'cr', 'Attaquant', 14, 'PSV Eindhoven'),
    mkPlayer('26', 'CRO17', 'Marco Pašalić', 'Croatie', '🇭🇷', 'cr', 'Attaquant', 22, 'HNK Rijeka'),
    mkPlayer('26', 'CRO18', 'Ante Budimir', 'Croatie', '🇭🇷', 'cr', 'Attaquant', 17, 'CA Osasuna'),
    mkPlayer('26', 'CRO19', 'Andrej Kramarić', 'Croatie', '🇭🇷', 'cr', 'Attaquant', 9, 'TSG Hoffenheim'),
    mkPlayer('26', 'CRO20', 'Franjo Ivanović', 'Croatie', '🇭🇷', 'cr', 'Attaquant', 19, 'Union Saint-Gilloise'),
    // ── Ghana ──
    mkBadge('26', 'GHA1', 'Ghana', '🇬🇭', 'gh'),
    mkPlayer('26', 'GHA2', 'Lawrence Ati Zigi', 'Ghana', '🇬🇭', 'gh', 'Gardien', 1, 'FC Saint-Gall'),
    mkPlayer('26', 'GHA3', 'Tariq Lamptey', 'Ghana', '🇬🇭', 'gh', 'Défenseur', 2, 'Brighton & Hove Albion'),
    mkPlayer('26', 'GHA4', 'Mohammed Salisu', 'Ghana', '🇬🇭', 'gh', 'Défenseur', 6, 'AS Monaco'),
    mkPlayer('26', 'GHA5', 'Alidu Seidu', 'Ghana', '🇬🇭', 'gh', 'Défenseur', 23, 'Stade Rennais'),
    mkPlayer('26', 'GHA6', 'Alexander Djiku', 'Ghana', '🇬🇭', 'gh', 'Défenseur', 21, 'Fenerbahçe SK'),
    mkPlayer('26', 'GHA7', 'Gideon Mensah', 'Ghana', '🇬🇭', 'gh', 'Défenseur', 14, 'AJ Auxerre'),
    mkPlayer('26', 'GHA8', 'Caleb Yirenkyi', 'Ghana', '🇬🇭', 'gh', 'Défenseur', 3, 'FC Nordsjælland'),
    mkPlayer('26', 'GHA9', 'Abdul Issahaku Fatawu', 'Ghana', '🇬🇭', 'gh', 'Attaquant', 7, 'Leicester City'),
    mkPlayer('26', 'GHA10', 'Thomas Partey', 'Ghana', '🇬🇭', 'gh', 'Milieu', 5, 'Arsenal FC'),
    mkPlayer('26', 'GHA11', 'Salis Abdul Samed', 'Ghana', '🇬🇭', 'gh', 'Milieu', 20, 'Sunderland AFC'),
    mkPlayer('26', 'GHA12', 'Kamaldeen Sulemana', 'Ghana', '🇬🇭', 'gh', 'Attaquant', 22, 'Southampton FC'),
    mkSpecial('26', 'GHA13', 'Photo Ghana', 'special', 'Ghana', '🇬🇭', 'gh'),
    mkPlayer('26', 'GHA14', 'Mohammed Kudus', 'Ghana', '🇬🇭', 'gh', 'Milieu', 20, 'West Ham United'),
    mkPlayer('26', 'GHA15', 'Iñaki Williams', 'Ghana', '🇬🇭', 'gh', 'Attaquant', 19, 'Athletic Bilbao'),
    mkPlayer('26', 'GHA16', 'Jordan Ayew', 'Ghana', '🇬🇭', 'gh', 'Attaquant', 9, 'Leicester City'),
    mkPlayer('26', 'GHA17', 'André Ayew', 'Ghana', '🇬🇭', 'gh', 'Attaquant', 10, 'Le Havre AC'),
    mkPlayer('26', 'GHA18', 'Joseph Paintsil', 'Ghana', '🇬🇭', 'gh', 'Attaquant', 11, 'Los Angeles Galaxy'),
    mkPlayer('26', 'GHA19', 'Osman Bukari', 'Ghana', '🇬🇭', 'gh', 'Attaquant', 11, 'Austin FC'),
    mkPlayer('26', 'GHA20', 'Antoine Semenyo', 'Ghana', '🇬🇭', 'gh', 'Attaquant', 25, 'AFC Bournemouth'),
    // ── Panama ──
    mkBadge('26', 'PAN1', 'Panama', '🇵🇦', 'pa'),
    mkPlayer('26', 'PAN2', 'Orlando Mosquera', 'Panama', '🇵🇦', 'pa', 'Gardien', 22, 'Al-Fayha FC'),
    mkPlayer('26', 'PAN3', 'Luis Mejía', 'Panama', '🇵🇦', 'pa', 'Gardien', 1, 'Club Nacional'),
    mkPlayer('26', 'PAN4', 'Fidel Escobar', 'Panama', '🇵🇦', 'pa', 'Défenseur', 4, 'Deportivo Saprissa'),
    mkPlayer('26', 'PAN5', 'Andrés Andrade', 'Panama', '🇵🇦', 'pa', 'Défenseur', 3, 'LASK'),
    mkPlayer('26', 'PAN6', 'Michael Amir Murillo', 'Panama', '🇵🇦', 'pa', 'Défenseur', 23, 'Olympique de Marseille'),
    mkPlayer('26', 'PAN7', 'Eric Davis', 'Panama', '🇵🇦', 'pa', 'Défenseur', 15, 'Vila Nova FC'),
    mkPlayer('26', 'PAN8', 'José Córdoba', 'Panama', '🇵🇦', 'pa', 'Défenseur', 24, 'Norwich City'),
    mkPlayer('26', 'PAN9', 'César  Blackman', 'Panama', '🇵🇦', 'pa', 'Défenseur', 2, 'Slovan Bratislava'),
    mkPlayer('26', 'PAN10', 'Cristian Martínez', 'Panama', '🇵🇦', 'pa', 'Milieu', 6, 'Kiryat Shmona'),
    mkPlayer('26', 'PAN11', 'Aníbal Godoy', 'Panama', '🇵🇦', 'pa', 'Milieu', 20, 'Nashville SC'),
    mkPlayer('26', 'PAN12', 'Adalberto Carrasquilla', 'Panama', '🇵🇦', 'pa', 'Milieu', 8, 'Houston Dynamo'),
    mkSpecial('26', 'PAN13', 'Photo Panama', 'special', 'Panama', '🇵🇦', 'pa'),
    mkPlayer('26', 'PAN14', 'Édgar Bárcenas', 'Panama', '🇵🇦', 'pa', 'Milieu', 10, 'Mazatlán FC'),
    mkPlayer('26', 'PAN15', 'Carlos Harvey', 'Panama', '🇵🇦', 'pa', 'Milieu', 16, 'Minnesota United'),
    mkPlayer('26', 'PAN16', 'Ismael Díaz', 'Panama', '🇵🇦', 'pa', 'Attaquant', 7, 'Universidad Católica'),
    mkPlayer('26', 'PAN17', 'José Fajardo', 'Panama', '🇵🇦', 'pa', 'Attaquant', 17, 'Universidad Católica'),
    mkPlayer('26', 'PAN18', 'Cecilio Waterman', 'Panama', '🇵🇦', 'pa', 'Attaquant', 9, 'Alianza Lima'),
    mkPlayer('26', 'PAN19', 'José Luis Rodríguez', 'Panama', '🇵🇦', 'pa', 'Attaquant', 11, 'FC Juárez'),
    mkPlayer('26', 'PAN20', 'Alberto Quintero', 'Panama', '🇵🇦', 'pa', 'Attaquant', 19, 'CD Plaza Amador'),
    // ── Stickers spéciaux FWC ──
    mkSpecial('26', 'FWC9', 'Italy 1934', 'special', 'FIFA World Cup History', '🌎', 'us'),
    mkSpecial('26', 'FWC10', 'Uruguay 1950', 'special', 'FIFA World Cup History', '🌎', 'us'),
    mkSpecial('26', 'FWC11', 'West Germany 1954', 'special', 'FIFA World Cup History', '🌎', 'us'),
    mkSpecial('26', 'FWC12', 'Brazil 1962', 'special', 'FIFA World Cup History', '🌎', 'us'),
    mkSpecial('26', 'FWC13', 'West Germany 1974', 'special', 'FIFA World Cup History', '🌎', 'us'),
    mkSpecial('26', 'FWC14', 'Argentina 1986', 'special', 'FIFA World Cup History', '🌎', 'us'),
    mkSpecial('26', 'FWC15', 'Brazil 1994', 'special', 'FIFA World Cup History', '🌎', 'us'),
    mkSpecial('26', 'FWC16', 'Brazil 2002', 'special', 'FIFA World Cup History', '🌎', 'us'),
    mkSpecial('26', 'FWC17', 'Italy 2006', 'special', 'FIFA World Cup History', '🌎', 'us'),
    mkSpecial('26', 'FWC18', 'Germany 2014', 'special', 'FIFA World Cup History', '🌎', 'us'),
    mkSpecial('26', 'FWC19', 'Argentina 2022', 'special', 'FIFA World Cup History', '🌎', 'us'),
  ]),
};

// ─── Cross-edition player index ───────────────────────────────────────────────

export const PLAYERS: Record<string, Player> = {
  // Légendes
  pele:         { key: 'pele',         name: 'Pelé',                flag: '🇧🇷', nationality: 'Brésil',      position: 'Attaquant', editionIds: ['70'] },
  beckenbauer:  { key: 'beckenbauer',  name: 'Franz Beckenbauer',   flag: '🇩🇪', nationality: 'Allemagne',   position: 'Défenseur', editionIds: ['70','74'] },
  cruyff:       { key: 'cruyff',       name: 'Johan Cruyff',        flag: '🇳🇱', nationality: 'Pays-Bas',    position: 'Attaquant', editionIds: ['74'] },
  gerdmuller:   { key: 'gerdmuller',   name: 'Gerd Müller',         flag: '🇩🇪', nationality: 'Allemagne',   position: 'Attaquant', editionIds: ['70','74'] },
  maradona:     { key: 'maradona',     name: 'Diego Maradona',      flag: '🇦🇷', nationality: 'Argentine',   position: 'Milieu',    editionIds: ['82','86','90','94'] },
  platini:      { key: 'platini',      name: 'Michel Platini',      flag: '🇫🇷', nationality: 'France',      position: 'Milieu',    editionIds: ['82','86'] },
  zico:         { key: 'zico',         name: 'Zico',                flag: '🇧🇷', nationality: 'Brésil',      position: 'Milieu',    editionIds: ['78','82','86'] },
  kempes:       { key: 'kempes',       name: 'Mario Kempes',        flag: '🇦🇷', nationality: 'Argentine',   position: 'Attaquant', editionIds: ['74','78'] },
  rummenigge:   { key: 'rummenigge',   name: 'K.-H. Rummenigge',    flag: '🇩🇪', nationality: 'Allemagne',   position: 'Attaquant', editionIds: ['78','82','86'] },
  paolorossi:   { key: 'paolorossi',   name: 'Paolo Rossi',         flag: '🇮🇹', nationality: 'Italie',      position: 'Attaquant', editionIds: ['78','82'] },
  lothar:       { key: 'lothar',       name: 'Lothar Matthäus',     flag: '🇩🇪', nationality: 'Allemagne',   position: 'Milieu',    editionIds: ['86','90','94','98'] },
  lineker:      { key: 'lineker',      name: 'Gary Lineker',        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', nationality: 'Angleterre',  position: 'Attaquant', editionIds: ['86','90'] },
  francescoli:  { key: 'francescoli',  name: 'Enzo Francescoli',    flag: '🇺🇾', nationality: 'Uruguay',     position: 'Attaquant', editionIds: ['86'] },
  vanbasten:    { key: 'vanbasten',    name: 'Marco van Basten',    flag: '🇳🇱', nationality: 'Pays-Bas',    position: 'Attaquant', editionIds: ['90'] },
  rbaggio:      { key: 'rbaggio',      name: 'Roberto Baggio',      flag: '🇮🇹', nationality: 'Italie',      position: 'Attaquant', editionIds: ['90','94','98'] },
  romario:      { key: 'romario',      name: 'Romário',             flag: '🇧🇷', nationality: 'Brésil',      position: 'Attaquant', editionIds: ['94'] },
  batistuta:    { key: 'batistuta',    name: 'Gabriel Batistuta',   flag: '🇦🇷', nationality: 'Argentine',   position: 'Attaquant', editionIds: ['94','98','02'] },
  hagi:         { key: 'hagi',         name: 'Gheorghe Hagi',       flag: '🇷🇴', nationality: 'Roumanie',    position: 'Milieu',    editionIds: ['94'] },
  stoichkov:    { key: 'stoichkov',    name: 'Hristo Stoichkov',    flag: '🇧🇬', nationality: 'Bulgarie',    position: 'Attaquant', editionIds: ['94'] },
  okocha:       { key: 'okocha',       name: 'Jay-Jay Okocha',      flag: '🇳🇬', nationality: 'Nigéria',     position: 'Milieu',    editionIds: ['94'] },
  // Ère 98-06
  zidane:       { key: 'zidane',       name: 'Zinédine Zidane',     flag: '🇫🇷', nationality: 'France',      position: 'Milieu',    editionIds: ['94','98','02','06'] },
  henry:        { key: 'henry',        name: 'Thierry Henry',       flag: '🇫🇷', nationality: 'France',      position: 'Attaquant', editionIds: ['98','02','06','10'] },
  ronaldo:      { key: 'ronaldo',      name: 'Ronaldo (R9)',        flag: '🇧🇷', nationality: 'Brésil',      position: 'Attaquant', editionIds: ['94','98','02','06'] },
  ronaldinho:   { key: 'ronaldinho',   name: 'Ronaldinho',          flag: '🇧🇷', nationality: 'Brésil',      position: 'Milieu',    editionIds: ['02','06'] },
  kaka:         { key: 'kaka',         name: 'Kaká',                flag: '🇧🇷', nationality: 'Brésil',      position: 'Milieu',    editionIds: ['02','06','10'] },
  bergkamp:     { key: 'bergkamp',     name: 'Dennis Bergkamp',     flag: '🇳🇱', nationality: 'Pays-Bas',    position: 'Attaquant', editionIds: ['98'] },
  beckham:      { key: 'beckham',      name: 'David Beckham',       flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', nationality: 'Angleterre',  position: 'Milieu',    editionIds: ['98','02','06'] },
  raul:         { key: 'raul',         name: 'Raúl González',       flag: '🇪🇸', nationality: 'Espagne',     position: 'Attaquant', editionIds: ['98','02','06'] },
  klose:        { key: 'klose',        name: 'Miroslav Klose',      flag: '🇩🇪', nationality: 'Allemagne',   position: 'Attaquant', editionIds: ['02','06','10','14'] },
  ribery:       { key: 'ribery',       name: 'Franck Ribéry',       flag: '🇫🇷', nationality: 'France',      position: 'Milieu',    editionIds: ['06','10'] },
  pirlo:        { key: 'pirlo',        name: 'Andrea Pirlo',        flag: '🇮🇹', nationality: 'Italie',      position: 'Milieu',    editionIds: ['06','10','14'] },
  ftorres:      { key: 'ftorres',      name: 'Fernando Torres',     flag: '🇪🇸', nationality: 'Espagne',     position: 'Attaquant', editionIds: ['06','10'] },
  villa:        { key: 'villa',        name: 'David Villa',         flag: '🇪🇸', nationality: 'Espagne',     position: 'Attaquant', editionIds: ['06','10','14'] },
  // Ère 10-18
  messi:        { key: 'messi',        name: 'Lionel Messi',        flag: '🇦🇷', nationality: 'Argentine',   position: 'Attaquant', editionIds: ['06','10','14','18','22','26'] },
  cr7:          { key: 'cr7',          name: 'Cristiano Ronaldo',   flag: '🇵🇹', nationality: 'Portugal',    position: 'Attaquant', editionIds: ['06','10','14','18','22','26'] },
  xavi:         { key: 'xavi',         name: 'Xavi Hernández',      flag: '🇪🇸', nationality: 'Espagne',     position: 'Milieu',    editionIds: ['10','14'] },
  iniesta:      { key: 'iniesta',      name: 'Andrés Iniesta',      flag: '🇪🇸', nationality: 'Espagne',     position: 'Milieu',    editionIds: ['10','14','18'] },
  lahm:         { key: 'lahm',         name: 'Philipp Lahm',        flag: '🇩🇪', nationality: 'Allemagne',   position: 'Défenseur', editionIds: ['06','10','14'] },
  muller:       { key: 'muller',       name: 'Thomas Müller',       flag: '🇩🇪', nationality: 'Allemagne',   position: 'Attaquant', editionIds: ['10','14','18','22'] },
  neuer:        { key: 'neuer',        name: 'Manuel Neuer',        flag: '🇩🇪', nationality: 'Allemagne',   position: 'Gardien',   editionIds: ['14','18','22','26'] },
  forlan:       { key: 'forlan',       name: 'Diego Forlán',        flag: '🇺🇾', nationality: 'Uruguay',     position: 'Attaquant', editionIds: ['10'] },
  suarez:       { key: 'suarez',       name: 'Luis Suárez',         flag: '🇺🇾', nationality: 'Uruguay',     position: 'Attaquant', editionIds: ['10','14','18'] },
  cavani:       { key: 'cavani',       name: 'Edinson Cavani',      flag: '🇺🇾', nationality: 'Uruguay',     position: 'Attaquant', editionIds: ['14','18'] },
  robben:       { key: 'robben',       name: 'Arjen Robben',        flag: '🇳🇱', nationality: 'Pays-Bas',    position: 'Attaquant', editionIds: ['10','14'] },
  james:        { key: 'james',        name: 'James Rodríguez',     flag: '🇨🇴', nationality: 'Colombie',    position: 'Milieu',    editionIds: ['14'] },
  benzema:      { key: 'benzema',      name: 'Karim Benzema',       flag: '🇫🇷', nationality: 'France',      position: 'Attaquant', editionIds: ['14'] },
  neymar:       { key: 'neymar',       name: 'Neymar Jr',           flag: '🇧🇷', nationality: 'Brésil',      position: 'Attaquant', editionIds: ['14','18','22'] },
  kdb:          { key: 'kdb',          name: 'Kevin De Bruyne',     flag: '🇧🇪', nationality: 'Belgique',    position: 'Milieu',    editionIds: ['14','18','22','26'] },
  modric:       { key: 'modric',       name: 'Luka Modrić',         flag: '🇭🇷', nationality: 'Croatie',     position: 'Milieu',    editionIds: ['06','10','14','18','22'] },
  // Ère 18-26
  mbappe:       { key: 'mbappe',       name: 'Kylian Mbappé',       flag: '🇫🇷', nationality: 'France',      position: 'Attaquant', editionIds: ['18','22','26'] },
  griezmann:    { key: 'griezmann',    name: 'Antoine Griezmann',   flag: '🇫🇷', nationality: 'France',      position: 'Attaquant', editionIds: ['14','18','22','26'] },
  kane:         { key: 'kane',         name: 'Harry Kane',          flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', nationality: 'Angleterre',  position: 'Attaquant', editionIds: ['18','22','26'] },
  bellingham:   { key: 'bellingham',   name: 'Jude Bellingham',     flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', nationality: 'Angleterre',  position: 'Milieu',    editionIds: ['22','26'] },
  foden:        { key: 'foden',        name: 'Phil Foden',          flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', nationality: 'Angleterre',  position: 'Milieu',    editionIds: ['22','26'] },
  vini:         { key: 'vini',         name: 'Vinícius Jr',         flag: '🇧🇷', nationality: 'Brésil',      position: 'Attaquant', editionIds: ['22','26'] },
  vandijk:      { key: 'vandijk',      name: 'Virgil van Dijk',     flag: '🇳🇱', nationality: 'Pays-Bas',    position: 'Défenseur', editionIds: ['22','26'] },
  pedri:        { key: 'pedri',        name: 'Pedri',               flag: '🇪🇸', nationality: 'Espagne',     position: 'Milieu',    editionIds: ['22','26'] },
  gavi:         { key: 'gavi',         name: 'Gavi',                flag: '🇪🇸', nationality: 'Espagne',     position: 'Milieu',    editionIds: ['22','26'] },
  musiala:      { key: 'musiala',      name: 'Jamal Musiala',       flag: '🇩🇪', nationality: 'Allemagne',   position: 'Milieu',    editionIds: ['22','26'] },
  hakimi:       { key: 'hakimi',       name: 'Achraf Hakimi',       flag: '🇲🇦', nationality: 'Maroc',       position: 'Défenseur', editionIds: ['22','26'] },
  // Nouveaux 2026
  yamal:        { key: 'yamal',        name: 'Lamine Yamal',        flag: '🇪🇸', nationality: 'Espagne',     position: 'Milieu',    editionIds: ['26'] },
  wirtz:        { key: 'wirtz',        name: 'Florian Wirtz',       flag: '🇩🇪', nationality: 'Allemagne',   position: 'Milieu',    editionIds: ['26'] },
  endrick:      { key: 'endrick',      name: 'Endrick',             flag: '🇧🇷', nationality: 'Brésil',      position: 'Attaquant', editionIds: ['26'] },
  davies:       { key: 'davies',       name: 'Alphonso Davies',     flag: '🇨🇦', nationality: 'Canada',      position: 'Défenseur', editionIds: ['26'] },
  darwin:       { key: 'darwin',       name: 'Darwin Núñez',        flag: '🇺🇾', nationality: 'Uruguay',     position: 'Attaquant', editionIds: ['26'] },
  donnarumma:   { key: 'donnarumma',   name: 'G. Donnarumma',       flag: '🇮🇹', nationality: 'Italie',      position: 'Gardien',   editionIds: ['26'] },
  son:          { key: 'son',          name: 'Son Heung-min',       flag: '🇰🇷', nationality: 'Corée du Sud', position: 'Attaquant', editionIds: ['26'] },
  xavisimons:   { key: 'xavisimons',   name: 'Xavi Simons',         flag: '🇳🇱', nationality: 'Pays-Bas',    position: 'Milieu',    editionIds: ['26'] },
  mitoma:       { key: 'mitoma',       name: 'Kaoru Mitoma',        flag: '🇯🇵', nationality: 'Japon',       position: 'Milieu',    editionIds: ['26'] },
};

// ─── Effectifs complets 1970 → 2022 (chargés à la demande) ────────────────────
// Chaque album est complété avec les joueurs des effectifs officiels
// (src/data/squads/<édition>.ts, Fjelstul World Cup Database) quand on en a
// besoin : le démarrage ne télécharge que les stickers saisis à la main.
// Les stickers déjà saisis gardent leur numéro, pour que les collections
// existantes restent valides ; les joueurs manquants (et l'écusson d'une
// équipe s'il manque) reçoivent les numéros suivants.

Object.assign(BG, TEAM_GRADIENTS);

// Taille finale de chaque album, connue dès le démarrage (pourcentages justes avant chargement)
for (const ed of EDITIONS) {
  if (CHECKLIST_SIZES[ed.id]) ed.totalStickers = CHECKLIST_SIZES[ed.id]; // checklist officielle : taille exacte
  else if (SQUAD_SIZES[ed.id]) ed.totalStickers = Math.max(ed.totalStickers, SQUAD_SIZES[ed.id]);
}

// ─── Photos libres de droits (Wikimedia Commons, voir photos.ts) ──────────────
// Retrouvée par clé de joueur ("pele") ou par nom ("Kylian Mbappé" importé des effectifs).
const photoKey = (name: string) => name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const PHOTOS_BY_NAME = new Map(Object.values(PHOTOS).map((p) => [photoKey(p.name), p]));

/** Photo (et crédits) du joueur d'un sticker, s'il en a une. */
export const getPhoto = (s: Sticker): PlayerPhoto | undefined =>
  s.category === 'badge' || !s.player ? undefined
    : PHOTOS[s.player.playerKey ?? ''] ?? PHOTOS_BY_NAME.get(photoKey(s.player.name));

const attachPhoto = (s: Sticker) => { if (!s.imageUrl) s.imageUrl = getPhoto(s)?.url; };
Object.values(STICKERS_BY_EDITION).forEach((list) => list.forEach(attachPhoto));

const SQUAD_POS = { G: 'Gardien', D: 'Défenseur', M: 'Milieu', A: 'Attaquant' } as const;
const normName = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\bjr\b\.?/g, 'junior'); // "Vin\u00edcius Jr" = "Vin\u00edcius J\u00fanior"
const lastWord = (s: string) => normName(s).split(/\s+/).pop() ?? '';
// Mots significatifs d'un nom (sans "de", "da", "van"… ni initiales)
const nameWords = (s: string) => normName(s).split(/[\s.]+/).filter((w) => w.length >= 4);
const teamOfSticker = (s: Sticker) => s.teamName ?? s.player?.nationality ?? '';

/**
 * Même joueur sous deux orthographes ? Même nom de famille (avec la même initiale de prénom quand
 * les deux en ont un), nom inversé (« Heung-min Son »), orthographe proche (« Rivellino ») ou même
 * maillot + nom proche. Renvoie l'index dans `names`, ou -1.
 */
function findSamePlayer(rawNames: Array<{ name: string; shirt?: number }>, rawName: string, shirt?: number) {
  // « Al-Sheeb » = « Al Sheeb »
  const names = rawNames.map((x) => ({ ...x, name: x.name.replace(/-/g, ' ') }));
  const name = rawName.replace(/-/g, ' ');
  const exact = names.findIndex((x) => normName(x.name) === normName(name));
  if (exact !== -1) return exact;
  const last = lastWord(name);
  const words = nameWords(name);
  const initial = (n: string) => (normName(n).split(/\s+/).length > 1 ? normName(n)[0] : '');
  return names.findIndex((x) => {
    const l = lastWord(x.name);
    const sameInitial = !initial(x.name) || !initial(name) || initial(x.name) === initial(name);
    return (l === last && sameInitial)
      || words.includes(l) || nameWords(x.name).includes(last)
      || (l.length >= 5 && l.slice(0, 5) === last.slice(0, 5) && Math.abs(l.length - last.length) <= 1 && sameInitial)
      || (shirt != null && x.shirt === shirt && l.slice(0, 4) === last.slice(0, 4));
  });
}

// « Heung-min Son » = « Heungmin Son », « Lionel Andres Messi » = « Lionel Messi » :
// même équipe nationale, même nom de famille, même premier prénom (ou son initiale).
const compact = (s: string) => normName(s).replace(/[-'.]/g, '').split(/\s+/).filter(Boolean);
const samePerson = (a: string, b: string) => {
  const x = compact(a), y = compact(b);
  if (x.join('') === y.join('')) return true;
  if (x.length === 2 && y.length === 2 && x[0] === y[1] && x[1] === y[0]) return true; // « Son Heung-min » (ordre coréen)
  if (x.length < 2 || y.length < 2 || x[x.length - 1] !== y[y.length - 1]) return false;
  const [fx, fy] = [x[0], y[0]];
  return fx === fy || (fx.length === 1 && fy.startsWith(fx)) || (fy.length === 1 && fx.startsWith(fy));
};
const playersByNation = new Map<string, Player[]>();
// « clé|album » des stickers réellement rangés (les stars saisies à la main annoncent leurs albums d'avance)
const placed = new Set<string>();

/** Page joueur : relie le sticker à ses autres Coupes du Monde (même joueur, autre orthographe comprise). */
const registerPlayer = (editionId: string, s: Sticker) => {
  const p = s.player!;
  let known = PLAYERS[p.playerKey!];
  if (!known) {
    // Déjà connu sous une autre graphie ? Jamais deux fois dans le même album.
    known = (playersByNation.get(p.nationality) ?? []).find((x) => !placed.has(`${x.key}|${editionId}`) && samePerson(x.name, p.name))!;
    if (known) p.playerKey = known.key;
  }
  if (!known) {
    known = PLAYERS[p.playerKey!] = { key: p.playerKey!, name: p.name, flag: p.flag, nationality: p.nationality, position: p.position ?? '', editionIds: [editionId] };
    playersByNation.set(p.nationality, [...(playersByNation.get(p.nationality) ?? []), known]);
  } else if (!known.editionIds.includes(editionId)) known.editionIds.push(editionId);
  placed.add(`${known.key}|${editionId}`);
};
// Les stars saisies à la main servent de point de départ
for (const pl of Object.values(PLAYERS)) playersByNation.set(pl.nationality, [...(playersByNation.get(pl.nationality) ?? []), pl]);

/** Construction d'un album sans checklist : stickers saisis + effectifs numérotés à la suite.
 *  `register` = false : calcul seul (pour convertir les anciennes collections), sans toucher PLAYERS. */
function mergeSquads(editionId: string, squads: Record<string, string>, list: Sticker[] = (STICKERS_BY_EDITION[editionId] ??= []), register = true) {
  let next = list.reduce((max, s) => Math.max(max, s.number), 0) + 1;

  // Ordre des pages : les équipes déjà présentes d'abord, puis les autres par ordre alphabétique
  const known = [...new Set(list.map(teamOfSticker))];
  const codes = Object.keys(squads).filter((c) => TEAMS[c]).sort((a, b) => {
    const ia = known.indexOf(TEAMS[a].name), ib = known.indexOf(TEAMS[b].name);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
    return TEAMS[a].name.localeCompare(TEAMS[b].name, 'fr');
  });

  for (const code of codes) {
    const team = TEAMS[code];
    const existing = list.filter((s) => teamOfSticker(s) === team.name);
    // Joueurs déjà saisis à la main, pas encore associés à un joueur de l'effectif
    const pool = existing.filter((s) => s.category !== 'badge');

    if (!existing.some((s) => s.category === 'badge')) list.push(mkBadge(editionId, next++, team.name, team.flag, team.colKey));

    // Déjà saisi à la main ? Chaque sticker saisi ne sert qu'une fois.
    // 1er passage : nom identique — sinon "Lautaro Martínez" prendrait la place d'"Emiliano Martínez".
    const players = squads[code].split(';').map((entry) => entry.split('|'));
    const done = players.map(([, , name]) => {
      const i = pool.findIndex((s) => normName(s.player?.name ?? '') === normName(name));
      return i !== -1 && !!pool.splice(i, 1);
    });

    players.forEach(([shirt, pos, name], idx) => {
      if (done[idx]) return;
      // 2e passage : même nom de famille (avec la même initiale de prénom quand les deux en ont un),
      // nom inversé ("Heung-min Son"), orthographe proche ("Rivellino") ou même maillot + nom proche
      const last = lastWord(name);
      const words = nameWords(name);
      const initial = (n: string) => (normName(n).split(/\s+/).length > 1 ? normName(n)[0] : '');
      const match = pool.findIndex((s) => {
        const other = s.player?.name ?? '';
        const l = lastWord(other);
        const sameInitial = !initial(other) || !initial(name) || initial(other) === initial(name);
        return (l === last && sameInitial)
          || words.includes(l) || nameWords(other).includes(last)
          || (l.length >= 5 && l.slice(0, 5) === last.slice(0, 5) && Math.abs(l.length - last.length) <= 1 && sameInitial)
          || (s.player?.jerseyNumber === Number(shirt) && l.slice(0, 4) === last.slice(0, 4));
      });
      if (match !== -1) { pool.splice(match, 1); return; }
      const sticker = mkPlayer(editionId, next++, name, team.name, team.flag, team.colKey, SQUAD_POS[pos as keyof typeof SQUAD_POS], Number(shirt), '');
      attachPhoto(sticker);
      list.push(sticker);
      if (register) registerPlayer(editionId, sticker); // page joueur : on relie ses Coupes du Monde
    });
  }

  // Range l'album par équipe (pages), puis par numéro
  const order = new Map<string, number>();
  for (const s of list) if (!order.has(teamOfSticker(s))) order.set(teamOfSticker(s), order.size);
  list.sort((a, b) => order.get(teamOfSticker(a))! - order.get(teamOfSticker(b))! || a.number - b.number);

  const edition = EDITIONS.find((e) => e.id === editionId);
  if (edition && register) edition.totalStickers = Math.max(edition.totalStickers, list.length);
  return list;
}

// ─── Albums avec checklist officielle Panini (src/data/checklists/) ──────────
// L'album est reconstruit dans l'ordre Panini, avec les vrais numéros. Pour chaque
// joueur on récupère ce qu'on sait déjà : sticker saisi à la main (clé joueur, club,
// photo) ou effectif officiel (poste, maillot).

const TEAM_CODE_BY_NAME = Object.fromEntries(Object.entries(TEAMS).map(([code, t]) => [t.name, code]));

function buildFromChecklist(editionId: string, checklist: string, squads: Record<string, string> | undefined, hand: Sticker[]) {
  const edition = EDITIONS.find((e) => e.id === editionId)!;
  const list: Sticker[] = [];
  for (const line of checklist.split('\n')) {
    const [num, code, section, kindRaw, name] = line.split('|');
    const number = Number(num);
    const shiny = kindRaw.endsWith('*');
    const teamCode = TEAM_CODE_BY_NAME[section];
    const meta = teamCode ? TEAMS[teamCode] : { flag: edition.hostFlag, colKey: edition.colKey };
    let s: Sticker;
    if (kindRaw[0] === 'B') {
      s = mkBadge(editionId, number, section, meta.flag, meta.colKey);
      s.isShiny = shiny;
    } else if (kindRaw[0] === 'S') {
      s = mkSpecial(editionId, number, name, shiny ? 'shiny' : 'special', section, meta.flag, meta.colKey);
    } else {
      const handPool = hand.filter((h) => h.category !== 'badge' && teamOfSticker(h) === section && h.player);
      const h = handPool[findSamePlayer(handPool.map((x) => ({ name: x.player!.name, shirt: x.player!.jerseyNumber })), name)];
      const squad = (teamCode && squads?.[teamCode] ? squads[teamCode].split(';') : []).map((e) => e.split('|'));
      const q = squad[findSamePlayer(squad.map(([shirt, , n]) => ({ name: n, shirt: Number(shirt) })), name)];
      const pos = h?.player?.position ?? (q ? SQUAD_POS[q[1] as keyof typeof SQUAD_POS] : undefined);
      const shirt = h?.player?.jerseyNumber ?? (q ? Number(q[0]) : undefined);
      // Nom déjà saisi à la main de préférence : les vieilles checklists n'ont pas les accents (« Pele »)
      s = mkPlayer(editionId, number, h?.player?.name ?? name, section, meta.flag, meta.colKey, pos!, shirt!, h?.player?.club ?? '', h?.player?.playerKey, shiny || !!h?.isShiny, h?.imageUrl);
      attachPhoto(s);
      registerPlayer(editionId, s);
    }
    if (code) s.code = prettyCode(code);
    list.push(s);
  }
  return list;
}

/**
 * Ancien numéro → nouveau, pour convertir les collections cochées avant la checklist
 * officielle : même page, et même joueur (ou écusson de la même équipe).
 */
function renumberMap(oldList: Sticker[], newList: Sticker[]) {
  const map = new Map<number, number>();
  const free = [...newList];
  for (const o of oldList) {
    const team = teamOfSticker(o);
    const candidates = free.filter((n) => teamOfSticker(n) === team && (n.category === 'badge') === (o.category === 'badge'));
    const i = o.category === 'badge' ? 0 : findSamePlayer(candidates.map((n) => ({ name: n.player?.name ?? '' })), o.player?.name ?? '', o.player?.jerseyNumber);
    const match = candidates[i];
    if (!match) continue;
    map.set(o.number, match.number);
    free.splice(free.indexOf(match), 1);
  }
  return map;
}

const renumberListeners = new Set<(editionId: string, map: Map<number, number>) => void>();
/** Prévient (la collection) qu'un album vient de passer aux numéros officiels. */
export const onEditionRenumbered = (fn: (editionId: string, map: Map<number, number>) => void) => { renumberListeners.add(fn); };

// ─── Chargement à la demande ────────────────────────────────────────────────
// Un fichier JS par album (Vite le découpe tout seul grâce à import.meta.glob).

const SQUAD_FILES = import.meta.glob<{ default: Record<string, string> }>('./squads/*.ts');
const CHECKLIST_FILES = import.meta.glob<{ default: string }>('./checklists/*.ts');
const pending: Record<string, Promise<void>> = {};
const loaded = new Set<string>();
let dataVersion = 0;
const listeners = new Set<() => void>();

/** L'album est-il complet (rien à charger, ou déjà chargé) ? */
export const isEditionLoaded = (editionId: string) => (!SQUAD_FILES[`./squads/${editionId}.ts`] && !CHECKLIST_FILES[`./checklists/${editionId}.ts`]) || loaded.has(editionId);

/** Charge les effectifs d'un album (une seule fois) et prévient les composants abonnés. */
export function loadEdition(editionId: string): Promise<void> {
  const file = SQUAD_FILES[`./squads/${editionId}.ts`];
  const checklistFile = CHECKLIST_FILES[`./checklists/${editionId}.ts`];
  if ((!file && !checklistFile) || loaded.has(editionId)) return Promise.resolve();
  return (pending[editionId] ??= Promise.all([file?.(), checklistFile?.()]).then(([squadMod, checklistMod]) => {
    if (checklistMod) {
      const hand = STICKERS_BY_EDITION[editionId] ?? [];
      const next = buildFromChecklist(editionId, checklistMod.default, squadMod?.default, hand);
      const old = squadMod ? mergeSquads(editionId, squadMod.default, [...hand], false) : hand;
      STICKERS_BY_EDITION[editionId] = next;
      const map = renumberMap(old, next);
      renumberListeners.forEach((fn) => fn(editionId, map));
    } else if (squadMod) {
      mergeSquads(editionId, squadMod.default);
    }
    loaded.add(editionId);
    dataVersion++;
    listeners.forEach((fn) => fn());
  }, (err) => {
    delete pending[editionId]; // échec réseau : on pourra réessayer
    throw err;
  }));
}

export const loadAllEditions = () => Promise.all(EDITIONS.map((e) => loadEdition(e.id))).then(() => {});

/** Pour useSyncExternalStore : change à chaque album chargé. */
export const subscribeData = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
export const getDataVersion = () => dataVersion;
