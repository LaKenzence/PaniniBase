import React from 'react';
import { useUIStore } from './store';
import { GlobalSearch } from './components/GlobalSearch';
import { HomeView } from './views/HomeView';
import { AlbumView } from './views/AlbumView';
import { PlayerView } from './views/PlayerView';
import { CollectionView } from './views/CollectionView';

type NavView = 'home' | 'collection';

export default function App() {
  const { view, goHome } = useUIStore();
  const [navActive, setNavActive] = React.useState<NavView>('home');

  const handleNav = (target: NavView) => {
    setNavActive(target);
    if (target === 'home') goHome();
  };

  const activeNav: NavView = (view === 'album' || view === 'player') ? 'home' : navActive;

  return (
    <div
      className="flex flex-col h-screen min-h-0"
      style={{ fontSize: '13px', fontFamily: 'var(--font-sans)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* ── Topbar ── */}
      <header
        className="flex-shrink-0 flex items-center gap-3 px-4 z-20"
        style={{
          height: '48px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-subtle)',
          boxShadow: '0 1px 0 rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity whitespace-nowrap flex-shrink-0"
        >
          <span style={{ fontSize: '18px' }}>⚽</span>
          <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>
            Panini<span style={{ color: 'var(--gold)' }}>Base</span>
          </span>
          <span
            style={{
              fontSize: '8px',
              fontWeight: 700,
              letterSpacing: '0.8px',
              padding: '2px 5px',
              borderRadius: '4px',
              background: 'rgba(201,162,39,0.15)',
              border: '1px solid rgba(201,162,39,0.3)',
              color: 'var(--gold)',
            }}
          >
            BETA
          </span>
        </button>

        {/* Search */}
        <GlobalSearch />

        {/* Nav */}
        <nav className="flex gap-1 ml-auto flex-shrink-0">
          {([
            { key: 'home' as NavView, icon: '⚽', label: 'Albums' },
            { key: 'collection' as NavView, icon: '❤️', label: 'Collection' },
          ]).map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => handleNav(key)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all nav-btn ${activeNav === key ? 'nav-active' : ''}`}
              style={{
                fontSize: '11.5px',
                fontWeight: activeNav === key ? 600 : 400,
                color: activeNav === key ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: activeNav === key ? 'var(--bg-elevated)' : 'transparent',
                border: '1px solid',
                borderColor: activeNav === key ? 'var(--border-default)' : 'transparent',
              }}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Views ── */}
      <main className="flex flex-1 min-h-0 overflow-hidden">
        {navActive === 'collection' && view !== 'album' && view !== 'player'
          ? <CollectionView />
          : view === 'home'   ? <HomeView />
          : view === 'album'  ? <AlbumView />
          : view === 'player' ? <PlayerView />
          : null
        }
      </main>
    </div>
  );
}
