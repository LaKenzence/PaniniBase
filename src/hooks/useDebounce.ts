import { useState, useEffect } from 'react';

/**
 * Retourne une version "debouncée" de la valeur passée : elle ne se met à jour
 * que `delay` ms après la dernière modification. Utile pour les champs de
 * recherche afin d'éviter de recalculer un filtre à chaque frappe.
 */
export function useDebounce<T>(value: T, delay: number = 200): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}
