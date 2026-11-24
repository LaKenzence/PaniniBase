/**
 * import-checklists.mjs
 * Transforme les checklists Panini (fichier texte, un album après l'autre) en
 * données de l'appli : src/data/checklists/<édition>.ts + src/data/checklists.ts.
 *
 * Usage : node scripts/import-checklists.mjs "C:\chemin\Joueurs.txt" [année]
 *   [année] : album des lignes placées avant le premier en-tête (ex. 1998), s'il y en a.
 *   Les albums absents du fichier gardent leur checklist déjà importée.
 *
 * Formats reconnus dans le fichier (un en-tête « 2022 : » avant chaque album) :
 *   2022        « QAT 3 - Saad Al Sheeb - Qatar »                (code - nom - équipe)
 *   1970→2018   « 209<TAB>Kylian Mbappé<TAB>France<TAB>-<TAB>… » (numéro, nom, équipe, type)
 *               le numéro est parfois seul sur sa ligne, suivi du reste
 * 2026 est ignoré (déjà saisi avec les codes officiels dans stickers.ts). 1994 aussi tant que
 * sa checklist est incomplète (moins de 400 stickers) : l'album garderait des trous.
 * On garde l'album de base : variantes « 36x » et extras régionaux (McDonald's,
 * Coca-Cola, mises à jour…) sont écartés.
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(import.meta.dirname, '..', 'src', 'data', 'checklists');
const EDITIONS = {
  2022: '22', 2018: '18', 2014: '14', 2010: '10', 2006: '06', 2002: '02',
  1998: '98', 1994: '94', 1990: '90', 1986: '86', 1982: '82', 1978: '78', 1974: '74', 1970: '70',
};
// Taille minimale crédible d'un album (une checklist plus courte est incomplète)
const MIN_SIZE = { '94': 400 };

// Nom d'équipe dans le fichier (anglais ou langue locale) → nom français de l'appli (teams.ts)
const TEAM_FR = {
  'Algeria': 'Algérie', 'Algérie': 'Algérie', 'Angola': 'Angola', 'Argentina': 'Argentine', 'Australia': 'Australie',
  'Belgium': 'Belgique', 'Belgique - Belgiё': 'Belgique', 'Belgique/Belgiä': 'Belgique',
  'Bosna i Hercegovina': 'Bosnie-Herzégovine', 'Brasil': 'Brésil', 'Brazil': 'Brésil',
  'Cameroon': 'Cameroun', 'Cameroun': 'Cameroun', 'Canada': 'Canada', 'Ceska Republika': 'Tchéquie',
  'Chile': 'Chili', 'China': 'Chine', 'Colombia': 'Colombie', 'Costa Rica': 'Costa Rica',
  "Cote D'Ivoire": "Côte d'Ivoire", "Côte D'Ivoire": "Côte d'Ivoire", "Côte d'Ivoire": "Côte d'Ivoire",
  'Croatia': 'Croatie', 'Hrvatska': 'Croatie', 'Danmark': 'Danemark', 'Denmark': 'Danemark',
  'Deutschland': 'Allemagne', 'Germany': 'Allemagne', 'Ecuador': 'Équateur', 'Egypt': 'Égypte',
  'England': 'Angleterre', 'España': 'Espagne', 'Spain': 'Espagne', 'France': 'France', 'Ghana': 'Ghana',
  'Hellas': 'Grèce', 'Helvetia': 'Suisse', 'Switzerland': 'Suisse', 'Honduras': 'Honduras',
  'Iceland': 'Islande', 'IR Iran': 'Iran', 'Iran': 'Iran', 'Ireland': 'Irlande', 'Italia': 'Italie',
  'Japan': 'Japon', 'Korea': 'Corée du Sud', 'Korea Republic': 'Corée du Sud', 'Korea Rebublic': 'Corée du Sud',
  'Korea DPR': 'Corée du Nord', 'Mexico': 'Mexique', 'México': 'Mexique', 'Morocco': 'Maroc',
  'Nederland': 'Pays-Bas', 'Netherlands': 'Pays-Bas', 'New Zealand': 'Nouvelle-Zélande', 'Nigeria': 'Nigéria',
  'Panama': 'Panama', 'Paraguay': 'Paraguay', 'Peru': 'Pérou', 'Poland': 'Pologne', 'Polska': 'Pologne',
  'Portugal': 'Portugal', 'Qatar': 'Qatar', 'Rossija': 'Russie', 'Russia': 'Russie',
  'Saudi Arabia': 'Arabie Saoudite', 'Senegal': 'Sénégal', 'Serbia': 'Serbie', 'Srbija': 'Serbie',
  'Srbija i Crna Gora': 'Serbie-et-Monténégro', 'Slovenija': 'Slovénie', 'Slovenská Republika': 'Slovaquie',
  'South Africa': 'Afrique du Sud', 'Sverige': 'Suède', 'Sweden': 'Suède', 'Togo': 'Togo',
  'Trinidad and Tobago': 'Trinité-et-Tobago', 'Tunisia': 'Tunisie', 'Tunisie': 'Tunisie', 'Türkiye': 'Turquie',
  'Ukrajina': 'Ukraine', 'Uruguay': 'Uruguay', 'USA': 'États-Unis', 'Usa': 'États-Unis', 'Wales': 'Pays de Galles',
  // Albums 1970–1998
  'Belgique-Belgie': 'Belgique', 'El Salvador': 'Salvador', 'U.S.S.R.': 'URSS', 'USSR': 'URSS', 'SSSR': 'URSS', 'CCCP': 'URSS',
  'Israel': 'Israël', 'Ceskoslovensko': 'Tchécoslovaquie', 'Chzechoslovakia': 'Tchécoslovaquie', 'CSSR': 'Tchécoslovaquie',
  'Romania': 'Roumanie', 'Bulgaria': 'Bulgarie', 'Maroc': 'Maroc', 'Marocco': 'Maroc',
  'W. Germany': 'Allemagne', 'West Germany': 'Allemagne', 'Deutschland-BRD': 'Allemagne', 'East Germany': 'RDA', 'GDR': 'RDA',
  'Zair': 'Zaïre', 'Iugoslavia': 'Yougoslavie', 'Jugoslavija': 'Yougoslavie', 'Yugoslavija': 'Yougoslavie',
  'Scotia': 'Écosse', 'Scotland': 'Écosse', 'Holland': 'Pays-Bas', 'Haiti': 'Haïti',
  'Hungaria': 'Hongrie', 'Hungary': 'Hongrie', 'Magyarorszag': 'Hongrie', 'Austria': 'Autriche', 'Osterreich': 'Autriche', 'Österreich': 'Autriche',
  'Tunis': 'Tunisie', 'Norway': 'Norvège', 'Norge': 'Norvège', 'Algerie': 'Algérie', 'Kuwait': 'Koweït', 'Espana': 'Espagne',
  'Northern Ireland': 'Irlande du Nord', 'North Ireland': 'Irlande du Nord', 'South Korea': 'Corée du Sud', 'Irak': 'Irak',
  'UAE': 'Émirats arabes unis', 'Jamaica': 'Jamaïque', 'Bolivia': 'Bolivie', 'Greece': 'Grèce', 'Italy': 'Italie',
};
// Pages hors équipes
const SECTION_FR = {
  'Introduction': 'Introduction', 'Intro': 'Introduction', '-': 'Introduction', 'metal': 'Introduction',
  'Stadiums': 'Stades', "Host cities' posters": 'Villes hôtes', 'FIFA Museum': 'Musée FIFA',
  'FIFA World Cup Legends': 'Légendes',
  // Albums 1970–1998
  'Special': 'Introduction', 'Mexico 70': 'Introduction', 'Programma Mexico 70': 'Introduction', 'Playing talisman': 'Introduction',
  'History': 'Histoire', 'poster': 'Affiches', 'Estadio': 'Stades', 'Stadium': 'Stades', 'City': 'Villes hôtes',
  'Cities & Stadiums': 'Stades', 'Stadiums & Cities': 'Stades',
};

// « Group A - Italia » → « Italia » ; « History: WC 1930 », « Uruguay 1930 » (1970) → histoire
const normalizeWhere = (where) => {
  const w = where.replace(/^Group [A-H] - /, '');
  if (/^History: /.test(w) || (/^\D+ (19[3-6]\d)$/.test(w) && !TEAM_FR[w])) return 'History';
  return w;
};

const kindOf = (name, inTeam) => {
  if (!inTeam) return 'S';
  // Écusson : aussi « Stema » (roumain, 1974), « Federation » (1978), « Flag » (1970)
  if (/\b(emblem|logo|badge|stema|steama|federation|flag)\b/i.test(name)) return 'B';
  // Photo d'équipe, mascotte, caricature : « Echipa » (1974), « Italia (team) » (1982)
  if (/\b(team|echipa|mascota|mascot|caricature)\b/i.test(name)) return 'S';
  return 'P';
};

function parse(file, firstYear) {
  const lines = fs.readFileSync(file, 'utf8').replace(/\r/g, '').split('\n');
  const blocks = {};
  let year = firstYear ?? null;
  if (year) blocks[year] = [];
  for (const l of lines) {
    const m = l.match(/^(\d{4})\s*[:(]/);
    if (m) { year = m[1]; blocks[year] = []; continue; }
    if (year) blocks[year].push(l);
  }

  const out = {};
  const unknown = new Set();
  for (const [y, editionId] of Object.entries(EDITIONS)) {
    const raw = blocks[y];
    if (!raw) continue; // album absent de ce fichier : on garde sa checklist actuelle
    const rows = [];

    if (y === '2022') {
      for (const l of raw.map((s) => s.trim()).filter(Boolean)) {
        const parts = l.split(' - ');
        const code = parts[0].replace(/\s+/g, '');
        const where = parts[parts.length - 1].trim();
        const name = parts.slice(1, -1).join(' - ').trim();
        const team = TEAM_FR[where];
        const section = team ?? SECTION_FR[where];
        if (!section) unknown.add(`${y}: ${where}`);
        rows.push({ code, section: section ?? where, kind: kindOf(name, !!team), name });
      }
      // Numéros = position dans l'album (comme 2026), le code Panini est gardé à part
      rows.forEach((r, i) => { r.number = i; });
    } else {
      // « 12 » seul sur une ligne + « Nom<TAB>Équipe<TAB>metal… » sur la suivante
      const merged = [];
      for (let i = 0; i < raw.length; i++) {
        const l = raw[i].trim();
        if (!l) continue;
        if (/^\d+$/.test(l) && i + 1 < raw.length && raw[i + 1].includes('\t')) { merged.push(`${l}\t${raw[++i].trim()}`); continue; }
        merged.push(l);
      }
      const seen = new Set();
      for (const l of merged) {
        const [num, name, rawWhere = '', type = ''] = l.split('\t').map((s) => s.trim());
        const where = normalizeWhere(rawWhere);
        if (!/^\d+$/.test(num) || num === '000') continue; // variantes, extras, « 000 » (même numéro que « 00 »)
        const number = parseInt(num, 10);
        if (seen.has(number)) continue;
        seen.add(number);
        const team = TEAM_FR[where];
        const section = team ?? SECTION_FR[where];
        if (!section) { unknown.add(`${y}: ${where}`); continue; } // éditions spéciales (US version…)
        rows.push({ number, code: '', section: section ?? where, kind: kindOf(name, !!team), name, shiny: type === 'metal' });
      }
      rows.sort((a, b) => a.number - b.number);
    }
    if (rows.length < (MIN_SIZE[editionId] ?? 0)) { console.warn(`⚠ ${y} : ${rows.length} stickers seulement, checklist incomplète ignorée`); continue; }
    out[editionId] = rows;
  }
  if (unknown.size) console.warn('⚠ Pages non reconnues, ignorées :', [...unknown].join(' | '));
  return out;
}

const file = process.argv[2];
if (!file) { console.error('Usage : node scripts/import-checklists.mjs <fichier.txt>'); process.exit(1); }
const data = parse(file, process.argv[3]);

fs.mkdirSync(OUT_DIR, { recursive: true });
// On garde les albums importés depuis un autre fichier
const SIZES_FILE = path.join(import.meta.dirname, '..', 'src', 'data', 'checklists.ts');
const sizes = Object.fromEntries([...(fs.existsSync(SIZES_FILE) ? fs.readFileSync(SIZES_FILE, 'utf8') : '').matchAll(/'(\d\d)': (\d+)/g)].map((m) => [m[1], Number(m[2])]));
for (const [editionId, rows] of Object.entries(data)) {
  sizes[editionId] = rows.length;
  const body = rows.map((r) => [r.number, r.code, r.section, r.kind + (r.shiny ? '*' : ''), r.name.replace(/\|/g, '/')].join('|')).join('\n');
  fs.writeFileSync(path.join(OUT_DIR, `${editionId}.ts`),
    `// Généré par scripts/import-checklists.mjs — ne pas modifier à la main.\n` +
    `// Checklist officielle Panini de l'album, dans l'ordre.\n` +
    `// Une ligne par sticker : numéro|code Panini|page|type (P joueur, B écusson, S spécial ; * = brillant)|nom\n\n` +
    `const checklist = ${JSON.stringify(body)};\n\nexport default checklist;\n`);
  console.log(`✓ ${editionId} : ${rows.length} stickers`);
}
fs.writeFileSync(SIZES_FILE,
  `// Généré par scripts/import-checklists.mjs — ne pas modifier à la main.\n` +
  `// Nombre de stickers de chaque album dont on a la checklist officielle Panini.\n\n` +
  `export const CHECKLIST_SIZES: Record<string, number> = ${JSON.stringify(sizes, null, 2).replace(/"(\w+)":/g, "'$1':")};\n`);
