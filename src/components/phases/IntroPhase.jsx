// src/components/phases/IntroPhase.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext, PHASES } from '../../context/AppContext.jsx';

export const IntroPhase = () => {
  const { dispatch } = useAppContext();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full h-full flex flex-col items-center justify-center font-sans overflow-hidden py-2"
    >
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-4 my-auto">

        {/* Pill */}
        <div className="bg-[#3A2B66] rounded-full px-5 py-2 flex items-center gap-2 mb-4 border border-white/10 shadow-lg">
          <span className="text-[#FFC107] text-base">✨</span>
          <span className="text-white text-xs md:text-sm font-extrabold tracking-wide uppercase">MOE Curriculum · Grade 2</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight text-center leading-tight drop-shadow-lg">
          Reading & Writing Numbers
        </h1>

        {/* Character & Speech Bubble */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-[#FFB300] rounded-full flex items-center justify-center text-3xl shadow-lg border-2 border-white/20 shrink-0">
            🐻
          </div>
          <div className="relative bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-base md:text-lg shadow-xl">
            Ready for a number adventure? 🎉
            {/* Speech bubble tail */}
            <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-white rotate-45"></div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-slate-200 text-base md:text-lg text-center max-w-2xl mb-6 leading-relaxed font-bold">
          Join Alex on a journey to read, write, and spell numbers up to 1,000 through stories, simulations, and fun games!
        </p>

        {/* Journey Card */}
        <div className="bg-[#30235C]/90 backdrop-blur-md rounded-2xl p-5 md:p-6 w-full max-w-3xl mb-6 border border-white/10 shadow-2xl">
          <h3 className="text-[#FFC107] text-xs md:text-sm font-black text-center tracking-widest mb-4 uppercase">
            Your Learning Journey
          </h3>

          <div className="flex items-center justify-between w-full px-2">

            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#413175] flex items-center justify-center text-xl md:text-2xl shadow-inner border border-white/10">
                  🔍
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-black text-sm md:text-base">Wonder</span>
                  <span className="text-slate-300 text-[11px] font-semibold">Spark curiosity</span>
                </div>
              </div>
            </div>

            <div className="text-amber-400 font-bold text-xl px-1">→</div>

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#413175] flex items-center justify-center text-xl md:text-2xl shadow-inner border border-white/10">
                  📖
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-black text-sm md:text-base">Story</span>
                  <span className="text-slate-300 text-[11px] font-semibold">Hear the tale</span>
                </div>
              </div>
            </div>

            <div className="text-amber-400 font-bold text-xl px-1">→</div>

            {/* Step 3 */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#413175] flex items-center justify-center text-xl md:text-2xl shadow-inner border border-white/10">
                  🧪
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-black text-sm md:text-base">Simulate</span>
                  <span className="text-slate-300 text-[11px] font-semibold">Explore & discover</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center w-full px-2 mt-4 gap-6 md:gap-10">
            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#413175] flex items-center justify-center text-xl md:text-2xl shadow-inner border border-white/10">
                  🎮
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-black text-sm md:text-base">Practice</span>
                  <span className="text-slate-300 text-[11px] font-semibold">Test your skills</span>
                </div>
              </div>
            </div>

            <div className="text-amber-400 font-bold text-xl">→</div>

            {/* Step 5 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#413175] flex items-center justify-center text-xl md:text-2xl shadow-inner border border-white/10">
                  📱
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-black text-sm md:text-base">Reflect</span>
                  <span className="text-slate-300 text-[11px] font-semibold">What did you learn?</span>
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
          className="bg-[#FFC107] text-[#4A3200] font-black text-xl md:text-2xl px-12 py-4 rounded-2xl shadow-[0_5px_0_#D99C00] hover:shadow-[0_2px_0_#D99C00] hover:translate-y-[2px] transition-all flex items-center gap-3 mb-6 cursor-pointer"
        >
          <span>🚀</span> Begin Your Journey!
        </motion.button>

        {/* Bottom Cards */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="bg-[#30235C]/80 backdrop-blur-sm rounded-2xl px-5 py-3 flex items-center gap-3 border border-white/10 shadow-lg">
            <div className="bg-[#413175] p-2 rounded-xl text-2xl shadow-inner">
              🔢
            </div>
            <span className="text-white text-xs md:text-sm font-black">Count & Spell</span>
          </div>

          <div className="bg-[#30235C]/80 backdrop-blur-sm rounded-2xl px-5 py-3 flex items-center gap-3 border border-white/10 shadow-lg">
            <div className="bg-[#413175] p-2 rounded-xl text-2xl shadow-inner">
              🧱
            </div>
            <span className="text-white text-xs md:text-sm font-black">Interactive Sims</span>
          </div>

          <div className="bg-[#30235C]/80 backdrop-blur-sm rounded-2xl px-5 py-3 flex items-center gap-3 border border-white/10 shadow-lg">
            <div className="bg-[#413175] p-2 rounded-xl text-2xl shadow-inner">
              🏆
            </div>
            <span className="text-white text-xs md:text-sm font-black">3 Game Worlds</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default IntroPhase;
