/**
 * TRACE: Ghost Protocol — Navigation Bar
 */

import { NavLink } from 'react-router-dom';
import { useGame, getCompletedMissionCount } from '../context/GameContext';
import { MISSIONS } from '../data/missions';

const navItems = [
  { path: '/missions', label: 'MISSIONS', icon: '📡' },
  { path: '/evidence', label: 'EVIDENCE', icon: '🗄️' },
  { path: '/connections', label: 'CONNECTIONS', icon: '🔗' },
  { path: '/leaderboard', label: 'LEADERBOARD', icon: '🏆' },
  { path: '/field-manual', label: 'FIELD MANUAL', icon: '📋' },
];

export default function Navbar() {
  const { state, dispatch } = useGame();
  const completed = getCompletedMissionCount(state);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-ghost-border" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group" aria-label="TRACE Home">
            <div className="w-8 h-8 rounded border border-ghost-amber/50 flex items-center justify-center bg-ghost-amber/10 group-hover:bg-ghost-amber/20 transition-ghost">
              <span className="text-ghost-amber font-mono font-bold text-sm">T</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-mono text-xs font-bold tracking-[0.3em] text-ghost-amber leading-none">TRACE</span>
              <span className="font-mono text-[9px] text-ghost-text-dim tracking-wider leading-none">GHOST PROTOCOL</span>
            </div>
          </NavLink>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded font-mono text-xs tracking-wider transition-ghost flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-ghost-amber/10 text-ghost-amber border border-ghost-amber/30'
                      : 'text-ghost-text-muted hover:text-ghost-text hover:bg-ghost-card border border-transparent'
                  }`
                }
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            {state.isRecruited && (
              <>
                <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded bg-ghost-card border border-ghost-border">
                  <span className="font-mono text-[10px] text-ghost-text-dim">SCORE</span>
                  <span className="font-mono text-sm font-bold text-ghost-amber">{state.totalScore}</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded bg-ghost-card border border-ghost-border">
                  <span className="font-mono text-[10px] text-ghost-text-dim">MISSIONS</span>
                  <span className="font-mono text-sm font-bold text-ghost-green">{completed}/{MISSIONS.length}</span>
                </div>
              </>
            )}
            
            {/* Mobile menu button */}
            <MobileMenu items={navItems} />
            
            {state.isRecruited && (
              <button
                onClick={() => {
                  if (window.confirm('Reset all progress? This cannot be undone.')) {
                    dispatch({ type: 'RESET_GAME' });
                    window.location.href = '/';
                  }
                }}
                className="p-1.5 rounded text-ghost-text-dim hover:text-ghost-red hover:bg-ghost-red/10 transition-ghost"
                title="Reset Progress"
                aria-label="Reset all progress"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileMenu({ items }) {
  return (
    <div className="md:hidden relative group">
      <button className="p-1.5 rounded text-ghost-text-muted hover:text-ghost-text hover:bg-ghost-card transition-ghost" aria-label="Open menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>
      <div className="absolute right-0 top-full mt-1 w-48 py-1 glass rounded-lg border border-ghost-border shadow-xl opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 font-mono text-xs tracking-wider ${
                isActive ? 'text-ghost-amber bg-ghost-amber/10' : 'text-ghost-text-muted hover:text-ghost-text hover:bg-ghost-card'
              }`
            }
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
