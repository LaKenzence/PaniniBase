import { useEffect, useRef } from 'react';
import { useAuthStore, useTradesStore, useOffersStore } from '../store/index';
import { t } from '../i18n';

const EVERY_MS = 10 * 60 * 1000;

/**
 * Cherche de nouveaux matches d'échange en arrière-plan (à la connexion, toutes
 * les 10 min et au retour sur l'onglet) et prévient via `onNew`. Si l'utilisateur
 * a autorisé les notifications et que la page est cachée, une notification système
 * est aussi affichée. Sans serveur de push, rien n'arrive quand l'appli est fermée.
 */
export function useMatchWatcher(onNew: (count: number) => void) {
  const user = useAuthStore((s) => s.user);
  const onNewRef = useRef(onNew);
  onNewRef.current = onNew;

  useEffect(() => {
    if (!user) return;
    let known = new Set(useTradesStore.getState().newMatchIds);
    let lastCheck = 0;

    const check = async () => {
      if (Date.now() - lastCheck < 2 * 60 * 1000) return; // pas plus d'une requête toutes les 2 min
      lastCheck = Date.now();
      useOffersStore.getState().loadOffers(); // propositions reçues (pastille de l'onglet)
      await useTradesStore.getState().findMatches();
      const fresh = useTradesStore.getState().newMatchIds.filter((id) => !known.has(id));
      known = new Set(useTradesStore.getState().newMatchIds);
      if (fresh.length === 0) return;
      onNewRef.current(fresh.length);
      if (document.hidden && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          new Notification('PaniniBase', { body: t("{n} nouveau match d'échange|{n} nouveaux matches d'échange", { n: fresh.length }), icon: '/logo-192.png' });
        } catch { /* certains navigateurs mobiles exigent un service worker */ }
      }
    };

    check();
    const timer = setInterval(check, EVERY_MS);
    const onVisible = () => { if (!document.hidden) check(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, [user]);
}
