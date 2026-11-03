import React from 'react';
import { Layers, Image as ImageIcon, Users, Copy, TrendingUp, ArrowRight, Flame } from 'lucide-react';
import { EDITIONS, STICKERS_BY_EDITION, PLAYERS } from '../data/stickers';
import { useUIStore, useCollectionStore } from '../store/index';
import { useGlobalStats, useEditionStats } from '../hooks';
import { useBadges } from '../hooks/useBadges';
import { useDataVersion } from '../hooks/useEditionData';
import { TrophyShelf } from '../components/TrophyShelf';
import { C } from '../theme';
import { clickable } from '../lib/a11y';
import { useT, useLangStore, albumName } from '../i18n';

// Les albums du plus récent au plus ancien : 2026 en premier
const EDITIONS_NEWEST_FIRST = [...EDITIONS].reverse();
/** Nombre de stickers de tous les albums, d'après la checklist (ne dépend pas des albums déjà chargés). */
const TOTAL_STICKERS = EDITIONS.reduce((n, e) => n + e.totalStickers, 0);
const STICKERS_2026 = EDITIONS.find((e) => e.id === '26')?.totalStickers ?? 0;
/** Légendes de l'index joueurs, comptées au chargement du module : ensuite PLAYERS
 *  grossit avec chaque joueur des effectifs importés (des milliers). */
const LEGENDS = Object.keys(PLAYERS).length;
/** Étoiles du hero : positions tirées une seule fois, sinon elles sautent à chaque re-render. */
const STARS = Array.from({ length: 30 }, () => ({ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.15 + Math.random() * 0.3 }));

// ── Carte Panini flottante décorative ────────────────────────────────────
const FloatingCard: React.FC<{
  flag: string; name: string; year: number; inner?: boolean;
  style: React.CSSProperties;
}> = ({ flag, name, year, inner, style }) => (
  <div className={`floating-card${inner ? ' floating-card--inner' : ''}`} aria-hidden="true" style={{
    position: 'absolute', width: '80px', borderRadius: '10px', overflow: 'hidden',
    boxShadow: '0 12px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
    background: 'linear-gradient(160deg, #1a2f5e 0%, #0d1a3a 100%)',
    ...style,
  }}>
    {/* Sheen */}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)', pointerEvents: 'none' }} />
    <div style={{ height: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px' }}>
      <span style={{ fontSize: '28px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{flag}</span>
      <span style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.8)', fontWeight: 700, textAlign: 'center', letterSpacing: '0.3px' }}>{name}</span>
    </div>
    <div style={{ background: 'rgba(201,162,39,0.9)', padding: '3px 0', textAlign: 'center', fontSize: '8px', fontWeight: 800, color: '#000', letterSpacing: '0.5px' }}>
      {year}
    </div>
  </div>
);

// ── Carte album premium ──────────────────────────────────────────────────

const AlbumCard: React.FC<{ editionId: string }> = ({ editionId }) => {
  const { goAlbum } = useUIStore();
  const t = useT();
  const edition = EDITIONS.find((e) => e.id === editionId)!;
  const { owned, pct } = useEditionStats(editionId);
  const catalogued = (STICKERS_BY_EDITION[editionId] ?? []).length;
  const color = pct === 100 ? C.gold : pct > 75 ? C.green : pct > 40 ? C.blue : pct > 0 ? C.orange : 'rgba(255,255,255,0.25)';

  return (
    <div
      {...clickable(() => goAlbum(editionId), t("Ouvrir l'album {album}", { album: albumName(edition.label, t) }) + (pct > 0 ? t(', {pct} % complété', { pct }) : ''))}
      style={{
        borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
        background: '#0a1428',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, border-color 0.2s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-6px) scale(1.03)';
        el.style.boxShadow = `0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.14), 0 0 30px ${color}22`;
        el.style.borderColor = `${color}44`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'none';
        el.style.boxShadow = 'none';
        el.style.borderColor = 'rgba(255,255,255,0.07)';
      }}
    >
      {/* Cover */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', background: edition.bgGradient, overflow: 'hidden' }}>
        {/* Noise overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")', opacity: 0.4 }} />
        {/* Dark vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 100%)' }} />
        {/* Sheen diagonal */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%)', transition: 'opacity 0.2s' }} />

        {/* Sash */}
        <div style={{ position: 'absolute', top: '12px', right: '-32px', width: '130px', padding: '3px 0', background: `linear-gradient(180deg, ${C.goldLight}, ${C.gold} 60%, #8a6e16)`, color: '#1a1206', fontSize: '7px', fontWeight: 800, letterSpacing: '1px', textAlign: 'center', transform: 'rotate(40deg)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', zIndex: 2 }}>FIFA WORLD CUP</div>

        <span style={{ position: 'relative', zIndex: 2, fontSize: '34px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))', display: 'block', textAlign: 'center', paddingTop: '28px' }}>{edition.hostFlag}</span>
        <span style={{ position: 'relative', zIndex: 2, display: 'block', textAlign: 'center', fontSize: '26px', fontWeight: 800, color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.7)', letterSpacing: '-0.5px', marginTop: '4px' }}>{edition.year}</span>
        <span style={{ position: 'relative', zIndex: 2, display: 'block', textAlign: 'center', fontSize: '8px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', marginTop: '2px' }}>{t(edition.hostCountry)}</span>

        <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 3, fontSize: '8px', padding: '2px 6px', borderRadius: '6px', background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}>
          {edition.totalStickers}
        </div>

        {/* Progress */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '5px', zIndex: 3, background: 'rgba(0,0,0,0.4)' }}>
          {pct > 0 && <div style={{ height: '100%', width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}`, transition: 'width 0.7s ease' }} />}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: C.textPrimary, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{albumName(edition.label, t)}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: C.textTertiary }}>
            {catalogued > 0 ? `${owned} / ${edition.totalStickers}` : t('Données à venir')}
          </span>
          {pct > 0 && <span style={{ fontSize: '11px', fontWeight: 700, color }}>{pct}%</span>}
        </div>
      </div>
    </div>
  );
};

const AlbumCardSkeleton: React.FC = () => (
  <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#0a1428', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="skeleton" style={{ width: '100%', aspectRatio: '3/4', borderRadius: 0 }} />
    <div style={{ padding: '10px 12px' }}>
      <div className="skeleton" style={{ height: '11px', width: '70%', marginBottom: '8px' }} />
      <div className="skeleton" style={{ height: '9px', width: '50%' }} />
    </div>
  </div>
);

// ── Stat card avec sous-titre ────────────────────────────────────────────
const StatCard: React.FC<{
  Icon: typeof Layers; val: string | number; lbl: string; color: string;
  sub?: string; subColor?: string; onClick?: () => void;
}> = ({ Icon, val, lbl, color, sub, subColor, onClick }) => (
  <div
    className="home-stat"
    {...(onClick ? clickable(onClick, `${val} ${lbl}`) : {})}
    style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '16px 20px', borderRadius: '18px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(10px)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'border-color 0.15s, background 0.15s',
      minWidth: '190px', flex: 1,
    }}
    onMouseEnter={(e) => { if (onClick) { e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; } }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
  >
    <div className="home-stat-icon" style={{ width: '44px', height: '44px', borderRadius: '14px', background: `${color}18`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color }}>
      <Icon size={20} />
    </div>
    <div style={{ textAlign: 'left', minWidth: 0 }}>
      <div className="home-stat-val" style={{ fontSize: '22px', fontWeight: 800, color: C.textPrimary, lineHeight: 1, letterSpacing: '-0.5px' }}>{val}</div>
      <div style={{ fontSize: '11px', color: C.textTertiary, marginTop: '3px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{lbl}</div>
      {sub && <div style={{ fontSize: '11px', color: subColor ?? color, marginTop: '4px', fontWeight: 600 }}>{sub}</div>}
    </div>
  </div>
);

// ── Halo flou de lumière ────────────────────────────────────────────────
const Halo: React.FC<{ x: string; y: string; color: string; size: number; opacity?: number }> = ({ x, y, color, size, opacity = 0.15 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%', background: color, opacity, filter: `blur(${size * 0.4}px)`, transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
);

// ── Anneau de progression ────────────────────────────────────────────────
const ProgressRing: React.FC<{ pct: number; size?: number }> = ({ pct, size = 96 }) => {
  const r = size / 2 - 7;
  const len = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.gold} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={len} strokeDashoffset={len * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset 0.8s ease', filter: 'drop-shadow(0 0 6px rgba(201,162,39,0.6))' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size > 80 ? '22px' : '16px', fontWeight: 900, color: C.textPrimary }}>{pct}%</div>
    </div>
  );
};

// ── Accueil d'un collectionneur : sa collection d'abord ──────────────────
const MyCollection: React.FC = () => {
  const collection = useCollectionStore((s) => s.collection);
  const { goAlbum, goTrade } = useUIStore();
  const { totalOwned, totalDupes } = useGlobalStats();
  const badges = useBadges();
  const version = useDataVersion();
  const t = useT();

  // Album à reprendre : celui où il y a le plus de stickers, s'il n'est pas fini ; sinon 2026
  const current = React.useMemo(() => {
    let best = { id: '26', owned: -1 };
    for (const ed of EDITIONS) {
      const owned = (STICKERS_BY_EDITION[ed.id] ?? []).filter((s) => collection[`${ed.id}-${s.number}`]?.owned).length;
      if (owned < ed.totalStickers && owned > best.owned) best = { id: ed.id, owned };
    }
    return best.id;
  }, [collection, version]);
  const edition = EDITIONS.find((e) => e.id === current)!;
  const { owned, pct, dupes } = useEditionStats(current);

  // Équipes presque complètes, toutes éditions confondues
  const almostDone = React.useMemo(() => {
    const teams: Array<{ editionId: string; year: number; team: string; flag: string; owned: number; total: number }> = [];
    for (const ed of EDITIONS) {
      const byTeam: Record<string, { flag: string; owned: number; total: number }> = {};
      for (const s of STICKERS_BY_EDITION[ed.id] ?? []) {
        const team = s.teamName ?? s.player?.nationality ?? '';
        byTeam[team] ??= { flag: s.player?.flag ?? '', owned: 0, total: 0 };
        byTeam[team].total++;
        if (collection[`${ed.id}-${s.number}`]?.owned) byTeam[team].owned++;
      }
      for (const [team, x] of Object.entries(byTeam)) if (x.owned > 0 && x.owned < x.total) teams.push({ editionId: ed.id, year: ed.year, team, ...x });
    }
    return teams.sort((a, b) => (a.total - a.owned) - (b.total - b.owned) || b.owned / b.total - a.owned / a.total).slice(0, 3);
  }, [collection, version]);

  return (
    <div className="home-mine" style={{ padding: '28px 20px 8px', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '12px', fontWeight: 700, color: C.gold, letterSpacing: '1.5px', textTransform: 'uppercase' }}>{t('Ta collection')}</p>
        <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 900, color: C.textPrimary, letterSpacing: '-0.8px', marginTop: '4px' }}>
          {t('{n} sticker collé|{n} stickers collés', { n: totalOwned })} <span style={{ color: C.textTertiary, fontWeight: 600, fontSize: '0.6em' }}>· {t('{n} doublon|{n} doublons', { n: totalDupes })}</span>
        </h1>
      </div>

      <div className="home-mine-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '16px' }}>
        {/* Reprendre l'album */}
        <div {...clickable(() => goAlbum(current), t("Continuer l'album {album}", { album: albumName(edition.label, t) }))} className="card-tactile" style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', borderRadius: '20px', padding: '22px', border: '1px solid rgba(201,162,39,0.25)', background: `linear-gradient(120deg, rgba(7,12,24,0.92) 40%, rgba(7,12,24,0.55)), ${edition.bgGradient}` }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: C.textSecondary, letterSpacing: '1px', textTransform: 'uppercase' }}>{t('Continue ton album')}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '12px' }}>
            <ProgressRing pct={pct} />
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: C.textPrimary, letterSpacing: '-0.5px' }}><span style={{ marginRight: '8px' }}>{edition.hostFlag}</span>{albumName(edition.label, t)}</h2>
              <p style={{ fontSize: '13px', color: C.textSecondary, marginTop: '6px' }}>
                <b style={{ color: C.textPrimary }}>{owned}</b> / {edition.totalStickers} · {t("il t'en manque")} <b style={{ color: C.textPrimary }}>{edition.totalStickers - owned}</b>
                {dupes > 0 && <> · <span style={{ color: C.gold }}>{t('{n} doublon|{n} doublons', { n: dupes })}</span></>}
              </p>
              <span className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '14px', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 800 }}>
                {t('Reprendre')} <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </div>

        {/* Presque complètes */}
        <div style={{ borderRadius: '20px', padding: '18px', background: C.bgCard, border: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: C.textSecondary, letterSpacing: '1px', textTransform: 'uppercase' }}><Flame size={13} color={C.orange} /> {t('Presque complètes')}</p>
          {almostDone.length === 0 && <p style={{ fontSize: '12px', color: C.textTertiary }}>{t('Colle tes premiers stickers pour voir les équipes à finir.')}</p>}
          {almostDone.map((team) => {
            const left = team.total - team.owned;
            return (
              <button key={team.editionId + team.team} className="btn-tactile" onClick={() => goAlbum(team.editionId, { team: team.team })}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: '22px' }}>{team.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{t(team.team)} <span style={{ color: C.textTertiary, fontWeight: 500 }}>{team.year}</span></p>
                  <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.07)', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(team.owned / team.total) * 100}%`, background: C.green }} />
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: C.orange, whiteSpace: 'nowrap' }}>{t('plus que {n}', { n: left })}</span>
              </button>
            );
          })}
          {totalDupes > 0 && (
            <button className="btn-tactile" onClick={goTrade} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', borderRadius: '10px', background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.3)', color: C.gold, fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              <Copy size={13} /> {t('Échanger mes {n} doublons', { n: totalDupes })}
            </button>
          )}
        </div>
      </div>

      <TrophyShelf badges={badges} compact />
    </div>
  );
};

export const HomeView: React.FC<{ loading?: boolean }> = ({ loading }) => {
  const { totalOwned } = useGlobalStats();
  const { goAlbum } = useUIStore();
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const hasCollection = totalOwned > 0;

  const totalYears = 2026 - 1970;

  const floatingCards = [
    { flag: '🇧🇷', name: t('Brésil') + ' 1970', year: 1970, style: { left: '4%', top: '10%', transform: 'rotate(-14deg)', animation: 'float-a 6s ease-in-out infinite' } },
    { flag: '🇦🇷', name: t('Argentine') + ' 1986', year: 1986, style: { left: '8%', top: '52%', transform: 'rotate(10deg)', animation: 'float-b 7s ease-in-out infinite' } },
    { flag: '🇫🇷', name: t('France') + ' 1998', year: 1998, inner: true, style: { left: '14%', top: '28%', transform: 'rotate(-6deg)', animation: 'float-c 5.5s ease-in-out infinite' } },
    { flag: '🇩🇪', name: t('Allemagne') + ' 2014', year: 2014, style: { right: '5%', top: '8%', transform: 'rotate(12deg)', animation: 'float-b 6.5s ease-in-out infinite' } },
    { flag: '🇮🇹', name: t('Italie') + ' 1982', year: 1982, inner: true, style: { right: '11%', top: '46%', transform: 'rotate(-9deg)', animation: 'float-a 7.5s ease-in-out infinite' } },
    { flag: '🇳🇱', name: t('Pays-Bas') + ' 1974', year: 1974, style: { right: '3%', top: '25%', transform: 'rotate(6deg)', animation: 'float-c 8s ease-in-out infinite' } },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.bgBase }}>

      {hasCollection && <MyCollection />}

      {/* ── HERO (nouveaux visiteurs) ── */}
      {!hasCollection && <div className="home-hero" style={{ position: 'relative', padding: '60px 24px 52px', textAlign: 'center', overflow: 'hidden', minHeight: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Fond cosmique — couches */}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 100% 80% at 50% 0%, #0e1f4a 0%, ${C.bgBase} 65%)` }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 20% 80%, rgba(100,0,150,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 30% at 80% 90%, rgba(0,80,180,0.1) 0%, transparent 70%)' }} />

        {/* Halos lumineux */}
        <Halo x="50%" y="0%" color="#3060ff" size={600} opacity={0.08} />
        <Halo x="20%" y="60%" color="#8000ff" size={300} opacity={0.07} />
        <Halo x="80%" y="70%" color="#0040ff" size={250} opacity={0.06} />

        {/* Étoiles — points lumineux */}
        {STARS.map((st, i) => (
          <div key={i} style={{ position: 'absolute', width: '1.5px', height: '1.5px', borderRadius: '50%', background: '#fff', pointerEvents: 'none', ...st }} />
        ))}

        {/* Cartes flottantes */}
        {floatingCards.map((c, i) => <FloatingCard key={i} {...c} />)}

        {/* Contenu central */}
        <div style={{ position: 'relative', zIndex: 10 }}>

          {/* Eyebrow */}
          <div className="home-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '20px', background: 'rgba(52,100,219,0.15)', border: '1px solid rgba(52,100,219,0.3)', marginBottom: '22px', backdropFilter: 'blur(8px)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: '#7EB3FF', textTransform: 'uppercase' }}>World Cup Edition</span>
          </div>

          {/* Wordmark */}
          <h1 style={{ fontSize: 'clamp(36px, 8vw, 60px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1, marginBottom: '16px', color: C.textPrimary }}>
            Panini<span style={{ background: `linear-gradient(135deg, ${C.goldLight} 0%, ${C.gold} 50%, #8a6e16 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Base</span>
          </h1>

          <p style={{ fontSize: '15px', color: C.textSecondary, marginBottom: '10px', letterSpacing: '0.2px' }}>
            {t('Toutes les cartes Panini Coupe du Monde')}
          </p>
          <p className="home-years" style={{ fontSize: '22px', fontWeight: 700, color: C.textPrimary, marginBottom: '32px', letterSpacing: '-0.5px' }}>1970 — 2026</p>

          {/* Badge éditions */}
          <div className="home-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '40px', backdropFilter: 'blur(8px)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.gold, display: 'inline-block' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: C.textSecondary }}>{t('{n} ÉDITIONS', { n: EDITIONS.length })}</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: C.textSecondary }}>{t('{n} ANS DE PASSION', { n: totalYears })}</span>
          </div>

          {/* Appel à l'action : l'album de l'année */}
          <div style={{ marginBottom: '28px' }}>
            <button className="btn-tactile btn-gold" onClick={() => goAlbum('26')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 24px', borderRadius: '14px', border: 'none', fontSize: '15px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 30px rgba(201,162,39,0.35)' }}>
              🌎 {t("Commencer l'album 2026")} <ArrowRight size={17} />
            </button>
          </div>

          {/* Stats cards */}
          <div className="home-stats" style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', maxWidth: '920px', margin: '0 auto' }}>
            <StatCard Icon={Layers} val={EDITIONS.length} lbl={t('Albums')} color={C.gold} sub={t('De Mexique 1970 à 2026')} subColor={C.gold} />
            <StatCard Icon={ImageIcon} val={TOTAL_STICKERS.toLocaleString(lang)} lbl={t('Stickers référencés')} color={C.blue} sub={t('dont {n} en 2026', { n: STICKERS_2026.toLocaleString(lang) })} subColor={C.blue} />
            <StatCard Icon={Users} val={LEGENDS} lbl={t('Légendes suivies')} color={C.green} sub={t("d'une Coupe du Monde à l'autre")} subColor={C.green} />
          </div>
        </div>
      </div>}

      {/* ── Albums grid ── */}
      <div className="home-albums" style={{ padding: '28px 20px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: C.textPrimary, letterSpacing: '-0.3px' }}>{t('Choisir un album')}</h2>
            <p style={{ fontSize: '11px', color: C.textTertiary, marginTop: '3px' }}>{t('{n} éditions', { n: EDITIONS.length })} · 1970 – 2026</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: C.textTertiary }}>
            <TrendingUp size={13} />
            <span>{t('Progression globale')}</span>
            <span style={{ fontWeight: 700, color: C.gold }}>
              {Math.round((totalOwned / TOTAL_STICKERS) * 100)}%
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <AlbumCardSkeleton key={i} />)
            : EDITIONS_NEWEST_FIRST.map((ed) => <AlbumCard key={ed.id} editionId={ed.id} />)
          }
        </div>
      </div>
    </div>
  );
};
