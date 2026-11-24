/**
 * fetch-squad-photos.mjs
 * Génère src/data/squad-photos/<album>.ts : une photo libre de droits (Wikimedia Commons)
 * pour chaque joueur des checklists Panini (src/data/checklists/), avec auteur et licence.
 *
 * Pour chaque équipe : une requête SPARQL Wikidata liste les footballeurs du pays
 * qui ont une image (P18), puis on retrouve chaque joueur de la checklist par son nom
 * et son année de naissance (15 à 44 ans au moment de la Coupe du monde).
 * En cas de doute (homonymes), le joueur garde la silhouette : mieux vaut pas de photo
 * qu'une photo d'un autre joueur.
 *
 * Usage : node scripts/fetch-squad-photos.mjs
 * Prérequis : Node 18+ (fetch natif). Aucun npm install nécessaire.
 */

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';

const ROOT = new URL('../src/data/', import.meta.url);
const HEADERS = { 'User-Agent': 'PaniniBase/1.0 (projet de fan non commercial)', Accept: 'application/sparql-results+json' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Équipe (nom de page de la checklist) → pays Wikidata (nationalité, pays sportif ou équipe nationale)
const UK = 'Q145';
const YUGO = ['Q83286', 'Q838261', 'Q37024', 'Q403', 'Q224', 'Q225', 'Q215', 'Q236', 'Q221'];
const COUNTRY = {
  'Afrique du Sud': ['Q258'], 'Algérie': ['Q262'], 'Allemagne': ['Q183', 'Q713750'], 'Angleterre': ['Q21', UK],
  'Angola': ['Q916'], 'Arabie Saoudite': ['Q851'], 'Argentine': ['Q414'], 'Australie': ['Q408'], 'Autriche': ['Q40'],
  'Belgique': ['Q31'], 'Bosnie-Herzégovine': ['Q225'], 'Brésil': ['Q155'], 'Bulgarie': ['Q219'], 'Cameroun': ['Q1009'],
  'Canada': ['Q16'], 'Chili': ['Q298'], 'Chine': ['Q148'], 'Colombie': ['Q739'], 'Corée du Nord': ['Q423'],
  'Corée du Sud': ['Q884'], 'Costa Rica': ['Q800'], 'Croatie': ['Q224'], "Côte d'Ivoire": ['Q1008'], 'Danemark': ['Q35'],
  'Espagne': ['Q29'], 'France': ['Q142'], 'Ghana': ['Q117'], 'Grèce': ['Q41'], 'Haïti': ['Q790'], 'Honduras': ['Q783'],
  'Hongrie': ['Q28'], 'Irak': ['Q796'], 'Iran': ['Q794'], 'Irlande': ['Q27'], 'Irlande du Nord': ['Q26', UK],
  'Islande': ['Q189'], 'Israël': ['Q801'], 'Italie': ['Q38'], 'Jamaïque': ['Q766'], 'Japon': ['Q17'], 'Koweït': ['Q817'],
  'Maroc': ['Q1028'], 'Mexique': ['Q96'], 'Nigéria': ['Q1033'], 'Norvège': ['Q20'], 'Nouvelle-Zélande': ['Q664'],
  'Panama': ['Q804'], 'Paraguay': ['Q733'], 'Pays de Galles': ['Q25', UK], 'Pays-Bas': ['Q55', 'Q29999'],
  'Pologne': ['Q36'], 'Portugal': ['Q45'], 'Pérou': ['Q419'], 'Qatar': ['Q846'], 'RDA': ['Q16957', 'Q183'],
  'Roumanie': ['Q218'], 'Russie': ['Q159'], 'Salvador': ['Q792'], 'Serbie': ['Q403'], 'Serbie-et-Monténégro': YUGO,
  'Slovaquie': ['Q214'], 'Slovénie': ['Q215'], 'Suisse': ['Q39'], 'Suède': ['Q34'], 'Sénégal': ['Q1041'],
  'Tchécoslovaquie': ['Q33946', 'Q213', 'Q214'], 'Tchéquie': ['Q213'], 'Togo': ['Q945'], 'Trinité-et-Tobago': ['Q754'],
  'Tunisie': ['Q948'], 'Turquie': ['Q43'], 'URSS': ['Q15180', 'Q159', 'Q212', 'Q232', 'Q230', 'Q184', 'Q37', 'Q211', 'Q191', 'Q265', 'Q399', 'Q227'],
  'Ukraine': ['Q212'], 'Uruguay': ['Q77'], 'Yougoslavie': YUGO, 'Zaïre': ['Q974'], 'Écosse': ['Q22', UK],
  'Égypte': ['Q79'], 'Émirats arabes unis': ['Q878'], 'Équateur': ['Q736'], 'États-Unis': ['Q30'],
};

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/ß/g, 'ss').replace(/[øö]/g, 'o').replace(/æ/g, 'ae').replace(/ł/g, 'l').replace(/[đð]/g, 'd').replace(/ı/g, 'i')
  .replace(/\bjr\b\.?/g, 'junior').replace(/[-‐.'’`]/g, ' ').replace(/\s+/g, ' ').trim();
const words = (s) => norm(s).split(' ').filter(Boolean);
const stripHtml = (html = '') => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  .replace(/^(.+?)\s*\1$/, '$1').replace(/^Unknown author$/i, 'Auteur inconnu');

async function get(url, attempt = 0) {
  const res = await fetch(url, { headers: HEADERS });
  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    await sleep(Number(res.headers.get('retry-after')) * 1000 || 3000 * 2 ** attempt);
    return get(url, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${url.slice(0, 120)}`);
  return res.json();
}

// ─── 1. Joueurs des checklists ──────────────────────────────────────────────
const files = (await readdir(new URL('checklists/', ROOT))).filter((f) => /^\d\d\.ts$/.test(f));
const editions = {}; // id → [{ section, name, year }]
for (const f of files) {
  const id = f.slice(0, 2);
  const year = Number(id) < 50 ? 2000 + Number(id) : 1900 + Number(id);
  const src = await readFile(new URL(`checklists/${f}`, ROOT), 'utf8');
  const body = JSON.parse(src.slice(src.indexOf('"'), src.lastIndexOf('"') + 1));
  editions[id] = body.split('\n').map((l) => l.split('|')).filter((p) => p[3]?.[0] === 'P')
    .map(([, , section, , name]) => ({ section, name, year }));
}
const sections = [...new Set(Object.values(editions).flat().map((p) => p.section))];
const missing = sections.filter((s) => !COUNTRY[s]);
if (missing.length) console.log('Équipes sans pays :', missing.join(', '));

// ─── 2. Footballeurs avec photo, par équipe ────────────────────────────────
const LANGS = '"fr","en","es","pt","de","it","nl","mul"';
const candidates = {}; // section → [{ id, birth, img, names: Set }]
// `node scripts/fetch-squad-photos.mjs Italie Écosse` : ne refait que ces équipes (les autres photos sont gardées)
const ONLY = process.argv.slice(2);
for (const section of sections) {
  const qids = COUNTRY[section];
  if (!qids || (ONLY.length && !ONLY.includes(section))) continue;
  const years = Object.values(editions).flat().filter((p) => p.section === section).map((p) => p.year);
  const [from, to] = [Math.min(...years) - 44, Math.max(...years) - 15];
  // Une requête par pays et par lien (nationalité, pays sportif, équipe nationale) : sinon les grosses
  // nations dépassent la taille de réponse de Wikidata et la réponse arrive coupée
  const byId = new Map();
  let failed = false;
  for (const q of qids) for (const link of ['wdt:P27 wd:Q', 'wdt:P1532 wd:Q', 'wdt:P54 ?t . ?t wdt:P31 wd:Q6979593 ; wdt:P17 wd:Q']) {
  const query = `SELECT ?p ?img ?birth ?name WHERE {
    ?p ${link}${q.slice(1)} .
    ?p wdt:P106 wd:Q937857 ; wdt:P18 ?img ; wdt:P569 ?birth .
    FILTER(YEAR(?birth) >= ${from} && YEAR(?birth) <= ${to})
    { ?p rdfs:label ?name } UNION { ?p skos:altLabel ?name }
    FILTER(LANG(?name) IN (${LANGS}))
  }`;
  try {
    const json = await get(`https://query.wikidata.org/sparql?${new URLSearchParams({ query, format: 'json' })}`);
    for (const b of json.results.bindings) {
      const id = b.p.value.split('/').pop();
      const c = byId.get(id) ?? { id, birth: Number(b.birth.value.slice(0, 4)), img: b.img.value, names: new Set() };
      c.names.add(norm(b.name.value));
      byId.set(id, c);
    }
  } catch (err) {
    failed = true;
    console.log(`⚠  ${section} (${q}) : ${err.message}`);
  }
  await sleep(1000);
  }
  if (!failed) candidates[section] = [...byId.values()];
  console.log(`${section} : ${byId.size} footballeurs avec photo${failed ? ' (incomplet, ignoré)' : ''}`);
}

// ─── 3. Association joueur de checklist → personne Wikidata ────────────────
function findPerson({ section, name, year }) {
  const pool = (candidates[section] ?? []).filter((c) => c.birth >= year - 44 && c.birth <= year - 15);
  const n = norm(name);
  const unique = (list) => (new Set(list.map((c) => c.id)).size === 1 ? list[0] : undefined);
  const exact = pool.filter((c) => c.names.has(n));
  if (exact.length) return unique(exact);
  // « P. Schmeichel », « Juan Alvarado » vs « Juan Manuel Alvarado » : même nom de famille + même prénom (ou initiale)
  const w = words(name);
  if (w.length < 2) return undefined;
  const last = w.at(-1), first = w[0];
  const loose = pool.filter((c) => [...c.names].some((cn) => {
    const cw = cn.split(' ');
    return cw.at(-1) === last && (first.length === 1 ? cw[0][0] === first : cw[0] === first);
  }));
  return unique(loose);
}

const matches = {}; // edition → { "section|name": qid }
const people = new Map(); // qid → candidate
for (const [id, list] of Object.entries(editions)) {
  matches[id] = {};
  for (const p of list) {
    const c = findPerson(p);
    if (!c) continue;
    matches[id][`${p.section}|${p.name}`] = c.id;
    people.set(c.id, c);
  }
}

// ─── 4. Crédits Commons (par lots de 50 fichiers) ──────────────────────────
const titleOf = (img) => `File:${decodeURIComponent(img.split('/Special:FilePath/').pop()).replace(/_/g, ' ')}`;
const credits = new Map(); // title → [thumb, author, license, licenseUrl]
const titles = [...new Set([...people.values()].map((c) => titleOf(c.img)))];
for (let i = 0; i < titles.length; i += 50) {
  const batch = titles.slice(i, i + 50);
  const params = new URLSearchParams({ action: 'query', format: 'json', titles: batch.join('|'), prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '400' });
  try {
    const json = await get(`https://commons.wikimedia.org/w/api.php?${params}`);
    const normalized = new Map((json.query.normalized ?? []).map((x) => [x.to, x.from]));
    for (const page of Object.values(json.query.pages)) {
      const ii = page.imageinfo?.[0];
      const meta = ii?.extmetadata ?? {};
      const license = meta.LicenseShortName?.value;
      if (!ii?.thumburl || !license) continue;
      // Pas de scans de vrais stickers Panini (marque déposée), même s'ils sont libres sur Commons
      if (/panini/i.test(`${page.title} ${stripHtml(meta.Artist?.value)} ${stripHtml(meta.ImageDescription?.value)}`)) continue;
      credits.set(normalized.get(page.title) ?? page.title, [ii.thumburl, stripHtml(meta.Artist?.value) || 'Auteur inconnu', license, meta.LicenseUrl?.value ?? '']);
    }
  } catch (err) {
    console.log(`⚠  crédits ${i}–${i + 50} : ${err.message}`);
  }
  process.stdout.write(`\rCrédits : ${Math.min(i + 50, titles.length)}/${titles.length}`);
  await sleep(500);
}
console.log();

// ─── 5. Un fichier par album ────────────────────────────────────────────────
await mkdir(new URL('squad-photos/', ROOT), { recursive: true });
let total = 0, players = 0;
for (const [id, map] of Object.entries(matches)) {
  // Relance partielle : on repart du fichier existant et on ne remplace que les équipes refaites
  const file = new URL(`squad-photos/${id}.ts`, ROOT);
  let out = {};
  if (ONLY.length) {
    try {
      const prev = await readFile(file, 'utf8');
      out = JSON.parse(prev.slice(prev.indexOf('= {') + 2, prev.lastIndexOf('};') + 1));
      for (const k of Object.keys(out)) if (ONLY.includes(k.split('|')[0])) delete out[k];
    } catch { /* pas encore de fichier */ }
  }
  for (const [key, qid] of Object.entries(map)) {
    const credit = credits.get(titleOf(people.get(qid).img));
    if (credit) out[key] = credit;
  }
  total += Object.keys(out).length;
  players += editions[id].length;
  await writeFile(file, `// Généré par scripts/fetch-squad-photos.mjs — ne pas modifier à la main.
// Photos libres de Wikimedia Commons : "équipe|joueur" → [miniature, auteur, licence, lien de la licence].
// L'auteur et la licence sont affichés sur la fiche du sticker (obligatoire).

const photos: Record<string, [string, string, string, string]> = ${JSON.stringify(out, null, 0).replace(/\],"/g, '],\n"')};

export default photos;
`);
  console.log(`${id} : ${Object.keys(out).length}/${editions[id].length} joueurs avec photo`);
}
console.log(`\nTotal : ${total}/${players} stickers joueurs avec photo`);
