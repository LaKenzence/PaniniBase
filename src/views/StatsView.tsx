import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { EDITIONS, STICKERS_BY_EDITION } from '../data/stickers';
import { useCollectionStore, useUIStore } from '../store/index';
import { useEditionStats, useGlobalStats } from '../hooks';

const GOLD = '#C9A227', GREEN = '#2ECC71', RED = '#E74C3C', BLUE = '#3498DB', ORANGE = '#E67E22', PURPLE = '#9B59B6';
const TIER_COLORS = [GREEN, BLUE, GOLD, ORANGE, RED];

const MiniDonut: React.FC<{ pct: number; color: string; size?: number }> = ({ pct, color, size = 40 }) => {
  const r = (size / 2) - 4;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
    </svg>
  );
};

const EditionRow: React.FC<{ editionId: string }> = ({ editionId }) => {
  const edition = EDITIONS.find((e) => e.id === editionId)!;
  const { owned, pct, total, dupes } = useEditionStats(editionId);
  const { goAlbum } = useUIStore();
  const catalogued = (STICKERS_BY_EDITION[editionId] ?? []).length;
  const color = pct === 100 ? GOLD : pct > 75 ? GREEN : pct > 40 ? BLUE : pct > 10 ? ORANGE : RED;
  return (
    <div onClick={() => goAlbum(editionId)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '12px', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.12s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
      <MiniDonut pct={pct} color={color} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#F0F4FF' }}>{edition.label}</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color }}>{pct}%</span>
        </div>
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 0.6s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          <span style={{ fontSize: '9.5px', color: '#4A5A7A' }}>{owned} / {catalogued} catalogués</span>
          {dupes > 0 && <span style={{ fontSize: '9.5px', color: GOLD }}>{dupes} doublons</span>}
        </div>
      </div>
      <span style={{ fontSize: '16px' }}>{edition.hostFlag}</span>
    </div>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#131E35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
      <p style={{ color: '#8A9BBF', marginBottom: '4px', fontSize: '11px' }}>{label}</p>
      {payload.map((p: any) => <p key={p.name} style={{ color: p.color, fontWeight: 700 }}>{p.name} : {p.value}</p>)}
    </div>
  );
};

export const StatsView: React.FC = () => {
  const { totalOwned, totalCatalogued, totalDupes } = useGlobalStats();
  const { collection, exportCollection, importCollection, clearCollection } = useCollectionStore();
  const [importError, setImportError]     = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [activeTab, setActiveTab]         = useState<'overview' | 'albums' | 'data'>('overview');

  const completionData = useMemo(() => EDITIONS.map((ed) => {
    const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
    const ownedCount = stickers.filter((s) => collection[`${ed.id}-${s.number}`]?.owned).length;
    const pct = stickers.length > 0 ? Math.round((ownedCount / ed.totalStickers) * 100) : 0;
    return { name: `${ed.year}`, label: ed.label, owned: ownedCount, total: ed.totalStickers, catalogued: stickers.length, pct, flag: ed.hostFlag };
  }), [collection]);

  const tierData = useMemo(() => [
    { name: '100%', min: 100, max: 100 },
    { name: '75-99%', min: 75, max: 99 },
    { name: '25-74%', min: 25, max: 74 },
    { name: '1-24%', min: 1, max: 24 },
    { name: '0%', min: 0, max: 0 },
  ].map((t, i) => ({ name: t.name, value: completionData.filter((d) => d.pct >= t.min && d.pct <= t.max).length, color: TIER_COLORS[i] })).filter((t) => t.value > 0), [completionData]);

  const top5 = useMemo(() => [...completionData].sort((a, b) => b.pct - a.pct).slice(0, 5), [completionData]);
  const globalPct = totalCatalogued > 0 ? Math.round((totalOwned / totalCatalogued) * 100) : 0;

  // ── Export JSON ──────────────────────────────────────────────────────────────
  const handleExportJSON = () => {
    const blob = new Blob([exportCollection()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `paninibase-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Export CSV ───────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const rows = ['Album,Code,Joueur,Équipe,Possédé,Doublons'];
    EDITIONS.forEach((ed) => {
      const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
      stickers.forEach((s) => {
        const entry = collection[`${ed.id}-${s.number}`];
        const owned = entry?.owned ? 'Oui' : 'Non';
        const dupes = entry?.duplicates ?? 0;
        const name = (s.player?.name ?? s.teamName ?? '').replace(/,/g, ';');
        const team = (s.player?.nationality ?? s.teamName ?? '').replace(/,/g, ';');
        rows.push(`${ed.label},${s.number},${name},${team},${owned},${dupes}`);
      });
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `paninibase-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Import JSON ──────────────────────────────────────────────────────────────
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importCollection(ev.target?.result as string);
      if (ok) { setImportSuccess(true); setImportError(null); setTimeout(() => setImportSuccess(false), 3000); }
      else setImportError('Fichier invalide');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── Import CSV ───────────────────────────────────────────────────────────────
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const lines = (ev.target?.result as string).split('\n').slice(1);
        const map: Record<string, any> = { ...JSON.parse(exportCollection()) };
        lines.forEach((line) => {
          const [albumLabel, code, , , ownedStr, dupesStr] = line.split(',');
          if (!code || !albumLabel) return;
          const ed = EDITIONS.find((e) => e.label === albumLabel.trim());
          if (!ed) return;
          const k = `${ed.id}-${code.trim()}`;
          const owned = ownedStr?.trim() === 'Oui';
          const dupes = parseInt(dupesStr?.trim() ?? '0') || 0;
          map[k] = { stickerEditionId: ed.id, stickerNumber: code.trim(), owned, duplicates: dupes };
        });
        importCollection(JSON.stringify(map));
        setImportSuccess(true); setImportError(null);
        setTimeout(() => setImportSuccess(false), 3000);
      } catch { setImportError('CSV invalide'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const tabs = [
    { key: 'overview', label: '📊 Vue globale' },
    { key: 'albums',   label: '📋 Par album' },
    { key: 'data',     label: '💾 Données' },
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#070C18' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '14px 20px 0', background: '#0D1526', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <h1 style={{ fontSize: '16px', fontWeight: 800, color: '#F0F4FF', marginBottom: '12px' }}>❤️ Ma Collection</h1>
        <div style={{ display: 'flex', gap: '2px' }}>
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{ padding: '8px 14px', fontSize: '12px', fontWeight: activeTab === key ? 700 : 400, color: activeTab === key ? '#F0F4FF' : '#4A5A7A', background: 'none', border: 'none', cursor: 'pointer', borderBottom: `2px solid ${activeTab === key ? GOLD : 'transparent'}`, transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
              {[
                { val: totalOwned, lbl: 'Possédés', color: GREEN, icon: '✓' },
                { val: totalDupes, lbl: 'Doublons', color: GOLD, icon: '×' },
                { val: `${globalPct}%`, lbl: 'Complétion', color: BLUE, icon: '◎' },
                { val: EDITIONS.length, lbl: 'Albums', color: PURPLE, icon: '📚' },
              ].map(({ val, lbl, color, icon }) => (
                <div key={lbl} style={{ background: '#0D1526', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{icon}</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: '9px', color: '#4A5A7A', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{lbl}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#0D1526', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#8A9BBF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Complétion par album</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={completionData} barSize={16} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#4A5A7A' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#4A5A7A' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                  <Bar dataKey="pct" name="Complétion %" radius={[4, 4, 0, 0]}>
                    {completionData.map((entry, i) => (
                      <Cell key={i} fill={entry.pct === 100 ? GOLD : entry.pct > 75 ? GREEN : entry.pct > 40 ? BLUE : entry.pct > 10 ? ORANGE : 'rgba(255,255,255,0.12)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#0D1526', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#8A9BBF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Répartition</h3>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie data={tierData} cx="50%" cy="50%" innerRadius={32} outerRadius={52} dataKey="value" strokeWidth={0}>
                      {tierData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                  {tierData.map((t) => (
                    <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: t.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '10px', color: '#8A9BBF' }}>{t.name}</span>
                      <span style={{ fontSize: '10px', color: '#F0F4FF', fontWeight: 700, marginLeft: 'auto' }}>{t.value} album{t.value > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#0D1526', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#8A9BBF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Top albums</h3>
                {top5.map((album, i) => (
                  <div key={album.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: i === 0 ? GOLD : '#4A5A7A', width: '16px' }}>#{i + 1}</span>
                    <span style={{ fontSize: '12px' }}>{album.flag}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '10px', fontWeight: 600, color: '#F0F4FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{album.label}</p>
                      <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', marginTop: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${album.pct}%`, background: TIER_COLORS[i] }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: GOLD }}>{album.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ALBUMS ── */}
        {activeTab === 'albums' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ fontSize: '11px', color: '#4A5A7A', marginBottom: '6px' }}>{EDITIONS.length} albums · Clique pour ouvrir</p>
            {EDITIONS.map((ed) => <EditionRow key={ed.id} editionId={ed.id} />)}
          </div>
        )}

        {/* ── DATA ── */}
        {activeTab === 'data' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Export */}
            <div style={{ background: '#0D1526', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#F0F4FF', marginBottom: '6px' }}>📤 Exporter</h3>
              <p style={{ fontSize: '12px', color: '#4A5A7A', marginBottom: '14px', lineHeight: 1.6 }}>Sauvegarde ta collection en JSON ou CSV.</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleExportJSON} style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'rgba(46,204,113,0.08)', border: '1px solid rgba(46,204,113,0.2)', color: GREEN, fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                  ↓ JSON
                </button>
                <button onClick={handleExportCSV} style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'rgba(52,152,219,0.08)', border: '1px solid rgba(52,152,219,0.2)', color: BLUE, fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                  ↓ CSV
                </button>
              </div>
            </div>

            {/* Import */}
            <div style={{ background: '#0D1526', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#F0F4FF', marginBottom: '6px' }}>📥 Importer</h3>
              <p style={{ fontSize: '12px', color: '#4A5A7A', marginBottom: '14px', lineHeight: 1.6 }}>Restaure depuis un fichier JSON ou CSV exporté.</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <label style={{ flex: 1, display: 'block', padding: '11px', borderRadius: '10px', background: 'rgba(46,204,113,0.08)', border: '1px solid rgba(46,204,113,0.2)', color: GREEN, fontWeight: 700, fontSize: '12px', cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box' }}>
                  ↑ JSON <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                </label>
                <label style={{ flex: 1, display: 'block', padding: '11px', borderRadius: '10px', background: 'rgba(52,152,219,0.08)', border: '1px solid rgba(52,152,219,0.2)', color: BLUE, fontWeight: 700, fontSize: '12px', cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box' }}>
                  ↑ CSV <input type="file" accept=".csv" onChange={handleImportCSV} style={{ display: 'none' }} />
                </label>
              </div>
              {importSuccess && <p style={{ fontSize: '12px', color: GREEN, marginTop: '8px', textAlign: 'center' }}>✓ Importé avec succès !</p>}
              {importError && <p style={{ fontSize: '12px', color: RED, marginTop: '8px', textAlign: 'center' }}>⚠️ {importError}</p>}
            </div>

            {/* Reset */}
            <div style={{ background: '#0D1526', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#F0F4FF', marginBottom: '6px' }}>🗑️ Réinitialiser</h3>
              <p style={{ fontSize: '12px', color: '#4A5A7A', marginBottom: '14px', lineHeight: 1.6 }}>Efface toute ta collection. Irréversible.</p>
              <button onClick={() => { if (confirm('Effacer toute la collection ?')) clearCollection(); }} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)', color: RED, fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                ✕ Effacer ma collection
              </button>
            </div>

            {/* Summary */}
            <div style={{ background: '#0D1526', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#8A9BBF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Résumé</h3>
              {[
                ['Stickers possédés', totalOwned, GREEN],
                ['Doublons', totalDupes, GOLD],
                ['Albums commencés', completionData.filter((d) => d.owned > 0).length, BLUE],
                ['Albums terminés', completionData.filter((d) => d.pct === 100).length, GOLD],
              ].map(([label, val, color]) => (
                <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '12px', color: '#8A9BBF' }}>{label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: String(color) }}>{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
