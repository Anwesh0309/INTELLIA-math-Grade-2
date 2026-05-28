import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { narrate, stopNarration } from '../../utils/audio';
import { reflectNarration } from '../../utils/narration';
import StarRating from '../ui/StarRating';
import NumbCharacter from '../ui/NumbCharacter';

const ReflectPhase = () => {
  const { state, dispatch } = useAppContext();
  const { starsEarned, sessionScore, totalQuestions, maxStreak } = state;
  const percentage = Math.round((sessionScore / totalQuestions) * 100) || 0;

  useEffect(() => {
    narrate(reflectNarration(), true);
    return () => {
      stopNarration();
    };
  }, []);

  const handleRestart = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  const handleHome = () => {
    // Navigate to the Simulation phases
    dispatch({ type: 'SET_PHASE', payload: 'simulate' });
  };

  // Generate 40 random confetti pieces
  const confetti = Array.from({ length: 40 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    color: ['bg-red-500', 'bg-blue-500', 'bg-yellow-400', 'bg-green-500', 'bg-purple-500'][Math.floor(Math.random() * 5)],
    size: Math.random() > 0.5 ? 'w-2 h-2' : 'w-3 h-3',
    delay: `${Math.random() * 2}s`,
    rotation: `${Math.random() * 360}deg`
  }));

  // SVG Circular Progress values
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-transparent overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Confetti Background */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        {confetti.map((c, i) => (
          <motion.div
            key={i}
            className={`absolute ${c.color} ${c.size} rounded-sm opacity-80`}
            style={{ left: c.left, top: c.top, transform: `rotate(${c.rotation})` }}
            animate={{
              y: [0, Math.random() * -100 - 50],
              opacity: [0.8, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: parseFloat(c.delay)
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 w-full max-w-sm mt-8 relative"
      >
        <div className="bg-[#1A1130]/90 backdrop-blur-md rounded-[32px] p-6 border-2 border-yellow-600/30 shadow-2xl flex flex-col items-center">
          
          <div className="text-4xl mb-2">🏆</div>
          <h2 className="text-xl font-extrabold text-white mb-1">Journey Complete!</h2>
          <p className="text-slate-400 text-xs mb-8">You finished all 5 phases!</p>

          {/* Circular Progress */}
          <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#30235C"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#FFC107"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-[#FFC107]">{percentage}%</span>
              <span className="text-xs font-bold text-slate-300">{sessionScore}/{totalQuestions}</span>
            </div>
          </div>

          <div className="flex gap-2 mb-6 text-slate-600 text-lg">
            {/* 3 Stars (Greyed or Yellow) */}
            {[1, 2, 3].map((star) => (
              <span key={star} className={star <= starsEarned ? 'text-yellow-400 drop-shadow-md' : 'text-slate-600'}>
                ★
              </span>
            ))}
          </div>

          {/* Stat Boxes */}
          <div className="grid grid-cols-2 gap-2 w-full mb-6">
            <div className="bg-[#4CAF50]/20 border border-[#4CAF50]/40 rounded-xl p-3 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-[#4CAF50]">{sessionScore}</span>
              <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Correct</span>
            </div>
            <div className="bg-[#EF5350]/20 border border-[#EF5350]/40 rounded-xl p-3 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-[#EF5350]">{totalQuestions - sessionScore}</span>
              <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Wrong</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 w-full mb-6">
            <div className="bg-[#2A1E4A] rounded-xl p-3 flex flex-col items-center justify-center">
              <span className="text-lg font-black text-white">{sessionScore * 10}</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">XP Earned</span>
            </div>
            <div className="bg-[#2A1E4A] rounded-xl p-3 flex flex-col items-center justify-center">
              <span className="text-lg font-black text-white flex items-center gap-1">🔥 {maxStreak}</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Max Streak</span>
            </div>
            <div className="bg-[#2A1E4A] rounded-xl p-3 flex flex-col items-center justify-center">
              <span className="text-lg font-black text-white">3/3</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Stations</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col w-full gap-3 relative mt-6 z-20">
            <button
              onClick={() => dispatch({ type: 'SET_PHASE', payload: 'intro' })}
              className="w-full bg-[#34D399] hover:bg-[#10B981] text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg"
            >
              <span>✅</span> Continue to Next Level
            </button>
            <div className="flex w-full gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg text-sm"
              >
                <span>🔄</span> Retry
              </button>
              <button
                onClick={handleHome}
                className="flex-1 bg-white hover:bg-slate-100 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg text-sm"
              >
                <span>🏠</span> Home
              </button>
            </div>
          </div>
        </div>
        
        {/* Bear Speech Bubble Overlay */}
        <div className="absolute -top-12 -left-8 flex items-center z-30 pointer-events-none">
          <div className="w-14 h-14 bg-[#FFC107] border-4 border-[#2A1E4A] rounded-full flex items-center justify-center text-2xl shadow-lg">
            🐻
          </div>
          <div className="ml-2 bg-white px-4 py-2 rounded-2xl rounded-bl-none text-xs font-bold text-slate-800 shadow-xl max-w-[150px]">
            {percentage >= 80 ? "Amazing job! You're a star! 🌟" : "Good start! Try again to improve! 📚"}
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default ReflectPhase;
