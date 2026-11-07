import React, { useEffect, useRef } from 'react';

/**
 * Décor « galaxie » de l'accueil, entièrement en code (canvas + SVG + CSS).
 *
 * Images optionnelles : si tu déposes un fichier dans src/assets/cosmic/,
 * il remplace la version dessinée en code (Vite ne référence que les fichiers
 * qui existent, donc aucune requête 404 s'ils sont absents) :
 *   - galaxy.webp|png|jpg  → fond galaxie (sans texte)
 *   - earth.webp|png       → Terre détourée, fond transparent
 */
const COSMIC = import.meta.glob<string>('../assets/cosmic/*.{webp,png,jpg,jpeg}', { eager: true, import: 'default' });
const cosmicAsset = (name: string) => Object.entries(COSMIC).find(([p]) => p.split('/').pop()!.startsWith(name + '.'))?.[1];
export const GALAXY_IMG = cosmicAsset('galaxy');
export const EARTH_IMG = cosmicAsset('earth');

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Générateur pseudo-aléatoire déterministe : le décor est le même à chaque visite. */
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

// ── Champ d'étoiles scintillantes (fixe, derrière toute l'appli) ─────────
export const Starfield: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rand = rng(42);
    const stars = Array.from({ length: 260 }, () => ({
      x: rand(), y: rand(),
      r: rand() < 0.92 ? 0.4 + rand() * 0.8 : 1.2 + rand() * 1.1,
      a: 0.25 + rand() * 0.75,
      speed: 0.4 + rand() * 1.6,
      phase: rand() * Math.PI * 2,
      tint: rand() < 0.15 ? '255,220,150' : rand() < 0.3 ? '170,190,255' : '255,255,255',
    }));
    let w = 0, h = 0, raf = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = 0.55 + 0.45 * Math.sin(t * 0.001 * s.speed + s.phase);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = `rgb(${s.tint})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1.4) { // petites croix de lumière sur les plus grosses
          ctx.globalAlpha = s.a * tw * 0.35;
          ctx.fillRect(s.x * w - s.r * 4, s.y * h - 0.4, s.r * 8, 0.8);
          ctx.fillRect(s.x * w - 0.4, s.y * h - s.r * 4, 0.8, s.r * 8);
        }
      }
      ctx.globalAlpha = 1;
    };
    const loop = (t: number) => { if (!document.hidden) draw(t); raf = requestAnimationFrame(loop); };
    resize();
    window.addEventListener('resize', resize);
    if (reducedMotion()) draw(0); else raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
};

/** Fond galaxie : nébuleuses violettes/bleues + étoiles. Se place en position:fixed derrière l'appli. */
/**
 * `calm` : version discrète pour les écrans de travail (album, collection, échanges) —
 * la galaxie y est floutée et très assombrie pour ne pas gêner la lecture.
 * L'accueil garde la galaxie pleine.
 */
export const GalaxyBackdrop: React.FC<{ calm?: boolean }> = ({ calm }) => (
  <div className={`galaxy-backdrop${calm ? ' galaxy-backdrop--calm' : ''}`} aria-hidden="true">
    {GALAXY_IMG
      ? <>
          <div className="galaxy-img" style={{ position: 'absolute', inset: 0, backgroundImage: `url(${GALAXY_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          {/* voile sombre : garde le texte lisible et fond l'image dans le bleu nuit de l'appli */}
          <div className="galaxy-veil" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(4,6,18,0.1) 0%, rgba(4,6,18,0.3) 55%, rgba(4,6,18,0.75) 100%)' }} />
        </>
      : <>
          <div className="nebula nebula--violet" />
          <div className="nebula nebula--blue" />
          <div className="nebula nebula--magenta" />
          <div className="nebula nebula--milky" />
        </>}
    <Starfield />
  </div>
);

// ── La Terre, de nuit, qui tourne doucement ──────────────────────────────
/** Zones urbaines approximatives [lat, lon, étalement°, poids] */
const CITY_CLUSTERS: Array<[number, number, number, number]> = [
  [50, 5, 6, 9], [45, 10, 5, 6], [40, -4, 4, 4], [52, 20, 6, 4], [56, 38, 6, 4], [60, 60, 12, 2],
  [40, -78, 5, 8], [42, -88, 5, 5], [34, -100, 9, 5], [36, -118, 4, 4], [47, -122, 2, 2], [20, -100, 4, 4],
  [-23, -46, 4, 5], [-34, -59, 3, 3], [5, -74, 4, 2], [-10, -40, 8, 2],
  [7, 4, 4, 3], [30, 31, 2, 3], [-26, 28, 3, 2], [0, 35, 5, 1],
  [26, 50, 5, 3], [33, 44, 5, 2], [24, 78, 8, 8], [13, 78, 4, 4],
  [32, 118, 6, 8], [39, 116, 3, 4], [23, 113, 3, 4], [36, 138, 3, 5], [37, 127, 2, 3],
  [14, 101, 4, 3], [-6, 108, 4, 3], [1, 104, 2, 2], [-34, 150, 3, 2], [-37, 145, 2, 1],
];

const EarthCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rand = rng(7);
    const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;
    const totalWeight = CITY_CLUSTERS.reduce((n, c) => n + c[3], 0);
    const lights: Array<{ lat: number; lon: number; b: number }> = [];
    for (const [lat, lon, spread, wgt] of CITY_CLUSTERS) {
      const n = Math.round((wgt / totalWeight) * 1700);
      for (let i = 0; i < n; i++) lights.push({ lat: (lat + gauss() * spread) * Math.PI / 180, lon: (lon + gauss() * spread * 1.4) * Math.PI / 180, b: 0.35 + rand() * 0.65 });
    }
    const tilt = -0.38; // inclinaison de l'axe
    let size = 0, raf = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = size * dpr; canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (t: number) => {
      const R = size / 2, rot = t * 0.000012 - 1.0;
      ctx.clearRect(0, 0, size, size);
      ctx.globalCompositeOperation = 'lighter';
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      for (const p of lights) {
        const cl = Math.cos(p.lat);
        const x0 = cl * Math.sin(p.lon + rot), y0 = -Math.sin(p.lat), z = cl * Math.cos(p.lon + rot);
        if (z <= 0.05) continue;
        const x = x0 * ct - y0 * st, y = x0 * st + y0 * ct;
        // plus lumineux au centre, s'estompe vers le bord et du côté « jour » (en haut à gauche)
        const day = Math.max(0, x * 0.55 - y * 0.55);
        const a = Math.min(1, p.b * 1.25 * Math.pow(z, 0.6) * (1 - day * 0.9));
        if (a < 0.03) continue;
        ctx.fillStyle = `rgba(255,${190 + Math.round(p.b * 40)},${110 + Math.round(p.b * 50)},${a * 0.85})`;
        const r = (0.9 + p.b * 1.3) * (size / 700);
        const px = R + x * R, py = R + y * R;
        ctx.fillRect(px - r / 2, py - r / 2, r, r);
        ctx.fillStyle = `rgba(255,170,80,${a * 0.07})`;
        ctx.fillRect(px - r * 2, py - r * 2, r * 4, r * 4);
      }
      ctx.globalCompositeOperation = 'source-over';
    };
    const loop = (t: number) => { if (!document.hidden) draw(t); raf = requestAnimationFrame(loop); };
    resize();
    window.addEventListener('resize', resize);
    if (reducedMotion()) draw(0); else raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: '50%', filter: 'blur(0.3px)' }} />;
};

export const Earth: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <div className={`earth ${className ?? ''}`} aria-hidden="true" style={style}>
    {EARTH_IMG
      ? <img src={EARTH_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      : <>
          <div className="earth-glow" />
          <div className="earth-body"><EarthCanvas /></div>
          <div className="earth-rim" />
        </>}
  </div>
);

// ── Traînées de lumière dorées / violettes ───────────────────────────────
/** Chaque traînée : un halo large et flou, une bande colorée, un cœur blanc, et un éclat qui file dessus. */
const TRAILS: Array<{ d: string; w: number; color: 'gold' | 'violet'; dur: number; delay: number }> = [
  // grande courbe depuis le haut à gauche, qui plonge derrière les cartes
  { d: 'M-40 70 C 180 150, 330 300, 560 360 S 900 420, 1040 400', w: 1.25, color: 'gold', dur: 9, delay: 0 },
  { d: 'M-40 210 C 140 250, 300 330, 520 380', w: 0.75, color: 'gold', dur: 7, delay: -3 },
  { d: 'M-40 300 C 220 330, 380 400, 640 430', w: 0.6, color: 'violet', dur: 10, delay: -6 },
  // sous la Terre, à droite, qui remonte vers le bord
  { d: 'M820 470 C 1050 440, 1300 360, 1650 210', w: 1.35, color: 'gold', dur: 8, delay: -2 },
  { d: 'M900 520 C 1150 480, 1380 400, 1650 330', w: 0.7, color: 'violet', dur: 11, delay: -5 },
  { d: 'M1000 420 C 1200 380, 1400 300, 1650 150', w: 0.5, color: 'gold', dur: 12, delay: -8 },
];

/** Petites étincelles posées le long des traînées */
const SPARKS = Array.from({ length: 46 }, (_, i) => {
  const rand = rng(100 + i);
  const left = rand() < 0.5;
  const t = rand();
  return {
    x: left ? -40 + t * 1000 : 820 + t * 800,
    y: left ? 90 + t * 330 + (rand() - 0.5) * 70 : 480 - t * 290 + (rand() - 0.5) * 70,
    r: 0.8 + rand() * 1.8,
    gold: rand() < 0.7,
    delay: -rand() * 4,
  };
});

const TRAILS_IMG = cosmicAsset('trails');
const SPARKLES_IMG = cosmicAsset('sparkles');

/** Traînées : l'image (src/assets/cosmic/trails.webp) posée deux fois, sinon la version SVG. */
export const LightTrails: React.FC = () => TRAILS_IMG ? (
  <div className="light-trails" aria-hidden="true">
    <img className="trail-img trail-img--a" src={TRAILS_IMG} alt="" />
    <img className="trail-img trail-img--b" src={TRAILS_IMG} alt="" />
  </div>
) : <SvgTrails />;

const SvgTrails: React.FC = () => (
  <svg className="light-trails" viewBox="0 0 1600 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      {(['gold', 'violet'] as const).map((c) => (
        <linearGradient key={c} id={`tg-${c}`} x1="0" x2="1">
          <stop offset="0" stopColor={c === 'gold' ? '#ffb238' : '#9b5cff'} stopOpacity="0" />
          <stop offset="0.25" stopColor={c === 'gold' ? '#ffc94d' : '#b77dff'} stopOpacity="0.95" />
          <stop offset="0.6" stopColor={c === 'gold' ? '#ff9a1f' : '#7f6bff'} stopOpacity="0.85" />
          <stop offset="1" stopColor={c === 'gold' ? '#c45cff' : '#5aa0ff'} stopOpacity="0" />
        </linearGradient>
      ))}
      <linearGradient id="tg-core" x1="0" x2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.3" stopColor="#fffbe8" stopOpacity="1" />
        <stop offset="0.7" stopColor="#fff2c4" stopOpacity="0.9" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <filter id="tf-wide" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="14" /></filter>
      <filter id="tf-mid" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="3.5" /></filter>
      <radialGradient id="tg-spark">
        <stop offset="0" stopColor="#fff" />
        <stop offset="0.35" stopColor="#ffd56b" stopOpacity="0.9" />
        <stop offset="1" stopColor="#ffb238" stopOpacity="0" />
      </radialGradient>
    </defs>
    <g fill="none" strokeLinecap="round">
      {TRAILS.map((t, i) => (
        <g key={i}>
          <path d={t.d} stroke={`url(#tg-${t.color})`} strokeWidth={26 * t.w} opacity="0.35" filter="url(#tf-wide)" />
          <path d={t.d} stroke={`url(#tg-${t.color})`} strokeWidth={6 * t.w} opacity="0.9" filter="url(#tf-mid)" />
          <path d={t.d} stroke="url(#tg-core)" strokeWidth={1.6 * t.w} opacity={t.color === 'gold' ? 0.95 : 0.6} />
          <path className="trail-flash" d={t.d} stroke="#fff" strokeWidth={3 * t.w} filter="url(#tf-mid)"
            style={{ animationDuration: `${t.dur}s`, animationDelay: `${t.delay}s` }} />
        </g>
      ))}
    </g>
    <g>
      {SPARKS.map((s, i) => (
        <circle key={i} className="trail-spark" cx={s.x} cy={s.y} r={s.r * 2.2} fill={s.gold ? 'url(#tg-spark)' : '#c9a8ff'}
          style={{ animationDelay: `${s.delay}s` }} />
      ))}
    </g>
  </svg>
);

/** Étoiles « éclat » à 4 branches, comme sur les photos d'espace */
const FLARES = [
  { x: '31%', y: '12%', s: 22 }, { x: '47%', y: '6%', s: 14 }, { x: '62%', y: '18%', s: 18 }, { x: '9%', y: '62%', s: 16 },
  { x: '24%', y: '74%', s: 12 }, { x: '71%', y: '64%', s: 14 }, { x: '88%', y: '6%', s: 20 }, { x: '55%', y: '58%', s: 10 },
];
export const StarFlares: React.FC = () => SPARKLES_IMG ? (
  <div className="star-flares" aria-hidden="true">
    <img className="sparkles-img" src={SPARKLES_IMG} alt="" />
  </div>
) : (
  <div className="star-flares" aria-hidden="true">
    {FLARES.map((f, i) => (
      <span key={i} className="star-flare" style={{ left: f.x, top: f.y, width: f.s * 2, height: f.s * 2, animationDelay: `${-i * 0.7}s` }} />
    ))}
  </div>
);

// ── Carte Panini flottante (holographique) ───────────────────────────────
const TrophyArt = () => (
  <svg viewBox="0 0 60 80" width="62%" aria-hidden="true">
    <defs>
      <linearGradient id="tro" x1="0" x2="1"><stop offset="0" stopColor="#8a5d10" /><stop offset="0.45" stopColor="#ffe08a" /><stop offset="1" stopColor="#9c6b14" /></linearGradient>
    </defs>
    <path d="M18 6h24c0 10 6 14 6 24 0 9-7 15-12 19v9h5v6H19v-6h5v-9c-5-4-12-10-12-19 0-10 6-14 6-24z" fill="url(#tro)" />
    <circle cx="30" cy="22" r="9" fill="#ffe9a8" opacity="0.5" />
    <rect x="14" y="64" width="32" height="10" rx="2" fill="#2d6b3c" />
    <rect x="14" y="66" width="32" height="2" fill="url(#tro)" />
  </svg>
);
const PlayerArt = () => (
  <svg viewBox="0 0 60 80" width="70%" aria-hidden="true">
    <circle cx="33" cy="12" r="6" fill="#0b1430" />
    <path d="M27 20l10-1 6 14-5 2-3-6-1 14 8 12-4 3-9-11-6 12-5-2 6-16-1-11-7 6-3-3z" fill="#0b1430" />
    <circle cx="45" cy="64" r="6" fill="#fff" stroke="#0b1430" strokeWidth="1.2" />
    <path d="M42 61l3 2 3-2M45 63v4" stroke="#0b1430" strokeWidth="1" fill="none" />
  </svg>
);

/**
 * Cartes flottantes illustrées : images de src/assets/cards/ (card-trophy.webp,
 * card-1.webp…). S'il n'y en a pas, on dessine des cartes génériques en SVG.
 */
const CARDS = import.meta.glob<string>('../assets/cards/*.{webp,png}', { eager: true, import: 'default' });
const CARD_LIST = Object.entries(CARDS).sort(([a], [b]) => a.localeCompare(b));
export const cardImage = (name: string) => CARD_LIST.find(([p]) => p.split('/').pop()!.startsWith(name + '.'))?.[1];

export const HoloCard: React.FC<{ kind: 'trophy' | 'player'; image?: string; tone?: string; className?: string; style?: React.CSSProperties }> = ({ kind, image, tone = '#3b4fd6', className, style }) => image ? (
  <div className={`holo-card holo-card--img ${className ?? ''}`} aria-hidden="true" style={style}>
    <img src={image} alt="" draggable={false} />
  </div>
) : (
  <div className={`holo-card ${className ?? ''}`} aria-hidden="true" style={style}>
    <div className="holo-card-inner" style={{ background: `radial-gradient(circle at 50% 35%, ${tone}cc, #0a0f2e 75%)` }}>
      {kind === 'trophy' ? <TrophyArt /> : <PlayerArt />}
      <div className="holo-card-sheen" />
    </div>
  </div>
);
