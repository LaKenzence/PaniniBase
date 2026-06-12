// ─── Editions ────────────────────────────────────────────────────────────────

export type StickerCategory = 'player' | 'badge' | 'logo' | 'stadium' | 'special' | 'shiny';

export interface Edition {
  id: string;           // e.g. '98', '06', '22'
  year: number;
  label: string;        // e.g. "France 1998"
  hostCountry: string;
  hostFlag: string;
  totalStickers: number;
  bgGradient: string;
  colKey: string;
}

// ─── Stickers ────────────────────────────────────────────────────────────────

export interface Sticker {
  id: string;             // `${editionId}-${number}`
  editionId: string;
  number: number;
  category: StickerCategory;
  isShiny: boolean;
  player?: PlayerOnSticker;
  teamName?: string;      // for badge/logo stickers
}

export interface PlayerOnSticker {
  name: string;
  nationality: string;
  flag: string;
  position: 'Gardien' | 'Défenseur' | 'Milieu' | 'Attaquant';
  jerseyNumber: number;
  club: string;
  colKey: string;
  playerKey?: string;     // links to Player entity for cross-edition tracking
}

// ─── Players (cross-edition entity) ─────────────────────────────────────────

export interface Player {
  key: string;
  name: string;
  flag: string;
  nationality: string;
  position: string;
  editionIds: string[];   // all editions where this player appears
}

// ─── Collection (user state) ─────────────────────────────────────────────────

export interface CollectionEntry {
  stickerEditionId: string;
  stickerNumber: number;
  owned: boolean;
  duplicates: number;
}

export type CollectionMap = Record<string, CollectionEntry>; // key: `${editionId}-${number}`

// ─── UI helpers ──────────────────────────────────────────────────────────────

export type AlbumFilter = 'all' | 'owned' | 'missing' | 'dupes';
export type View = 'home' | 'album' | 'player';
