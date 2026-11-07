import type React from 'react';

/** Rend un <div> cliquable utilisable au clavier (Tab + Entrée/Espace) et par les lecteurs d'écran. */
export const clickable = (onClick: () => void, label: string) => ({
  role: 'button' as const,
  tabIndex: 0,
  'aria-label': label,
  onClick,
  onKeyDown: (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    e.stopPropagation(); // sinon Espace déclenche aussi le raccourci de l'album
    onClick();
  },
});
