type StickerNum = string | number;

// "MEX14" → ['MEX', 14] ; 14 → ['', 14] ; code sans chiffres final → null
const split = (n: StickerNum): [string, number] | null => {
  const m = String(n).match(/^([A-Za-z]*)(\d+)$/);
  return m ? [m[1], parseInt(m[2], 10)] : null;
};

/**
 * Compacte une liste de numéros (dans l'ordre de l'album) en plages :
 * [1,2,3,7,'MEX1','MEX2','MEX3'] → "1-3, 7, MEX1-MEX3".
 * Le format est celui accepté par « Ajout en masse » : la liste copiée peut y être recollée.
 */
export const compactNumbers = (numbers: StickerNum[]): string => {
  const parts: string[] = [];
  let i = 0;
  while (i < numbers.length) {
    const start = split(numbers[i]);
    let j = i;
    if (start) {
      while (j + 1 < numbers.length) {
        const next = split(numbers[j + 1]);
        if (!next || next[0] !== start[0] || next[1] !== start[1] + (j + 1 - i)) break;
        j++;
      }
    }
    // Une plage seulement à partir de 3 numéros : "4, 5" se lit mieux que "4-5"
    if (j - i >= 2) { parts.push(`${numbers[i]}-${numbers[j]}`); i = j + 1; }
    else { parts.push(String(numbers[i])); i++; }
  }
  return parts.join(', ');
};

/** Texte prêt à coller (WhatsApp, SMS, impression) : manquants puis doublons d'un album. */
export const buildTradeList = (
  albumLabel: string,
  missing: StickerNum[],
  dupes: Array<{ number: StickerNum; count: number }>,
  labels = { title: 'PaniniBase', missing: 'Il me manque', dupes: 'Doublons', none: 'aucun' },
): string => {
  const dupesText = dupes.map((d) => (d.count > 1 ? `${d.number} (×${d.count})` : String(d.number))).join(', ');
  const dupesTotal = dupes.reduce((sum, d) => sum + d.count, 0);
  return [
    `${labels.title} · ${albumLabel}`,
    `${labels.missing} (${missing.length}) : ${missing.length ? compactNumbers(missing) : labels.none}`,
    `${labels.dupes} (${dupesTotal}) : ${dupes.length ? dupesText : labels.none}`,
  ].join('\n');
};
