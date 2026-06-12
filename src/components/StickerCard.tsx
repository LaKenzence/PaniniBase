import React from 'react';
import type { Sticker } from '../types';
import { useCollectionStore } from '../store';
import { BG } from '../data/stickers';

interface Props {
  sticker: Sticker;
  selected?: boolean;
  onClick: () => void;
}

export const StickerCard: React.FC<Props> = ({ sticker, selected, onClick }) => {
  const isOwned = useCollectionStore((s) => s.isOwned);
  const getDuplicates = useCollectionStore((s) => s.getDuplicates);

  const owned = isOwned(sticker.editionId, sticker.number);
  const dupes = getDuplicates(sticker.editionId, sticker.number);
  const bg = BG[sticker.player?.colKey ?? ''] ?? 'linear-gradient(135deg,#1a3a6e,#2d5fa0)';
  const isBadge = sticker.category === 'badge';

  let borderClass = 'border-[var(--color-border-tertiary)]';
  if (selected) borderClass = 'border-[var(--red)] border-[1.5px]';
  else if (dupes > 0) borderClass = 'border-[var(--gold)] border-[1.5px]';
  else if (owned) borderClass = 'border-[var(--green)] border-[1.5px]';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-lg border overflow-hidden cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md bg-[var(--color-background-primary)] ${borderClass}`}
    >
      {/* Sticker visual */}
      <div className="relative w-full aspect-[3/4] flex flex-col items-center justify-center overflow-hidden" style={{ background: bg }}>
        {/* Sheen overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 55%)' }} />

        {/* Shiny shimmer */}
        {sticker.isShiny && (
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(45deg,rgba(255,215,0,0.15),rgba(255,255,255,0.1),rgba(255,215,0,0.15))', backgroundSize: '200% 200%' }} />
        )}

        {/* Number badge */}
        <span className="absolute top-1 left-1.5 text-[8px] font-medium text-white/90 bg-black/40 px-1 py-0.5 rounded">
          {sticker.number}
        </span>

        {/* Status badge */}
        {dupes > 0 && (
          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[var(--gold)] flex items-center justify-center text-[7px] text-white font-bold">
            {dupes}
          </span>
        )}
        {owned && dupes === 0 && (
          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[var(--green)] flex items-center justify-center text-[8px] text-white">
            ✓
          </span>
        )}

        {/* Content */}
        {isBadge ? (
          <>
            <span className="text-3xl mb-1">{sticker.player?.flag}</span>
            <span className="text-[8px] text-white/80 font-medium text-center px-1">ÉCUSSON</span>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xl mb-1">
              {sticker.player?.flag}
            </div>
            <span className="text-[8px] text-white/90 text-center px-1 font-medium leading-tight max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {sticker.player?.name.split(' ').pop()}
            </span>
          </>
        )}

        {sticker.isShiny && (
          <span className="absolute bottom-1 right-1 text-[8px] text-yellow-300 font-bold">★</span>
        )}
      </div>

      {/* Info row */}
      <div className="px-1.5 py-1">
        <p className="text-[10px] font-medium text-[var(--color-text-primary)] truncate leading-tight">
          {isBadge ? (sticker.teamName ?? '') : sticker.player?.name}
        </p>
        <div className="flex justify-between items-center mt-0.5">
          <span className="text-[8.5px] text-[var(--color-text-tertiary)]">
            {isBadge ? 'Écusson' : sticker.player?.position}
          </span>
          {sticker.isShiny && (
            <span className="text-[7.5px] text-yellow-500 font-semibold">SHINY</span>
          )}
        </div>
      </div>
    </div>
  );
};
