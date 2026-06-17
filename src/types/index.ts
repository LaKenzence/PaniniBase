// ─── Editions ────────────────────────────────────────────────────────────────

export type StickerCategory = 'player' | 'badge' | 'logo' | 'stadium' | 'special' | 'shiny';

export interface Edition {
  id: string;
  year: number;
  label: string;
  hostCountry: string;
  hostFlag: string;
  totalStickers: number;
  bgGradient: string;
  colKey: string;
}

// ─── Stickers ────────────────────────────────────────────────────────────────

export interface Sticker {
  id: string;
  editionId: string;
  number: number;
  category: StickerCategory;
  isShiny: boolean;
  imageUrl?: string;        // ← NOUVEAU : URL Supabase Storage
  player?: PlayerOnSticker;
  teamName?: string;
}

export interface PlayerOnSticker {
  name: string;
  nationality: string;
  flag: string;
  position?: 'Gardien' | 'Défenseur' | 'Milieu' | 'Attaquant';
  jerseyNumber?: number;
  club?: string;
  colKey: string;
  playerKey?: string;
}

// ─── Players (cross-edition entity) ─────────────────────────────────────────

export interface Player {
  key: string;
  name: string;
  flag: string;
  nationality: string;
  position: string;
  editionIds: string[];
}

// ─── Collection (user state) ─────────────────────────────────────────────────

export interface CollectionEntry {
  stickerEditionId: string;
  stickerNumber: number;
  owned: boolean;
  duplicates: number;
}

export type CollectionMap = Record<string, CollectionEntry>;

// ─── UI helpers ──────────────────────────────────────────────────────────────

export type AlbumFilter = 'all' | 'owned' | 'missing' | 'dupes';
export type View = 'home' | 'album' | 'player';