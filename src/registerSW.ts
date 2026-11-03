/**
 * Enregistre le service worker en production uniquement.
 * Appelé une fois depuis main.tsx — n'interagit pas avec le reste de l'app.
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[SW] Enregistré :', reg.scope);

          // Vérifie les mises à jour du SW toutes les heures
          setInterval(() => reg.update(), 60 * 60 * 1000);

          reg.addEventListener('updatefound', () => {
            const newSW = reg.installing;
            if (!newSW) return;
            newSW.addEventListener('statechange', () => {
              if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                // Une nouvelle version est disponible — on la notifie via un
                // custom event que App.tsx peut écouter si besoin
                window.dispatchEvent(new CustomEvent('sw-update-available'));
              }
            });
          });
        })
        .catch((err) => console.error('[SW] Erreur :', err));
    });
  }
}
