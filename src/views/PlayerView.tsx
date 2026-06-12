import React from 'react';
import { PLAYERS, STICKERS_BY_EDITION, EDITIONS, BG } from '../data/stickers';
import { useUIStore } from '../store';
import { useCollectionStore } from '../store';

export const PlayerView: React.FC = () => {
  const { selectedPlayerKey, goBack, goAlbum, selectSticker } = useUIStore();
  const { isOwned } = useCollectionStore();

  const player = selectedPlayerKey ? PLAYERS[selectedPlayerKey] : null;

  if (!player) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[var(--color-text-tertiary)] text-sm">Joueur introuvable</p>
      </div>
    );
  }

  const appearances = player.editionIds.flatMap((edId) => {
    const stickers = STICKERS_BY_EDITION[edId] ?? [];
    const edition = EDITIONS.find((e) => e.id === edId);
    const sticker = stickers.find((s) => s.player?.playerKey === selectedPlayerKey);
    if (!sticker || !edition) return [];
    return [{ edition, sticker, owned: isOwned(edId, sticker.number) }];
  });

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border-tertiary)] px-5 py-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[var(--color-background-secondary)] border border-[var(--color-border-secondary)] flex items-center justify-center text-3xl flex-shrink-0">
          {player.flag}
        </div>
        <div>
          <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)]">{player.name}</h2>
          <p className="text-[11.5px] text-[var(--color-text-secondary)] mt-0.5">{player.flag} {player.nationality} · {player.position}</p>
          <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">
            {appearances.length} apparition{appearances.length > 1 ? 's' : ''} Panini Coupe du Monde
          </p>
        </div>
      </div>

      {/* Back button */}
      <div className="px-5 pt-4">
        <button onClick={goBack} className="flex items-center gap-1 text-[11.5px] text-[var(--color-text-secondary)] border border-[var(--color-border-secondary)] rounded-lg px-2.5 py-1 hover:bg-[var(--color-background-secondary)] transition-colors mb-4">
          ← Retour
        </button>

        <p className="text-[11.5px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Toutes les apparitions Panini</p>

        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
          {appearances.map(({ edition, sticker, owned }) => {
            const bg = BG[sticker.player?.colKey ?? ''] ?? 'linear-gradient(135deg,#1a3a6e,#2d5fa0)';
            return (
              <div
                key={edition.id}
                onClick={() => { goAlbum(edition.id); setTimeout(() => selectSticker(sticker.number), 50); }}
                className={`bg-[var(--color-background-primary)] border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all ${owned ? 'border-[var(--green)]' : 'border-[var(--color-border-tertiary)] hover:border-[var(--color-border-secondary)]'}`}
              >
                <div className="w-full aspect-[3/4] relative flex flex-col items-center justify-center overflow-hidden" style={{ background: bg }}>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.13) 0%,transparent 55%)' }} />
                  {sticker.isShiny && <div className="absolute inset-0" style={{ background: 'linear-gradient(45deg,rgba(255,215,0,0.12),transparent,rgba(255,215,0,0.12))' }} />}
                  <span className="absolute top-1.5 left-2 text-[8.5px] font-medium text-white/90 bg-black/40 px-1.5 py-0.5 rounded">#{sticker.number}</span>
                  {owned && <span className="absolute top-1.5 right-2 w-4 h-4 rounded-full bg-[var(--green)] flex items-center justify-center text-[8px] text-white">✓</span>}
                  {sticker.isShiny && <span className="absolute bottom-2 right-2 text-yellow-300 text-sm">★</span>}
                  <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-2xl mb-1">
                    {sticker.player?.flag}
                  </div>
                  <span className="text-[9px] font-medium text-white/95 text-center px-2">{sticker.player?.name.split(' ').pop()}</span>
                </div>
                <div className="px-2.5 py-2">
                  <p className="text-[12.5px] font-medium text-[var(--color-text-primary)]">{edition.year}</p>
                  <p className="text-[9.5px] text-[var(--color-text-tertiary)] mt-0.5">{sticker.player?.club}</p>
                  <span className="inline-block text-[9.5px] font-medium text-[var(--red)] bg-red-50 px-1.5 py-0.5 rounded mt-1">#{sticker.number}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
