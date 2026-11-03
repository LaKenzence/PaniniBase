/**
 * Palette de l'app, en un seul endroit.
 * Les mêmes valeurs existent en variables CSS dans index.css (--gold, --bg-card…) :
 * si tu changes une couleur ici, change-la aussi là-bas.
 *
 * On garde des valeurs hexa (et pas `var(--x)`) car certains composants y
 * ajoutent une opacité (`${C.gold}18`), et html2canvas / recharts en ont besoin.
 */
export const C = {
  // Accents
  gold:      '#C9A227',
  goldLight: '#E8C84A',
  green:     '#2ECC71',
  red:       '#E74C3C',
  redLight:  '#FF7675',
  blue:      '#3498DB',
  orange:    '#E67E22',
  purple:    '#9B59B6',
  shiny:     '#FFD700',

  // Fonds
  bgBase:     '#070C18',
  bgCard:     '#0D1526',
  bgElevated: '#131E35',

  // Textes
  textPrimary:   '#F0F4FF',
  textSecondary: '#8A9BBF',
  textTertiary:  '#6B7A9A', // contraste ≥ 4.5:1 sur bgBase (lisible en petit texte)
} as const;
