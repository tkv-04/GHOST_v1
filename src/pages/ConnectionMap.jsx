/**
 * TRACE: Ghost Protocol — Connection Map
 * 
 * Visual graph showing mission dependencies and evidence flow.
 * Built with pure SVG — no external libraries needed.
 */

import { Navigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { MISSIONS, HANDLERS } from '../data/missions';

// Layout positions for the mission nodes
const NODE_POSITIONS = {
  'mission-1': { x: 120, y: 80 },
  'mission-2': { x: 360, y: 80 },
  'mission-3': { x: 600, y: 80 },
  'mission-4': { x: 180, y: 240 },
  'mission-5': { x: 420, y: 240 },
  'mission-6': { x: 540, y: 400 },
  'mission-7': { x: 360, y: 540 },
};

// Evidence flow connections
const CONNECTIONS = [
  { from: 'mission-1', to: 'mission-4', label: 'Codename', color: '#ef4444' },
  { from: 'mission-2', to: 'mission-5', label: 'Alias', color: '#a855f7' },
  { from: 'mission-3', to: 'mission-6', label: 'Keyword', color: '#22c55e' },
  { from: 'mission-5', to: 'mission-6', label: 'Location', color: '#f59e0b' },
  { from: 'mission-4', to: 'mission-7', label: 'Archive', color: '#3b82f6' },
  { from: 'mission-6', to: 'mission-7', label: 'Operation', color: '#06b6d4' },
  { from: 'mission-1', to: 'mission-7', label: 'Codename', color: '#ef4444', dashed: true },
  { from: 'mission-2', to: 'mission-7', label: 'Alias', color: '#a855f7', dashed: true },
  { from: 'mission-3', to: 'mission-7', label: 'Keyword', color: '#22c55e', dashed: true },
];

export default function ConnectionMap() {
  const { state } = useGame();

  if (!state.isRecruited) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-ghost-dark pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ghost-amber animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-ghost-amber uppercase">Intelligence Analysis</span>
          </div>
          <h1 className="text-3xl font-bold text-ghost-text font-mono tracking-tight">Connection Map</h1>
          <p className="text-sm text-ghost-text-muted mt-1">
            Evidence flow and mission dependencies. Solid lines show prerequisite dependencies, dashed lines show evidence reuse.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 p-3 glass rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-ghost-amber" />
            <span className="font-mono text-[10px] text-ghost-text-dim">Prerequisite</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t border-dashed border-ghost-text-dim" />
            <span className="font-mono text-[10px] text-ghost-text-dim">Evidence Reuse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ghost-green/30 border border-ghost-green" />
            <span className="font-mono text-[10px] text-ghost-text-dim">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ghost-amber/30 border border-ghost-amber" />
            <span className="font-mono text-[10px] text-ghost-text-dim">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ghost-card border border-ghost-border" />
            <span className="font-mono text-[10px] text-ghost-text-dim">Locked</span>
          </div>
        </div>

        {/* SVG Graph */}
        <div className="glass rounded-lg p-4 overflow-x-auto animate-fadeIn">
          <svg
            viewBox="0 0 720 640"
            className="w-full min-w-[600px]"
            role="img"
            aria-label="Mission connection map showing dependencies between all 7 missions"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" opacity="0.6" />
              </marker>
              <marker
                id="arrowhead-dim"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#64748b" opacity="0.4" />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connections */}
            {CONNECTIONS.map((conn, idx) => {
              const fromPos = NODE_POSITIONS[conn.from];
              const toPos = NODE_POSITIONS[conn.to];
              const fromCompleted = state.missionProgress[conn.from]?.status === 'completed';
              const toCompleted = state.missionProgress[conn.to]?.status === 'completed';
              const isActive = fromCompleted;

              // Calculate control point for curved line
              const midX = (fromPos.x + toPos.x) / 2;
              const midY = (fromPos.y + toPos.y) / 2;
              const dx = toPos.x - fromPos.x;
              const dy = toPos.y - fromPos.y;
              const offsetX = -dy * 0.15;
              const offsetY = dx * 0.15;

              return (
                <g key={idx}>
                  <path
                    d={`M ${fromPos.x} ${fromPos.y} Q ${midX + offsetX} ${midY + offsetY} ${toPos.x} ${toPos.y}`}
                    fill="none"
                    stroke={isActive ? conn.color : '#1e2a3a'}
                    strokeWidth={isActive ? 2 : 1}
                    strokeDasharray={conn.dashed ? '6 4' : 'none'}
                    opacity={isActive ? 0.7 : 0.3}
                    markerEnd={isActive ? 'url(#arrowhead)' : 'url(#arrowhead-dim)'}
                  />
                  {/* Connection label */}
                  {isActive && (
                    <text
                      x={midX + offsetX}
                      y={midY + offsetY - 8}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize="8"
                      fill={conn.color}
                      opacity="0.8"
                    >
                      {conn.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Mission Nodes */}
            {MISSIONS.map((mission) => {
              const pos = NODE_POSITIONS[mission.id];
              const status = state.missionProgress[mission.id]?.status || 'locked';
              const handler = HANDLERS[mission.handler];
              const isCompleted = status === 'completed';
              const isAvailable = status === 'available' || status === 'active';

              return (
                <g key={mission.id} className="cursor-pointer">
                  {/* Glow effect for active/completed */}
                  {(isCompleted || isAvailable) && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="38"
                      fill="none"
                      stroke={isCompleted ? '#22c55e' : '#f59e0b'}
                      strokeWidth="1"
                      opacity="0.2"
                      filter="url(#glow)"
                    />
                  )}

                  {/* Main circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="32"
                    fill={isCompleted ? 'rgba(34,197,94,0.1)' : isAvailable ? 'rgba(245,158,11,0.1)' : '#111827'}
                    stroke={isCompleted ? '#22c55e' : isAvailable ? '#f59e0b' : '#1e2a3a'}
                    strokeWidth={isCompleted || isAvailable ? 2 : 1}
                  />

                  {/* Mission number */}
                  <text
                    x={pos.x}
                    y={pos.y - 6}
                    textAnchor="middle"
                    className="font-mono font-bold"
                    fontSize="14"
                    fill={isCompleted ? '#22c55e' : isAvailable ? '#f59e0b' : '#64748b'}
                  >
                    M{mission.number}
                  </text>

                  {/* Handler avatar */}
                  <text
                    x={pos.x}
                    y={pos.y + 12}
                    textAnchor="middle"
                    fontSize="12"
                  >
                    {handler.avatar}
                  </text>

                  {/* Title label below */}
                  <text
                    x={pos.x}
                    y={pos.y + 52}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize="8"
                    fill={isCompleted ? '#22c55e' : isAvailable ? '#e2e8f0' : '#64748b'}
                  >
                    {mission.title}
                  </text>

                  {/* Status icon */}
                  {isCompleted && (
                    <text x={pos.x + 24} y={pos.y - 20} fontSize="12">✅</text>
                  )}
                  {status === 'locked' && (
                    <text x={pos.x + 24} y={pos.y - 20} fontSize="10">🔒</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Evidence Flow Table */}
        <div className="mt-6 glass rounded-lg p-4 animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">📊</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-ghost-amber">EVIDENCE FLOW MATRIX</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-ghost-border">
                  <th className="text-left py-2 px-3 text-ghost-text-dim">Evidence</th>
                  <th className="text-left py-2 px-3 text-ghost-text-dim">Source</th>
                  <th className="text-left py-2 px-3 text-ghost-text-dim">Used In</th>
                  <th className="text-center py-2 px-3 text-ghost-text-dim">Status</th>
                </tr>
              </thead>
              <tbody>
                {MISSIONS.flatMap((m) =>
                  m.discoveredClues.map((clue) => {
                    const evidence = state.evidenceLocker.find((e) => e.id === clue.id);
                    return (
                      <tr key={clue.id} className="border-b border-ghost-border/50 hover:bg-ghost-card/50 transition-ghost">
                        <td className="py-2 px-3 text-ghost-text">{clue.label}</td>
                        <td className="py-2 px-3 text-ghost-text-muted">M{m.number}: {m.title}</td>
                        <td className="py-2 px-3">
                          {clue.usedIn.length > 0 ? (
                            clue.usedIn.map((id) => (
                              <span key={id} className="inline-block mr-1 px-1.5 py-0.5 rounded bg-ghost-amber/10 text-ghost-amber border border-ghost-amber/20 text-[10px]">
                                M{MISSIONS.find((mi) => mi.id === id)?.number}
                              </span>
                            ))
                          ) : (
                            <span className="text-ghost-text-dim">Final</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {evidence ? (
                            <span className="text-ghost-green">✅ {evidence.value}</span>
                          ) : (
                            <span className="text-ghost-text-dim">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
