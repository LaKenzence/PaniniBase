import React, { useRef } from 'react';
import { EDITIONS, STICKERS_BY_EDITION } from '../data/stickers';
import { useCollectionStore, useUIStore } from '../store';
import { useEditionStats } from '../hooks';

const EditionRow: React.FC<{ editionId: string }> = ({ editionId }) => {
  const edition = EDITIONS.find((e) => e.id === editionId)!;
  const { owned, missing, dupes, pct } = useEditionStats(editionId);
  const { goAlbum } = useUIStore();

  return (
    <div onClick={() => goAlbum(editionId)} className="flex items-center gap-3 p-3 bg-[var(--color-background-primary)] border border-[var(--color-border-tertiary)] rounded-xl cursor-pointer hover:border-[var(--color-border-secondary)] transition-colors">
      <div className="w-10 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0" style={{ background: edition.bgGradient }}>
        {edition.hostFlag}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-[var(--color-text-primary)] truncate">{edition.label}</p>
        <div className="h-1 bg-[var(--color-border-tertiary)] rounded-full mt-1.5 overflow-hidden">
          <div className="h-full bg-[var(--green)] rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[12px] font-semibold text-[var(--green)]">{pct}%</p>
        <p className="text-[9.5px] text-[var(--color-text-tertiary)]">{owned} / {owned + missing}</p>
      </div>
      {dupes > 0 && (
        <span className="text-[9.5px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex-shrink-0">{dupes} dup</span>
      )}
    </div>
  );
};

export const CollectionView: React.FC = () => {
  const { exportCollection, importCollection, clearCollection, collection } = useCollectionStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const totalOwned = Object.values(collection).filter((e) => e.owned).length;
  const totalDupes = Object.values(collection).reduce((sum, e) => sum + e.duplicates, 0);
  const editionsWithData = EDITIONS.filter((e) => STICKERS_BY_EDITION[e.id]);

  const handleExport = () => {
    const json = exportCollection();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paninibase-collection.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importCollection(ev.target?.result as string);
      alert(ok ? '✅ Collection importée !' : '❌ Fichier invalide');
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero stats */}
      <div className="px-5 py-6 border-b border-[var(--color-border-tertiary)]">
        <h2 className="text-[17px] font-semibold text-[var(--color-text-primary)] mb-4">Ma collection</h2>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-[var(--red)]">{totalOwned.toLocaleString()}</div>
            <div className="text-[9.5px] text-[var(--color-text-tertiary)] mt-0.5">Stickers possédés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-amber-500">{totalDupes.toLocaleString()}</div>
            <div className="text-[9.5px] text-[var(--color-text-tertiary)] mt-0.5">Doublons</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-[var(--green)]">{editionsWithData.filter((e) => { const stickers = STICKERS_BY_EDITION[e.id] ?? []; return stickers.some((s) => Object.values(collection).some((c) => c.stickerEditionId === e.id && c.owned)); }).length}</div>
            <div className="text-[9.5px] text-[var(--color-text-tertiary)] mt-0.5">Albums actifs</div>
          </div>
        </div>
      </div>

      {/* Per-edition list */}
      <div className="p-5">
        <p className="text-[11.5px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Progression par album</p>
        <div className="flex flex-col gap-2 mb-6">
          {editionsWithData.map((e) => <EditionRow key={e.id} editionId={e.id} />)}
        </div>

        {/* Import / Export */}
        <p className="text-[11.5px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Sauvegarde</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleExport} className="px-3 py-2 rounded-lg border border-[var(--color-border-secondary)] text-[11.5px] text-[var(--color-text-secondary)] bg-[var(--color-background-primary)] hover:bg-[var(--color-background-secondary)] transition-colors">
            📥 Exporter ma collection
          </button>
          <button onClick={() => fileRef.current?.click()} className="px-3 py-2 rounded-lg border border-[var(--color-border-secondary)] text-[11.5px] text-[var(--color-text-secondary)] bg-[var(--color-background-primary)] hover:bg-[var(--color-background-secondary)] transition-colors">
            📤 Importer
          </button>
          <button onClick={() => { if (confirm('Réinitialiser toute la collection ?')) clearCollection(); }} className="px-3 py-2 rounded-lg border border-red-200 text-[11.5px] text-red-500 bg-[var(--color-background-primary)] hover:bg-red-50 transition-colors">
            🗑 Réinitialiser
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>

        {/* Supabase note */}
        <div className="mt-6 p-3 bg-[var(--color-background-secondary)] rounded-xl border border-[var(--color-border-tertiary)]">
          <p className="text-[11px] font-medium text-[var(--color-text-secondary)] mb-1">🔌 Prêt pour Supabase</p>
          <p className="text-[10.5px] text-[var(--color-text-tertiary)] leading-relaxed">
            La collection est stockée en localStorage. Pour synchroniser entre appareils, connecte Supabase dans <code className="text-[10px] bg-[var(--color-background-primary)] px-1 rounded">src/lib/supabase.ts</code> et remplace le store par des appels API.
          </p>
        </div>
      </div>
    </div>
  );
};
