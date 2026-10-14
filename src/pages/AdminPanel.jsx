/**
 * TRACE: Ghost Protocol — Admin Panel
 * 
 * Challenge management, answer keys, source verification status.
 * Protected by a simple passphrase in the prototype.
 */

import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { MISSIONS, HANDLERS, ANSWER_KEY, DIFFICULTY_COLORS } from '../data/missions';

const ADMIN_PASS = 'fury-director-alpha'; // Simple prototype passphrase

export default function AdminPanel() {
  const { state } = useGame();
  const [authenticated, setAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [selectedMission, setSelectedMission] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);

  if (!state.isRecruited) return <Navigate to="/" replace />;

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-ghost-dark pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="glass rounded-lg p-8 max-w-md w-full animate-fadeIn">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <span className="text-2xl">🔐</span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-ghost-red uppercase">Restricted Access</span>
          </div>
          <h2 className="text-xl font-bold text-ghost-text font-mono text-center mb-6">Admin Authentication</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (passphrase === ADMIN_PASS) {
                setAuthenticated(true);
              } else {
                alert('Access denied. Invalid passphrase.');
              }
            }}
          >
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter admin passphrase..."
              className="w-full bg-ghost-dark border border-ghost-border rounded px-3 py-2.5 font-mono text-sm text-ghost-text placeholder:text-ghost-text-dim/50 focus:border-ghost-red focus:ring-1 focus:ring-ghost-red/30 outline-none transition-ghost mb-4"
              autoComplete="off"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded font-mono text-xs font-bold tracking-wider uppercase bg-ghost-red/10 text-ghost-red border border-ghost-red/30 hover:bg-ghost-red/20 transition-ghost"
            >
              AUTHENTICATE
            </button>
            <p className="mt-4 text-center font-mono text-[10px] text-ghost-text-dim">
              Prototype passphrase: fury-director-alpha
            </p>
          </form>
        </div>
      </div>
    );
  }

  const mission = selectedMission ? MISSIONS.find((m) => m.id === selectedMission) : null;

  return (
    <div className="min-h-screen bg-ghost-dark pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ghost-red animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-ghost-red uppercase">Admin • Restricted</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-ghost-text font-mono tracking-tight">Challenge Admin</h1>
              <p className="text-sm text-ghost-text-muted mt-1">
                Manage challenges, verify sources, and view answer keys.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className={`px-4 py-2 rounded font-mono text-xs tracking-wider border transition-ghost ${
                  showAnswers
                    ? 'bg-ghost-red/10 text-ghost-red border-ghost-red/30'
                    : 'border-ghost-border text-ghost-text-muted hover:text-ghost-text'
                }`}
              >
                {showAnswers ? '🔓 HIDE ANSWERS' : '🔒 SHOW ANSWERS'}
              </button>
              <button
                onClick={() => setAuthenticated(false)}
                className="px-4 py-2 rounded font-mono text-xs tracking-wider border border-ghost-border text-ghost-text-dim hover:text-ghost-red hover:border-ghost-red/30 transition-ghost"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mission List */}
          <div className="lg:col-span-1">
            <div className="glass rounded-lg p-2 sticky top-20">
              <div className="p-2 mb-2">
                <span className="font-mono text-[10px] tracking-wider text-ghost-amber">CHALLENGE LIST</span>
              </div>
              {MISSIONS.map((m) => {
                const handler = HANDLERS[m.handler];
                const progress = state.missionProgress[m.id];
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMission(m.id)}
                    className={`w-full text-left px-3 py-2.5 rounded font-mono text-xs transition-ghost flex items-center gap-2 ${
                      selectedMission === m.id
                        ? 'bg-ghost-amber/10 text-ghost-amber'
                        : 'text-ghost-text-muted hover:text-ghost-text hover:bg-ghost-card'
                    }`}
                  >
                    <span className="text-sm">{handler.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">M{m.number}: {m.title}</div>
                      <div className="text-[10px] text-ghost-text-dim">{m.difficulty} • {m.points}pts</div>
                    </div>
                    <span className={`text-[10px] ${
                      progress?.status === 'completed' ? 'text-ghost-green' : 'text-ghost-text-dim'
                    }`}>
                      {progress?.status === 'completed' ? '✅' : progress?.status === 'locked' ? '🔒' : '📡'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mission Detail */}
          <div className="lg:col-span-2">
            {mission ? (
              <div className="space-y-4 animate-fadeIn" key={mission.id}>
                {/* Mission Info */}
                <div className="glass rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-ghost-text font-mono">
                        M{mission.number}: {mission.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-mono ${DIFFICULTY_COLORS[mission.difficulty]}`}>
                          {mission.difficulty}
                        </span>
                        <span className="font-mono text-xs text-ghost-text-dim">{mission.category}</span>
                        <span className="font-mono text-xs text-ghost-amber">{mission.points} pts</span>
                      </div>
                    </div>
                  </div>

                  <AdminField label="Handler" value={`${HANDLERS[mission.handler].name} (${HANDLERS[mission.handler].codename})`} />
                  <AdminField label="Prerequisites" value={mission.prerequisites.length > 0 ? mission.prerequisites.map((p) => `M${MISSIONS.find((m) => m.id === p)?.number}`).join(', ') : 'None'} />
                  <AdminField label="Objective" value={mission.objective} />
                  <AdminField label="Expected Source" value={mission.expectedSource} />
                  <AdminField label="Expected Observation" value={mission.expectedObservation} />
                  <AdminField label="Answer Format" value={mission.answerFormat} />
                  <AdminField label="Verification Method" value={mission.verificationMethod} />
                  
                  {showAnswers && (
                    <div className="mt-4 p-3 rounded-lg bg-ghost-red/5 border border-ghost-red/20">
                      <div className="font-mono text-[10px] tracking-wider text-ghost-red mb-1">🔑 ANSWER KEY</div>
                      <div className="font-mono text-lg font-bold text-ghost-red">{ANSWER_KEY[mission.id]}</div>
                    </div>
                  )}
                </div>

                {/* Search Queries */}
                <div className="glass rounded-lg p-4">
                  <div className="font-mono text-[10px] tracking-wider text-ghost-amber mb-3">SEARCH QUERIES</div>
                  {mission.searchQueries.map((q, i) => (
                    <div key={i} className="p-2 rounded bg-ghost-dark border border-ghost-border mb-2 last:mb-0">
                      <div className="font-mono text-xs text-ghost-text">{q.label}</div>
                      <div className="font-mono text-[10px] text-ghost-text-dim mt-0.5">{q.query || '(internal)'}</div>
                    </div>
                  ))}
                </div>

                {/* Hints */}
                <div className="glass rounded-lg p-4">
                  <div className="font-mono text-[10px] tracking-wider text-ghost-amber mb-3">HINTS</div>
                  {mission.hints.map((h, i) => (
                    <div key={i} className="p-3 rounded bg-ghost-dark border border-ghost-border mb-2 last:mb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs text-ghost-amber">Hint {i + 1}</span>
                        <span className="font-mono text-[10px] text-ghost-red">-{h.penalty} pts</span>
                      </div>
                      <p className="font-mono text-xs text-ghost-text-muted">{h.text}</p>
                    </div>
                  ))}
                </div>

                {/* Evidence Dependencies */}
                <div className="glass rounded-lg p-4">
                  <div className="font-mono text-[10px] tracking-wider text-ghost-amber mb-3">EVIDENCE CHAIN</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <div className="font-mono text-[10px] text-ghost-text-dim mb-2">DISCOVERS:</div>
                      {mission.discoveredClues.map((c) => (
                        <div key={c.id} className="p-2 rounded bg-ghost-green/5 border border-ghost-green/20 mb-1 text-xs font-mono">
                          <span className="text-ghost-green">{c.label}</span>
                          <span className="text-ghost-text-dim ml-2">→ {c.usedIn.length > 0 ? c.usedIn.map((id) => `M${MISSIONS.find((m) => m.id === id)?.number}`).join(', ') : 'Final'}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-ghost-text-dim mb-2">REQUIRES:</div>
                      {mission.evidenceRequired.length > 0 ? mission.evidenceRequired.map((r) => (
                        <div key={r.clueId} className="p-2 rounded bg-ghost-blue/5 border border-ghost-blue/20 mb-1 text-xs font-mono">
                          <span className="text-ghost-blue">From M{MISSIONS.find((m) => m.id === r.fromMission)?.number}</span>
                          <span className="text-ghost-text-dim ml-2">{r.description}</span>
                        </div>
                      )) : (
                        <div className="text-xs font-mono text-ghost-text-dim p-2">None</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fallback */}
                <div className="glass rounded-lg p-4">
                  <div className="font-mono text-[10px] tracking-wider text-ghost-amber mb-2">FALLBACK ARTIFACT</div>
                  <p className="font-mono text-xs text-ghost-text-muted">{mission.fallbackArtifact}</p>
                </div>
              </div>
            ) : (
              <div className="glass rounded-lg p-12 text-center">
                <span className="text-4xl mb-4 block">📋</span>
                <p className="font-mono text-sm text-ghost-text-dim">Select a mission to view its configuration.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminField({ label, value }) {
  return (
    <div className="py-2 border-b border-ghost-border/50 last:border-0">
      <div className="font-mono text-[10px] text-ghost-text-dim tracking-wider mb-0.5">{label.toUpperCase()}</div>
      <div className="font-mono text-xs text-ghost-text">{value}</div>
    </div>
  );
}
