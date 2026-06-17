import React, { useEffect, useState, useRef } from 'react';
import { useUIStore, useAuthStore } from './store/index';
import { GlobalSearch } from './components/GlobalSearch';
import { HomeView } from './views/HomeView';
import { AlbumView } from './views/AlbumView';
import { PlayerView } from './views/PlayerView';
import { TradeView } from './views/TradeView';
import { AuthModal } from './components/AuthModal';
import { StatsView } from './views/StatsView';

type NavTab = 'home' | 'collection' | 'trade';

export default function App() {
  const { view, goHome, goTrade } = useUIStore();
  const { user, loading, init, signOut } = useAuthStore();
  const username = user?.user_metadata?.username ?? user?.email?.split('@')[0] ?? 'Moi';

  const [navActive, setNavActive]         = useState<NavTab>('home');
  const [showAuth, setShowAuth]           = useState(false);
  const [showUserMenu, setShowUserMenu]   = useState(false);
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { init(); }, []);

  // Ferme le menu desktop si clic extérieur
  useEffect(() => {
    if (!showUserMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showUserMenu]);

  const handleNav = (target: NavTab) => {
    setNavActive(target);
    // Réinitialise la vue store selon l'onglet
    if (target === 'home')       goHome();
    if (target === 'trade')      goTrade();
    if (target === 'collection') goHome(); // reset view sans changer navActive
  };

  const handleSignOut = async () => {
    setShowUserMenu(false);
    setShowMobileSheet(false);
    await signOut();
  };

  // Quelle vue afficher ?
  const renderMain = () => {
    // Échanges — priorité absolue si navActive = trade
    if (navActive === 'trade') return <TradeView />;
    // Collection — affiche StatsView sauf si on a navigué vers un album/joueur depuis là
    if (navActive === 'collection') {
      if (view === 'album')  return <AlbumView />;
      if (view === 'player') return <PlayerView />;
      return <StatsView />;
    }
    // Home — Albums
    if (view === 'album')  return <AlbumView />;
    if (view === 'player') return <PlayerView />;
    return <HomeView />;
  };

  // Quel onglet est actif visuellement ?
  const isNavActive = (key: NavTab) => navActive === key;

  const navItems: Array<{ key: NavTab; icon: string; label: string }> = [
    { key: 'home',       icon: '⚽', label: 'Albums' },
    { key: 'collection', icon: '❤️', label: 'Collection' },
    { key: 'trade',      icon: '🔄', label: 'Échanges' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontSize: '13px', fontFamily: 'var(--font-sans)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* ── Topbar ── */}
      <header style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px', height: '48px', background: '#0D1526', borderBottom: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 1px 0 rgba(0,0,0,0.4)', zIndex: 20, position: 'relative' }}>

        {/* Logo */}
        <button onClick={() => handleNav('home')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <span style={{ fontSize: '18px' }}>⚽</span>
          <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.3px', color: '#F0F4FF' }}>
            Panini<span style={{ color: '#C9A227' }}>Base</span>
          </span>
          <span style={{ fontSize: '8px', fontWeight: 700, padding: '2px 5px', borderRadius: '4px', background: 'rgba(201,162,39,0.15)', border: '1px solid rgba(201,162,39,0.3)', color: '#C9A227', letterSpacing: '0.8px' }}>
            BETA
          </span>
        </button>

        {/* Search */}
        <div className="desktop-search" style={{ flex: 1, maxWidth: '300px' }}>
          <GlobalSearch />
        </div>

        {/* Nav desktop */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '4px', marginLeft: 'auto', flexShrink: 0 }}>
          {navItems.map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => handleNav(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 12px', borderRadius: '8px', fontSize: '11.5px',
                fontWeight: isNavActive(key) ? 600 : 400,
                color: isNavActive(key) ? '#F0F4FF' : '#4A5A7A',
                background: isNavActive(key) ? 'rgba(255,255,255,0.07)' : 'transparent',
                border: `1px solid ${isNavActive(key) ? 'rgba(255,255,255,0.12)' : 'transparent'}`,
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>

        {/* Auth */}
        {!loading && (
          <div ref={menuRef} style={{ position: 'relative', flexShrink: 0, marginLeft: '8px' }}>
            {user ? (
              <>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '10px', background: showUserMenu ? 'rgba(201,162,39,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${showUserMenu ? 'rgba(201,162,39,0.3)' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', transition: 'all 0.15s' }}
                >
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(201,162,39,0.2)', border: '1px solid rgba(201,162,39,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#C9A227' }}>
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '12px', color: '#8A9BBF', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{username}</span>
                  <span style={{ fontSize: '9px', color: '#4A5A7A', display: 'inline-block', transform: showUserMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▼</span>
                </button>

                {showUserMenu && (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 100, width: '220px', background: '#0D1526', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 16px 48px rgba(0,0,0,0.7)', overflow: 'hidden' }}>
                    <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #C9A227, transparent)' }} />
                    <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(201,162,39,0.12)', border: '2px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: '#C9A227', flexShrink: 0 }}>
                          {username.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: '13px', fontWeight: 700, color: '#F0F4FF', margin: 0 }}>{username}</p>
                          <p style={{ fontSize: '11px', color: '#4A5A7A', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '8px' }}>
                      <button
                        onClick={handleSignOut}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', color: '#ff7675', background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.12s', fontFamily: 'inherit' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(231,76,60,0.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                      >
                        🚪 Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                style={{ padding: '7px 14px', borderRadius: '10px', background: '#C9A227', color: '#000', fontWeight: 700, fontSize: '12px', border: 'none', cursor: 'pointer' }}
              >
                Connexion
              </button>
            )}
          </div>
        )}
      </header>

      {/* ── Main ── */}
      <main style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {renderMain()}
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav style={{ flexShrink: 0, display: 'flex', background: '#0D1526', borderTop: '1px solid rgba(255,255,255,0.07)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {navItems.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => handleNav(key)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer', color: isNavActive(key) ? '#C9A227' : '#4A5A7A', transition: 'color 0.15s' }}
          >
            <span style={{ fontSize: '20px', lineHeight: 1 }}>{icon}</span>
            <span style={{ fontSize: '10px', fontWeight: isNavActive(key) ? 700 : 400 }}>{label}</span>
          </button>
        ))}
        {/* Compte mobile */}
        <button
          onClick={() => user ? setShowMobileSheet(true) : setShowAuth(true)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer', color: user ? '#C9A227' : '#4A5A7A', transition: 'color 0.15s' }}
        >
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: user ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${user ? 'rgba(201,162,39,0.4)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: user ? '#C9A227' : '#4A5A7A' }}>
            {user ? username.charAt(0).toUpperCase() : '?'}
          </div>
          <span style={{ fontSize: '10px', fontWeight: user ? 700 : 400 }}>{user ? username : 'Compte'}</span>
        </button>
      </nav>

      {/* ── Mobile user sheet ── */}
      {showMobileSheet && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(4,8,20,0.85)', backdropFilter: 'blur(12px)' }}
          onClick={(e) => e.target === e.currentTarget && setShowMobileSheet(false)}
        >
          <div style={{ background: '#0D1526', borderTop: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px 24px 0 0', padding: '0 0 40px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #C9A227, transparent)', borderRadius: '24px 24px 0 0', marginBottom: '16px' }} />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.15)' }} />
            </div>
            <div style={{ margin: '0 20px 20px', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(201,162,39,0.12)', border: '2px solid rgba(201,162,39,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, color: '#C9A227', flexShrink: 0 }}>
                {username.charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '17px', fontWeight: 800, color: '#F0F4FF', margin: 0 }}>{username}</p>
                <p style={{ fontSize: '12px', color: '#4A5A7A', margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
              </div>
            </div>
            <div style={{ padding: '0 20px' }}>
              <button
                onClick={handleSignOut}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '16px', borderRadius: '14px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)', color: '#ff7675', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxSizing: 'border-box' }}
              >
                🚪 Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Auth modal ── */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
