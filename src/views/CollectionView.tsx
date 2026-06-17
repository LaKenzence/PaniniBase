import React, { useRef, useState } from 'react';
import { EDITIONS, STICKERS_BY_EDITION } from '../data/stickers';
import { useCollectionStore } from '../store/index';
import { useGlobalStats } from '../hooks';

export const CollectionView: React.FC = () => {
  const { collection, exportCollection, importCollection, clearCollection } = useCollectionStore();
  const { totalStickers, totalCatalogued, totalOwned, totalDupes } = useGlobalStats();
  const fileRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // ── JSON export (existing) ──
  const handleExportJSON = () => {
    const json = exportCollection();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paninibase-collection-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── JSON import (existing) ──
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const json = ev.target?.result as string;
      const ok = importCollection(json);
      showToast(ok ? '✓ Collection importée (JSON)' : '✗ Fichier JSON invalide');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── CSV export ──
  const handleExportCSV = () => {
    const rows: string[] = ['edition_id,edition_label,sticker_number,sticker_code,player_name,team,position,owned,duplicates'];
    for (const ed of EDITIONS) {
      const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
      for (const s of stickers) {
        const k = `${ed.id}-${s.number}`;
        const entry = collection[k];
        const owned = entry?.owned ? '1' : '0';
        const dupes = String(entry?.duplicates ?? 0);
        const name = (s.player?.name ?? '').replace(/,/g, ' ');
        const team = (s.teamName ?? s.player?.nationality ?? '').replace(/,/g, ' ');
        const pos = s.player?.position ?? (s.category === 'badge' ? 'Écusson' : '');
        rows.push([ed.id, ed.label, s.number, s.id, name, team, pos, owned, dupes].join(','));
      }
    }
    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paninibase-collection-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ Export CSV téléchargé');
  };

  // ── CSV import ──
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const lines = text.trim().split('\n');
        // Skip header
        const data = lines.slice(1);
        let added = 0;
        // Build a map from sticker_code → { editionId, number }
        const codeMap: Record<string, { editionId: string; number: number }> = {};
        for (const ed of EDITIONS) {
          for (const s of STICKERS_BY_EDITION[ed.id] ?? []) {
            codeMap[s.id] = { editionId: ed.id, number: s.number };
          }
        }
        const newCollection = { ...collection };
        for (const line of data) {
          if (!line.trim()) continue;
          const cols = line.split(',');
          // edition_id,edition_label,sticker_number,sticker_code,player_name,team,position,owned,duplicates
          const editionId = cols[0]?.trim();
          const stickerNumber = parseInt(cols[2]?.trim(), 10);
          const owned = cols[7]?.trim() === '1';
          const duplicates = parseInt(cols[8]?.trim() ?? '0', 10) || 0;
          if (!editionId || isNaN(stickerNumber)) continue;
          const k = `${editionId}-${stickerNumber}`;
          newCollection[k] = { stickerEditionId: editionId, stickerNumber, owned, duplicates };
          if (owned) added++;
        }
        importCollection(JSON.stringify(newCollection));
        showToast(`✓ CSV importé — ${added} stickers possédés`);
      } catch {
        showToast('✗ Fichier CSV invalide');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const csvImportRef = useRef<HTMLInputElement>(null);

  const pct = totalCatalogued > 0 ? Math.round((totalOwned / totalCatalogued) * 100) : 0;
  const progressColor = pct === 100 ? '#C9A227' : pct > 75 ? '#2ECC71' : pct > 40 ? '#3498DB' : '#E74C3C';

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', background: '#070C18', color: '#F0F4FF' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
          background: '#1A2744', border: '1px solid rgba(201,162,39,0.4)',
          color: '#F0F4FF', padding: '10px 20px', borderRadius: '12px',
          fontSize: '13px', fontWeight: 600, zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          {toast}
        </div>
      )}

      <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', color: '#F0F4FF' }}>Ma collection</h2>

      {/* Global stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '24px' }}>
        {[
          { val: totalOwned,      lbl: 'Stickers possédés', color: '#2ECC71' },
          { val: totalDupes,      lbl: 'Doublons',           color: '#C9A227' },
          { val: totalCatalogued, lbl: 'Catalogués',         color: '#3498DB' },
          { val: `${pct}%`,       lbl: 'Complété',           color: progressColor },
        ].map(({ val, lbl, color }) => (
          <div key={lbl} style={{ background: '#0D1526', borderRadius: '14px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color }}>{val}</div>
            <div style={{ fontSize: '11px', color: '#4A5A7A', marginTop: '2px' }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Per-edition progress */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#4A5A7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Par édition</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {EDITIONS.map((ed) => {
            const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
            const ownedCount = stickers.filter((s) => collection[`${ed.id}-${s.number}`]?.owned).length;
            const edPct = stickers.length > 0 ? Math.round((ownedCount / ed.totalStickers) * 100) : 0;
            const edColor = edPct === 100 ? '#C9A227' : edPct > 75 ? '#2ECC71' : edPct > 40 ? '#3498DB' : '#E74C3C';
            return (
              <div key={ed.id} style={{ background: '#0D1526', borderRadius: '10px', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', marginRight: '6px' }}>{ed.hostFlag}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, flex: 1 }}>{ed.label}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: edColor }}>{ownedCount}/{ed.totalStickers}</span>
                </div>
                <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${edPct}%`, background: edColor, borderRadius: '2px', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Import / Export */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#4A5A7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Import / Export</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {/* JSON */}
          <button onClick={handleExportJSON} style={btnStyle('#3498DB')}>
            📤 Export JSON
          </button>
          <button onClick={() => fileRef.current?.click()} style={btnStyle('#3498DB')}>
            📥 Import JSON
          </button>

          {/* CSV */}
          <button onClick={handleExportCSV} style={btnStyle('#2ECC71')}>
            📊 Export CSV
          </button>
          <button onClick={() => csvImportRef.current?.click()} style={btnStyle('#2ECC71')}>
            📋 Import CSV
          </button>
        </div>

        <p style={{ fontSize: '10.5px', color: '#2A3A5A', marginTop: '8px', lineHeight: 1.5 }}>
          Le CSV est compatible Excel/Google Sheets. Colonnes : edition_id, sticker_number, owned (0/1), duplicates.
        </p>
      </div>

      {/* Hidden inputs */}
      <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportJSON} />
      <input ref={csvImportRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleImportCSV} />

      {/* Danger zone */}
      <div style={{ borderTop: '1px solid rgba(231,76,60,0.15)', paddingTop: '16px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#4A5A7A', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>Zone danger</h3>
        <button
          onClick={() => {
            if (window.confirm('Supprimer toute ta collection ? Cette action est irréversible.')) {
              clearCollection();
              showToast('Collection effacée');
            }
          }}
          style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.25)', color: '#E74C3C', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
        >
          🗑 Effacer toute la collection
        </button>
      </div>
    </div>
  );
};

const btnStyle = (color: string): React.CSSProperties => ({
  padding: '10px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
  background: `rgba(${hexToRgb(color)},0.08)`,
  border: `1px solid rgba(${hexToRgb(color)},0.25)`,
  color, cursor: 'pointer', transition: 'all 0.12s',
});

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
