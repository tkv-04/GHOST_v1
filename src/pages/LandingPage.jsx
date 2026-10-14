/**
 * TRACE: Ghost Protocol — Landing Page
 * 
 * Cinematic briefing page with GHOST's message and recruitment flow.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

export default function LandingPage() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (state.isRecruited) {
      navigate('/missions');
      return;
    }

    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 4500),
      setTimeout(() => setPhase(4), 6000),
    ];

    const cursorInterval = setInterval(() => setShowCursor((p) => !p), 530);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(cursorInterval);
    };
  }, [state.isRecruited, navigate]);

  const handleRecruit = (e) => {
    e.preventDefault();
    dispatch({
      type: 'RECRUIT_PLAYER',
      payload: { name: playerName || 'Agent' },
    });
    navigate('/missions');
  };

  return (
    <div className="min-h-screen bg-ghost-dark grid-bg scanline-overlay flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-ghost-amber/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulseGlow ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Classification header */}
        {phase >= 0 && (
          <div className="animate-fadeIn mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ghost-red/30 bg-ghost-red/5">
              <span className="w-1.5 h-1.5 rounded-full bg-ghost-red animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-ghost-red uppercase">
                Classified • Priority Alpha
              </span>
            </div>
          </div>
        )}

        {/* Title */}
        {phase >= 1 && (
          <div className="animate-fadeIn text-center mb-8">
            <h1 className="font-mono text-5xl sm:text-6xl font-bold tracking-tighter mb-2">
              <span className="text-ghost-text">T</span>
              <span className="text-ghost-text">R</span>
              <span className="text-ghost-text">A</span>
              <span className="text-ghost-text">C</span>
              <span className="text-ghost-text">E</span>
            </h1>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-ghost-amber/50" />
              <span className="font-mono text-xs tracking-[0.4em] text-ghost-amber">GHOST PROTOCOL</span>
              <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-ghost-amber/50" />
            </div>
            <p className="font-mono text-xs text-ghost-text-dim tracking-wider">
              OPEN SOURCE INTELLIGENCE • CAPTURE THE FLAG
            </p>
          </div>
        )}

        {/* GHOST's message */}
        {phase >= 2 && (
          <div className="animate-fadeIn mb-8">
            <div className="glass-amber rounded-lg p-6 relative">
              <div className="absolute -top-3 left-4 px-2 bg-ghost-dark">
                <span className="font-mono text-[10px] tracking-wider text-ghost-amber">INTERCEPTED TRANSMISSION</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded border border-ghost-amber/30 flex items-center justify-center bg-ghost-amber/10 shrink-0 mt-1">
                  <span className="text-ghost-amber text-sm">👻</span>
                </div>
                <div>
                  <div className="font-mono text-xs text-ghost-text-dim mb-2">
                    FROM: <span className="text-ghost-amber">GHOST</span> • ORIGIN: UNKNOWN • TIMESTAMP: REDACTED
                  </div>
                  <blockquote className="font-mono text-lg text-ghost-text leading-relaxed italic border-l-2 border-ghost-amber/30 pl-4">
                    "The truth was never deleted.{' '}
                    <span className="text-ghost-amber">You just stopped looking.</span>"
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Briefing */}
        {phase >= 3 && (
          <div className="animate-fadeIn mb-8">
            <div className="glass rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🛡️</span>
                <span className="font-mono text-xs tracking-wider text-ghost-amber">BRIEFING FROM DIRECTOR FURY</span>
              </div>
              <div className="space-y-3 text-sm text-ghost-text-muted leading-relaxed">
                <p>
                  An unknown operator designated <span className="text-ghost-amber font-semibold">GHOST</span> has left a trail of digital breadcrumbs across the public internet. 
                  We don't know their identity. We don't know their motive. But the intelligence they've exposed is too significant to ignore.
                </p>
                <p>
                  You are being recruited as a <span className="text-ghost-text">Junior Intelligence Analyst</span> for 
                  the <span className="text-ghost-text">S.H.I.E.L.D. OSINT Division</span>. Your mission: trace GHOST's 
                  path using open-source intelligence techniques — public searches, code repositories, archived pages, 
                  image analysis, and geolocation.
                </p>
                <p>
                  Seven missions. Seven handlers. One investigation.
                </p>
                <p className="text-ghost-text font-medium">
                  Every clue you discover feeds the next. Nothing is random.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recruitment form */}
        {phase >= 4 && (
          <div className="animate-fadeIn">
            <form onSubmit={handleRecruit} className="glass rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-ghost-green animate-pulse" />
                <span className="font-mono text-xs tracking-wider text-ghost-green">RECRUITMENT TERMINAL</span>
              </div>
              
              <div className="mb-4">
                <label htmlFor="agentName" className="block font-mono text-[10px] tracking-wider text-ghost-text-dim mb-2 uppercase">
                  Agent Designation (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-ghost-amber text-sm">{'>'}</span>
                  <input
                    id="agentName"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your codename..."
                    maxLength={20}
                    className="w-full bg-ghost-dark border border-ghost-border rounded px-3 py-2.5 pl-7 font-mono text-sm text-ghost-text placeholder:text-ghost-text-dim/50 focus:border-ghost-amber focus:ring-1 focus:ring-ghost-amber/30 outline-none transition-ghost"
                    autoComplete="off"
                  />
                  {showCursor && !playerName && (
                    <span className="absolute left-7 top-1/2 -translate-y-1/2 w-2 h-5 bg-ghost-amber/70" />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded font-mono text-sm font-bold tracking-wider uppercase bg-ghost-amber/10 text-ghost-amber border border-ghost-amber/30 hover:bg-ghost-amber/20 hover:border-ghost-amber/50 active:scale-[0.98] transition-ghost animate-pulseGlow"
              >
                ⚡ Accept Mission
              </button>

              <p className="mt-4 text-center font-mono text-[10px] text-ghost-text-dim tracking-wider">
                ⚠️ Fan-made educational project • Not affiliated with Marvel Entertainment
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
