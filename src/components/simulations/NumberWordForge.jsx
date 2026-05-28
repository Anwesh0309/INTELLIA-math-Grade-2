// src/components/simulations/NumberWordForge.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { numberToWords } from '../../utils/numberWords.js';
import { narrate, stopNarration } from '../../utils/audio.js';
import { correctAnswerNarration, wrongAnswerNarration } from '../../utils/narration.js';

export const NumberWordForge = ({ onComplete }) => {
  const [pairs, setPairs] = useState([]); // List of matching cards in current round
  const [leftCards, setLeftCards] = useState([]); // Numeral cards
  const [rightCards, setRightCards] = useState([]); // Word cards
  const [connections, setConnections] = useState([]); // Array of correct matches: { leftId, rightId }
  
  const [activeLeft, setActiveLeft] = useState(null); // Left card active selection
  const [dragPointer, setDragPointer] = useState(null); // Current cursor coordinate during drawing
  const [rounds, setRounds] = useState(0);
  const [gamePhase, setGamePhase] = useState('playing'); // 'playing' | 'complete'
  const [wrongFlash, setWrongFlash] = useState(null); // { leftId, rightId } for brief flash on incorrect

  const boardRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});

  // Initialize a new round
  const initRound = () => {
    const numbers = [];
    while (numbers.length < 4) {
      const num = Math.floor(Math.random() * 95) + 105; // 105 to 199
      if (!numbers.includes(num)) numbers.push(num);
    }

    const roundPairs = numbers.map(num => ({
      num: num,
      words: numberToWords(num)
    }));

    setPairs(roundPairs);
    setConnections([]);
    setActiveLeft(null);
    setDragPointer(null);
    setGamePhase('playing');
    setWrongFlash(null);

    // Shuffle left and right cards independently
    setLeftCards([...roundPairs].sort(() => Math.random() - 0.5));
    setRightCards([...roundPairs].sort(() => Math.random() - 0.5));
  };

  // Restart the same round (keep same numbers, reset connections)
  const restartRound = () => {
    setConnections([]);
    setActiveLeft(null);
    setDragPointer(null);
    setWrongFlash(null);
    // Shuffle cards again for the retry
    setLeftCards([...pairs].sort(() => Math.random() - 0.5));
    setRightCards([...pairs].sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    initRound();
  }, [rounds]);

  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, []);

  // Click card handlers
  const handleLeftSelect = (item) => {
    // If already matched, skip
    if (connections.some(c => c.leftId === item.num)) return;
    setActiveLeft(item);
  };

  const handleRightSelect = (item) => {
    if (!activeLeft) return;
    
    // Check if match is correct
    const isCorrect = activeLeft.num === item.num;
    
    if (isCorrect) {
      const newConnections = [...connections, { leftId: activeLeft.num, rightId: item.num }];
      setConnections(newConnections);
      narrate([
        { text: numberToWords(activeLeft.num), style: 'emphasis' },
        { text: 'is', style: 'statement' },
        { text: activeLeft.words, style: 'emphasis' }
      ], true);
      setActiveLeft(null);

      // Check if all 4 matched!
      if (newConnections.length === 4) {
        narrate(correctAnswerNarration(), true);
        setTimeout(() => {
          if (rounds + 1 >= 3) {
            setGamePhase('complete');
            setTimeout(() => {
              if (typeof onComplete === 'function') {
                onComplete();
              }
            }, 2000);
          } else {
            setRounds(rounds + 1);
          }
        }, 1800);
      }
    } else {
      // Trigger brief red flash
      setWrongFlash({ leftId: activeLeft.num, rightId: item.num });
      narrate(wrongAnswerNarration(), true);
      setActiveLeft(null);
      setTimeout(() => {
        restartRound();
      }, 1500);
    }
  };

  // Helper to retrieve coordinate center of card
  const getCardCenter = (id, side) => {
    const refs = side === 'left' ? leftRefs.current : rightRefs.current;
    const cardEl = refs[id];
    const boardEl = boardRef.current;
    
    if (cardEl && boardEl) {
      const cardRect = cardEl.getBoundingClientRect();
      const boardRect = boardEl.getBoundingClientRect();
      
      return {
        x: cardRect.left - boardRect.left + cardRect.width / 2,
        y: cardRect.top - boardRect.top + cardRect.height / 2
      };
    }
    return { x: 0, y: 0 };
  };

  return (
    <div className="w-full flex flex-col gap-6 items-center select-none" id="number-word-forge-game">
      {/* Game Head */}
      <div className="w-full flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Station 3</span>
          <span className="text-sm font-extrabold text-crystal-teal">Number Word Forge</span>
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

      {gamePhase === 'playing' && (
        <div className="w-full flex flex-col items-center gap-4 relative">
          <h4 className="text-sm font-bold text-center text-slate-400 uppercase tracking-widest">
            Tap a number on the left, then tap its matching word on the right!
          </h4>

          {/* Interactive Draw Board */}
          <div 
            ref={boardRef}
            className="w-full grid grid-cols-2 gap-x-20 md:gap-x-32 relative py-4"
          >
            {/* SVG Canvas for drawing matching lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {/* Draw locked connections */}
              {connections.map((c) => {
                const start = getCardCenter(c.leftId, 'left');
                const end = getCardCenter(c.rightId, 'right');
                return (
                  <motion.line
                    key={`${c.leftId}-${c.rightId}`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4 }}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="#0D9488"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(13,148,136,0.8)]"
                  />
                );
              })}

              {/* Draw active line from currently selected left card following cursor (using static connector logic) */}
              {activeLeft && dragPointer && (
                <line
                  x1={getCardCenter(activeLeft.num, 'left').x}
                  y1={getCardCenter(activeLeft.num, 'left').y}
                  x2={dragPointer.x}
                  y2={dragPointer.y}
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray="6,4"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]"
                />
              )}
            </svg>

            {/* Left Column: Numerals */}
            <div className="flex flex-col gap-4 relative z-20">
              {leftCards.map((item) => {
                const isMatched = connections.some(c => c.leftId === item.num);
                const isActive = activeLeft?.num === item.num;
                const isFlashingWrong = wrongFlash?.leftId === item.num;

                return (
                  <div
                    ref={el => leftRefs.current[item.num] = el}
                    key={item.num}
                    onClick={() => handleLeftSelect(item)}
                    className={`p-4 rounded-xl border text-center font-black text-lg transition-all duration-300 cursor-pointer ${
                      isMatched
                        ? 'bg-crystal-teal/10 border-crystal-teal/40 text-teal-300 opacity-60 shadow-glow-teal cursor-default'
                        : isFlashingWrong
                        ? 'bg-red-500/20 border-red-500 text-red-300 animate-bounce'
                        : isActive
                        ? 'bg-crystal-blue/20 border-blue-400 text-white shadow-glow-blue scale-105'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-850'
                    }`}
                  >
                    {item.num}
                  </div>
                );
              })}
            </div>

            {/* Right Column: Words */}
            <div className="flex flex-col gap-4 relative z-20">
              {rightCards.map((item) => {
                const isMatched = connections.some(c => c.rightId === item.num);
                const isFlashingWrong = wrongFlash?.rightId === item.num;

                return (
                  <div
                    ref={el => rightRefs.current[item.num] = el}
                    key={item.num}
                    onClick={() => handleRightSelect(item)}
                    className={`p-4 rounded-xl border text-center font-bold text-xs md:text-sm min-h-[60px] flex items-center justify-center leading-tight transition-all duration-300 cursor-pointer ${
                      isMatched
                        ? 'bg-crystal-teal/10 border-crystal-teal/40 text-teal-300 opacity-60 shadow-glow-teal cursor-default'
                        : isFlashingWrong
                        ? 'bg-red-500/20 border-red-500 text-red-300'
                        : activeLeft
                        ? 'bg-slate-900 border-crystal-blue/40 text-slate-200 hover:bg-crystal-blue/10 hover:border-blue-400'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-850'
                    }`}
                  >
                    {item.words}
                  </div>
                );
              })}
            </div>
          </div>
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
            Station 3 Complete!
          </h4>
          <p className="text-slate-400 text-xs mt-1">Magnificent Forge master explorer! All simulation stations complete!</p>
        </motion.div>
      )}
    </div>
  );
};

export default NumberWordForge;
