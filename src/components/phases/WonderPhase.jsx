// src/components/phases/WonderPhase.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState.js';
import { useNarration } from '../../hooks/useNarration.js';
import { wonderNarration } from '../../utils/narration.js';
import { NumbCharacter } from '../ui/NumbCharacter.jsx';
import { PHASES } from '../../context/AppContext.jsx';

export const WonderPhase = () => {
  const { setPhase } = useGameState();

  // Run wonder vocal narration
  useNarration(wonderNarration);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full h-full flex flex-col items-center justify-center font-sans overflow-hidden bg-transparent"
      id="wonder-phase-container"
    >
      {/* Background Floating Emojis */}
      <div className="absolute inset-0 pointer-events-none opacity-30 select-none overflow-hidden">
        <div className="absolute top-[15%] left-[10%] text-3xl opacity-50 transform -rotate-12">👋🏽</div>
        <div className="absolute top-[20%] right-[25%] text-2xl opacity-40">🎪</div>
        <div className="absolute top-[65%] left-[15%] text-4xl opacity-30">🎪</div>
        <div className="absolute top-[35%] right-[10%] text-3xl opacity-50 transform rotate-12">👋🏽</div>
        <div className="absolute top-[50%] right-[15%] text-4xl opacity-40 transform -rotate-12">👋🏽</div>
        <div className="absolute bottom-[5%] left-[30%] text-2xl opacity-30">🎪</div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center max-w-3xl w-full px-4 my-auto">
        
        {/* Top Character Cluster */}
        <div className="flex flex-col items-center relative mb-4">
          {/* Question mark bubble */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-20 h-20 md:w-24 md:h-24 bg-[#8B74FE] rounded-full flex items-center justify-center text-white text-4xl md:text-5xl font-black shadow-lg shadow-indigo-500/30 z-0 relative top-4"
          >
            ?
          </motion.div>
          
          {/* Bear Icon */}
          <div className="w-16 h-16 bg-[#FFC107] rounded-full flex items-center justify-center text-3xl z-10 shadow-lg border-4 border-[#211842]">
            🐻
          </div>
          
          {/* Speech Bubble */}
          <div className="mt-2 bg-white text-slate-900 px-6 py-2.5 rounded-2xl text-base md:text-lg font-black shadow-xl relative z-10">
            Hmm... I wonder... 🤔
            {/* Speech bubble arrow */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
          </div>
        </div>

        {/* Central Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full bg-[#30235C]/90 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 flex flex-col items-center text-center shadow-2xl mb-6"
        >
          <div className="text-5xl md:text-6xl mb-4">👋</div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 max-w-2xl drop-shadow-md">
            How many <span className="text-[#FFD100] underline decoration-amber-400/50">fingers</span> do you have on both hands? Can you count by <span className="text-[#FFD100] underline decoration-amber-400/50">fives to 100</span>?
          </h2>
          <p className="text-slate-200 text-base md:text-xl italic font-extrabold">
            Your fingers are the best counting tool ever!
          </p>
        </motion.div>

        {/* Bottom Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPhase(PHASES.LEARN)}
          className="bg-gradient-to-r from-[#7C5DF9] to-[#9277FF] hover:from-[#6c4be0] hover:to-[#8165f0] text-white font-black text-xl md:text-2xl px-12 py-4 rounded-full shadow-xl shadow-indigo-500/40 flex items-center gap-3 transition-all cursor-pointer border border-white/20"
        >
          <span>✨ Let's Discover! ✨</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default WonderPhase;
