// src/components/phases/IntroPhase.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext, PHASES } from '../../context/AppContext.jsx';
import { useNarration } from '../../hooks/useNarration.js';
import { introNarration } from '../../utils/narration.js';

export const IntroPhase = () => {
  const { dispatch } = useAppContext();

  // Run intro vocal narration on start
  useNarration(introNarration);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center w-full h-full font-sans overflow-hidden"
    >
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-4">
        
        {/* Pill */}
        <div className="bg-[#3A2B66] rounded-full px-4 py-1.5 flex items-center gap-2 mb-6">
          <span className="text-[#FFC107] text-sm">✨</span>
          <span className="text-white text-xs font-medium tracking-wide">Singapore MOE Curriculum · Grade 2</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight text-center">
          Reading & Writing <span className="text-[#FFC107]">Numbers</span>
        </h1>

        {/* Character & Speech Bubble */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#FFB300] rounded-full flex items-center justify-center text-3xl shadow-lg border-2 border-white/10">
            🐻
          </div>
          <div className="relative bg-white text-[#333] px-5 py-3 rounded-2xl font-bold shadow-lg">
            Ready for a number adventure? 🎉
            {/* Speech bubble tail */}
            <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-white rotate-45"></div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-slate-300 text-sm md:text-base text-center max-w-xl mb-10 leading-relaxed font-medium">
          Join Wei Ming on a journey to read, write, and spell numbers 0–100 through stories, simulations, and fun games!
        </p>

        {/* Journey Card */}
        <div className="bg-[#30235C]/80 backdrop-blur-md rounded-2xl p-6 w-full max-w-3xl mb-8 border border-white/5 shadow-xl">
          <h3 className="text-[#FFC107] text-xs font-black text-center tracking-widest mb-6 uppercase">
            Your Learning Journey
          </h3>
          
          <div className="flex items-center justify-between w-full px-2">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#413175] flex items-center justify-center text-xl shadow-inner border border-white/10">
                  🔍
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-xs">Wonder</span>
                  <span className="text-slate-400 text-[10px]">Spark your curiosity</span>
                </div>
              </div>
            </div>

            <div className="text-slate-500 text-lg">→</div>

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#413175] flex items-center justify-center text-xl shadow-inner border border-white/10">
                  📖
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-xs">Story</span>
                  <span className="text-slate-400 text-[10px]">Hear the tale</span>
                </div>
              </div>
            </div>

            <div className="text-slate-500 text-lg">→</div>

            {/* Step 3 */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#413175] flex items-center justify-center text-xl shadow-inner border border-white/10">
                  🧪
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-xs">Simulate</span>
                  <span className="text-slate-400 text-[10px]">Explore & discover</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center w-full px-2 mt-6 gap-8">
            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#413175] flex items-center justify-center text-xl shadow-inner border border-white/10">
                  🎮
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-xs">Play</span>
                  <span className="text-slate-400 text-[10px]">Test your skills</span>
                </div>
              </div>
            </div>

            <div className="text-slate-500 text-lg">→</div>

            {/* Step 5 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#413175] flex items-center justify-center text-xl shadow-inner border border-white/10">
                  📓
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-xs">Reflect</span>
                  <span className="text-slate-400 text-[10px]">What did you learn?</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Begin Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch({ type: 'SET_PHASE', payload: PHASES.WONDER })}
          className="bg-[#FFC107] text-[#5A3E00] font-extrabold text-lg px-10 py-4 rounded-xl shadow-[0_4px_0_#D99C00] hover:shadow-[0_2px_0_#D99C00] hover:translate-y-[2px] transition-all flex items-center gap-2 mb-10"
        >
          <span>🚀</span> Begin Your Journey!
        </motion.button>

        {/* Bottom Cards */}
        <div className="flex items-center gap-6">
          <div className="bg-[#30235C]/60 backdrop-blur-sm rounded-2xl w-32 h-28 flex flex-col items-center justify-center gap-3 border border-white/5 hover:bg-[#30235C]/80 transition cursor-default">
            <div className="bg-[#413175] p-2 rounded-lg text-2xl shadow-inner">
              🔢
            </div>
            <span className="text-white text-xs font-medium">Count & Spell</span>
          </div>

          <div className="bg-[#30235C]/60 backdrop-blur-sm rounded-2xl w-32 h-28 flex flex-col items-center justify-center gap-3 border border-white/5 hover:bg-[#30235C]/80 transition cursor-default">
            <div className="bg-[#413175] p-2 rounded-lg text-2xl shadow-inner">
              🧱
            </div>
            <span className="text-white text-xs font-medium">Simulations</span>
          </div>

          <div className="bg-[#30235C]/60 backdrop-blur-sm rounded-2xl w-32 h-28 flex flex-col items-center justify-center gap-3 border border-white/5 hover:bg-[#30235C]/80 transition cursor-default">
            <div className="bg-[#413175] p-2 rounded-lg text-2xl shadow-inner">
              🏆
            </div>
            <span className="text-white text-xs font-medium">3 Game Worlds</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default IntroPhase;
