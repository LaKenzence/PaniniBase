import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CollectionMap, AlbumFilter, View } from '../types';

// ─── Collection Store (persisted) ────────────────────────────────────────────

interface CollectionState {
  collection: CollectionMap;
  setOwned: (editionId: string, number: number, owned: boolean) => void;
  setDuplicates: (editionId: string, number: number, delta: number) => void;
  isOwned: (editionId: string, number: number) => boolean;
  getDuplicates: (editionId: string, number: number) => number;
  exportCollection: () => string;
  importCollection: (json: string) => boolean;
  clearCollection: () => void;
}

const stickerKey = (editionId: string, number: number) => `${editionId}-${number}`;

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      collection: {},

      setOwned: (editionId, number, owned) => {
        const key = stickerKey(editionId, number);
        set((s) => ({
          collection: {
            ...s.collection,
            [key]: {
              stickerEditionId: editionId,
              stickerNumber: number,
              owned,
              duplicates: owned ? (s.collection[key]?.duplicates ?? 0) : 0,
            },
          },
        }));
      },

      setDuplicates: (editionId, number, delta) => {
        const key = stickerKey(editionId, number);
        set((s) => {
          const current = s.collection[key];
          if (!current?.owned) return s;
          return {
            collection: {
              ...s.collection,
              [key]: { ...current, duplicates: Math.max(0, current.duplicates + delta) },
            },
          };
        });
      },

      isOwned: (editionId, number) => {
        return get().collection[stickerKey(editionId, number)]?.owned ?? false;
      },

      getDuplicates: (editionId, number) => {
        return get().collection[stickerKey(editionId, number)]?.duplicates ?? 0;
      },

      exportCollection: () => {
        return JSON.stringify(get().collection, null, 2);
      },

      importCollection: (json) => {
        try {
          const parsed = JSON.parse(json);
          set({ collection: parsed });
          return true;
        } catch {
          return false;
        }
      },

      clearCollection: () => set({ collection: {} }),
    }),
    { name: 'paninibase-collection-v1' }
  )
);

// ─── UI / Navigation Store ────────────────────────────────────────────────────

interface UIState {
  view: View;
  selectedEditionId: string | null;
  selectedStickerNumber: number | null;
  selectedPlayerKey: string | null;
  albumFilter: AlbumFilter;
  albumSearch: string;
  albumTeamFilter: string | null;
  previousView: View | null;

  goHome: () => void;
  goAlbum: (editionId: string) => void;
  goPlayer: (playerKey: string) => void;
  goBack: () => void;
  selectSticker: (number: number | null) => void;
  setAlbumFilter: (f: AlbumFilter) => void;
  setAlbumSearch: (q: string) => void;
  setAlbumTeamFilter: (team: string | null) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  view: 'home',
  selectedEditionId: null,
  selectedStickerNumber: null,
  selectedPlayerKey: null,
  albumFilter: 'all',
  albumSearch: '',
  albumTeamFilter: null,
  previousView: null,

  goHome: () => set({ view: 'home', selectedEditionId: null, selectedStickerNumber: null }),
  goAlbum: (editionId) => set((s) => ({ view: 'album', selectedEditionId: editionId, selectedStickerNumber: null, previousView: s.view })),
  goPlayer: (playerKey) => set((s) => ({ view: 'player', selectedPlayerKey: playerKey, previousView: s.view })),
  goBack: () => {
    const { previousView, selectedEditionId } = get();
    if (previousView === 'album' && selectedEditionId) set({ view: 'album', selectedPlayerKey: null });
    else set({ view: 'home', selectedEditionId: null, selectedPlayerKey: null });
  },
  selectSticker: (number) => set({ selectedStickerNumber: number }),
  setAlbumFilter: (f) => set({ albumFilter: f }),
  setAlbumSearch: (q) => set({ albumSearch: q }),
  setAlbumTeamFilter: (team) => set({ albumTeamFilter: team }),
}));
