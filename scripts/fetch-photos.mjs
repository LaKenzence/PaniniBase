/**
 * fetch-photos.mjs
 * Génère src/data/photos.ts : une photo libre de droits (Wikimedia Commons)
 * pour chaque joueur de l'index PLAYERS de src/data/stickers.ts, avec son
 * auteur et sa licence (à afficher dans l'appli, c'est obligatoire).
 *
 * Joueur → Wikidata (footballeur, bonne nationalité, avec une image P18)
 *        → Commons (miniature 400 px, auteur, licence, page du fichier).
 * Les joueurs sans photo trouvée gardent la silhouette.
 *
 * Usage : node scripts/fetch-photos.mjs
 * Prérequis : Node 18+ (fetch natif). Aucun npm install nécessaire.
 */

import { readFile, writeFile } from 'node:fs/promises';

const STICKERS = new URL('../src/data/stickers.ts', import.meta.url);
const OUT = new URL('../src/data/photos.ts', import.meta.url);
const HEADERS = { 'User-Agent': 'PaniniBase/1.0 (projet de fan non commercial)' };
const FOOTBALLER = 'Q937857';

// Nationalité (telle qu'écrite dans PLAYERS) → pays Wikidata acceptés (P27 nationalité / P1532 pays sportif)
const COUNTRY = {
  'Allemagne': ['Q183', 'Q713750'], 'Brésil': ['Q155'], 'Espagne': ['Q29'], 'France': ['Q142'],
  'Pays-Bas': ['Q55', 'Q29999'], 'Uruguay': ['Q77'], 'Angleterre': ['Q21', 'Q145'], 'Italie': ['Q38'],
  'Argentine': ['Q414'], 'Roumanie': ['Q218'], 'Portugal': ['Q45'], 'Nigéria': ['Q1033'], 'Maroc': ['Q1028'],
  'Japon': ['Q17'], 'Croatie': ['Q224'], 'Corée du Sud': ['Q884'], 'Colombie': ['Q739'], 'Canada': ['Q16'],
  'Bulgarie': ['Q219'], 'Belgique': ['Q31'],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Wikimedia limite le nombre de requêtes : on patiente et on réessaie (429 = trop de requêtes)
const api = async (base, params, attempt = 0) => {
  const url = `${base}?${new URLSearchParams({ format: 'json', ...params })}`;
  const res = await fetch(url, { headers: HEADERS });
  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    await sleep(Number(res.headers.get('retry-after')) * 1000 || 2000 * 2 ** attempt);
    return api(base, params, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const json = await res.json();
  // Serveur surchargé ("maxlag") : réponse 200 avec une erreur → on patiente et on réessaie
  if (json.error && attempt < 5) {
    await sleep(Number(res.headers.get('retry-after')) * 1000 || 3000 * 2 ** attempt);
    return api(base, params, attempt + 1);
  }
  if (json.error) throw new Error(`${json.error.code} ${url}`);
  return json;
};
const wikidata = (p) => api('https://www.wikidata.org/w/api.php', p);
const commons = (p) => api('https://commons.wikimedia.org/w/api.php', p);
const claimIds = (entity, prop) => (entity.claims?.[prop] ?? []).map((c) => c.mainsnak?.datavalue?.value?.id).filter(Boolean);
const stripHtml = (html = '') => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  .replace(/^(.+?)\s*\1$/, '$1')            // "Unknown authorUnknown author" → "Unknown author"
  .replace(/^Unknown author$/i, 'Auteur inconnu');

// Index PLAYERS : "  pele: { key: 'pele', name: 'Pelé', … nationality: 'Brésil', …"
const src = await readFile(STICKERS, 'utf8');
const players = [...src.matchAll(/^\s+[a-z0-9]+:\s*\{ key: '([^']+)',\s*name: '((?:[^'\\]|\\.)*)',.*?nationality: '([^']+)'/gm)]
  .map(([, key, name, nationality]) => ({ key, name: name.replace(/\\'/g, "'"), nationality }));

// Noms abrégés dans PLAYERS → nom complet pour la recherche
const SEARCH_AS = { 'Ronaldo (R9)': 'Ronaldo Nazário', 'K.-H. Rummenigge': 'Karl-Heinz Rummenigge' };

// Reprise : on garde les photos déjà trouvées (le script peut être relancé sans tout refaire)
let photos = {};
try {
  const previous = await readFile(OUT, 'utf8');
  photos = JSON.parse(previous.slice(previous.indexOf('PHOTOS: Record<string, PlayerPhoto> = ') + 38).trim().replace(/;$/, ''));
} catch { /* premier lancement */ }

for (const p of players) {
  if (photos[p.key]) continue;
  try {
  await sleep(700); // reste poli avec les serveurs de Wikimedia
  const query = SEARCH_AS[p.name] ?? p.name.replace(/^[A-Z]\. /, '');
  const search = await wikidata({ action: 'wbsearchentities', search: query, language: 'fr', uselang: 'fr', type: 'item', limit: '10' });
  const ids = search.search.map((r) => r.id);
  if (!ids.length) { console.log(`–  ${p.name} : introuvable`); continue; }

  const { entities } = await wikidata({ action: 'wbgetentities', ids: ids.join('|'), props: 'claims|labels', languages: 'fr|en' });
  const allowed = COUNTRY[p.nationality] ?? [];
  const match = ids.map((id) => entities[id]).find((e) =>
    claimIds(e, 'P106').includes(FOOTBALLER)
    && (e.claims?.P18?.length ?? 0) > 0
    && (!allowed.length || [...claimIds(e, 'P27'), ...claimIds(e, 'P1532')].some((c) => allowed.includes(c))));
  if (!match) { console.log(`–  ${p.name} : pas de photo libre`); continue; }

  const file = match.claims.P18[0].mainsnak.datavalue.value;
  const info = await commons({ action: 'query', titles: `File:${file}`, prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '400' });
  const ii = Object.values(info.query.pages)[0]?.imageinfo?.[0];
  const meta = ii?.extmetadata ?? {};
  const license = meta.LicenseShortName?.value;
  if (!ii?.thumburl || !license) { console.log(`–  ${p.name} : licence inconnue, ignorée`); continue; }
  // Pas de scans de vrais stickers Panini (marque déposée), même s'ils sont libres sur Commons
  if (/panini/i.test(`${file} ${stripHtml(meta.Artist?.value)} ${stripHtml(meta.ImageDescription?.value)}`)) {
    console.log(`–  ${p.name} : photo issue d'un sticker Panini, ignorée`);
    continue;
  }

  photos[p.key] = {
    name: match.labels?.fr?.value ?? match.labels?.en?.value ?? p.name,
    url: ii.thumburl,
    author: stripHtml(meta.Artist?.value) || 'Auteur inconnu',
    license,
    licenseUrl: meta.LicenseUrl?.value ?? '',
    source: ii.descriptionurl,
  };
  console.log(`✓  ${p.name} → ${photos[p.key].name} (${license}, ${photos[p.key].author.slice(0, 40)})`);
  await save(); // sauvegarde au fur et à mesure
  } catch (err) {
    // Un joueur en échec ne bloque pas les autres : relancer le script le retentera
    console.log(`⚠  ${p.name} : ${String(err.message).split(' ')[0]} — relance le script pour réessayer`);
  }
}

await save();
console.log(`\n${Object.keys(photos).length} photos / ${players.length} joueurs → src/data/photos.ts`);

async function save() {
  const out = `// Généré par scripts/fetch-photos.mjs — ne pas modifier à la main.
// Photos libres de droits de Wikimedia Commons (via Wikidata). Chaque photo
// a son auteur et sa licence : ils sont affichés dans l'appli (obligatoire).

export interface PlayerPhoto {
  /** Nom du joueur sur Wikidata */
  name: string;
  /** Miniature 400 px hébergée par Wikimedia */
  url: string;
  author: string;
  license: string;
  licenseUrl: string;
  /** Page du fichier sur Commons */
  source: string;
}

export const PHOTOS: Record<string, PlayerPhoto> = ${JSON.stringify(photos, null, 2)};
`;
  await writeFile(OUT, out);
}
