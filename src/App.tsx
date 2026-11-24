import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { Layers, Heart, ArrowLeftRight, LogOut, User as UserIcon, WifiOff, RefreshCw, Search } from 'lucide-react';
import { useUIStore, useAuthStore, useCollectionStore, useTradesStore, useOffersStore, offersWaitingForMe } from './store/index';
import { useMatchWatcher } from './hooks/useMatchWatcher';
import { GlobalSearch } from './components/GlobalSearch';
import { HomeView } from './views/HomeView'; // statique : c'est la vue par défaut, lazy créerait un double flash au démarrage
const AlbumView  = lazy(() => import('./views/AlbumView').then(m => ({ default: m.AlbumView })));
const PlayerView = lazy(() => import('./views/PlayerView').then(m => ({ default: m.PlayerView })));
const TradeView  = lazy(() => import('./views/TradeView').then(m => ({ default: m.TradeView })));
import { AuthModal } from './components/AuthModal';
import { ShortcutsHelp } from './components/ShortcutsHelp';
import { OnboardingTour } from './components/OnboardingTour';
import { Confetti } from './components/Confetti';
import { useBadges } from './hooks/useBadges';
import { useEditions } from './hooks/useEditionData';
import { LegalModal } from './components/LegalModal';
import { C } from './theme';
import { LanguageMenu } from './components/LanguageMenu';
import { GalaxyBackdrop } from './components/Cosmic';
import { useT, useLangStore } from './i18n';
const StatsView = lazy(() => import('./views/StatsView').then(m => ({ default: m.StatsView })));

export default function App() {
  const { view, activeTab, setActiveTab, goHome, goTrade } = useUIStore();
  const { user, loading, init, signOut } = useAuthStore();
  const pendingSync = useCollectionStore((s) => s.pendingSync);
  const retrySync = useCollectionStore((s) => s.retrySync);
  const pendingCount = Object.keys(pendingSync).length;
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  // Albums où l'utilisateur a déjà des stickers : chargés en arrière-plan dès le démarrage
  const collection = useCollectionStore((s) => s.collection);
  const myEditions = React.useMemo(() => [...new Set(Object.keys(collection).map((k) => k.split('-')[0]))].sort(), [collection]);
  useEditions(myEditions);

  // ── Indicateur hors ligne (réseau coupé, indépendant des syncs en attente) ──
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  // ── Célébration globale quand un nouveau badge est débloqué ──────────────
  // (vit ici, pas dans une vue précise, car les badges dépendent de toute la
  // collection et doivent se déclencher peu importe l'écran affiché)
  const badges = useBadges();
  const [badgeToast, setBadgeToast] = useState<string | null>(null);
  const [showBadgeConfetti, setShowBadgeConfetti] = useState(false);
  const prevEarnedRef = useRef<Set<string> | null>(null);
  useEffect(() => {
    const earnedNow = new Set(badges.filter((b) => b.earned).map((b) => b.id));
    if (prevEarnedRef.current) {
      const newlyEarned = badges.find((b) => b.earned && !prevEarnedRef.current!.has(b.id));
      if (newlyEarned) {
        setBadgeToast(t('🏅 Badge débloqué : {title}', { title: newlyEarned.title }));
        setShowBadgeConfetti(true);
        setTimeout(() => setShowBadgeConfetti(false), 2000);
        setTimeout(() => setBadgeToast(null), 3500);
      }
    }
    prevEarnedRef.current = earnedNow;
  }, [badges]);
  // ── Nouveaux matches d'échange (vérifiés en arrière-plan) ────────────────
  // Pastille Échanges : nouveaux matches + propositions qui attendent une réponse ou une confirmation
  const newMatchCount = useTradesStore((s) => s.newMatchIds.length) + useOffersStore((s) => offersWaitingForMe(s.offers));
  useMatchWatcher((n) => {
    setBadgeToast(t("🔁 {n} nouveau match d'échange|🔁 {n} nouveaux matches d'échange", { n }));
    setTimeout(() => setBadgeToast(null), 4000);
  });
  const NavBadge: React.FC<{ navKey: string }> = ({ navKey }) => (navKey === 'trade' && newMatchCount > 0
    ? <span aria-label={t("{n} échange en attente|{n} échanges en attente", { n: newMatchCount })} style={{ minWidth: '16px', height: '16px', padding: '0 4px', borderRadius: '8px', background: C.red, color: '#fff', fontSize: '10px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>{newMatchCount}</span>
    : null);
  const username = user?.user_metadata?.username ?? user?.email?.split('@')[0] ?? t('Moi');

  const [showAuth, setShowAuth]           = useState(false);
  const [showUserMenu, setShowUserMenu]   = useState(false);
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [splashExiting, setSplashExiting] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { init(); }, []);

  // Lien d'échange partagé (?trade=xxxxx) : ouvre directement l'onglet Échanges
  // avec le code pré-rempli, puis nettoie l'URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('trade');
    if (token) {
      setActiveTab('trade');
      useUIStore.getState().setPendingTradeToken(token);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Splash screen : reste visible au moins 500ms pour éviter un flash,
  // puis fade-out une fois l'auth résolue.
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => {
        setSplashExiting(true);
        setTimeout(() => setShowSplash(false), 400);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [loading]);

  useEffect(() => {
    if (!showUserMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showUserMenu]);

  const handleNav = (target: 'home' | 'collection' | 'trade') => {
    setActiveTab(target);
    if (target === 'home') goHome();
    if (target === 'trade') goTrade();
    if (target === 'collection') goHome(); // reset la view, l'onglet collection s'affiche via activeTab
  };

  const handleSignOut = async () => {
    setShowUserMenu(false);
    setShowMobileSheet(false);
    await signOut();
  };

  const renderMain = () => {
    if (activeTab === 'trade') return <TradeView />;
    if (activeTab === 'collection') {
      if (view === 'album')  return <AlbumView />;
      if (view === 'player') return <PlayerView />;
      return <StatsView />;
    }
    if (view === 'album')  return <AlbumView />;
    if (view === 'player') return <PlayerView />;
    return <HomeView />;
  };

  const isNavActive = (key: string) => activeTab === key;

  const navItems: Array<{ key: 'home' | 'collection' | 'trade'; Icon: typeof Layers; label: string }> = [
    { key: 'home',       Icon: Layers,         label: t('Albums') },
    { key: 'collection', Icon: Heart,          label: t('Collection') },
    { key: 'trade',      Icon: ArrowLeftRight, label: t('Échanges') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontSize: '13px', fontFamily: 'var(--font-sans)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* ── Splash screen ── */}
      {showSplash && (
        <div
          className={splashExiting ? 'splash-exit' : ''}
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'transparent',
          }}
        >
          <div className="splash-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <img src="/logo.svg" alt="" style={{ width: '64px', height: '64px', borderRadius: '16px' }} />
            <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px', color: C.textPrimary }}>
              Panini<span style={{ color: C.gold }}>Base</span>
            </span>
          </div>
        </div>
      )}

      {/* ── Fond galaxie : plein sur l'accueil, discret sur les écrans de travail ── */}
      <GalaxyBackdrop calm={!(activeTab === 'home' && view === 'home')} />

      {/* ── Bandeau hors ligne ── */}
      {isOffline && (
        <div style={{
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '6px 12px', background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.1)',
          fontSize: '11px', color: C.textSecondary,
        }}>
          <WifiOff size={12} />
          <span>{t('Tu es hors ligne — tes changements seront syncés au retour du réseau')}</span>
        </div>
      )}

      {/* ── Bandeau sync en attente ── */}
      {pendingCount > 0 && (
        <div style={{
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '6px 12px', background: 'rgba(231,76,60,0.12)', borderBottom: '1px solid rgba(231,76,60,0.25)',
          fontSize: '11px', color: C.redLight,
        }}>
          <WifiOff size={12} />
          <span>{pendingCount > 1 ? t('{n} changements non synchronisés', { n: pendingCount }) : t('1 changement non synchronisé')}</span>
          <button
            onClick={() => retrySync()}
            className="btn-tactile"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: C.redLight, fontSize: '11px', cursor: 'pointer', marginLeft: '4px' }}
          >
            <RefreshCw size={10} /> {t('Réessayer')}
          </button>
        </div>
      )}

      {/* ── Topbar ── */}
      <header className="topbar-glass" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '16px', padding: '0 20px', height: '60px', zIndex: 20, position: 'relative' }}>

        <button onClick={() => handleNav('home')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <img src="/logo.svg" alt="" style={{ width: '28px', height: '28px', borderRadius: '8px', filter: 'drop-shadow(0 0 8px rgba(255,190,50,0.45))' }} />
          <span style={{ fontSize: '19px', fontWeight: 900, letterSpacing: '-0.5px', color: C.textPrimary }}>Panini<span style={{ color: '#ffc531' }}>Base</span></span>
          <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '5px', background: 'rgba(255,197,49,0.12)', border: '1px solid rgba(255,197,49,0.5)', color: '#ffc531', letterSpacing: '0.8px' }}>BETA</span>
        </button>

        <div className="desktop-search" style={{ flex: 1, maxWidth: '560px', margin: '0 auto' }}>
          <GlobalSearch />
        </div>

        <nav className="desktop-nav" style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          {navItems.map(({ key, Icon, label }) => (
            <button key={key} className={`btn-tactile nav-tab${isNavActive(key) ? ' nav-tab--active' : ''}`} aria-current={isNavActive(key) ? 'page' : undefined} onClick={() => handleNav(key)} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: isNavActive(key) ? 700 : 500, color: isNavActive(key) ? '#fff' : C.textSecondary, background: 'transparent', border: '1px solid transparent', cursor: 'pointer', transition: 'color 0.12s' }}>
              <Icon size={16} color={isNavActive(key) ? '#ffc531' : 'currentColor'} />{label}<NavBadge navKey={key} />
            </button>
          ))}
        </nav>

        {/* Recherche sur mobile : une loupe qui ouvre la barre sous l'en-tête */}
        <button className="mobile-search-btn btn-tactile" onClick={() => setShowMobileSearch(true)} aria-label={t('Rechercher un joueur')} aria-expanded={showMobileSearch} style={{ marginLeft: 'auto', width: '40px', height: '40px', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: C.textSecondary, cursor: 'pointer', flexShrink: 0 }}>
          <Search size={18} />
        </button>

        <LanguageMenu />

        {!loading && (
          <div ref={menuRef} style={{ position: 'relative', flexShrink: 0, marginLeft: '8px' }}>
            {user ? (
              <>
                <button onClick={() => setShowUserMenu(!showUserMenu)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '10px', background: showUserMenu ? 'rgba(201,162,39,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${showUserMenu ? 'rgba(201,162,39,0.3)' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(201,162,39,0.2)', border: '1px solid rgba(201,162,39,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: C.gold }}>{username.charAt(0).toUpperCase()}</div>
                  <span style={{ fontSize: '12px', color: C.textSecondary, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{username}</span>
                  <span style={{ fontSize: '11px', color: C.textTertiary, display: 'inline-block', transform: showUserMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▼</span>
                </button>
                {showUserMenu && (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 100, width: '220px', background: C.glassStrong, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 16px 48px rgba(0,0,0,0.7)', overflow: 'hidden' }}>
                    <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
                    <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(201,162,39,0.12)', border: '2px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: C.gold, flexShrink: 0 }}>{username.charAt(0).toUpperCase()}</div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: '13px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>{username}</p>
                          <p style={{ fontSize: '11px', color: C.textTertiary, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '8px' }}>
                      <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', color: C.redLight, background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.12s', fontFamily: 'inherit' }} onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(231,76,60,0.1)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}><LogOut size={14} /> {t('Se déconnecter')}</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button className="btn-tactile btn-gold" onClick={() => setShowAuth(true)} style={{ padding: '7px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>{t('Connexion')}</button>
            )}
          </div>
        )}
      </header>

      {showMobileSearch && (
        <div className="mobile-search-bar" style={{ flexShrink: 0, padding: '8px 12px', background: C.glassBar, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'relative', zIndex: 19 }}>
          <GlobalSearch autoFocus onDone={() => setShowMobileSearch(false)} />
        </div>
      )}

      <main style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <Suspense fallback={
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '3px solid rgba(201,162,39,0.2)', borderTopColor: C.gold, animation: 'spin 0.7s linear infinite' }} />
          </div>
        }>
          {renderMain()}
        </Suspense>
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="mobile-nav" style={{ flexShrink: 0, display: 'flex', background: C.glassStrong, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.07)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {navItems.map(({ key, Icon, label }) => (
          <button key={key} onClick={() => handleNav(key)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer', color: isNavActive(key) ? C.gold : C.textSecondary, transition: 'color 0.15s' }}>
            <span style={{ position: 'relative', display: 'flex' }}>
              <Icon size={19} />
              <span style={{ position: 'absolute', top: '-6px', right: '-12px' }}><NavBadge navKey={key} /></span>
            </span>
            <span style={{ fontSize: '11px', fontWeight: isNavActive(key) ? 700 : 400 }}>{label}</span>
          </button>
        ))}
        <button onClick={() => user ? setShowMobileSheet(true) : setShowAuth(true)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer', color: user ? C.gold : C.textTertiary, transition: 'color 0.15s' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: user ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${user ? 'rgba(201,162,39,0.4)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: user ? C.gold : C.textTertiary }}>{user ? username.charAt(0).toUpperCase() : <UserIcon size={12} />}</div>
          <span style={{ fontSize: '11px', fontWeight: user ? 700 : 400 }}>{user ? username : t('Compte')}</span>
        </button>
      </nav>

      {/* ── Mobile user sheet ── */}
      {showMobileSheet && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(4,8,20,0.85)', backdropFilter: 'blur(12px)' }} onClick={(e) => e.target === e.currentTarget && setShowMobileSheet(false)}>
          <div style={{ background: C.glassStrong, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px 24px 0 0', padding: '0 0 40px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, borderRadius: '24px 24px 0 0', marginBottom: '16px' }} />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}><div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.15)' }} /></div>
            <div style={{ margin: '0 20px 20px', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(201,162,39,0.12)', border: '2px solid rgba(201,162,39,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, color: C.gold, flexShrink: 0 }}>{username.charAt(0).toUpperCase()}</div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '17px', fontWeight: 800, color: C.textPrimary, margin: 0 }}>{username}</p>
                <p style={{ fontSize: '12px', color: C.textTertiary, margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
              </div>
            </div>
            <div style={{ padding: '0 20px' }}>
              <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '16px', borderRadius: '14px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)', color: C.redLight, fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxSizing: 'border-box' }}><LogOut size={16} /> {t('Se déconnecter')}</button>
            </div>
          </div>
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showLegal && <LegalModal onClose={() => setShowLegal(false)} />}

      {/* Lien discret mentions légales, accessible partout sans gêner l'UI */}
      <button
        className="legal-link"
        onClick={() => setShowLegal(true)}
        style={{
          position: 'fixed', bottom: '6px', right: '8px', zIndex: 5,
          fontSize: '11px', color: 'rgba(107,122,154,0.7)', background: 'none', border: 'none',
          cursor: 'pointer', padding: '4px 6px',
        }}
      >
        {t('Mentions légales')}
      </button>
      <ShortcutsHelp />
      <OnboardingTour />
      {showBadgeConfetti && <Confetti />}
      {badgeToast && (
        <div style={{
          position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)', zIndex: 250,
          padding: '10px 18px', borderRadius: '20px', background: C.glassStrong, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(201,162,39,0.4)', color: C.gold,
          fontSize: '13px', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.25s ease',
        }}>
          {badgeToast}
        </div>
      )}
    </div>
  );
}
