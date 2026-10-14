/**
 * TRACE: Ghost Protocol — Mission Board
 * 
 * REDESIGNED: Strictly sequential progression.
 * Only the next mission is available after completing the current one.
 */

import { Link, Navigate } from 'react-router-dom';
import { useGame, getCompletedMissionCount, getMaxPossibleScore } from '../context/GameContext';
import { MISSIONS, HANDLERS, DIFFICULTY_COLORS, CATEGORY_ICONS } from '../data/missions';

const STATUS_CONFIG = {
  locked: {
    card: 'opacity-40 grayscale cursor-not-allowed',
    badge: 'bg-ghost-text-dim/10 text-ghost-text-dim border-ghost-text-dim/20',
    label: '🔒 LOCKED',
    accent: 'bg-ghost-border',
  },
  available: {
    card: 'hover:border-ghost-amber/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] cursor-pointer ring-1 ring-ghost-amber/20',
    badge: 'bg-ghost-amber/10 text-ghost-amber border-ghost-amber/30 animate-pulse',
    label: '📡 READY',
    accent: 'bg-ghost-amber',
  },
  active: {
    card: 'border-ghost-amber/40 shadow-[0_0_20px_rgba(245,158,11,0.15)] cursor-pointer ring-1 ring-ghost-amber/30',
    badge: 'bg-ghost-amber/10 text-ghost-amber border-ghost-amber/30 animate-pulse',
    label: '⚡ IN PROGRESS',
    accent: 'bg-ghost-amber animate-pulse',
  },
  completed: {
    card: 'border-ghost-green/30 cursor-pointer',
    badge: 'bg-ghost-green/10 text-ghost-green border-ghost-green/30',
    label: '✅ SOLVED',
    accent: 'bg-ghost-green',
  },
};

export default function MissionBoard() {
  const { state } = useGame();

  if (!state.isRecruited) return <Navigate to="/" replace />;

  const completed = getCompletedMissionCount(state);
  const maxScore = getMaxPossibleScore();

  return (
    <div className="min-h-screen bg-ghost-dark pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ghost-amber animate-pulse" />
                <span className="font-mono text-[10px] tracking-[0.3em] text-ghost-amber uppercase">Mission Control</span>
              </div>
              <h1 className="text-3xl font-bold text-ghost-text font-mono tracking-tight">Mission Board</h1>
              <p className="text-sm text-ghost-text-muted mt-1">
                Welcome, <span className="text-ghost-amber">{state.playerName}</span>. Complete each mission to unlock the next.
              </p>
            </div>
            <div className="flex gap-3">
              <StatCard label="SOLVED" value={`${completed}/${MISSIONS.length}`} color="text-ghost-green" />
              <StatCard label="SCORE" value={state.totalScore} color="text-ghost-amber" />
              <StatCard label="MAX" value={maxScore} color="text-ghost-text-dim" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-ghost-card rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-ghost-amber to-ghost-green rounded-full transition-all duration-700"
              style={{ width: `${(completed / MISSIONS.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            {MISSIONS.map((m) => {
              const status = state.missionProgress[m.id]?.status || 'locked';
              return (
                <div
                  key={m.id}
                  className={`w-2 h-2 rounded-full transition-all ${
                    status === 'completed' ? 'bg-ghost-green' : status === 'available' || status === 'active' ? 'bg-ghost-amber animate-pulse' : 'bg-ghost-border'
                  }`}
                  title={`M${m.number}: ${status}`}
                />
              );
            })}
          </div>
        </div>

        {/* Sequential Mission List */}
        <div className="space-y-4">
          {MISSIONS.map((mission, idx) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              status={state.missionProgress[mission.id]?.status || 'locked'}
              progress={state.missionProgress[mission.id]}
              delay={idx * 80}
              missionIndex={idx}
            />
          ))}
        </div>

        {/* Campaign completion */}
        {completed === MISSIONS.length && (
          <div className="mt-8 animate-fadeIn">
            <div className="glass-amber rounded-lg p-8 text-center">
              <span className="text-5xl mb-4 block">🏆</span>
              <h2 className="font-mono text-2xl font-bold text-ghost-amber mb-2">Investigation Complete</h2>
              <p className="text-sm text-ghost-text-muted mb-1">
                Final Score: <span className="text-ghost-amber font-bold text-lg">{state.totalScore}</span> / {maxScore} points
              </p>
              {state.totalPenalties > 0 && (
                <p className="text-xs text-ghost-text-dim">
                  Hint penalties: -{state.totalPenalties} points
                </p>
              )}
              <Link
                to="/leaderboard"
                className="inline-block mt-4 px-6 py-2.5 rounded font-mono text-xs tracking-wider bg-ghost-amber/10 text-ghost-amber border border-ghost-amber/30 hover:bg-ghost-amber/20 transition-ghost"
              >
                VIEW LEADERBOARD →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="px-3 py-2 rounded-lg bg-ghost-card border border-ghost-border">
      <div className="font-mono text-[9px] tracking-wider text-ghost-text-dim mb-0.5">{label}</div>
      <div className={`font-mono text-lg font-bold ${color}`}>{value}</div>
    </div>
  );
}

function MissionCard({ mission, status, progress, delay, missionIndex }) {
  const handler = HANDLERS[mission.handler];
  const statusConfig = STATUS_CONFIG[status];
  const diffColor = DIFFICULTY_COLORS[mission.difficulty];
  const categoryIcon = CATEGORY_ICONS[mission.category] || '📋';
  const isClickable = status !== 'locked';

  const card = (
    <div
      className={`glass rounded-lg p-5 border border-ghost-border transition-ghost ${statusConfig.card} animate-fadeIn group relative overflow-hidden`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
      role="article"
      aria-label={`Mission ${mission.number}: ${mission.title} — ${statusConfig.label}`}
    >
      {/* Status accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${statusConfig.accent}`} />

      {/* Sequential number indicator */}
      <div className="absolute -left-px top-0 bottom-0 w-1 rounded-l">
        <div className={`h-full ${statusConfig.accent} rounded-l`} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Mission number circle */}
        <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center shrink-0 transition-ghost ${
          status === 'completed' ? 'border-ghost-green bg-ghost-green/10' :
          status === 'available' || status === 'active' ? 'border-ghost-amber bg-ghost-amber/10' :
          'border-ghost-border bg-ghost-card'
        }`}>
          {status === 'completed' ? (
            <span className="text-xl">✅</span>
          ) : status === 'locked' ? (
            <span className="text-xl">🔒</span>
          ) : (
            <span className={`font-mono text-xl font-bold ${status === 'available' || status === 'active' ? 'text-ghost-amber' : 'text-ghost-text-dim'}`}>
              {mission.number}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{handler.avatar}</span>
            <span className={`font-mono text-[10px] ${handler.color} tracking-wider`}>{handler.name}</span>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono tracking-wider ${statusConfig.badge}`}>
              {statusConfig.label}
            </span>
          </div>

          <h3 className="font-mono text-base font-bold text-ghost-text group-hover:text-ghost-amber transition-ghost mb-1">
            Mission {mission.number}: {mission.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-0.5 rounded border text-[10px] font-mono ${diffColor}`}>
              {mission.difficulty}
            </span>
            <span className="text-ghost-text-dim text-[10px] font-mono flex items-center gap-1">
              {categoryIcon} {mission.category}
            </span>
          </div>
        </div>

        {/* Points */}
        <div className="text-right shrink-0">
          <div className="font-mono text-[9px] text-ghost-text-dim">POINTS</div>
          <div className="font-mono text-xl font-bold text-ghost-amber">
            {status === 'completed' ? progress.score : mission.points}
          </div>
          {status === 'completed' && progress.score < mission.points && (
            <div className="font-mono text-[9px] text-ghost-red">-{mission.points - progress.score} hints</div>
          )}
        </div>
      </div>

      {/* Connection line to next */}
      {missionIndex < MISSIONS.length - 1 && (
        <div className="absolute -bottom-4 left-7 w-0.5 h-4 bg-ghost-border z-10" />
      )}
    </div>
  );

  if (isClickable) {
    return <Link to={`/mission/${mission.id}`} className="block">{card}</Link>;
  }
  return card;
}
