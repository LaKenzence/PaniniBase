/**
 * Petite vibration de confirmation sur mobile (Android surtout ; iOS Safari
 * ne supporte pas l'API et l'appel est simplement ignoré).
 * Respecte « réduire les animations » du système.
 */
export const haptic = (ms = 12) => {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  try { navigator.vibrate(ms); } catch { /* certains navigateurs lèvent hors geste utilisateur */ }
};
