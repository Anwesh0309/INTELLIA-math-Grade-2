// src/components/simulations/CrystalCounter.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { narrate, stopNarration } from '../../utils/audio.js';
import { correctAnswerNarration, wrongAnswerNarration } from '../../utils/narration.js';
import { numberToWords } from '../../utils/numberWords.js';

export const CrystalCounter = ({ onComplete }) => {
  const [target, setTarget] = useState(0);
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [gamePhase, setGamePhase] = useState('counting'); // 'counting' | 'question' | 'complete'
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  // Initialize a new round
  const initRound = () => {
    const newTarget = Math.floor(Math.random() * 90) + 105; // 105 to 195
    setTarget(newTarget);
    setCount(0);
    setGamePhase('counting');
    setSelectedOption(null);
    setFeedback(null);
    
    // Generate MCQ distractors
    const correct = String(newTarget);
    const dist1 = String(newTarget + (Math.random() > 0.5 ? 10 : -10));
    const dist2 = String(newTarget + (Math.random() > 0.5 ? 1 : -1));
    
    // Shuffled options
    const arr = [correct, dist1, dist2].sort(() => Math.random() - 0.5);
    setOptions(arr);
  };

  useEffect(() => {
    initRound();
  }, [rounds]);

  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, []);

  // Handle count milestone logic
  const handleTapHundred = () => {
    if (count < 100) {
      setCount(100);
      narrate([{ text: 'One hundred!', style: 'emphasis' }], true);
    }
  };

  const handleTapOne = () => {
    if (count >= 100 && count < target) {
      const nextCount = count + 1;
      setCount(nextCount);
      narrate([{ text: numberToWords(nextCount), style: 'emphasis' }], true);
      
      // Auto-transition to MCQ question when target is hit!
      if (nextCount === target) {
        setGamePhase('question');
        narrate([{ text: "Choose the correct number!", style: 'instruction' }], true);
      }
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const isCorrect = Number(option) === target;
    if (isCorrect) {
      setFeedback('correct');
      narrate(correctAnswerNarration(), true);
      if (rounds + 1 >= 3) {
        setGamePhase('complete');
        setTimeout(() => {
          if (typeof onComplete === 'function') {
            onComplete();
          }
        }, 1500);
      } else {
        setTimeout(() => {
          setRounds(prev => prev + 1);
        }, 1200);
      }
    } else {
      setFeedback('wrong');
      narrate(wrongAnswerNarration(), true);
      // Auto-clear selection after delay to prevent freeze and allow retry
      setTimeout(() => {
        setSelectedOption(null);
        setFeedback(null);
      }, 1500);
    }
  };

  // Determine individual crystals needed (target - 100)
  const remainder = target > 100 ? target - 100 : 0;
  const tappedOnes = count > 100 ? count - 100 : 0;

  return (
    <div className="w-full flex flex-col gap-6 items-center" id="crystal-counter-game">
      {/* Game Head */}
      <div className="w-full flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Station 1</span>
          <span className="text-sm font-extrabold text-blue-300">Crystal Counter</span>
        </div>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`w-4 h-4 transition-all duration-300 transform hover:scale-125 select-none ${
                i < rounds
                  ? 'fill-amber-400 stroke-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                  : 'fill-slate-800 stroke-slate-700'
              }`}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
      </div>

      {gamePhase === 'counting' && (
        <div className="w-full flex flex-col items-center gap-6">
          <h4 className="text-base font-extrabold text-center text-slate-300">
            Count exactly <strong className="text-amber-300">{target}</strong> crystals!
          </h4>

          {/* Interactive Tap Zone */}
          <div className="flex flex-col md:flex-row gap-8 items-center w-full justify-center py-4">
            
            {/* Hundred Giant Block */}
            <motion.div
              whileHover={count < 100 ? { scale: 1.05 } : {}}
              whileTap={count < 100 ? { scale: 0.95 } : {}}
              onClick={handleTapHundred}
              className={`w-36 h-36 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-md ${
                count >= 100
                  ? 'bg-crystal-purple/20 border-crystal-purple/60 text-crystal-purple opacity-40 shadow-none cursor-default'
                  : 'bg-crystal-purple border-purple-400 text-white shadow-glow-purple'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 mb-2 fill-amber-400 stroke-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-lg font-black leading-none">100 Blocks</span>
              <span className="text-[10px] uppercase font-bold mt-1 opacity-80">
                {count >= 100 ? "Tapped!" : "Tap to add 100"}
              </span>
            </motion.div>

            {/* Individual Crystals Zone (unlocked after tapping 100) */}
            <div className={`flex flex-col items-center gap-3 p-4 bg-slate-950/60 rounded-2xl border transition-opacity duration-300 max-w-sm ${
              count >= 100 ? 'opacity-100 border-slate-800' : 'opacity-30 border-transparent pointer-events-none'
            }`}>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tap to count individual crystals</span>
              <div className="flex flex-wrap gap-2 justify-center min-h-[96px] items-center">
                {/* Draw crystals */}
                {[...Array(remainder)].map((_, i) => {
                  const isTapped = i < tappedOnes;
                  return (
                    <button
                      key={i}
                      disabled={isTapped}
                      onClick={handleTapOne}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center font-extrabold text-xs transition-all duration-200 select-none ${
                        isTapped
                          ? 'bg-crystal-blue/20 border-crystal-blue/40 text-blue-300 opacity-30 shadow-none cursor-default'
                          : 'bg-crystal-blue border-blue-400 text-white shadow-glow-blue hover:scale-115 active:scale-90 cursor-pointer'
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className={`w-4 h-4 transition-all duration-300 ${
                          isTapped
                            ? 'fill-slate-700 stroke-slate-600 opacity-40'
                            : 'fill-amber-400 stroke-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.7)] animate-pulse'
                        }`}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Current Live Count Display */}
          <div className="w-full text-center bg-slate-950/40 py-3 rounded-xl border border-slate-900">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Count</span>
            <div className="text-3xl font-black text-amber-300 leading-none mt-1">{count}</div>
          </div>
        </div>
      )}

      {gamePhase === 'question' && (
        <div className="w-full flex flex-col items-center gap-6 py-6" id="crystal-mcq-phase">
          <h4 className="text-lg font-black text-slate-200 text-center">
            How many crystals did you count in total?
          </h4>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            {options.map((opt) => {
              const isSelected = selectedOption === opt;
              const isCorrect = Number(opt) === target;
              
              return (
                <motion.button
                  whileHover={{ x: 4 }}
                  key={opt}
                  onClick={() => handleOptionSelect(opt)}
                  disabled={selectedOption !== null}
                  className={`w-full py-4 px-6 rounded-2xl text-base font-black border transition-all duration-300 flex items-center justify-between ${
                    selectedOption === null
                      ? 'bg-slate-900 border-slate-800 hover:border-crystal-blue text-slate-100 hover:bg-slate-850'
                      : isSelected
                      ? isCorrect
                        ? 'bg-crystal-green/20 border-crystal-green text-green-300 shadow-glow-green'
                        : 'bg-red-500/20 border-red-500 text-red-300'
                      : isCorrect
                      ? 'bg-crystal-green/20 border-crystal-green/60 text-green-300'
                      : 'bg-slate-950/50 border-slate-900 text-slate-600'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedOption !== null && (
                    <span>
                      {isCorrect ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-crystal-green"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      ) : isSelected ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-red-400"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      ) : null}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {feedback === 'wrong' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm font-semibold text-red-400"
              >
                Not quite! Let's think and try again.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {gamePhase === 'complete' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-crystal-green/20 border border-crystal-green flex items-center justify-center mb-4 shadow-glow-green animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-crystal-green">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h4 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-green-100">
            Station 1 Complete!
          </h4>
          <p className="text-slate-400 text-xs mt-1">Excellent counting adventurer! Next station unlocking...</p>
        </motion.div>
      )}
    </div>
  );
};

export default CrystalCounter;
