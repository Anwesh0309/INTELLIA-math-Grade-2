// src/hooks/useGameState.js
import { useAppContext } from '../context/AppContext.jsx';

export function useGameState() {
  const { state, dispatch } = useAppContext();
  
  const setPhase = (phase) => dispatch({ type: 'SET_PHASE', payload: phase });
  const viewLearnSection = (section) => dispatch({ type: 'VIEW_LEARN_SECTION', payload: section });
  const completeStation = (station) => dispatch({ type: 'COMPLETE_STATION', payload: station });
  const setAudio = (enabled) => dispatch({ type: 'SET_AUDIO_ENABLED', payload: enabled });
  const recordAnswer = (id, selected, isCorrect) => dispatch({ type: 'RECORD_ANSWER', payload: { id, selected, isCorrect } });
  const nextQuestion = () => dispatch({ type: 'NEXT_QUESTION' });
  const resetModule = () => dispatch({ type: 'RESET_STATE' });

  return {
    state,
    setPhase,
    viewLearnSection,
    completeStation,
    setAudio,
    recordAnswer,
    nextQuestion,
    resetModule
  };
}
