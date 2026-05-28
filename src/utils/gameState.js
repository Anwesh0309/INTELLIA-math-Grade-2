// src/utils/gameState.js
// Handles gamification helpers and session persistence mapping

export const PERSIST_KEYS = [
  'currentPhase', 
  'learnSectionsViewed', 
  'stationsCompleted',
  'activeStation',
  'currentQuestionIndex', 
  'answers', 
  'xp', 
  'streak', 
  'maxStreak', 
  'starsEarned'
];

export function loadState() {
  try {
    const saved = sessionStorage.getItem('numbers_to_200_state');
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error('Failed to load session state', err);
    return null;
  }
}

export function saveState(state) {
  try {
    const toSave = {};
    PERSIST_KEYS.forEach(key => {
      if (state[key] !== undefined) {
        toSave[key] = state[key];
      }
    });
    sessionStorage.setItem('numbers_to_200_state', JSON.stringify(toSave));
  } catch (err) {
    console.error('Failed to save session state', err);
  }
}

export function clearState() {
  try {
    sessionStorage.removeItem('numbers_to_200_state');
  } catch (err) {
    console.error('Failed to clear session state', err);
  }
}

export function computeStars(accuracy) {
  if (accuracy >= 90) return 3;
  if (accuracy >= 70) return 2;
  if (accuracy >= 40) return 1;
  return 0;
}
