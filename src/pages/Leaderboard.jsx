/**
 * TRACE: Ghost Protocol — Leaderboard & Write-up Submission
 */

import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useGame, getCompletedMissionCount, getMaxPossibleScore } from '../context/GameContext';

export default function Leaderboard() {
  const { state, dispatch } = useGame();
  const [writeUp, setWriteUp] = useState(state.writeUp || '');
  const [saved, setSaved] = useState(false);

  if (!state.isRecruited) return <Navigate to="/" replace />;

  const completed = getCompletedMissionCount(state);
  const maxScore = getMaxPossibleScore();

  // Mock leaderboard data for prototype
  const leaderboardData = [
    ...(completed > 0
      ? [
          {
            rank: '-',
            name: state.playerName,
            score: state.totalScore,
            missions: completed,
            time: state.startedAt
              ? Math.floor((Date.now() - new Date(state.startedAt).getTime()) / 60000)
              : 0,
            isPlayer: true,
          },
        ]
      : []),
    { rank: 1, name: 'SPECTRE', score: 1850, missions: 7, time: 45 },
    { rank: 2, name: 'CIPHER', score: 1700, missions: 7, time: 62 },
    { rank: 3, name: 'PHANTOM', score: 1600, missions: 7, time: 78 },
    { rank: 4, name: 'VECTOR', score: 1450, missions: 7, time: 95 },
    { rank: 5, name: 'WRAITH', score: 1200, missions: 6, time: 110 },
    { rank: 6, name: 'SHADE', score: 950, missions: 5, time: 85 },
    { rank: 7, name: 'ECHO', score: 800, missions: 4, time: 120 },
    { rank: 8, name: 'NULL', score: 600, missions: 3, time: 60 },
  ].sort((a, b) => b.score - a.score);

  const handleSaveWriteUp = () => {
    dispatch({ type: 'UPDATE_WRITEUP', payload: writeUp });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-ghost-dark pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ghost-amber animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-ghost-amber uppercase">Competition</span>
          </div>
          <h1 className="text-3xl font-bold text-ghost-text font-mono tracking-tight">Leaderboard</h1>
          <p className="text-sm text-ghost-text-muted mt-1">
            Top agents ranked by score. Mock data shown — multiplayer leaderboard requires the backend.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard Table */}
          <div className="lg:col-span-2">
            <div className="glass rounded-lg overflow-hidden animate-fadeIn">
              <div className="p-4 border-b border-ghost-border">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏆</span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-ghost-amber">AGENT RANKINGS</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-xs">
                  <thead>
                    <tr className="border-b border-ghost-border bg-ghost-card/50">
                      <th className="text-left py-3 px-4 text-ghost-text-dim">#</th>
                      <th className="text-left py-3 px-4 text-ghost-text-dim">AGENT</th>
                      <th className="text-center py-3 px-4 text-ghost-text-dim">SCORE</th>
                      <th className="text-center py-3 px-4 text-ghost-text-dim">MISSIONS</th>
                      <th className="text-center py-3 px-4 text-ghost-text-dim">TIME (min)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((entry, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-ghost-border/50 transition-ghost ${
                          entry.isPlayer
                            ? 'bg-ghost-amber/5 border-l-2 border-l-ghost-amber'
                            : 'hover:bg-ghost-card/50'
                        }`}
                      >
                        <td className="py-3 px-4">
                          {idx === 0 && !entry.isPlayer ? (
                            <span className="text-amber-400">🥇</span>
                          ) : idx === 1 && !leaderboardData[0]?.isPlayer ? (
                            <span className="text-gray-300">🥈</span>
                          ) : idx === 2 && !leaderboardData[0]?.isPlayer && !leaderboardData[1]?.isPlayer ? (
                            <span className="text-amber-600">🥉</span>
                          ) : (
                            <span className={entry.isPlayer ? 'text-ghost-amber' : 'text-ghost-text-dim'}>
                              {entry.isPlayer ? 'YOU' : entry.rank}
                            </span>
                          )}
                        </td>
                        <td className={`py-3 px-4 font-bold ${entry.isPlayer ? 'text-ghost-amber' : 'text-ghost-text'}`}>
                          {entry.name}
                        </td>
                        <td className={`py-3 px-4 text-center font-bold ${entry.isPlayer ? 'text-ghost-amber' : 'text-ghost-text'}`}>
                          {entry.score}
                        </td>
                        <td className="py-3 px-4 text-center text-ghost-text-muted">
                          {entry.missions}/7
                        </td>
                        <td className="py-3 px-4 text-center text-ghost-text-muted">
                          {entry.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-ghost-border bg-ghost-card/30">
                <p className="font-mono text-[10px] text-ghost-text-dim text-center">
                  ⚠️ Prototype: Mock data shown. Real-time leaderboard requires FastAPI backend.
                </p>
              </div>
            </div>
          </div>

          {/* Stats & Write-up */}
          <div className="space-y-6">
            {/* Your Stats */}
            <div className="glass rounded-lg p-4 animate-fadeIn" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm">📊</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-ghost-amber">YOUR STATS</span>
              </div>
              <div className="space-y-3">
                <StatRow label="Score" value={`${state.totalScore} / ${maxScore}`} />
                <StatRow label="Missions" value={`${completed} / 7`} />
                <StatRow label="Penalties" value={`-${state.totalPenalties}`} />
                <StatRow label="Evidence" value={state.evidenceLocker.length} />
                {state.startedAt && (
                  <StatRow
                    label="Elapsed"
                    value={`${Math.floor((Date.now() - new Date(state.startedAt).getTime()) / 60000)} min`}
                  />
                )}
              </div>
            </div>

            {/* Write-up */}
            <div className="glass rounded-lg p-4 animate-fadeIn" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm">📝</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-ghost-amber">INVESTIGATION WRITE-UP</span>
              </div>
              <p className="text-xs text-ghost-text-dim mb-3">
                Document your methodology, evidence chain, and conclusions. This will be part of your final report.
              </p>
              <textarea
                value={writeUp}
                onChange={(e) => setWriteUp(e.target.value)}
                rows={8}
                placeholder="Describe your investigation process, key findings, and how you connected the evidence..."
                className="w-full bg-ghost-dark border border-ghost-border rounded px-3 py-2 font-mono text-xs text-ghost-text placeholder:text-ghost-text-dim/50 focus:border-ghost-amber outline-none resize-y min-h-[120px]"
              />
              <button
                onClick={handleSaveWriteUp}
                className="mt-2 w-full py-2 rounded font-mono text-xs tracking-wider bg-ghost-amber/10 text-ghost-amber border border-ghost-amber/30 hover:bg-ghost-amber/20 transition-ghost"
              >
                {saved ? '✅ SAVED' : 'SAVE WRITE-UP'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-ghost-border/50 last:border-0">
      <span className="font-mono text-[10px] text-ghost-text-dim tracking-wider">{label}</span>
      <span className="font-mono text-sm font-bold text-ghost-text">{value}</span>
    </div>
  );
}
