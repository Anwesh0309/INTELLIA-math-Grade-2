import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import IntroPhase from './components/phases/IntroPhase.jsx';
import WonderPhase from './components/phases/WonderPhase.jsx';
import LearnPhase from './components/phases/LearnPhase.jsx';
import SimulatePhase from './components/phases/SimulatePhase.jsx';
import PracticePhase from './components/phases/PracticePhase.jsx';
import ReflectPhase from './components/phases/ReflectPhase.jsx';
import AudioToggle from './components/ui/AudioToggle.jsx';
import PhaseNavigation from './components/ui/PhaseNavigation.jsx';
import XPCounter from './components/ui/XPCounter.jsx';
import { AnimatePresence } from 'framer-motion';

const PhaseRouter = () => {
  const { state } = useAppContext();
  const { currentPhase } = state;

  const renderPhase = () => {
    switch (currentPhase) {
      case 'intro': return <IntroPhase key="intro" />;
      case 'wonder': return <WonderPhase key="wonder" />;
      case 'learn': return <LearnPhase key="learn" />;
      case 'simulate': return <SimulatePhase key="simulate" />;
      case 'practice': return <PracticePhase key="practice" />;
      case 'reflect': return <ReflectPhase key="reflect" />;
      default: return <IntroPhase key="intro" />;
    }
  };

  const backgroundNumbers = [
    { num: '54', top: '5%', left: '10%', fontSize: 'text-4xl', opacity: 'opacity-10' },
    { num: '91', top: '10%', left: '25%', fontSize: 'text-6xl', opacity: 'opacity-[0.08]' },
    { num: '11', top: '8%', left: '32%', fontSize: 'text-5xl', opacity: 'opacity-10' },
    { num: '66', top: '12%', left: '38%', fontSize: 'text-5xl', opacity: 'opacity-[0.07]' },
    { num: '90', top: '5%', left: '48%', fontSize: 'text-4xl', opacity: 'opacity-[0.06]' },
    { num: '64', top: '3%', left: '60%', fontSize: 'text-5xl', opacity: 'opacity-10' },
    { num: '30', top: '8%', left: '72%', fontSize: 'text-6xl', opacity: 'opacity-[0.09]' },
    { num: '69', top: '5%', left: '80%', fontSize: 'text-4xl', opacity: 'opacity-10' },
    { num: '90', top: '10%', left: '90%', fontSize: 'text-7xl', opacity: 'opacity-[0.08]' },
    { num: '8', top: '40%', left: '5%', fontSize: 'text-6xl', opacity: 'opacity-10' },
    { num: '12', top: '50%', left: '15%', fontSize: 'text-5xl', opacity: 'opacity-[0.07]' },
    { num: '27', top: '80%', left: '20%', fontSize: 'text-6xl', opacity: 'opacity-[0.06]' },
    { num: '73', top: '75%', left: '80%', fontSize: 'text-5xl', opacity: 'opacity-10' },
    { num: '45', top: '60%', left: '90%', fontSize: 'text-6xl', opacity: 'opacity-[0.08]' },
  ];

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-[#211842] text-white font-sans relative">
      {/* Floating Background Numbers */}
      {backgroundNumbers.map((bn, i) => (
        <div 
          key={i} 
          className={`absolute font-black text-white ${bn.fontSize} ${bn.opacity} select-none pointer-events-none`}
          style={{ top: bn.top, left: bn.left, transform: 'rotate(-10deg)' }}
        >
          {bn.num}
        </div>
      ))}
      {/* Global Header */}
      <header className="relative w-full shrink-0 z-[60] flex items-center justify-between px-4 pt-4 pb-2 min-h-[72px]">
        {/* Home button top left */}
        <div className="pointer-events-auto z-20">
          <button 
            onClick={() => window.location.reload()}
            className="h-10 px-4 bg-[#1A1130]/90 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition shadow-lg border border-white/5 gap-2 font-bold text-sm backdrop-blur-md"
          >
            <span>🏠</span> Home
          </button>
        </div>

        {/* PhaseNavigation Centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <PhaseNavigation />
          </div>
        </div>

        {/* Close button top right */}
        <div className="pointer-events-auto z-20">
          <button 
            onClick={() => window.history.back()}
            className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center text-white hover:bg-blue-400 transition shadow-lg border border-blue-400/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>
      
      {/* XP Counter bottom left (fixed relative to screen) */}
      <div className="absolute bottom-4 left-4 z-[60]">
        <XPCounter />
      </div>
      
      {/* Audio Toggle bottom right (fixed relative to screen) */}
      <div className="absolute bottom-4 right-4 z-[60]">
        <AudioToggle />
      </div>

      {/* Main Scrollable Game Content */}
      <main className="flex-1 w-full relative overflow-y-auto overflow-x-hidden pt-4 pb-20">
        <AnimatePresence mode="wait">
          {renderPhase()}
        </AnimatePresence>
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <PhaseRouter />
    </AppProvider>
  );
}

export default App;
