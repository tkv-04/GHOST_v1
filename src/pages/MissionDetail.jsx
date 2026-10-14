/**
 * TRACE: Ghost Protocol — Mission Detail Page
 * 
 * REDESIGNED: Question-based investigation, no answer leakage,
 * "Proceed to Next Mission" button after completion.
 */

import { useState, useEffect } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { MISSIONS, HANDLERS, DIFFICULTY_COLORS, CATEGORY_ICONS, ANSWER_KEY } from '../data/missions';

export default function MissionDetail() {
  const { missionId } = useParams();
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHints, setShowHints] = useState({});

  const mission = MISSIONS.find((m) => m.id === missionId);
  const progress = state.missionProgress[missionId];

  // Auto-activate mission on visit
  useEffect(() => {
    if (progress?.status === 'available') {
      dispatch({ type: 'START_MISSION', payload: { missionId } });
    }
  }, [missionId, progress?.status, dispatch]);

  if (!state.isRecruited) return <Navigate to="/" replace />;
  if (!mission) return <Navigate to="/missions" replace />;

  const handler = HANDLERS[mission.handler];
  const diffColor = DIFFICULTY_COLORS[mission.difficulty];
  const categoryIcon = CATEGORY_ICONS[mission.category];
  const isCompleted = progress?.status === 'completed';
  const isLocked = progress?.status === 'locked';

  if (isLocked) return <Navigate to="/missions" replace />;

  // Find the next mission in sequence
  const currentIndex = MISSIONS.findIndex((m) => m.id === missionId);
  const nextMission = currentIndex < MISSIONS.length - 1 ? MISSIONS[currentIndex + 1] : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    const correctAnswer = ANSWER_KEY[missionId];
    const isCorrect = answer.toLowerCase().trim() === correctAnswer?.toLowerCase().trim();

    dispatch({ type: 'SUBMIT_ANSWER', payload: { missionId, answer } });

    if (isCorrect) {
      setFeedback({ type: 'success', message: 'Flag accepted! Intelligence verified. ✅' });
    } else {
      setFeedback({ type: 'error', message: 'Incorrect. Re-examine your evidence and try again.' });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleHint = (index) => {
    if (progress.hintsUsed.includes(index)) {
      setShowHints((prev) => ({ ...prev, [index]: !prev[index] }));
      return;
    }
    const hint = mission.hints[index];
    if (window.confirm(`Use Hint ${index + 1}? This will cost ${hint.penalty} points from your score.`)) {
      dispatch({ type: 'USE_HINT', payload: { missionId, hintIndex: index } });
      setShowHints((prev) => ({ ...prev, [index]: true }));
    }
  };

  return (
    <div className="min-h-screen bg-ghost-dark pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 animate-fadeIn">
          <Link to="/missions" className="font-mono text-xs text-ghost-text-dim hover:text-ghost-amber transition-ghost">
            ← MISSION BOARD
          </Link>
          <span className="font-mono text-xs text-ghost-text-dim">/</span>
          <span className="font-mono text-xs text-ghost-amber">M{mission.number}</span>
        </div>

        {/* Mission Header */}
        <div className="glass rounded-lg p-6 mb-6 animate-fadeIn relative overflow-hidden">
          <div className={`absolute top-0 left-0 right-0 h-1 ${isCompleted ? 'bg-ghost-green' : 'bg-ghost-amber'}`} />
          
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-lg border ${handler.borderColor} ${handler.bgColor} flex items-center justify-center shrink-0`}>
                <span className="text-2xl">{handler.avatar}</span>
              </div>
              <div>
                <div className={`font-mono text-[10px] ${handler.color} tracking-wider mb-1`}>
                  HANDLER: {handler.name.toUpperCase()} • CODENAME: {handler.codename}
                </div>
                <h1 className="text-2xl font-bold text-ghost-text font-mono">
                  <span className="text-ghost-text-dim">M{mission.number}</span> — {mission.title}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded border text-xs font-mono ${diffColor}`}>
                {mission.difficulty}
              </span>
              <span className="px-2 py-1 rounded border border-ghost-border bg-ghost-card text-xs font-mono text-ghost-amber">
                {isCompleted ? progress.score : mission.points} PTS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-ghost-text-dim">
            <span>{categoryIcon} {mission.category}</span>
            {isCompleted && (
              <>
                <span>•</span>
                <span className="text-ghost-green">Completed ✅</span>
              </>
            )}
            {progress?.attempts > 0 && !isCompleted && (
              <>
                <span>•</span>
                <span className="text-ghost-red">{progress.attempts} attempt(s)</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Briefing */}
            <section className="glass rounded-lg p-6 animate-fadeIn" style={{ animationDelay: '100ms' }}>
              <SectionHeader icon="📋" label="CLASSIFIED BRIEFING" />
              <div className="whitespace-pre-line text-sm text-ghost-text-muted leading-relaxed">
                {mission.briefing}
              </div>
            </section>

            {/* Investigation Question */}
            <section className="glass-amber rounded-lg p-6 animate-fadeIn" style={{ animationDelay: '200ms' }}>
              <SectionHeader icon="❓" label="INVESTIGATION QUESTION" />
              <p className="text-sm text-ghost-text leading-relaxed whitespace-pre-line">{mission.question}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="font-mono text-[10px] text-ghost-text-dim tracking-wider">ANSWER FORMAT:</span>
                <span className="px-2 py-0.5 rounded bg-ghost-dark border border-ghost-border font-mono text-[10px] text-ghost-amber">
                  {mission.answerFormat}
                </span>
              </div>
            </section>

            {/* Flag Submission */}
            <section className="glass rounded-lg p-6 animate-fadeIn" style={{ animationDelay: '300ms' }}>
              <SectionHeader icon="🏁" label="FLAG SUBMISSION" />
              
              {isCompleted ? (
                <div className="space-y-4">
                  <div className="bg-ghost-green/5 border border-ghost-green/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-ghost-green text-lg">✅</span>
                      <span className="font-mono text-sm font-bold text-ghost-green">Mission Complete</span>
                    </div>
                    <p className="font-mono text-xs text-ghost-text-dim">
                      Submitted answer: <span className="text-ghost-text">{progress.submittedAnswer}</span>
                    </p>
                    <p className="font-mono text-xs text-ghost-text-dim mt-1">
                      Score: <span className="text-ghost-amber">{progress.score}</span> / {mission.points} pts
                      {progress.hintsUsed.length > 0 && ` (${progress.hintsUsed.length} hint(s) used)`}
                    </p>
                  </div>

                  {/* Epilogue for Mission 7 */}
                  {mission.epilogue && (
                    <div className="p-5 bg-ghost-amber/5 border border-ghost-amber/20 rounded-lg">
                      <div className="font-mono text-[10px] tracking-wider text-ghost-amber mb-3">CLASSIFIED EPILOGUE</div>
                      <div className="whitespace-pre-line text-xs text-ghost-text-muted leading-relaxed">
                        {mission.epilogue}
                      </div>
                    </div>
                  )}

                  {/* Proceed to Next Mission Button */}
                  {nextMission ? (
                    <button
                      onClick={() => navigate(`/mission/${nextMission.id}`)}
                      className="w-full py-3.5 rounded-lg font-mono text-sm font-bold tracking-wider uppercase bg-ghost-amber/10 text-ghost-amber border-2 border-ghost-amber/40 hover:bg-ghost-amber/20 hover:border-ghost-amber/60 active:scale-[0.98] transition-ghost animate-pulseGlow flex items-center justify-center gap-2"
                    >
                      <span>⚡</span>
                      PROCEED TO MISSION {nextMission.number}: {nextMission.title.toUpperCase()}
                      <span>→</span>
                    </button>
                  ) : (
                    <div className="text-center p-4 bg-ghost-amber/5 border border-ghost-amber/20 rounded-lg">
                      <span className="text-3xl block mb-2">🏆</span>
                      <p className="font-mono text-sm font-bold text-ghost-amber">INVESTIGATION COMPLETE</p>
                      <p className="font-mono text-xs text-ghost-text-dim mt-1">You've completed all missions. The Ghost Protocol is solved.</p>
                      <Link
                        to="/leaderboard"
                        className="inline-block mt-3 px-6 py-2 rounded font-mono text-xs tracking-wider bg-ghost-amber/10 text-ghost-amber border border-ghost-amber/30 hover:bg-ghost-amber/20 transition-ghost"
                      >
                        VIEW LEADERBOARD →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-ghost-amber text-sm">FLAG{'>'}</span>
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter your flag..."
                        className="w-full bg-ghost-dark border border-ghost-border rounded px-3 py-2.5 pl-14 font-mono text-sm text-ghost-text placeholder:text-ghost-text-dim/50 focus:border-ghost-amber focus:ring-1 focus:ring-ghost-amber/30 outline-none transition-ghost"
                        autoComplete="off"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!answer.trim()}
                      className="px-6 py-2.5 rounded font-mono text-xs font-bold tracking-wider uppercase bg-ghost-amber/10 text-ghost-amber border border-ghost-amber/30 hover:bg-ghost-amber/20 disabled:opacity-30 disabled:cursor-not-allowed transition-ghost"
                    >
                      SUBMIT
                    </button>
                  </div>

                  {feedback && (
                    <div className={`mt-3 p-3 rounded-lg border font-mono text-xs ${
                      feedback.type === 'success'
                        ? 'bg-ghost-green/5 border-ghost-green/20 text-ghost-green'
                        : 'bg-ghost-red/5 border-ghost-red/20 text-ghost-red'
                    }`}>
                      {feedback.message}
                    </div>
                  )}
                </form>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">


            {/* Hints */}
            <section className="glass rounded-lg p-4 animate-fadeIn" style={{ animationDelay: '250ms' }}>
              <SectionHeader icon="💡" label="INTEL HINTS" />
              <p className="text-[10px] font-mono text-ghost-text-dim mb-3">Using hints will reduce your mission score.</p>
              <div className="space-y-2">
                {mission.hints.map((hint, idx) => {
                  const isUsed = progress?.hintsUsed.includes(idx);
                  const isShown = showHints[idx];
                  return (
                    <div key={idx}>
                      <button
                        onClick={() => handleHint(idx)}
                        disabled={isCompleted && !isUsed}
                        className={`w-full text-left p-3 rounded border transition-ghost font-mono text-xs ${
                          isUsed
                            ? 'border-ghost-amber/20 bg-ghost-amber/5 hover:bg-ghost-amber/10'
                            : 'border-ghost-border bg-ghost-card hover:border-ghost-amber/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={isUsed ? 'text-ghost-amber' : 'text-ghost-text-muted'}>
                            {isUsed ? '🔓' : '🔒'} Hint {idx + 1}
                          </span>
                          <span className="text-ghost-red">-{hint.penalty} pts</span>
                        </div>
                      </button>
                      {isUsed && isShown && (
                        <div className="mt-1 p-3 rounded bg-ghost-amber/5 border border-ghost-amber/10 text-xs text-ghost-text-muted italic">
                          "{hint.text}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Discovered Clues (only after completion) */}
            {isCompleted && mission.discoveredClues.length > 0 && (
              <section className="glass rounded-lg p-4 animate-fadeIn" style={{ animationDelay: '350ms' }}>
                <SectionHeader icon="🗝️" label="DISCOVERED EVIDENCE" />
                <div className="space-y-2">
                  {mission.discoveredClues.map((clue) => {
                    const evidence = state.evidenceLocker.find((e) => e.id === clue.id);
                    return (
                      <div key={clue.id} className="p-3 rounded border border-ghost-green/20 bg-ghost-green/5">
                        <div className="font-mono text-xs text-ghost-green mb-1">{clue.label}</div>
                        <div className="font-mono text-xs text-ghost-text-dim">{clue.description}</div>
                        {evidence && (
                          <div className="font-mono text-xs text-ghost-amber mt-1">
                            Saved: {evidence.value}
                          </div>
                        )}
                        {clue.usedIn.length > 0 && (
                          <div className="font-mono text-[10px] text-ghost-text-dim mt-1">
                            Needed in: {clue.usedIn.map((id) => `M${MISSIONS.find((m) => m.id === id)?.number}`).join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Intel note about connection */}
            {mission.connectionToNext && !isCompleted && (
              <section className="glass rounded-lg p-4 animate-fadeIn" style={{ animationDelay: '450ms' }}>
                <SectionHeader icon="⚠️" label="INTEL NOTE" />
                <p className="text-xs text-ghost-text-dim font-mono italic">"{mission.connectionToNext}"</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-sm">{icon}</span>
      <span className="font-mono text-[10px] tracking-[0.2em] text-ghost-amber">{label}</span>
    </div>
  );
}
