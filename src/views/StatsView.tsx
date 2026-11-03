import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Heart, BarChart3, Layers, Database, Download, Upload, Trash2, AlertTriangle, Check, Sparkles, Award } from 'lucide-react';
import { EDITIONS, STICKERS_BY_EDITION, PLAYERS, loadAllEditions } from '../data/stickers';
import { useDataVersion } from '../hooks/useEditionData';
import { useCollectionStore, useUIStore, useAuthStore } from '../store/index';
import { AuthModal } from '../components/AuthModal';
import { useBadges } from '../hooks/useBadges';
import { TrophyShelf } from '../components/TrophyShelf';
import { useEditionStats, useGlobalStats } from '../hooks';
import { C } from '../theme';
import { useT, t as tr, albumName } from '../i18n';

const GOLD = C.gold, GREEN = C.green, RED = C.red, BLUE = C.blue, ORANGE = C.orange, PURPLE = C.purple;
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
  const { owned, pct, dupes } = useEditionStats(editionId);
  const { goAlbum } = useUIStore();
  const t = useT();
  const catalogued = (STICKERS_BY_EDITION[editionId] ?? []).length;
  const color = pct === 100 ? GOLD : pct > 75 ? GREEN : pct > 40 ? BLUE : pct > 10 ? ORANGE : RED;
  return (
    <div role="button" tabIndex={0} onClick={() => goAlbum(editionId)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goAlbum(editionId); } }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '12px', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.12s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
      <MiniDonut pct={pct} color={color} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: C.textPrimary }}>{albumName(edition.label, t)}</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color }}>{pct}%</span>
        </div>
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 0.6s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: C.textTertiary }}>{t('{owned} / {n} catalogués', { owned, n: catalogued })}</span>
          {dupes > 0 && <span style={{ fontSize: '11px', color: GOLD }}>{t('{n} doublon|{n} doublons', { n: dupes })}</span>}
        </div>
      </div>
      <span style={{ fontSize: '16px' }}>{edition.hostFlag}</span>
    </div>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(10,20,40,0.95)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '12px', padding: '10px 14px',
      fontSize: '12px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
      backdropFilter: 'blur(12px)',
    }}>
      {label && <p style={{ color: C.textTertiary, marginBottom: '6px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</p>}
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: p.color, boxShadow: `0 0 6px ${p.color}` }} />
          <span style={{ color: C.textPrimary, fontWeight: 700, fontSize: '13px' }}>{p.value}{p.name?.includes('%') ? '' : p.name === 'Complétion %' ? '%' : ''}</span>
          {p.name && <span style={{ color: C.textTertiary, fontSize: '11px' }}>{p.name}</span>}
        </div>
      ))}
    </div>
  );
};

export const StatsView: React.FC = () => {
  const { totalOwned, totalCatalogued, totalDupes } = useGlobalStats();
  const badges = useBadges();
  const version = useDataVersion();
  const favorites = useCollectionStore((s) => s.favorites);
  const { goPlayer } = useUIStore();
  const favoritePlayers = Object.keys(favorites).map((key) => PLAYERS[key]).filter(Boolean);
  const { collection, exportCollection, importCollection, clearCollection } = useCollectionStore();
  const [importError, setImportError]     = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [activeTab, setActiveTab]         = useState<'overview' | 'albums' | 'badges' | 'data'>('overview');
  const [showJsonDoc, setShowJsonDoc]     = useState(false);
  const [showCsvDoc, setShowCsvDoc]       = useState(false);
  const [showAuth, setShowAuth]           = useState(false);
  const user = useAuthStore((s) => s.user);
  const t = useT();

  const completionData = useMemo(() => EDITIONS.map((ed) => {
    const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
    const ownedCount = stickers.filter((s) => collection[`${ed.id}-${s.number}`]?.owned).length;
    const pct = stickers.length > 0 ? Math.round((ownedCount / ed.totalStickers) * 100) : 0;
    return { name: `${ed.year}`, label: ed.label, owned: ownedCount, total: ed.totalStickers, catalogued: stickers.length, pct, flag: ed.hostFlag };
  }), [collection, version]);

  const tierData = useMemo(() => [
    { name: '100%', min: 100, max: 100 }, { name: '75-99%', min: 75, max: 99 }, { name: '25-74%', min: 25, max: 74 }, { name: '1-24%', min: 1, max: 24 }, { name: '0%', min: 0, max: 0 },
  ].map((t, i) => ({ name: t.name, value: completionData.filter((d) => d.pct >= t.min && d.pct <= t.max).length, color: TIER_COLORS[i] })).filter((t) => t.value > 0), [completionData]);

  const top5 = useMemo(() => [...completionData].sort((a, b) => b.pct - a.pct).slice(0, 5), [completionData]);
  const globalPct = totalCatalogued > 0 ? Math.round((totalOwned / totalCatalogued) * 100) : 0;

  // ── Export JSON (backup complet, ré-importable) ───────────────────────────
  const handleExportJSON = () => {
    const payload = { _format: 'paninibase-backup-v1', _exported_at: new Date().toISOString(), collection: JSON.parse(exportCollection()) };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `paninibase-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Export CSV (lisible, éditable dans Excel/Sheets) ──────────────────────
  const escapeCsv = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const handleExportCSV = async () => {
    await loadAllEditions(); // tous les albums complets dans le fichier
    const rows = ['EditionId,Album,Code,Joueur,Equipe,Possede,Doublons'];
    EDITIONS.forEach((ed) => {
      const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
      stickers.forEach((s) => {
        const entry = collection[`${ed.id}-${s.number}`];
        const owned = entry?.owned ? 'Oui' : 'Non';
        const dupes = entry?.duplicates ?? 0;
        const name = s.player?.name ?? s.teamName ?? '';
        const team = s.player?.nationality ?? s.teamName ?? '';
        rows.push([ed.id, escapeCsv(ed.label), escapeCsv(String(s.number)), escapeCsv(name), escapeCsv(team), owned, dupes].join(','));
      });
    });
    // BOM pour Excel UTF-8
    const blob = new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `paninibase-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw = JSON.parse(ev.target?.result as string);
        // Support both formats : backup v1 ({_format, collection}) et export brut (collection direct)
        const collectionData = raw._format === 'paninibase-backup-v1' ? raw.collection : raw;
        const ok = importCollection(JSON.stringify(collectionData));
        if (ok) { setImportSuccess(true); setImportError(null); setTimeout(() => setImportSuccess(false), 3000); }
        else setImportError(t('Ce fichier ne contient pas une collection PaniniBase'));
      } catch { setImportError(t('Fichier JSON invalide ou corrompu')); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = (ev.target?.result as string).replace(/^\uFEFF/, '');
        const lines = text.split('\n').filter((l) => l.trim());
        const header = lines[0].split(',');
        const editionIdIdx = header.findIndex((h) => h.trim().toLowerCase() === 'editionid');
        const codeIdx      = header.findIndex((h) => h.trim().toLowerCase() === 'code');
        const owneIdx       = header.findIndex((h) => h.trim().toLowerCase() === 'possede');
        const dupesIdx      = header.findIndex((h) => h.trim().toLowerCase() === 'doublons');

        if (editionIdIdx === -1 || codeIdx === -1) {
          setImportError(t('Colonnes « EditionId » et « Code » introuvables — utilise un CSV exporté depuis PaniniBase'));
          return;
        }

        const map: Record<string, any> = { ...JSON.parse(exportCollection()) };
        // Simple CSV parse (gère les guillemets basiques)
        const parseLine = (line: string): string[] => {
          const out: string[] = [];
          let cur = ''; let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === '"') { inQuotes = !inQuotes; continue; }
            if (c === ',' && !inQuotes) { out.push(cur); cur = ''; continue; }
            cur += c;
          }
          out.push(cur);
          return out;
        };

        for (let i = 1; i < lines.length; i++) {
          const cols = parseLine(lines[i]);
          const editionId = cols[editionIdIdx]?.trim();
          const code = cols[codeIdx]?.trim();
          if (!editionId || !code) continue;
          const owned = owneIdx >= 0 ? ['oui', 'yes', 'sí', 'si', 'true', '1'].includes(cols[owneIdx]?.trim().toLowerCase()) : false;
          const dupes = dupesIdx >= 0 ? parseInt(cols[dupesIdx]?.trim() ?? '0') || 0 : 0;
          map[`${editionId}-${code}`] = { stickerEditionId: editionId, stickerNumber: code, owned, duplicates: owned ? dupes : 0 };
        }

        importCollection(JSON.stringify(map));
        setImportSuccess(true); setImportError(null);
        setTimeout(() => setImportSuccess(false), 3000);
      } catch { setImportError(t('CSV invalide — vérifie le format')); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const tabs = [{ key: 'overview', label: t('Vue globale'), Icon: BarChart3 }, { key: 'albums', label: t('Par album'), Icon: Layers }, { key: 'badges', label: t('Badges'), Icon: Award }, { key: 'data', label: t('Données'), Icon: Database }] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: C.bgBase }}>
      <div style={{ flexShrink: 0, padding: '14px 20px 0', background: C.bgCard, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 800, color: C.textPrimary, marginBottom: '12px' }}><Heart size={16} fill={C.red} color={C.red} /> {t('Ma Collection')}</h1>
        {!user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '12px', padding: '10px 14px', borderRadius: '12px', background: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.2)' }}>
            <p style={{ flex: 1, minWidth: '200px', margin: 0, fontSize: '12px', color: C.textSecondary, lineHeight: 1.5 }}>
              {t('Ta collection est enregistrée sur cet appareil uniquement. Connecte-toi pour la retrouver partout et échanger tes doublons.')}{' '}
              <button onClick={() => setActiveTab('data')} style={{ padding: 0, background: 'none', border: 'none', color: C.gold, fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}>{t('Ou exporte une sauvegarde.')}</button>
            </p>
            <button className="btn-tactile btn-gold" onClick={() => setShowAuth(true)} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}>{t('Se connecter')}</button>
          </div>
        )}
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        <div style={{ display: 'flex', gap: '2px' }}>
          {tabs.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '12px', fontWeight: activeTab === key ? 700 : 400, color: activeTab === key ? C.textPrimary : C.textTertiary, background: 'none', border: 'none', cursor: 'pointer', borderBottom: `2px solid ${activeTab === key ? GOLD : 'transparent'}`, transition: 'all 0.15s' }}><Icon size={13} /> {label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
              {[{ val: totalOwned, lbl: t('Possédés'), color: GREEN, Icon: Check }, { val: totalDupes, lbl: t('Doublons'), color: GOLD, Icon: Sparkles }, { val: `${globalPct}%`, lbl: t('Complétion'), color: BLUE, Icon: BarChart3 }, { val: EDITIONS.length, lbl: t('Albums'), color: PURPLE, Icon: Layers }].map(({ val, lbl, color, Icon }) => (
                <div key={lbl} style={{ background: `linear-gradient(160deg, ${C.bgCard} 0%, rgba(10,20,40,0.8) 100%)`, border: `1px solid ${color}22`, borderRadius: '16px', padding: '16px', textAlign: 'center', boxShadow: `0 4px 20px ${color}10`, transition: 'transform 0.15s, box-shadow 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 28px ${color}20`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 20px ${color}10`; }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color, boxShadow: `0 0 16px ${color}20` }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.5px' }}>{val}</div>
                  <div style={{ fontSize: '11px', color: C.textTertiary, marginTop: '5px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 500 }}>{lbl}</div>
                </div>
              ))}
            </div>

            <div style={{ background: C.bgCard, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>{t('Complétion par album')}</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={completionData} barSize={18} margin={{ top: 4, right: 0, bottom: 0, left: -20 }} barCategoryGap="25%">
                  <defs>
                    {completionData.map((entry, i) => {
                      const color = entry.pct === 100 ? GOLD : entry.pct > 75 ? GREEN : entry.pct > 40 ? BLUE : entry.pct > 10 ? ORANGE : 'rgba(255,255,255,0.2)';
                      return (
                        <linearGradient key={i} id={`bar-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                          <stop offset="100%" stopColor={color} stopOpacity={0.45} />
                        </linearGradient>
                      );
                    })}
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: C.textTertiary }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: C.textTertiary }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 6 }} />
                  <Bar dataKey="pct" name={t('Complétion %')} radius={[6, 6, 0, 0]} isAnimationActive={true} animationDuration={800} animationEasing="ease-out">
                    {completionData.map((entry, i) => <Cell key={i} fill={`url(#bar-grad-${i})`} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="stats-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: C.bgCard, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{t('Répartition')}</h3>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <defs>
                      {tierData.map((entry, i) => (
                        <radialGradient key={i} id={`pie-grad-${i}`} cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                          <stop offset="100%" stopColor={entry.color} stopOpacity={0.6} />
                        </radialGradient>
                      ))}
                    </defs>
                    <Pie
                      data={tierData} cx="50%" cy="50%"
                      innerRadius={38} outerRadius={58}
                      dataKey="value" strokeWidth={2} stroke={C.bgBase}
                      isAnimationActive={true} animationDuration={900} animationEasing="ease-out"
                      paddingAngle={3}
                    >
                      {tierData.map((entry, i) => <Cell key={i} fill={`url(#pie-grad-${i})`} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                  {tierData.map((t) => (
                    <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: t.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '11px', color: C.textSecondary }}>{t.name}</span>
                      <span style={{ fontSize: '11px', color: C.textPrimary, fontWeight: 700, marginLeft: 'auto' }}>{t.value > 1 ? tr('{n} albums', { n: t.value }) : tr('1 album')}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: C.bgCard, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{t('Top albums')}</h3>
                {top5.map((album, i) => (
                  <div key={album.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: i === 0 ? GOLD : C.textTertiary, width: '16px' }}>#{i + 1}</span>
                    <span style={{ fontSize: '12px' }}>{album.flag}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{albumName(album.label, t)}</p>
                      <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', marginTop: '3px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${album.pct}%`, background: TIER_COLORS[i] }} /></div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: GOLD }}>{album.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'albums' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ fontSize: '11px', color: C.textTertiary, marginBottom: '6px' }}>{t('{n} albums', { n: EDITIONS.length })} · {t('Clique pour ouvrir')}</p>
            {EDITIONS.map((ed) => <EditionRow key={ed.id} editionId={ed.id} />)}
          </div>
        )}

        {activeTab === 'data' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Export */}
            <div style={{ background: C.bgCard, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: '6px' }}><Download size={14} /> {t('Exporter')}</h3>
              <p style={{ fontSize: '12px', color: C.textTertiary, marginBottom: '14px', lineHeight: 1.6 }}>
                <strong style={{ color: C.textSecondary }}>JSON</strong> = {t('sauvegarde complète, à réimporter dans PaniniBase uniquement.')}<br />
                <strong style={{ color: C.textSecondary }}>CSV</strong> = {t('lisible/éditable dans Excel ou Google Sheets.')}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-tactile" onClick={handleExportJSON} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', borderRadius: '10px', background: 'rgba(46,204,113,0.08)', border: '1px solid rgba(46,204,113,0.2)', color: GREEN, fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}><Download size={13} /> JSON</button>
                <button className="btn-tactile" onClick={handleExportCSV} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', borderRadius: '10px', background: 'rgba(52,152,219,0.08)', border: '1px solid rgba(52,152,219,0.2)', color: BLUE, fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}><Download size={13} /> CSV</button>
              </div>
            </div>

            {/* Import */}
            <div style={{ background: C.bgCard, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: '6px' }}><Upload size={14} /> {t('Importer')}</h3>
              <p style={{ fontSize: '12px', color: C.textTertiary, marginBottom: '12px', lineHeight: 1.6 }}>
                {t('Utilise un fichier exporté depuis PaniniBase. Pour le CSV, ne change pas les colonnes')} <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 4px', borderRadius: '4px' }}>EditionId</code> {t('et')} <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 4px', borderRadius: '4px' }}>Code</code>.
              </p>

              {/* Doc dépliable JSON */}
              <button onClick={() => setShowJsonDoc(!showJsonDoc)} style={{ fontSize: '11px', color: BLUE, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '4px', textAlign: 'left' }}>
                {showJsonDoc ? '▼' : '▶'} {t('Voir le format JSON attendu')}
              </button>
              {showJsonDoc && (
                <pre style={{ fontSize: '11px', color: C.textSecondary, background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', overflowX: 'auto', marginBottom: '10px' }}>
{`{
  "_format": "paninibase-backup-v1",
  "collection": {
    "26-MEX1": { "stickerEditionId": "26", "stickerNumber": "MEX1", "owned": true, "duplicates": 0 },
    ...
  }
}`}
                </pre>
              )}

              {/* Doc dépliable CSV */}
              <button onClick={() => setShowCsvDoc(!showCsvDoc)} style={{ fontSize: '11px', color: BLUE, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '10px', textAlign: 'left' }}>
                {showCsvDoc ? '▼' : '▶'} {t('Voir le format CSV attendu')}
              </button>
              {showCsvDoc && (
                <pre style={{ fontSize: '11px', color: C.textSecondary, background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', overflowX: 'auto', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>
{`EditionId,Album,Code,Joueur,Equipe,Possede,Doublons
26,"USA/Canada/Mexique 2026","MEX1","Écusson Mexique","Mexique",Oui,0
26,"USA/Canada/Mexique 2026","MEX2","Joueur X","Mexique",Non,0`}
                </pre>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <label className="btn-tactile" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', borderRadius: '10px', background: 'rgba(46,204,113,0.08)', border: '1px solid rgba(46,204,113,0.2)', color: GREEN, fontWeight: 700, fontSize: '12px', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <Upload size={13} /> JSON <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                </label>
                <label className="btn-tactile" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', borderRadius: '10px', background: 'rgba(52,152,219,0.08)', border: '1px solid rgba(52,152,219,0.2)', color: BLUE, fontWeight: 700, fontSize: '12px', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <Upload size={13} /> CSV <input type="file" accept=".csv" onChange={handleImportCSV} style={{ display: 'none' }} />
                </label>
              </div>
              {importSuccess && <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: GREEN, marginTop: '8px' }}><Check size={13} /> {t('Importé avec succès !')}</p>}
              {importError && <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: RED, marginTop: '8px' }}><AlertTriangle size={13} /> {importError}</p>}
            </div>

            {/* Reset */}
            <div style={{ background: C.bgCard, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: '6px' }}><Trash2 size={14} /> {t('Réinitialiser')}</h3>
              <p style={{ fontSize: '12px', color: C.textTertiary, marginBottom: '14px', lineHeight: 1.6 }}>{user ? t('Efface toute ta collection, sur cet appareil et sur ton compte. Irréversible.') : t('Efface toute ta collection. Irréversible.')}</p>
              <button className="btn-tactile" onClick={() => { if (confirm(t('Effacer toute la collection ?'))) clearCollection(); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)', color: RED, fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}><Trash2 size={14} /> {t('Effacer ma collection')}</button>
            </div>

            <div style={{ background: C.bgCard, border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>{t('Résumé')}</h3>
              {[[t('Stickers possédés'), totalOwned, GREEN], [t('Doublons'), totalDupes, GOLD], [t('Albums commencés'), completionData.filter((d) => d.owned > 0).length, BLUE], [t('Albums terminés'), completionData.filter((d) => d.pct === 100).length, GOLD]].map(([label, val, color]) => (
                <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '12px', color: C.textSecondary }}>{label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: String(color) }}>{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BADGES ── */}
        {activeTab === 'badges' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TrophyShelf badges={badges} />

            {/* Favoris */}
            <div style={{ marginTop: '8px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={13} fill={C.red} color={C.red} /> {t('Joueurs favoris ({n})', { n: favoritePlayers.length })}
              </p>
              {favoritePlayers.length === 0 ? (
                <p style={{ fontSize: '11.5px', color: C.textTertiary, fontStyle: 'italic' }}>
                  {t("Aucun favori — ouvre la page d'un joueur et clique sur le cœur pour l'épingler ici.")}
                </p>
              ) : (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {favoritePlayers.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => goPlayer(p.key)}
                      className="btn-tactile"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)', color: C.textPrimary, fontSize: '11.5px', cursor: 'pointer' }}
                    >
                      <span>{p.flag}</span> {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
