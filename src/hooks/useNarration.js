// src/hooks/useNarration.js
import { useEffect } from 'react';
import { narrate, stopNarration } from '../utils/audio.js';
import { useAppContext } from '../context/AppContext.jsx';

export function useNarration(narrationFn, dependencies = []) {
  const { state } = useAppContext();
  const { audioEnabled } = state;

  useEffect(() => {
    if (audioEnabled && narrationFn) {
      const segments = typeof narrationFn === 'function' ? narrationFn() : narrationFn;
      narrate(segments, true);
    }
    return () => {
      stopNarration();
    };
  }, [audioEnabled, ...dependencies]);
}
