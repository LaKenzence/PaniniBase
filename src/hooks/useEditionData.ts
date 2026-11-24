import { useEffect, useSyncExternalStore } from 'react';
import { EDITIONS, subscribeData, getDataVersion, loadEdition, loadAllEditions, isEditionLoaded } from '../data/stickers';

/**
 * Change à chaque album chargé. À mettre dans les dépendances des calculs
 * faits sur STICKERS_BY_EDITION, pour qu'ils se refassent quand un album arrive.
 */
export const useDataVersion = () => useSyncExternalStore(subscribeData, getDataVersion);

/**
 * Charge les albums demandés ('all' = tous, null = aucun) et renvoie true
 * quand ils sont complets. Les effectifs 1970–2022 ne sont téléchargés
 * qu'à ce moment-là, pas au démarrage de l'appli.
 */
export function useEditions(ids: string[] | 'all' | null): boolean {
  useDataVersion();
  const key = ids === 'all' ? 'all' : (ids ?? []).join(',');

  useEffect(() => {
    const load = ids === 'all' ? loadAllEditions() : Promise.all((ids ?? []).map(loadEdition));
    // Hors ligne : on garde les stickers déjà disponibles, un nouvel essai aura lieu au prochain affichage
    load.catch((err) => console.warn('PaniniBase — album non chargé :', err));
  }, [key]);

  return ids === 'all' ? EDITIONS.every((e) => isEditionLoaded(e.id)) : (ids ?? []).every(isEditionLoaded);
}
