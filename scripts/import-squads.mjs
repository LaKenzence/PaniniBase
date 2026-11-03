/**
 * import-squads.mjs
 * Génère les effectifs complets des Coupes du Monde masculines 1970 → 2022,
 * depuis la Fjelstul World Cup Database :
 *   src/data/squads/<édition>.ts  un fichier par album, chargé à la demande
 *   src/data/squads.ts            index léger (taille de chaque album)
 *
 * Source : Joshua C. Fjelstul, "The Fjelstul World Cup Database"
 *          https://github.com/jfjelstul/worldcup — licence CC-BY-NC-SA 4.0
 *          (usage non commercial, avec citation de la source).
 *
 * Usage :
 *   node scripts/import-squads.mjs                 → télécharge squads.csv depuis GitHub
 *   node scripts/import-squads.mjs chemin/squads.csv  → utilise un fichier local
 *
 * Prérequis : Node 18+ (fetch natif). Aucun npm install nécessaire.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';

const CSV_URL = 'https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/squads.csv';
const OUT = new URL('../src/data/squads.ts', import.meta.url);
const POS = { GK: 'G', DF: 'D', MF: 'M', FW: 'A' }; // Gardien, Défenseur, Milieu, Attaquant

const csv = process.argv[2]
  ? await readFile(process.argv[2], 'utf8')
  : await (await fetch(CSV_URL)).text();

const [header, ...lines] = csv.trim().split(/\r?\n/);
const col = Object.fromEntries(header.split(',').map((name, i) => [name, i]));

// édition ("70") → code équipe → joueurs
const squads = {};
for (const line of lines) {
  const f = line.split(',');
  const tournament = f[col.tournament_id];               // "WC-1970"
  const year = Number(tournament.slice(3));
  if (!f[col.tournament_name].includes("Men's") || year < 1970) continue;

  const edition = String(year).slice(2);
  const given = f[col.given_name];
  const family = f[col.family_name];
  const name = given === 'not applicable' ? family : `${given} ${family}`;
  const team = f[col.team_code];

  ((squads[edition] ??= {})[team] ??= []).push([Number(f[col.shirt_number]) || 0, POS[f[col.position_code]] ?? 'M', name]);
}

// Un fichier par album (chargé seulement à l'ouverture de l'album) :
// src/data/squads/70.ts … Format compact par équipe : "numéro|poste|nom;…"
const HEADER = `// Généré par scripts/import-squads.mjs — ne pas modifier à la main.
// Source : Joshua C. Fjelstul, The Fjelstul World Cup Database
// (https://github.com/jfjelstul/worldcup), licence CC-BY-NC-SA 4.0.
`;
await mkdir(new URL('../src/data/squads/', import.meta.url), { recursive: true });

const sizes = {};
let total = 0;
for (const [edition, teams] of Object.entries(squads)) {
  let out = HEADER + `// Effectifs de la Coupe du Monde ${edition < '50' ? 20 : 19}${edition}, par code équipe.
// Chaque joueur : "numéro de maillot|poste (G/D/M/A)|nom".

const squads: Record<string, string> = {
`;
  for (const [team, players] of Object.entries(teams)) {
    players.sort((a, b) => a[0] - b[0]);
    total += players.length;
    out += `  ${team}: ${JSON.stringify(players.map((p) => p.join('|')).join(';'))},\n`;
  }
  out += '};\n\nexport default squads;\n';
  await writeFile(new URL(`../src/data/squads/${edition}.ts`, import.meta.url), out);
  // Taille finale de l'album : chaque joueur + un écusson par équipe
  sizes[edition] = Object.values(teams).reduce((n, players) => n + players.length + 1, 0);
}

// Index léger (chargé au démarrage) : taille de chaque album, pour les totaux et pourcentages
const index = HEADER + `// Nombre de stickers de chaque album une fois les effectifs chargés (joueurs + écussons).
// Les effectifs eux-mêmes sont dans src/data/squads/<édition>.ts, chargés à la demande.

export const SQUAD_SIZES: Record<string, number> = ${JSON.stringify(sizes, null, 2).replace(/"(\d\d)"/g, "'$1'")};
`;
await writeFile(OUT, index);
console.log(`✓ ${total} joueurs, ${Object.keys(squads).length} albums → src/data/squads/*.ts`);
