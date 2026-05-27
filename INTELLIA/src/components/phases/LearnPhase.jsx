// src/components/phases/LearnPhase.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState.js';
import { useNarration } from '../../hooks/useNarration.js';
import { PHASES } from '../../context/AppContext.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';

export const LearnPhase = () => {
  const { state, setPhase, viewLearnSection } = useGameState();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "Counting at the Playground",
      text: "One morning, Wei Ming ran to the school playground. His friends were playing hopscotch! He counted the squares: 1, 2, 3... all the way to 10. \"Counting is fun!\" he laughed.",
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
      text: "Wei Ming noticed something magical. One big flat square is exactly 100 little cubes! \"So if I have one flat and two rods... that's 120!\" he cheered. Understanding place value unlocked a whole new world.",
      highlight: "✨ 1 Hundred + 2 Tens = 120 ✨",
      characterMsg: "Place value is like a secret code! 🕵️‍♂️",
      image: "/assets/images/story_classroom.png",
      key: '3C'
    },
    {
      title: "Reading Big Numbers",
      text: "Now Wei Ming could read any number! When he saw 145, he confidently read out: 'One hundred and forty-five'. He was ready for the simulation cave to practice his new skills.",
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

  // Read narration when page changes
  useEffect(() => {
    narrate([{ text: pages[currentPage].text, style: 'statement' }], true);
    return () => {
      stopNarration();
    };
  }, [currentPage]);

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center w-full h-full font-sans pt-16 overflow-y-auto"
    >
      {/* Container for the story card to keep it centered and looking like the screenshot */}
      <div className="w-full max-w-2xl px-4 flex flex-col items-center">
        
        {/* Main Story Card */}
        <div className="bg-[#1C1438] rounded-3xl overflow-hidden w-full border border-white/5 shadow-2xl relative">
          {/* Top Image */}
          <div className="w-full h-56 bg-[#2B1D52] relative overflow-hidden">
            <img src={page.image} alt="Story illustration" className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1438] to-transparent"></div>
          </div>
          
          {/* Content Area */}
          <div className="px-8 pb-10 pt-4 relative">
            <h2 className="text-[22px] font-extrabold text-[#FFD100] mb-3">
              {page.title}
            </h2>
            <p className="text-slate-300 text-[15px] leading-relaxed mb-6 font-medium">
              {page.text}
            </p>
            
            {/* Highlighted text pill */}
            <div className="w-full bg-[#2A1E4A] rounded-2xl py-3 flex items-center justify-center border border-white/5 mb-6">
              <span className="font-bold text-[#FFD100] tracking-wide text-sm">
                {page.highlight}
              </span>
            </div>
            
            {/* Character Speech Bubble */}
            <div className="flex items-center gap-4 relative">
              <div className="w-12 h-12 bg-[#FFB300] rounded-full flex items-center justify-center text-2xl shadow-lg flex-shrink-0 z-10">
                🐻
              </div>
              <div className="bg-white text-[#333] px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md relative">
                {page.characterMsg}
                <div className="absolute top-1/2 -left-1.5 transform -translate-y-1/2 w-3 h-3 bg-white rotate-45"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="w-full flex items-center justify-between mt-8 px-2 max-w-xl">
          {/* Back Button */}
          <button 
            onClick={handleBack}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all flex items-center border ${
              currentPage === 0 
                ? 'opacity-0 pointer-events-none' 
                : 'bg-[#2A1E4A] text-white border-white/10 hover:bg-[#3B2C63]'
            }`}
          >
            ← Back
          </button>
          
          {/* Pagination Dots */}
          <div className="flex gap-2">
            {pages.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentPage ? 'bg-[#FFD100] scale-125' : 'bg-[#413175]'
                }`}
              />
            ))}
          </div>
          
          {/* Next Button */}
          <button 
            onClick={handleNext}
            className="px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-1 bg-[#FFD100] text-[#5A3E00] shadow-[0_4px_0_#D99C00] hover:shadow-[0_2px_0_#D99C00] hover:translate-y-[2px]"
          >
            {currentPage === pages.length - 1 ? 'Start Sim →' : 'Next →'}
          </button>
        </div>
        
      </div>
    </motion.div>
  );
};

export default LearnPhase;
