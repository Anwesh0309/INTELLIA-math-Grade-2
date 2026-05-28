// src/components/ui/PhaseNavigation.jsx
import React from 'react';
import { useGameState } from '../../hooks/useGameState.js';
import { PHASES } from '../../context/AppContext.jsx';

export const PhaseNavigation = () => {
  const { state, setPhase } = useGameState();
  const { currentPhase } = state;
  const learnSectionsViewed = Array.isArray(state?.learnSectionsViewed) ? state.learnSectionsViewed : [];
  const stationsCompleted = Array.isArray(state?.stationsCompleted) ? state.stationsCompleted : [];

  const phaseSequence = [
    { key: PHASES.WONDER, label: 'Wonder', icon: '🔍', num: '01' },
    { key: PHASES.LEARN, label: 'Story', icon: '📖', num: '02' },
    { key: PHASES.SIMULATE, label: 'Simulate', icon: '🧪', num: '03' },
    { key: PHASES.PRACTICE, label: 'Play', icon: '🎮', num: '04' },
    { key: PHASES.REFLECT, label: 'Reflect', icon: '📱', num: '05' },
  ];

  // Helper to determine if a phase is locked
  const isPhaseLocked = (phaseKey) => {
    if (phaseKey === PHASES.WONDER) return false;
    if (phaseKey === PHASES.LEARN) return false;
    if (phaseKey === PHASES.SIMULATE) {
      const required = ['3A', '3B', '3C', '3D'];
      return !required.every(sec => learnSectionsViewed.includes(sec));
    }
    if (phaseKey === PHASES.PRACTICE) {
      const required = ['station1', 'station2', 'station3'];
      return !required.every(st => stationsCompleted.includes(st));
    }
    if (phaseKey === PHASES.REFLECT) {
      return true;
    }
    return false;
  };

  const getPhaseIndex = (phaseKey) => phaseSequence.findIndex(p => p.key === phaseKey);
  const currentIndex = getPhaseIndex(currentPhase);

  // If we are in Intro, we might not show the navigation or just show it locked.
  // The screenshot shows the navigation pill at the top center.
  if (currentPhase === PHASES.INTRO) return null;

  return (
    <div className="flex items-center justify-center z-50" id="phase-navigation-container">
      <div className="bg-[#1A1130]/90 backdrop-blur-md rounded-full px-4 md:px-6 py-2.5 md:py-3 flex items-center gap-2 md:gap-3 border border-white/5 shadow-2xl">
        {phaseSequence.map((phase, index) => {
          const isActive = phase.key === currentPhase;
          const isCompleted = getPhaseIndex(phase.key) < currentIndex;
          const isLocked = isPhaseLocked(phase.key);
          
          return (
            <div key={phase.key} className="flex items-center">
              {/* Connector line */}
              {index > 0 && (
                <div className={`h-[2px] w-4 md:w-8 mx-2 transition-colors duration-500 ${
                  isCompleted ? 'bg-[#34D399]' : 'bg-slate-700/50'
                }`} />
              )}

              {/* Node Button */}
              <button
                onClick={() => {
                  if (!isLocked && !isActive && phase.key !== PHASES.REFLECT) {
                    setPhase(phase.key);
                  }
                }}
                disabled={isLocked || phase.key === PHASES.REFLECT}
                className="group relative flex items-center gap-2 transition-all duration-300 disabled:cursor-not-allowed"
                title={isLocked ? `${phase.label} is locked!` : `Go to ${phase.label}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                  isActive
                    ? 'bg-[#FFD100] text-black shadow-[0_0_10px_rgba(255,209,0,0.5)]'
                    : isCompleted
                    ? 'bg-[#34D399] text-black shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                    : 'bg-transparent border border-slate-600 text-slate-400'
                }`}>
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : phase.num}
                </div>
                
                <span className={`text-[11px] font-bold tracking-wider flex items-center gap-1 ${
                  isActive ? 'text-[#FFD100]' : isCompleted ? 'text-[#34D399]' : 'text-slate-500'
                }`}>
                  <span className="opacity-80">{phase.icon}</span> {phase.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhaseNavigation;
