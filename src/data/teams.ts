// ─── Équipes des effectifs importés (codes de la Fjelstul World Cup Database) ──
// Nom français, drapeau et clé de couleur (BG). Les noms reprennent ceux déjà
// utilisés dans stickers.ts pour que les stickers existants et importés se
// rangent sur la même page d'équipe.

export interface TeamMeta { name: string; flag: string; colKey: string }

/** Drapeau emoji à partir d'un code pays ISO à 2 lettres ("BR" → 🇧🇷). */
const flag = (iso2: string) => String.fromCodePoint(...[...iso2].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

const ENGLAND = '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
const SCOTLAND = '🏴󠁧󠁢󠁳󠁣󠁴󠁿';
const WALES = '🏴󠁧󠁢󠁷󠁬󠁳󠁿';

export const TEAMS: Record<string, TeamMeta> = {
  // Europe
  BEL: { name: 'Belgique',             flag: flag('BE'), colKey: 'be' },
  BGR: { name: 'Bulgarie',             flag: flag('BG'), colKey: 'bul' },
  CSK: { name: 'Tchécoslovaquie',      flag: flag('CZ'), colKey: 'cs' },
  CZE: { name: 'Tchéquie',             flag: flag('CZ'), colKey: 'cs' },
  SVK: { name: 'Slovaquie',            flag: flag('SK'), colKey: 'sk' },
  ENG: { name: 'Angleterre',           flag: ENGLAND,    colKey: 'en' },
  SCO: { name: 'Écosse',               flag: SCOTLAND,   colKey: 'sc' },
  WAL: { name: 'Pays de Galles',       flag: WALES,      colKey: 'wal' },
  NIR: { name: 'Irlande du Nord',      flag: flag('GB'), colKey: 'nir' },
  IRL: { name: 'Irlande',              flag: flag('IE'), colKey: 'ie' },
  ITA: { name: 'Italie',               flag: flag('IT'), colKey: 'it' },
  ISR: { name: 'Israël',               flag: flag('IL'), colKey: 'il' },
  ROU: { name: 'Roumanie',             flag: flag('RO'), colKey: 'ro' },
  SUN: { name: 'URSS',                 flag: flag('RU'), colKey: 'ru' },
  RUS: { name: 'Russie',               flag: flag('RU'), colKey: 'ru' },
  UKR: { name: 'Ukraine',              flag: flag('UA'), colKey: 'ua' },
  SWE: { name: 'Suède',                flag: flag('SE'), colKey: 'se' },
  NOR: { name: 'Norvège',              flag: flag('NO'), colKey: 'no' },
  DNK: { name: 'Danemark',             flag: flag('DK'), colKey: 'dk' },
  ISL: { name: 'Islande',              flag: flag('IS'), colKey: 'is' },
  DEU: { name: 'Allemagne',            flag: flag('DE'), colKey: 'de' },
  DDR: { name: 'RDA',                  flag: flag('DE'), colKey: 'ddr' },
  NLD: { name: 'Pays-Bas',             flag: flag('NL'), colKey: 'nl' },
  POL: { name: 'Pologne',              flag: flag('PL'), colKey: 'pl' },
  YUG: { name: 'Yougoslavie',          flag: flag('YU'), colKey: 'yu' },
  SCG: { name: 'Serbie-et-Monténégro', flag: flag('RS'), colKey: 'scg' },
  SRB: { name: 'Serbie',               flag: flag('RS'), colKey: 'rs' },
  HRV: { name: 'Croatie',              flag: flag('HR'), colKey: 'hr' },
  SVN: { name: 'Slovénie',             flag: flag('SI'), colKey: 'si' },
  BIH: { name: 'Bosnie-Herzégovine',   flag: flag('BA'), colKey: 'ba' },
  AUT: { name: 'Autriche',             flag: flag('AT'), colKey: 'at' },
  CHE: { name: 'Suisse',               flag: flag('CH'), colKey: 'ch' },
  FRA: { name: 'France',               flag: flag('FR'), colKey: 'fr' },
  ESP: { name: 'Espagne',              flag: flag('ES'), colKey: 'es' },
  PRT: { name: 'Portugal',             flag: flag('PT'), colKey: 'pt' },
  HUN: { name: 'Hongrie',              flag: flag('HU'), colKey: 'hu' },
  GRC: { name: 'Grèce',                flag: flag('GR'), colKey: 'gr' },
  TUR: { name: 'Turquie',              flag: flag('TR'), colKey: 'tr' },
  // Amériques
  BRA: { name: 'Brésil',               flag: flag('BR'), colKey: 'br' },
  ARG: { name: 'Argentine',            flag: flag('AR'), colKey: 'ar' },
  URY: { name: 'Uruguay',              flag: flag('UY'), colKey: 'uy' },
  CHL: { name: 'Chili',                flag: flag('CL'), colKey: 'cl' },
  PER: { name: 'Pérou',                flag: flag('PE'), colKey: 'pe' },
  COL: { name: 'Colombie',             flag: flag('CO'), colKey: 'co' },
  ECU: { name: 'Équateur',             flag: flag('EC'), colKey: 'ec' },
  PRY: { name: 'Paraguay',             flag: flag('PY'), colKey: 'py' },
  BOL: { name: 'Bolivie',              flag: flag('BO'), colKey: 'bo' },
  MEX: { name: 'Mexique',              flag: flag('MX'), colKey: 'mx' },
  USA: { name: 'États-Unis',           flag: flag('US'), colKey: 'us' },
  CAN: { name: 'Canada',               flag: flag('CA'), colKey: 'ca' },
  CRI: { name: 'Costa Rica',           flag: flag('CR'), colKey: 'cr' },
  HND: { name: 'Honduras',             flag: flag('HN'), colKey: 'hn' },
  SLV: { name: 'Salvador',             flag: flag('SV'), colKey: 'sv' },
  PAN: { name: 'Panama',               flag: flag('PA'), colKey: 'pa' },
  HTI: { name: 'Haïti',                flag: flag('HT'), colKey: 'ht' },
  JAM: { name: 'Jamaïque',             flag: flag('JM'), colKey: 'jm' },
  TTO: { name: 'Trinité-et-Tobago',    flag: flag('TT'), colKey: 'tt' },
  // Afrique
  MAR: { name: 'Maroc',                flag: flag('MA'), colKey: 'ma' },
  DZA: { name: 'Algérie',              flag: flag('DZ'), colKey: 'dz' },
  TUN: { name: 'Tunisie',              flag: flag('TN'), colKey: 'tn' },
  EGY: { name: 'Égypte',               flag: flag('EG'), colKey: 'eg' },
  CMR: { name: 'Cameroun',             flag: flag('CM'), colKey: 'cm' },
  NGA: { name: 'Nigéria',              flag: flag('NG'), colKey: 'ng' },
  SEN: { name: 'Sénégal',              flag: flag('SN'), colKey: 'sn' },
  GHA: { name: 'Ghana',                flag: flag('GH'), colKey: 'gh' },
  CIV: { name: "Côte d'Ivoire",        flag: flag('CI'), colKey: 'ci' },
  TGO: { name: 'Togo',                 flag: flag('TG'), colKey: 'tg' },
  AGO: { name: 'Angola',               flag: flag('AO'), colKey: 'ao' },
  ZAF: { name: 'Afrique du Sud',       flag: flag('ZA'), colKey: 'za' },
  COD: { name: 'Zaïre',                flag: flag('CD'), colKey: 'cd' },
  // Asie & Océanie
  JPN: { name: 'Japon',                flag: flag('JP'), colKey: 'jp' },
  KOR: { name: 'Corée du Sud',         flag: flag('KR'), colKey: 'kr' },
  PRK: { name: 'Corée du Nord',        flag: flag('KP'), colKey: 'kp' },
  CHN: { name: 'Chine',                flag: flag('CN'), colKey: 'cn' },
  IRN: { name: 'Iran',                 flag: flag('IR'), colKey: 'ir' },
  IRQ: { name: 'Irak',                 flag: flag('IQ'), colKey: 'iq' },
  KWT: { name: 'Koweït',               flag: flag('KW'), colKey: 'kw' },
  SAU: { name: 'Arabie Saoudite',      flag: flag('SA'), colKey: 'sa' },
  ARE: { name: 'Émirats arabes unis',  flag: flag('AE'), colKey: 'ae' },
  QAT: { name: 'Qatar',                flag: flag('QA'), colKey: 'qa' },
  AUS: { name: 'Australie',            flag: flag('AU'), colKey: 'au' },
  NZL: { name: 'Nouvelle-Zélande',     flag: flag('NZ'), colKey: 'nz' },
};

const g = (a: string, b: string, c: string) => `linear-gradient(160deg,${a} 0%,${b} 50%,${c} 100%)`;

/** Dégradés aux couleurs des équipes qui n'en avaient pas encore dans BG. */
export const TEAM_GRADIENTS: Record<string, string> = {
  sk: g('#fff', '#0B4EA2', '#EE1C25'),     sc: g('#005EB8', '#fff', '#005EB8'),
  wal: g('#fff', '#C8102E', '#00B140'),    nir: g('#fff', '#C8102E', '#fff'),
  ie: g('#169B62', '#fff', '#FF883E'),     il: g('#fff', '#0038B8', '#fff'),
  ua: g('#0057B7', '#0057B7', '#FFD700'),  se: g('#006AA7', '#FECC00', '#006AA7'),
  no: g('#BA0C2F', '#fff', '#00205B'),     is: g('#02529C', '#fff', '#DC1E35'),
  ddr: g('#000', '#DD0000', '#FFCE00'),    yu: g('#003893', '#fff', '#DE0000'),
  scg: g('#0C4076', '#fff', '#C6363C'),    rs: g('#C6363C', '#0C4076', '#fff'),
  hr: g('#FF0000', '#fff', '#171796'),     si: g('#fff', '#005DA4', '#ED1C24'),
  ba: g('#002395', '#FECB00', '#002395'),  at: g('#ED2939', '#fff', '#ED2939'),
  hu: g('#CD2A3E', '#fff', '#436F4D'),     gr: g('#0D5EAF', '#fff', '#0D5EAF'),
  cl: g('#0039A6', '#fff', '#D52B1E'),     pe: g('#D91023', '#fff', '#D91023'),
  co: g('#FCD116', '#003893', '#CE1126'),  py: g('#D52B1E', '#fff', '#0038A8'),
  bo: g('#D52B1E', '#F9E300', '#007934'),  hn: g('#0073CF', '#fff', '#0073CF'),
  sv: g('#0F47AF', '#fff', '#0F47AF'),     pa: g('#DA121A', '#fff', '#072357'),
  ht: g('#00209F', '#00209F', '#D21034'),  jm: g('#009B3A', '#FED100', '#000'),
  tt: g('#CE1126', '#000', '#CE1126'),     dz: g('#006233', '#fff', '#D21034'),
  tn: g('#E70013', '#fff', '#E70013'),     eg: g('#CE1126', '#fff', '#000'),
  ci: g('#F77F00', '#fff', '#009E60'),     tg: g('#006A4E', '#FFCE00', '#D21034'),
  ao: g('#CC092F', '#000', '#FFCB00'),     cd: g('#007FFF', '#F7D618', '#CE1021'),
  kp: g('#024FA2', '#ED1C27', '#024FA2'),  cn: g('#DE2910', '#FFDE00', '#DE2910'),
  iq: g('#CE1126', '#fff', '#000'),        kw: g('#007A3D', '#fff', '#CE1126'),
  sa: g('#006C35', '#fff', '#006C35'),     ae: g('#00732F', '#fff', '#000'),
  nz: g('#00247D', '#fff', '#CC142B'),
};
