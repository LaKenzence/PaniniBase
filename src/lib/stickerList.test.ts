import { describe, it, expect } from 'vitest';
import { compactNumbers, buildTradeList } from './stickerList';

describe('compactNumbers', () => {
  it('regroupe les suites de 3 numéros ou plus', () => {
    expect(compactNumbers([1, 2, 3, 4, 7, 9, 10])).toBe('1-4, 7, 9, 10');
  });

  it('gère les codes à préfixe sans mélanger les équipes', () => {
    expect(compactNumbers(['MEX1', 'MEX2', 'MEX3', 'RSA1', 'RSA2', 'RSA3', 'RSA5'])).toBe('MEX1-MEX3, RSA1-RSA3, RSA5');
  });

  it('laisse tels quels les codes sans numéro final', () => {
    expect(compactNumbers(['FWC', 1, 2, 3])).toBe('FWC, 1-3');
  });

  it('liste vide', () => {
    expect(compactNumbers([])).toBe('');
  });
});

describe('buildTradeList', () => {
  it('produit le texte à partager', () => {
    const text = buildTradeList('Mexique 1970', [1, 2, 3, 8], [{ number: 5, count: 1 }, { number: 12, count: 3 }]);
    expect(text).toBe('PaniniBase · Mexique 1970\nIl me manque (4) : 1-3, 8\nDoublons (4) : 5, 12 (×3)');
  });

  it('indique « aucun » quand une liste est vide', () => {
    expect(buildTradeList('X', [], [])).toContain('Il me manque (0) : aucun');
  });
});
