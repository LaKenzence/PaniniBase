/**
 * scrape-panini.mjs
 * Récupère les checklists Panini Coupe du Monde depuis cardboardconnection.com
 * et génère du TypeScript prêt à coller dans stickers.ts
 *
 * Usage :
 *   node scrape-panini.mjs 22     → Qatar 2022
 *   node scrape-panini.mjs 18     → Russie 2018
 *   node scrape-panini.mjs 14     → Brésil 2014
 *   node scrape-panini.mjs 10     → Afrique du Sud 2010
 *   node scrape-panini.mjs 06     → Allemagne 2006
 *   node scrape-panini.mjs 02     → Corée/Japon 2002
 *   node scrape-panini.mjs 98     → France 1998
 *
 * Prérequis : Node 18+ (fetch natif). Aucun npm install nécessaire.
 */

// ─── Configuration des albums ────────────────────────────────────────────────

const ALBUMS = {
  '98': {
    editionId: '98',
    label: 'France 1998',
    url: 'https://www.cardboardconnection.com/1998-panini-world-cup-stickers-france-checklist',
    fallbackUrl: 'https://www.checklistinsider.com/1998-panini-world-cup-france-sticker', // backup
  },
  '02': {
    editionId: '02',
    label: 'Corée/Japon 2002',
    url: 'https://www.cardboardconnection.com/2002-panini-world-cup-stickers-korea-japan-checklist',
  },
  '06': {
    editionId: '06',
    label: 'Allemagne 2006',
    url: 'https://www.cardboardconnection.com/2006-panini-world-cup-stickers-germany-checklist',
  },
  '10': {
    editionId: '10',
    label: 'Afrique du Sud 2010',
    url: 'https://www.cardboardconnection.com/2010-panini-world-cup-stickers-south-africa-checklist',
  },
  '14': {
    editionId: '14',
    label: 'Brésil 2014',
    url: 'https://www.cardboardconnection.com/2014-panini-world-cup-stickers-brazil-checklist',
  },
  '18': {
    editionId: '18',
    label: 'Russie 2018',
    url: 'https://www.cardboardconnection.com/2018-panini-world-cup-stickers-russia-checklist',
  },
  '22': {
    editionId: '22',
    label: 'Qatar 2022',
    url: 'https://www.cardboardconnection.com/2022-panini-world-cup-stickers-qatar-cards',
  },
};

// ─── Mapping code-pays → colKey + flag ───────────────────────────────────────
// Couvre les abréviations Panini connues (3 lettres officielles)

const COUNTRY_MAP = {
  // Africa
  'Algeria': { colKey: 'dz', flag: '🇩🇿', nation: 'Algérie' },
  'Angola': { colKey: 'ao', flag: '🇦🇴', nation: 'Angola' },
  'Cameroon': { colKey: 'cm', flag: '🇨🇲', nation: 'Cameroun' },
  'Côte d\'Ivoire': { colKey: 'ci', flag: '🇨🇮', nation: 'Côte d\'Ivoire' },
  'Egypt': { colKey: 'eg', flag: '🇪🇬', nation: 'Égypte' },
  'Ghana': { colKey: 'gh', flag: '🇬🇭', nation: 'Ghana' },
  'Morocco': { colKey: 'ma', flag: '🇲🇦', nation: 'Maroc' },
  'Nigeria': { colKey: 'ng', flag: '🇳🇬', nation: 'Nigéria' },
  'Senegal': { colKey: 'sn', flag: '🇸🇳', nation: 'Sénégal' },
  'South Africa': { colKey: 'za', flag: '🇿🇦', nation: 'Afrique du Sud' },
  'Tunisia': { colKey: 'tn', flag: '🇹🇳', nation: 'Tunisie' },
  // Americas
  'Argentina': { colKey: 'ar', flag: '🇦🇷', nation: 'Argentine' },
  'Bolivia': { colKey: 'bo', flag: '🇧🇴', nation: 'Bolivie' },
  'Brazil': { colKey: 'br', flag: '🇧🇷', nation: 'Brésil' },
  'Canada': { colKey: 'ca', flag: '🇨🇦', nation: 'Canada' },
  'Chile': { colKey: 'cl', flag: '🇨🇱', nation: 'Chili' },
  'Colombia': { colKey: 'co', flag: '🇨🇴', nation: 'Colombie' },
  'Costa Rica': { colKey: 'cr', flag: '🇨🇷', nation: 'Costa Rica' },
  'Ecuador': { colKey: 'ec', flag: '🇪🇨', nation: 'Équateur' },
  'Honduras': { colKey: 'hn', flag: '🇭🇳', nation: 'Honduras' },
  'Jamaica': { colKey: 'jm', flag: '🇯🇲', nation: 'Jamaïque' },
  'Mexico': { colKey: 'mx', flag: '🇲🇽', nation: 'Mexique' },
  'Panama': { colKey: 'pa', flag: '🇵🇦', nation: 'Panama' },
  'Paraguay': { colKey: 'py', flag: '🇵🇾', nation: 'Paraguay' },
  'Peru': { colKey: 'pe', flag: '🇵🇪', nation: 'Pérou' },
  'Trinidad & Tobago': { colKey: 'tt', flag: '🇹🇹', nation: 'Trinité-et-Tobago' },
  'Trinidad and Tobago': { colKey: 'tt', flag: '🇹🇹', nation: 'Trinité-et-Tobago' },
  'Uruguay': { colKey: 'uy', flag: '🇺🇾', nation: 'Uruguay' },
  'USA': { colKey: 'us', flag: '🇺🇸', nation: 'États-Unis' },
  // Asia / Oceania
  'Australia': { colKey: 'au', flag: '🇦🇺', nation: 'Australie' },
  'China': { colKey: 'cn', flag: '🇨🇳', nation: 'Chine' },
  'China PR': { colKey: 'cn', flag: '🇨🇳', nation: 'Chine' },
  'IR Iran': { colKey: 'ir', flag: '🇮🇷', nation: 'Iran' },
  'Iran': { colKey: 'ir', flag: '🇮🇷', nation: 'Iran' },
  'Japan': { colKey: 'jp', flag: '🇯🇵', nation: 'Japon' },
  'Saudi Arabia': { colKey: 'sa', flag: '🇸🇦', nation: 'Arabie Saoudite' },
  'South Korea': { colKey: 'kr', flag: '🇰🇷', nation: 'Corée du Sud' },
  'Korea Republic': { colKey: 'kr', flag: '🇰🇷', nation: 'Corée du Sud' },
  // Europe
  'Belgium': { colKey: 'be', flag: '🇧🇪', nation: 'Belgique' },
  'Bulgaria': { colKey: 'bul', flag: '🇧🇬', nation: 'Bulgarie' },
  'Croatia': { colKey: 'cr', flag: '🇭🇷', nation: 'Croatie' },
  'Czech Republic': { colKey: 'cs', flag: '🇨🇿', nation: 'République Tchèque' },
  'Czechia': { colKey: 'cs', flag: '🇨🇿', nation: 'Tchéquie' },
  'Denmark': { colKey: 'dk', flag: '🇩🇰', nation: 'Danemark' },
  'England': { colKey: 'en', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', nation: 'Angleterre' },
  'France': { colKey: 'fr', flag: '🇫🇷', nation: 'France' },
  'Germany': { colKey: 'de', flag: '🇩🇪', nation: 'Allemagne' },
  'Germany FR': { colKey: 'de', flag: '🇩🇪', nation: 'Allemagne' },
  'West Germany': { colKey: 'de', flag: '🇩🇪', nation: 'Allemagne Ouest' },
  'Greece': { colKey: 'gr', flag: '🇬🇷', nation: 'Grèce' },
  'Hungary': { colKey: 'hu', flag: '🇭🇺', nation: 'Hongrie' },
  'Italy': { colKey: 'it', flag: '🇮🇹', nation: 'Italie' },
  'Netherlands': { colKey: 'nl', flag: '🇳🇱', nation: 'Pays-Bas' },
  'Northern Ireland': { colKey: 'ni', flag: '🇬🇧', nation: 'Irlande du Nord' },
  'Norway': { colKey: 'no', flag: '🇳🇴', nation: 'Norvège' },
  'Poland': { colKey: 'pl', flag: '🇵🇱', nation: 'Pologne' },
  'Portugal': { colKey: 'pt', flag: '🇵🇹', nation: 'Portugal' },
  'Romania': { colKey: 'ro', flag: '🇷🇴', nation: 'Roumanie' },
  'Russia': { colKey: 'ru', flag: '🇷🇺', nation: 'Russie' },
  'Scotland': { colKey: 'sco', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', nation: 'Écosse' },
  'Serbia': { colKey: 'rs', flag: '🇷🇸', nation: 'Serbie' },
  'Slovakia': { colKey: 'sk', flag: '🇸🇰', nation: 'Slovaquie' },
  'Slovenia': { colKey: 'si', flag: '🇸🇮', nation: 'Slovénie' },
  'Spain': { colKey: 'es', flag: '🇪🇸', nation: 'Espagne' },
  'Sweden': { colKey: 'se', flag: '🇸🇪', nation: 'Suède' },
  'Switzerland': { colKey: 'ch', flag: '🇨🇭', nation: 'Suisse' },
  'Turkey': { colKey: 'tr', flag: '🇹🇷', nation: 'Turquie' },
  'Ukraine': { colKey: 'ua', flag: '🇺🇦', nation: 'Ukraine' },
  'Wales': { colKey: 'wal', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', nation: 'Pays de Galles' },
  // Middle East
  'Qatar': { colKey: 'qa', flag: '🇶🇦', nation: 'Qatar' },
  'UAE': { colKey: 'ae', flag: '🇦🇪', nation: 'Émirats Arabes' },
};

// ─── Fetch avec retry et User-Agent ──────────────────────────────────────────

async function fetchPage(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PaniniScraper/1.0; educational use)',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      console.warn(`  Tentative ${i + 1}/${retries} échouée: ${err.message}`);
      if (i < retries - 1) await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
  throw new Error(`Impossible de charger ${url} après ${retries} tentatives`);
}

// ─── Parser HTML → lignes de texte brut ──────────────────────────────────────

function extractTextLines(html) {
  // Supprime les balises HTML, décode les entités basiques
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&[a-z]+;/g, '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
}

// ─── Parser une ligne de checklist Panini ────────────────────────────────────
// Formats attendus :
//   "FRA19 Kylian Mbappé - France"
//   "QAT2 Team Logo FOIL - Qatar"
//   "FWC1 FIFA"
//   "00 Panini FOIL"

// Mots-clés qui signalent du contenu parasite (annonces eBay, avis, textes de nav)
const SPAM_PATTERNS = [
  /you pick/i,
  /sealed/i,
  /avoid this/i,
  /average product/i,
  /excellent product/i,
  /incredible product/i,
  /below average/i,
  /north america$/i,
  /pick your sticker/i,
  /\d+ stickers? (lot|pack|set)/i,
  /free shipping/i,
  /buy it now/i,
  /^subject to change/i,
  /^order (boxes|packs)/i,
  /^shop (for|on)/i,
  /^view the full/i,
  /^please (note|reach)/i,
];

function isSpam(country) {
  if (!country) return false;
  return SPAM_PATTERNS.some(p => p.test(country));
}

function parseStickerLine(line) {
  // Format principal : CODE Nom - Équipe
  const mainMatch = line.match(/^([A-Z]{2,4}\d+)\s+(.+?)\s+-\s+(.+)$/);
  if (mainMatch) {
    const [, code, name, country] = mainMatch;
    if (isSpam(country)) return null;
    return { code, name: name.trim(), country: country.trim() };
  }

  // Format numéro simple (anciens albums) : "1 Pelé - Brazil" ou "42 Paulo Rossi - Italy"
  const numMatch = line.match(/^(\d+)\s+(.+?)\s+-\s+(.+)$/);
  if (numMatch) {
    const [, code, name, country] = numMatch;
    if (isSpam(country)) return null;
    return { code, name: name.trim(), country: country.trim() };
  }

  // Format sans équipe : "FWC1 FIFA" ou "00 Panini FOIL"
  const noCountryMatch = line.match(/^([A-Z]{0,4}\d+)\s+(.+)$/);
  if (noCountryMatch) {
    const [, code, name] = noCountryMatch;
    if (!name.includes(' - ')) {
      return { code, name: name.trim(), country: null };
    }
  }

  return null;
}

// ─── Classifier le type de sticker ───────────────────────────────────────────

function classifySticker(name, code) {
  const nameLower = name.toLowerCase();

  if (nameLower.includes('team logo') || nameLower.includes('logo foil') || nameLower.includes('écusson')) {
    return 'badge';
  }
  if (nameLower.includes('team photo') || nameLower.includes('photo')) {
    return 'photo';
  }
  if (nameLower.includes('stadium') || nameLower.includes('stade')) {
    return 'stadium';
  }
  if (nameLower.includes('mascot') || nameLower.includes('mascotte')) {
    return 'mascot';
  }
  if (nameLower.includes('trophy') || nameLower.includes('trophée')) {
    return 'trophy';
  }
  if (code.startsWith('FWC')) {
    return 'special';
  }
  // Sticker classique de joueur
  return 'player';
}

// ─── Résoudre le pays → colKey + flag ────────────────────────────────────────

function resolveCountry(country) {
  if (!country) return { colKey: 'world', flag: '🌍', nation: country || 'Inconnu' };

  // Correspondance directe
  if (COUNTRY_MAP[country]) return COUNTRY_MAP[country];

  // Recherche partielle (ex: "South Korea" dans les variations)
  const lower = country.toLowerCase();
  for (const [key, val] of Object.entries(COUNTRY_MAP)) {
    if (key.toLowerCase() === lower) return val;
  }

  // Génère un colKey depuis le nom (fallback)
  const colKey = country.toLowerCase().replace(/[^a-z]/g, '').slice(0, 4);
  console.warn(`  ⚠️  Pays inconnu: "${country}" → colKey="${colKey}"`);
  return { colKey, flag: '🏳️', nation: country };
}

// ─── Générer le code TypeScript ───────────────────────────────────────────────

function generateTypeScript(editionId, stickers) {
  const lines = [`  // ── ${editionId} ───────────────────────────────────────────────────────────────`];
  lines.push(`  '${editionId}': [`);

  for (const s of stickers) {
    const { code, name, country, type } = s;
    const { colKey, flag, nation } = resolveCountry(country);
    const isShiny = name.toLowerCase().includes('foil') || name.toLowerCase().includes('shiny');

    if (type === 'badge') {
      const teamName = nation || country;
      lines.push(`    mkBadge('${editionId}', '${code}', '${teamName}', '${flag}', '${colKey}'),`);

    } else if (type === 'photo') {
      lines.push(`    mkSpecial('${editionId}', '${code}', '${name}', 'photo', '${nation}', '${flag}', '${colKey}'),`);

    } else if (type === 'player') {
      const cleanName = name.replace(/'/g, "\\'");
      const shinyFlag = isShiny ? ', undefined, true' : '';
      lines.push(`    mkPlayer('${editionId}', '${code}', '${cleanName}', '${nation}', '${flag}', '${colKey}', 'Milieu', 0, ''),${shinyFlag ? ' // SHINY' : ''}`);

    } else {
      // special, stadium, mascot, trophy...
      const catMap = { stadium: 'stadium', mascot: 'mascot', trophy: 'trophy', special: 'special', photo: 'photo' };
      const cat = catMap[type] || 'special';
      lines.push(`    mkSpecial('${editionId}', '${code}', '${name}', '${cat}', '${nation || 'World'}', '${flag}', '${colKey}'),`);
    }
  }

  lines.push(`  ],`);
  return lines.join('\n');
}

// ─── Scraper principal ────────────────────────────────────────────────────────

async function scrapeAlbum(key) {
  const album = ALBUMS[key];
  if (!album) {
    console.error(`Album "${key}" non reconnu. Choix: ${Object.keys(ALBUMS).join(', ')}`);
    process.exit(1);
  }

  console.log(`\n🔍 Scraping ${album.label}...`);
  console.log(`   URL: ${album.url}`);

  let html;
  try {
    html = await fetchPage(album.url);
  } catch (e) {
    console.error(`❌ Erreur: ${e.message}`);
    if (album.fallbackUrl) {
      console.log(`   Essai URL de secours: ${album.fallbackUrl}`);
      html = await fetchPage(album.fallbackUrl);
    } else {
      process.exit(1);
    }
  }

  const lines = extractTextLines(html);
  const stickers = [];
  let parsedCount = 0;
  let skippedCount = 0;

  for (const line of lines) {
    const parsed = parseStickerLine(line);
    if (!parsed) {
      skippedCount++;
      continue;
    }

    const type = classifySticker(parsed.name, parsed.code);
    stickers.push({ ...parsed, type });
    parsedCount++;
  }

  console.log(`✅ ${parsedCount} stickers parsés (${skippedCount} lignes ignorées)`);

  if (parsedCount === 0) {
    console.error('❌ Aucun sticker parsé. Vérifiez le format de la page.');
    console.log('\nVoici les 30 premières lignes extraites pour debug :');
    lines.slice(0, 30).forEach((l, i) => console.log(`  ${i}: ${l}`));
    process.exit(1);
  }

  // Stats par type
  const stats = {};
  for (const s of stickers) {
    stats[s.type] = (stats[s.type] || 0) + 1;
  }
  console.log('📊 Répartition:', JSON.stringify(stats, null, 2));

  // Génération TypeScript
  const ts = generateTypeScript(album.editionId, stickers);

  // Écriture du fichier
  const outPath = `stickers_${key}.ts`;
  const fs = await import('fs/promises');
  const fullOutput = `// Généré automatiquement par scrape-panini.mjs
// Album: ${album.label}
// ${parsedCount} stickers
//
// ⚠️  POSITIONS et CLUBS sont à remplir manuellement (valeur par défaut: 'Milieu', '')
// ⚠️  playerKey est à remplir pour les joueurs qui apparaissent dans PLAYERS_DB
//
// À coller dans STICKERS_BY_EDITION dans src/data/stickers.ts

export const STICKERS_${key.toUpperCase()} = {
${ts}
};
`;

  await fs.writeFile(outPath, fullOutput, 'utf-8');
  console.log(`\n💾 Fichier généré : ${outPath}`);
  console.log(`\n📋 Prochaines étapes :`);
  console.log(`   1. Ouvrir ${outPath}`);
  console.log(`   2. Vérifier les stickers parsés (comparer avec l'album physique)`);
  console.log(`   3. Remplir les positions (Gardien/Défenseur/Milieu/Attaquant)`);
  console.log(`   4. Remplir les clubs`);
  console.log(`   5. Ajouter les playerKey pour les joueurs dans PLAYERS_DB`);
  console.log(`   6. Coller le bloc dans STICKERS_BY_EDITION dans stickers.ts`);

  return stickers;
}

// ─── Debug : affiche les lignes brutes d'une URL ─────────────────────────────

async function debugUrl(url) {
  console.log(`\n🐛 Debug URL: ${url}`);
  const html = await fetchPage(url);
  const lines = extractTextLines(html);
  console.log(`\n${lines.length} lignes extraites. Premiers stickers détectés :`);

  let found = 0;
  for (const line of lines) {
    const parsed = parseStickerLine(line);
    if (parsed) {
      console.log(`  ✓ [${parsed.code}] "${parsed.name}" - ${parsed.country || '(pas de pays)'}`);
      if (++found >= 30) break;
    }
  }
}

// ─── Point d'entrée ───────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const cmd = args[0];

if (!cmd) {
  console.log(`
Usage:
  node scrape-panini.mjs <edition>     Scrape un album
  node scrape-panini.mjs debug <url>   Debug une URL

Editions disponibles: ${Object.entries(ALBUMS).map(([k, v]) => `${k} (${v.label})`).join(', ')}

Exemples:
  node scrape-panini.mjs 22
  node scrape-panini.mjs 18
  node scrape-panini.mjs debug https://www.cardboardconnection.com/2018-panini-world-cup-stickers-russia-checklist
  `);
} else if (cmd === 'debug') {
  if (!args[1]) {
    console.error('URL manquante. Usage: node scrape-panini.mjs debug <url>');
    process.exit(1);
  }
  await debugUrl(args[1]);
} else {
  await scrapeAlbum(cmd);
}
