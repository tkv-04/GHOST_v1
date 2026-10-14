/**
 * TRACE: Ghost Protocol — Game State Management
 * 
 * Manages player progress, evidence locker, scores, and hints
 * using React Context + localStorage for persistence.
 */

import { createContext, useContext, useReducer, useEffect } from 'react';
import { MISSIONS, ANSWER_KEY } from '../data/missions';

const GameContext = createContext(null);

const STORAGE_KEY = 'trace_ghost_protocol_state';

const initialState = {
  playerName: '',
  isRecruited: false,
  missionProgress: {},   // { 'mission-1': { status: 'locked'|'available'|'active'|'completed', attempts: 0, hintsUsed: [], score: 0, completedAt: null } }
  evidenceLocker: [],     // [{ id, label, description, value, fromMission, discoveredAt, notes }]
  totalScore: 0,
  totalPenalties: 0,
  startedAt: null,
  lastActivityAt: null,
  writeUp: '',
};

function initializeMissionProgress() {
  const progress = {};
  MISSIONS.forEach((mission) => {
    progress[mission.id] = {
      status: mission.prerequisites.length === 0 ? 'available' : 'locked',
      attempts: 0,
      hintsUsed: [],
      score: 0,
      completedAt: null,
      submittedAnswer: null,
    };
  });
  return progress;
}

function checkPrerequisites(missionId, missionProgress) {
  const mission = MISSIONS.find((m) => m.id === missionId);
  if (!mission) return false;
  return mission.prerequisites.every(
    (prereq) => missionProgress[prereq]?.status === 'completed'
  );
}

function updateUnlocks(progress) {
  const updated = { ...progress };
  MISSIONS.forEach((mission) => {
    if (updated[mission.id].status === 'locked') {
      if (checkPrerequisites(mission.id, updated)) {
        updated[mission.id] = { ...updated[mission.id], status: 'available' };
      }
    }
  });
  return updated;
}

function validateAnswer(missionId, answer) {
  const expected = ANSWER_KEY[missionId];
  if (!expected) return false;
  return answer.toLowerCase().trim() === expected.toLowerCase().trim();
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'RECRUIT_PLAYER': {
      const missionProgress = initializeMissionProgress();
      return {
        ...state,
        playerName: action.payload.name || 'Agent',
        isRecruited: true,
        missionProgress,
        startedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      };
    }

    case 'START_MISSION': {
      const { missionId } = action.payload;
      if (state.missionProgress[missionId]?.status !== 'available') return state;
      return {
        ...state,
        missionProgress: {
          ...state.missionProgress,
          [missionId]: {
            ...state.missionProgress[missionId],
            status: 'active',
          },
        },
        lastActivityAt: new Date().toISOString(),
      };
    }

    case 'SUBMIT_ANSWER': {
      const { missionId, answer } = action.payload;
      const mission = MISSIONS.find((m) => m.id === missionId);
      if (!mission) return state;

      const isCorrect = validateAnswer(missionId, answer);
      const currentProgress = state.missionProgress[missionId];
      const hintPenalty = currentProgress.hintsUsed.reduce((sum, idx) => {
        return sum + (mission.hints[idx]?.penalty || 0);
      }, 0);

      if (isCorrect) {
        const earnedScore = Math.max(0, mission.points - hintPenalty);
        let updatedProgress = {
          ...state.missionProgress,
          [missionId]: {
            ...currentProgress,
            status: 'completed',
            score: earnedScore,
            completedAt: new Date().toISOString(),
            submittedAnswer: answer.toLowerCase().trim(),
            attempts: currentProgress.attempts + 1,
          },
        };
        updatedProgress = updateUnlocks(updatedProgress);

        // Auto-add discovered clues to evidence locker
        const newEvidence = mission.discoveredClues.map((clue) => ({
          id: clue.id,
          label: clue.label,
          description: clue.description,
          value: answer.toLowerCase().trim(),
          fromMission: missionId,
          discoveredAt: new Date().toISOString(),
          notes: '',
          usedIn: clue.usedIn,
        }));

        return {
          ...state,
          missionProgress: updatedProgress,
          evidenceLocker: [...state.evidenceLocker, ...newEvidence],
          totalScore: state.totalScore + earnedScore,
          totalPenalties: state.totalPenalties + hintPenalty,
          lastActivityAt: new Date().toISOString(),
        };
      } else {
        return {
          ...state,
          missionProgress: {
            ...state.missionProgress,
            [missionId]: {
              ...currentProgress,
              attempts: currentProgress.attempts + 1,
              submittedAnswer: answer.toLowerCase().trim(),
            },
          },
          lastActivityAt: new Date().toISOString(),
        };
      }
    }

    case 'USE_HINT': {
      const { missionId, hintIndex } = action.payload;
      const currentProgress = state.missionProgress[missionId];
      if (currentProgress.hintsUsed.includes(hintIndex)) return state;

      return {
        ...state,
        missionProgress: {
          ...state.missionProgress,
          [missionId]: {
            ...currentProgress,
            hintsUsed: [...currentProgress.hintsUsed, hintIndex],
          },
        },
        lastActivityAt: new Date().toISOString(),
      };
    }

    case 'UPDATE_EVIDENCE_NOTES': {
      const { evidenceId, notes } = action.payload;
      return {
        ...state,
        evidenceLocker: state.evidenceLocker.map((e) =>
          e.id === evidenceId ? { ...e, notes } : e
        ),
        lastActivityAt: new Date().toISOString(),
      };
    }

    case 'ADD_CUSTOM_EVIDENCE': {
      return {
        ...state,
        evidenceLocker: [
          ...state.evidenceLocker,
          {
            ...action.payload,
            id: `custom-${Date.now()}`,
            discoveredAt: new Date().toISOString(),
          },
        ],
        lastActivityAt: new Date().toISOString(),
      };
    }

    case 'UPDATE_WRITEUP': {
      return {
        ...state,
        writeUp: action.payload,
        lastActivityAt: new Date().toISOString(),
      };
    }

    case 'RESET_GAME': {
      localStorage.removeItem(STORAGE_KEY);
      return { ...initialState };
    }

    case 'LOAD_STATE': {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialState, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load game state:', e);
    }
    return initialState;
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save game state:', e);
    }
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export function getMissionStatus(state, missionId) {
  return state.missionProgress[missionId]?.status || 'locked';
}

export function getCompletedMissionCount(state) {
  return Object.values(state.missionProgress).filter(
    (p) => p.status === 'completed'
  ).length;
}

export function getEvidenceForMission(state, missionId) {
  return state.evidenceLocker.filter((e) => e.fromMission === missionId);
}

export function getEvidenceById(state, clueId) {
  return state.evidenceLocker.find((e) => e.id === clueId);
}

export function getRequiredEvidence(state, missionId) {
  const mission = MISSIONS.find((m) => m.id === missionId);
  if (!mission) return [];
  return mission.evidenceRequired.map((req) => ({
    ...req,
    evidence: getEvidenceById(state, req.clueId),
    isSatisfied: !!getEvidenceById(state, req.clueId),
  }));
}

export function getMaxPossibleScore() {
  return MISSIONS.reduce((sum, m) => sum + m.points, 0);
}
