/**
 * TRACE: Ghost Protocol — Evidence Locker
 * 
 * Displays all discovered clues with source details, analyst notes,
 * and cross-mission references.
 */

import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { MISSIONS, HANDLERS } from '../data/missions';

export default function EvidenceLocker() {
  const { state, dispatch } = useGame();
  const [filter, setFilter] = useState('all');
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customEvidence, setCustomEvidence] = useState({ label: '', description: '', value: '', notes: '' });

  if (!state.isRecruited) return <Navigate to="/" replace />;

  const evidence = state.evidenceLocker;
  const filtered = filter === 'all' ? evidence : evidence.filter((e) => e.fromMission === filter);

  const handleSaveNote = (evidenceId) => {
    dispatch({ type: 'UPDATE_EVIDENCE_NOTES', payload: { evidenceId, notes: noteText } });
    setEditingNote(null);
    setNoteText('');
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customEvidence.label.trim()) return;
    dispatch({
      type: 'ADD_CUSTOM_EVIDENCE',
      payload: {
        label: customEvidence.label,
        description: customEvidence.description,
        value: customEvidence.value,
        notes: customEvidence.notes,
        fromMission: 'custom',
        usedIn: [],
      },
    });
    setCustomEvidence({ label: '', description: '', value: '', notes: '' });
    setShowAddCustom(false);
  };

  return (
    <div className="min-h-screen bg-ghost-dark pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ghost-amber animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-ghost-amber uppercase">Intelligence Archive</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-ghost-text font-mono tracking-tight">Evidence Locker</h1>
              <p className="text-sm text-ghost-text-muted mt-1">
                {evidence.length} item{evidence.length !== 1 ? 's' : ''} collected across your investigation.
              </p>
            </div>
            <button
              onClick={() => setShowAddCustom(!showAddCustom)}
              className="px-4 py-2 rounded font-mono text-xs tracking-wider border border-ghost-border bg-ghost-card hover:border-ghost-amber/30 hover:text-ghost-amber text-ghost-text-muted transition-ghost"
            >
              + ADD NOTE
            </button>
          </div>
        </div>

        {/* Add custom evidence form */}
        {showAddCustom && (
          <div className="glass rounded-lg p-4 mb-6 animate-fadeIn">
            <div className="font-mono text-[10px] tracking-wider text-ghost-amber mb-3">ADD CUSTOM EVIDENCE NOTE</div>
            <form onSubmit={handleAddCustom} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={customEvidence.label}
                onChange={(e) => setCustomEvidence({ ...customEvidence, label: e.target.value })}
                placeholder="Evidence label..."
                className="bg-ghost-dark border border-ghost-border rounded px-3 py-2 font-mono text-xs text-ghost-text placeholder:text-ghost-text-dim/50 focus:border-ghost-amber outline-none"
                required
              />
              <input
                type="text"
                value={customEvidence.value}
                onChange={(e) => setCustomEvidence({ ...customEvidence, value: e.target.value })}
                placeholder="Value / URL..."
                className="bg-ghost-dark border border-ghost-border rounded px-3 py-2 font-mono text-xs text-ghost-text placeholder:text-ghost-text-dim/50 focus:border-ghost-amber outline-none"
              />
              <textarea
                value={customEvidence.notes}
                onChange={(e) => setCustomEvidence({ ...customEvidence, notes: e.target.value })}
                placeholder="Your analysis notes..."
                rows={2}
                className="sm:col-span-2 bg-ghost-dark border border-ghost-border rounded px-3 py-2 font-mono text-xs text-ghost-text placeholder:text-ghost-text-dim/50 focus:border-ghost-amber outline-none resize-none"
              />
              <div className="sm:col-span-2 flex gap-2">
                <button type="submit" className="px-4 py-2 rounded font-mono text-xs bg-ghost-amber/10 text-ghost-amber border border-ghost-amber/30 hover:bg-ghost-amber/20 transition-ghost">
                  SAVE
                </button>
                <button type="button" onClick={() => setShowAddCustom(false)} className="px-4 py-2 rounded font-mono text-xs text-ghost-text-dim hover:text-ghost-text transition-ghost">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <FilterChip label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
          {MISSIONS.map((m) => {
            const hasEvidence = evidence.some((e) => e.fromMission === m.id);
            if (!hasEvidence) return null;
            return (
              <FilterChip
                key={m.id}
                label={`M${m.number}`}
                active={filter === m.id}
                onClick={() => setFilter(m.id)}
              />
            );
          })}
          {evidence.some((e) => e.fromMission === 'custom') && (
            <FilterChip label="Notes" active={filter === 'custom'} onClick={() => setFilter('custom')} />
          )}
        </div>

        {/* Evidence Grid */}
        {filtered.length === 0 ? (
          <div className="glass rounded-lg p-12 text-center animate-fadeIn">
            <span className="text-4xl mb-4 block">🗄️</span>
            <p className="font-mono text-sm text-ghost-text-dim">
              {evidence.length === 0
                ? 'No evidence collected yet. Complete missions to build your case file.'
                : 'No evidence matches this filter.'}
            </p>
            {evidence.length === 0 && (
              <Link to="/missions" className="inline-block mt-4 px-4 py-2 rounded font-mono text-xs text-ghost-amber border border-ghost-amber/30 hover:bg-ghost-amber/10 transition-ghost">
                Go to Missions →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item, idx) => {
              const mission = MISSIONS.find((m) => m.id === item.fromMission);
              const handler = mission ? HANDLERS[mission.handler] : null;
              const isEditing = editingNote === item.id;

              return (
                <div
                  key={item.id}
                  className="glass rounded-lg p-4 border border-ghost-border hover:border-ghost-amber/30 transition-ghost animate-fadeIn"
                  style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {handler ? (
                        <div className={`w-6 h-6 rounded border ${handler.borderColor} ${handler.bgColor} flex items-center justify-center`}>
                          <span className="text-xs">{handler.avatar}</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded border border-ghost-border bg-ghost-card flex items-center justify-center">
                          <span className="text-xs">📝</span>
                        </div>
                      )}
                      <div>
                        <div className="font-mono text-xs font-bold text-ghost-text">{item.label}</div>
                        <div className="font-mono text-[10px] text-ghost-text-dim">
                          {mission ? `Mission ${mission.number}` : 'Custom Note'} • {new Date(item.discoveredAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {item.usedIn?.length > 0 && (
                      <div className="flex gap-1">
                        {item.usedIn.map((mid) => (
                          <span key={mid} className="px-1.5 py-0.5 rounded bg-ghost-amber/10 font-mono text-[9px] text-ghost-amber border border-ghost-amber/20">
                            →M{MISSIONS.find((m) => m.id === mid)?.number}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-ghost-text-dim mb-2">{item.description}</p>

                  {/* Value */}
                  <div className="p-2 rounded bg-ghost-dark border border-ghost-border mb-3">
                    <div className="font-mono text-[10px] text-ghost-text-dim mb-1">VALUE</div>
                    <div className="font-mono text-sm text-ghost-amber break-all">{item.value}</div>
                  </div>

                  {/* Notes */}
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        rows={3}
                        className="w-full bg-ghost-dark border border-ghost-amber/30 rounded px-3 py-2 font-mono text-xs text-ghost-text focus:border-ghost-amber outline-none resize-none"
                        placeholder="Add your analysis..."
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleSaveNote(item.id)} className="px-3 py-1 rounded font-mono text-[10px] bg-ghost-amber/10 text-ghost-amber border border-ghost-amber/30 hover:bg-ghost-amber/20 transition-ghost">
                          SAVE
                        </button>
                        <button onClick={() => setEditingNote(null)} className="px-3 py-1 rounded font-mono text-[10px] text-ghost-text-dim hover:text-ghost-text transition-ghost">
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {item.notes ? (
                        <div className="p-2 rounded bg-ghost-amber/5 border border-ghost-amber/10 mb-2">
                          <div className="font-mono text-[10px] text-ghost-amber mb-1">ANALYST NOTES</div>
                          <p className="text-xs text-ghost-text-muted">{item.notes}</p>
                        </div>
                      ) : null}
                      <button
                        onClick={() => { setEditingNote(item.id); setNoteText(item.notes || ''); }}
                        className="font-mono text-[10px] text-ghost-text-dim hover:text-ghost-amber transition-ghost"
                      >
                        {item.notes ? '✏️ Edit Notes' : '+ Add Notes'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full font-mono text-xs tracking-wider border transition-ghost ${
        active
          ? 'bg-ghost-amber/10 text-ghost-amber border-ghost-amber/30'
          : 'text-ghost-text-dim border-ghost-border hover:border-ghost-amber/20 hover:text-ghost-text'
      }`}
    >
      {label}
    </button>
  );
}
