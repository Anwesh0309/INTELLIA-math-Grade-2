// src/components/ui/AudioToggle.jsx
import React from 'react';
import { useGameState } from '../../hooks/useGameState.js';

export const AudioToggle = () => {
  const { state, setAudio } = useGameState();
  const { audioEnabled } = state;

  return (
    <button
      onClick={() => setAudio(!audioEnabled)}
      className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center border ${
        audioEnabled
          ? 'bg-crystal-blue/20 border-crystal-blue/40 text-blue-400 shadow-glow-blue hover:bg-crystal-blue/30'
          : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800/60'
      }`}
      aria-label={audioEnabled ? "Mute audio" : "Unmute audio"}
      id="audio-toggle-btn"
    >
      {audioEnabled ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse-slow">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="22" y1="9" x2="16" y2="15"></line>
          <line x1="16" y1="9" x2="22" y2="15"></line>
        </svg>
      )}
    </button>
  );
};

export default AudioToggle;
