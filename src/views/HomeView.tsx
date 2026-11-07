import React from 'react';
import { Layers, Image as ImageIcon, Users, Copy, TrendingUp, ArrowRight, Flame, Trophy, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { EDITIONS, STICKERS_BY_EDITION, PLAYERS } from '../data/stickers';
import { useUIStore, useCollectionStore } from '../store/index';
import { useGlobalStats, useEditionStats } from '../hooks';
import { useBadges } from '../hooks/useBadges';
import { useDataVersion } from '../hooks/useEditionData';
import { TrophyShelf } from '../components/TrophyShelf';
import { Earth, LightTrails, HoloCard, StarFlares, cardImage } from '../components/Cosmic';
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
/**
 * Mascottes / illustrations d'albums : dépose une image nommée d'après l'année
 * dans src/assets/albums/ (ex. 1998.webp, 2026.png), fond transparent de préférence.
 * Seuls les fichiers présents sont référencés ; sinon on affiche un ballon dessiné.
 */
const ALBUM_ART = import.meta.glob<string>('../assets/albums/*.{webp,png,jpg,jpeg,svg}', { eager: true, import: 'default' });
const artForYear = (year: number) => Object.entries(ALBUM_ART).find(([p]) => p.split('/').pop()!.startsWith(`${year}.`))?.[1];

/** Ballon dessiné : illustration par défaut d'un album sans mascotte */
const BallArt: React.FC = () => (
  <svg viewBox="0 0 100 100" style={{ height: '78%' }} aria-hidden="true">
    <defs>
      <radialGradient id="ball-shade" cx="38%" cy="32%" r="70%">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.65" stopColor="#dfe4ee" />
        <stop offset="1" stopColor="#8d96aa" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="44" fill="url(#ball-shade)" />
    <g fill="#141a2c">
      <polygon points="50,33 62,42 57.5,56 42.5,56 38,42" />
      <polygon points="50,6.5 59,10 56,19 44,19 41,10" />
      <polygon points="88,38 92,50 86,58 79,50 80,40" />
      <polygon points="12,38 20,40 21,50 14,58 8,50" />
      <polygon points="27,80 36,74 43,82 39,92 29,90" />
      <polygon points="73,80 71,90 61,92 57,82 64,74" />
    </g>
    <g stroke="#141a2c" strokeWidth="1.6" fill="none" opacity="0.8">
      <path d="M50 33 L50 19 M62 42 L80 40 M57.5 56 L64 74 M42.5 56 L36 74 M38 42 L20 40" />
    </g>
    <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
  </svg>
);

// ── Tuile d'album (carrousel) ────────────────────────────────────────────
const AlbumTile: React.FC<{ editionId: string }> = ({ editionId }) => {
  const { goAlbum } = useUIStore();
  const t = useT();
  const edition = EDITIONS.find((e) => e.id === editionId)!;
  const { owned, pct } = useEditionStats(editionId);
  const art = artForYear(edition.year);
  const color = pct === 100 ? '#ffc531' : pct > 0 ? C.green : 'transparent';

  return (
    <div
      className="album-tile"
      {...clickable(() => goAlbum(editionId), t("Ouvrir l'album {album}", { album: albumName(edition.label, t) }) + (pct > 0 ? t(', {pct} % complété', { pct }) : ''))}
      style={{ background: edition.bgGradient }}
    >
      <div className="album-tile-light" />
      <div className="album-tile-rays" />
      <div className="album-tile-corner" />

      <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 4, fontSize: '11px', fontWeight: 800, padding: '3px 7px', borderRadius: '6px', background: 'rgba(5,8,20,0.75)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}>
        {edition.totalStickers}
      </div>

      <div className="album-tile-mascot">{art ? <img src={art} alt="" loading="lazy" /> : <BallArt />}</div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: pct > 0 ? '14px' : '10px', zIndex: 2, textAlign: 'center', padding: '0 8px' }}>
        <div className="album-tile-year">{edition.year}</div>
        <div className="album-tile-country">{t(edition.hostCountry)}</div>
      </div>

      {pct > 0 && (
        <div title={`${owned} / ${edition.totalStickers}`} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '5px', zIndex: 3, background: 'rgba(0,0,0,0.5)' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}`, transition: 'width 0.7s ease' }} />
        </div>
      )}
    </div>
  );
};

const AlbumTileSkeleton: React.FC = () => <div className="album-tile skeleton" style={{ border: '1px solid rgba(255,255,255,0.07)' }} />;

// ── Carrousel horizontal + flèches ───────────────────────────────────────
const AlbumRail: React.FC<{ loading?: boolean }> = ({ loading }) => {
  const t = useT();
  const ref = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState({ start: true, end: false });
  const update = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);
  React.useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <div style={{ position: 'relative' }}>
      <div ref={ref} className="album-rail" onScroll={update}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <AlbumTileSkeleton key={i} />)
          : EDITIONS_NEWEST_FIRST.map((ed) => <AlbumTile key={ed.id} editionId={ed.id} />)}
      </div>
      {!edges.start && <button className="rail-arrow" style={{ left: '-6px' }} onClick={() => scroll(-1)} aria-label={t('Albums précédents')}><ChevronLeft size={22} /></button>}
      {!edges.end && <button className="rail-arrow" style={{ right: '-6px' }} onClick={() => scroll(1)} aria-label={t('Albums suivants')}><ChevronRight size={22} /></button>}
    </div>
  );
};

// ── Carte de stat en verre ───────────────────────────────────────────────
const GlassStat: React.FC<{
  Icon: typeof Layers; val: string | number; lbl: string; color: string; sub: string; onClick?: () => void;
}> = ({ Icon, val, lbl, color, sub, onClick }) => (
  <div className="glass-stat home-stat" {...(onClick ? clickable(onClick, `${val} ${lbl}`) : {})}>
    <div className="home-stat-icon" style={{ width: '54px', height: '54px', borderRadius: '14px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color, background: `linear-gradient(145deg, ${color}38, ${color}10)`, border: `1px solid ${color}55`, boxShadow: `0 0 22px ${color}30` }}>
      <Icon size={26} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="home-stat-val" style={{ fontSize: '28px', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.5px' }}>{val}</div>
      <div style={{ fontSize: '14px', color: '#dfe5ff', marginTop: '4px', fontWeight: 500 }}>{lbl}</div>
      <div style={{ fontSize: '11.5px', color, marginTop: '3px', fontWeight: 700 }}>{sub}</div>
    </div>
    {onClick && <ChevronRight size={20} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0 }} />}
  </div>
);

/** Décor du hero : traînées dorées, Terre, cartes holographiques */
const HeroScene: React.FC<{ cards?: boolean }> = ({ cards = true }) => (
  <div className="hero-scene" aria-hidden="true">
    <StarFlares />
    <Earth className="hero-earth" />
    <LightTrails />
    {cards && <>
      <HoloCard kind="trophy" image={cardImage('card-trophy')} tone="#3a55ff" style={{ left: '5.5%', top: '9%', rotate: '-4deg', width: '140px' }} />
      <HoloCard kind="player" image={cardImage('card-hero')} tone="#5a3df0" className="holo-card--side" style={{ left: '16.5%', top: '30%', rotate: '9deg', width: '118px', animationDelay: '-2s' }} />
      <HoloCard kind="player" image={cardImage('card-2')} tone="#2c6df0" style={{ right: '7%', top: '12%', rotate: '6deg', width: '96px', animationDelay: '-4s' }} />
      <HoloCard kind="player" image={cardImage('card-7')} tone="#3f5cf5" className="holo-card--side" style={{ right: '16%', top: '34%', rotate: '-4deg', width: '112px', animationDelay: '-1s' }} />
      <HoloCard kind="player" image={cardImage('card-5')} tone="#c47a1e" style={{ right: '3.5%', top: '50%', rotate: '8deg', width: '128px', animationDelay: '-5s' }} />
    </>}
  </div>
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
        <div style={{ borderRadius: '20px', padding: '18px', background: C.glass, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
  const { goAlbum, setActiveTab } = useUIStore();
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const hasCollection = totalOwned > 0;
  const railRef = React.useRef<HTMLDivElement>(null);

  return (
    <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>

      {hasCollection && (
        <div style={{ position: 'relative' }}>
          <HeroScene cards={false} />
          <div style={{ position: 'relative', zIndex: 2 }}><MyCollection /></div>
        </div>
      )}

      {/* ── HERO (nouveaux visiteurs) ── */}
      {!hasCollection && (
        <section className="home-hero" style={{ position: 'relative', padding: '36px 24px 40px', textAlign: 'center', minHeight: '470px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <HeroScene />

          <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
            <div className="hero-eyebrow home-eyebrow" style={{ marginBottom: '18px' }}>
              <Trophy size={16} color="#ffc531" /> World Cup Edition
            </div>

            <h1 className="hero-wordmark" style={{ fontSize: 'clamp(46px, 9vw, 92px)', color: '#fff', marginBottom: '10px' }}>
              Panini<span className="gold">Base</span>
            </h1>

            <p style={{ fontSize: '17px', color: '#d6dcf5', marginBottom: '14px', letterSpacing: '0.2px', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
              {t('Toutes les cartes Panini Coupe du Monde')}
            </p>
            <p className="hero-years home-years" style={{ marginBottom: '26px' }}>1970 — 2026</p>

            <div style={{ marginBottom: '32px' }}>
              <button className="hero-cta" onClick={() => goAlbum('26')}>
                <Play size={16} fill="currentColor" /> {t("Commencer l'album 2026")} <ArrowRight size={18} />
              </button>
            </div>

            <div className="home-stats" style={{ display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap', maxWidth: '1160px', margin: '0 auto' }}>
              <GlassStat Icon={Layers} val={EDITIONS.length} lbl={t('Albums')} color="#ffc531" sub={t('De Mexique 1970 à 2026')}
                onClick={() => railRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
              <GlassStat Icon={ImageIcon} val={TOTAL_STICKERS.toLocaleString(lang)} lbl={t('Stickers référencés')} color="#3fb6ff" sub={t('dont {n} en 2026', { n: STICKERS_2026.toLocaleString(lang) })}
                onClick={() => goAlbum('26')} />
              <GlassStat Icon={Users} val={LEGENDS} lbl={t('Légendes suivies')} color="#2fe08a" sub={t("d'une Coupe du Monde à l'autre")}
                onClick={() => setActiveTab('collection')} />
            </div>
          </div>
        </section>
      )}

      {/* ── Albums ── */}
      <section ref={railRef} className="home-albums" style={{ position: 'relative', zIndex: 2, padding: '8px 28px 48px', scrollMarginTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
            <Trophy size={22} color="#ffc531" style={{ filter: 'drop-shadow(0 0 6px rgba(255,197,49,0.6))' }} /> {t('Choisir un album')}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#d6dcf5' }}>
            <TrendingUp size={16} />
            <span>{t('Progression globale')}</span>
            <span style={{ fontWeight: 800, color: '#ffc531' }}>{Math.round((totalOwned / TOTAL_STICKERS) * 100)}%</span>
          </div>
        </div>
        <AlbumRail loading={loading} />
      </section>
    </div>
  );
};
