// src/components/phases/LearnPhase.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState.js';
import { useNarration } from '../../hooks/useNarration.js';
import { PHASES } from '../../context/AppContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';

export const LearnPhase = () => {
  const { state, setPhase, viewLearnSection } = useGameState();
  const { audioEnabled } = state;
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "Counting at the Playground",
      text: "One morning, Alex ran to the school playground. His friends were playing hopscotch! He counted the squares: 1, 2, 3... all the way to 10. \"Counting is fun!\" he laughed.",
      highlight: "✨ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10! ✨",
      characterMsg: "Let's count with Wei Ming! 🔢",
      image: "/assets/images/story_playground.png",
      key: '3A'
    },
    {
      title: "Math Blocks in Class",
      text: "Back in the classroom, the teacher brought out colorful math blocks. \"Let's count higher!\" she said. Wei Ming grouped them into tens and ones, counting carefully: 10, 20, 30... 100!",
      highlight: "✨ 10, 20, 30, ... 100! ✨",
      characterMsg: "Blocks make counting easy! 🧱",
      image: "/assets/images/story_classroom.png",
      key: '3B'
    },
    {
      title: "Discovering Place Value",
      text: "Alex noticed something magical. One big flat square is exactly 100 little cubes! \"So if I have one flat and two rods... that's 120!\" he cheered. Understanding place value unlocked a whole new world.",
      highlight: "✨ 1 Hundred + 2 Tens = 120 ✨",
      characterMsg: "Place value is like a secret code! 🕵️‍♂️",
      image: "/assets/images/story_classroom.png",
      key: '3C'
    },
    {
      title: "Reading Big Numbers",
      text: "Now Alex could read any number! When he saw 145, he confidently read out: 'One hundred and forty-five'. He was ready for the simulation cave to practice his new skills.",
      highlight: "✨ One hundred and forty-five ✨",
      characterMsg: "You're a counting master! 🏆",
      image: "/assets/images/story_playground.png",
      key: '3D'
    }
  ];

  // Trigger viewing state for current page
  useEffect(() => {
    viewLearnSection(pages[currentPage].key);
  }, [currentPage]);

  // Read narration when page or audioEnabled changes
  useEffect(() => {
    if (audioEnabled) {
      narrate([{ text: pages[currentPage].text, style: 'statement' }], true);
    } else {
      stopNarration();
    }
    return () => {
      stopNarration();
    };
  }, [currentPage, audioEnabled]);

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      setPhase(PHASES.SIMULATE);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const page = pages[currentPage];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full h-full flex flex-col items-center justify-center font-sans overflow-hidden py-4"
    >
      {/* Container for the story card matching screenshot */}
      <div className="w-full max-w-4xl px-4 flex flex-col items-center my-auto gap-4">

        {/* Top Progress Bar & Counter */}
        <div className="w-full flex items-center gap-4 px-1">
          <div className="flex-1 h-2.5 bg-[#2B1D52] rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
            />
          </div>
          <span className="text-amber-300 text-sm md:text-base font-black shrink-0">
            {currentPage + 1} / {pages.length}
          </span>
        </div>

        {/* Main Story Card (Horizontal Split Layout) */}
        <div className="w-full bg-[#1C1438]/95 border border-white/10 rounded-[28px] overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">

          {/* Left Image Section */}
          <div className="relative w-full h-56 md:h-auto min-h-[240px] md:min-h-[320px] overflow-hidden bg-[#2B1D52]">
            <img
              src={page.image}
              alt={page.title}
              className="w-full h-full object-cover"
            />
            {/* Subtle inner shadow overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1C1438]/20 pointer-events-none"></div>
          </div>

          {/* Right Content Section */}
          <div className="p-6 md:p-8 flex flex-col justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#FFD100] mb-3 tracking-tight leading-tight">
                {page.title}
              </h2>
              <p className="text-slate-100 text-base md:text-lg lg:text-xl leading-relaxed font-black">
                {page.text}
              </p>
            </div>

            {/* Highlighted text pill */}
            <div className="w-full bg-[#251A49] rounded-2xl py-3.5 px-4 flex items-center justify-center border border-amber-400/30 shadow-inner">
              <span className="font-black text-[#FFD100] tracking-wide text-base md:text-lg lg:text-xl text-center">
                {page.highlight}
              </span>
            </div>

            {/* Character Speech Bubble */}
            <div className="flex items-center gap-3 relative mt-1">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FFB300] rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-lg flex-shrink-0 border-2 border-white/20">
                🐻
              </div>
              <div className="bg-white text-slate-900 px-4 py-2.5 rounded-2xl text-sm md:text-base font-black shadow-md relative">
                {page.characterMsg}
                {/* Pointer arrow */}
                <div className="absolute top-1/2 -left-1.5 transform -translate-y-1/2 w-3 h-3 bg-white rotate-45"></div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Navigation */}
        <div className="w-full flex items-center justify-between px-2 mt-1">
          {/* Back Button */}
          <button
            onClick={handleBack}
            disabled={currentPage === 0}
            className={`px-7 py-2.5 rounded-full font-black text-sm md:text-base transition-all flex items-center gap-1 border ${currentPage === 0
              ? 'opacity-30 border-white/5 text-slate-500 bg-[#251A49]/40 cursor-not-allowed'
              : 'bg-[#251A49] text-white border-white/10 hover:bg-[#342463] cursor-pointer'
              }`}
          >
            ← Back
          </button>

          {/* Pagination Dots */}
          <div className="flex gap-2.5">
            {pages.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentPage ? 'bg-[#FFC107] scale-125' : 'bg-[#3B2C67]'
                  }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="px-7 py-2.5 rounded-full font-black text-sm md:text-base transition-all flex items-center gap-1 bg-[#FFC107] text-[#3A2600] hover:bg-[#FFD13B] shadow-md cursor-pointer"
          >
            {currentPage === pages.length - 1 ? 'Start Simmulation →' : 'Next →'}
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default LearnPhase;
