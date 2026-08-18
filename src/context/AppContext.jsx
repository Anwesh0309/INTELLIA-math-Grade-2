// src/context/AppContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { generateQuestionBank } from '../utils/questionBank.js';
import { loadState, saveState, clearState, computeStars } from '../utils/gameState.js';
import { setAudioEnabled } from '../utils/audio.js';

const AppContext = createContext();

export const PHASES = {
  INTRO: 'intro',
  WONDER: 'wonder',
  LEARN: 'learn',
  SIMULATE: 'simulate',
  PRACTICE: 'practice',
  REFLECT: 'reflect'
};

const VALID_TRANSITIONS = {
  [PHASES.INTRO]: [PHASES.WONDER],
  [PHASES.WONDER]: [PHASES.LEARN],
  [PHASES.LEARN]: [PHASES.SIMULATE],
  [PHASES.SIMULATE]: [PHASES.PRACTICE],
  [PHASES.PRACTICE]: [PHASES.REFLECT],
  [PHASES.REFLECT]: [PHASES.INTRO]
};

const initialState = {
  currentPhase: PHASES.INTRO,
  learnSectionsViewed: [],          // ['3A', '3B', '3C', '3D']
  stationsCompleted: [],            // ['station1', 'station2', 'station3']
  activeStation: null,              // 'station1' | 'station2' | 'station3' | null
  audioEnabled: true,
  currentlyPlaying: null,
  
  // Practice Engine
  questionBank: [],                 
  currentQuestionIndex: 0,
  answers: {},                      // { questionId: { selected, correct, isCorrect, timestamp } }
  sessionScore: 0,
  totalQuestions: 100,
  lastAnswerCorrect: null,

  // Gamification
  xp: 0,
  streak: 0,
  maxStreak: 0,
  starsEarned: 0,

  // Platform
  studentId: 'student_123',
  moduleId: 'numbers-to-200-v1',
};

function appReducer(state, action) {
  let newState = state;

  switch (action.type) {
    case 'SET_PHASE': {
      const nextPhase = action.payload;

      newState = { 
        ...state, 
        currentPhase: nextPhase,
        // Reset active station when changing phases or returning to simulate
        ...(nextPhase === PHASES.SIMULATE ? { activeStation: null } : {}),
        // If entering Practice, initialize the deterministic question bank
        ...(nextPhase === PHASES.PRACTICE ? {
          questionBank: state.questionBank.length > 0 ? state.questionBank : generateQuestionBank(42), // seed 42
          currentQuestionIndex: 0,
          answers: {},
          sessionScore: 0,
          lastAnswerCorrect: null,
        } : {})
      };
      break;
    }

    case 'VIEW_LEARN_SECTION': {
      const section = action.payload;
      if (state.learnSectionsViewed.includes(section)) return state;
      newState = {
        ...state,
        learnSectionsViewed: [...state.learnSectionsViewed, section],
        xp: state.xp + 10 // Award 10 XP for reading section
      };
      break;
    }

    case 'COMPLETE_STATION': {
      const station = action.payload;
      const completed = Array.isArray(state.stationsCompleted) ? state.stationsCompleted : [];
      if (completed.includes(station)) return state;
      newState = {
        ...state,
        stationsCompleted: [...completed, station],
        xp: (state.xp || 0) + 50 // Award 50 XP for completing simulation station
      };
      break;
    }

    case 'SET_ACTIVE_STATION': {
      newState = {
        ...state,
        activeStation: action.payload
      };
      break;
    }

    case 'SET_AUDIO_ENABLED': {
      const enabled = action.payload;
      setAudioEnabled(enabled);
      newState = {
        ...state,
        audioEnabled: enabled
      };
      break;
    }

    case 'RECORD_ANSWER': {
      const { id, selected, isCorrect } = action.payload;
      
      const newAnswers = {
        ...state.answers,
        [id]: { selected, correct: state.questionBank[state.currentQuestionIndex].correct, isCorrect, timestamp: new Date().toISOString() }
      };

      const newScore = isCorrect ? state.sessionScore + 1 : state.sessionScore;
      const newStreak = isCorrect ? state.streak + 1 : 0;
      const newMaxStreak = Math.max(state.maxStreak, newStreak);
      const newXP = isCorrect ? state.xp + 15 : state.xp + 2; // 15 XP for correct, 2 XP for effort

      newState = {
        ...state,
        answers: newAnswers,
        sessionScore: newScore,
        streak: newStreak,
        maxStreak: newMaxStreak,
        xp: newXP,
        lastAnswerCorrect: isCorrect
      };
      break;
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentQuestionIndex + 1;
      if (nextIndex >= state.totalQuestions) {
        // Module finished, transition to reflect phase
        const accuracy = (state.sessionScore / state.totalQuestions) * 100;
        newState = {
          ...state,
          currentPhase: PHASES.REFLECT,
          starsEarned: computeStars(accuracy)
        };
      } else {
        newState = {
          ...state,
          currentQuestionIndex: nextIndex,
          lastAnswerCorrect: null
        };
      }
      break;
    }

    case 'INCREMENT_XP': {
      newState = {
        ...state,
        xp: state.xp + action.payload
      };
      break;
    }

    case 'LOAD_SAVED_STATE': {
      newState = {
        ...state,
        ...action.payload
      };
      break;
    }

    case 'RESET_STATE': {
      clearState();
      newState = {
        ...initialState,
        currentPhase: PHASES.INTRO,
        questionBank: [],
        currentQuestionIndex: 0,
        answers: {},
        learnSectionsViewed: [],
        stationsCompleted: [],
        activeStation: null,
        xp: 0,
        streak: 0,
        maxStreak: 0,
        starsEarned: 0
      };
      break;
    }

    default:
      return state;
  }

  // Save to session storage
  saveState(newState);
  return newState;
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state on start
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      dispatch({ type: 'LOAD_SAVED_STATE', payload: saved });
      setAudioEnabled(saved.audioEnabled !== undefined ? saved.audioEnabled : true);
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
