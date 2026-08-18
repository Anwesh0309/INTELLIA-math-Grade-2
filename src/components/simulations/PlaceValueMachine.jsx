// src/components/simulations/PlaceValueMachine.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { narrate, stopNarration } from '../../utils/audio.js';
import { correctAnswerNarration, wrongAnswerNarration } from '../../utils/narration.js';

export const PlaceValueMachine = ({ onComplete }) => {
  const [number, setNumber] = useState(0);
  const [digits, setDigits] = useState({ H: '', T: '', O: '' }); // Digits of current target
  const [slots, setSlots] = useState({ H: null, T: null, O: null }); // Student placement
  const [rounds, setRounds] = useState(0);
  const [gamePhase, setGamePhase] = useState('playing'); // 'playing' | 'whirring' | 'complete'
  const [selectedSlot, setSelectedSlot] = useState(null); // Click-to-place active slot
  const [feedback, setFeedback] = useState(null);

  // Stable refs for collision detection
  const slotHRef = useRef(null);
  const slotTRef = useRef(null);
  const slotORef = useRef(null);

  const slotRefs = {
    H: slotHRef,
    T: slotTRef,
    O: slotORef,
  };

  const initRound = () => {
    const newNum = Math.floor(Math.random() * 95) + 105; // 105 to 199
    setNumber(newNum);
    
    const str = String(newNum);
    setDigits({
      H: str[0],
      T: str[1],
      O: str[2]
    });

    setSlots({ H: null, T: null, O: null });
    setGamePhase('playing');
    setSelectedSlot(null);
    setFeedback(null);
  };

  useEffect(() => {
    initRound();
  }, [rounds]);

  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, []);

  // Click-to-place assignment
  const handleDigitSelect = (digit) => {
    if (selectedSlot) {
      assignDigitToSlot(selectedSlot, digit);
    }
  };

  const assignDigitToSlot = (slotKey, digitValue) => {
    const isCorrect = digits[slotKey] === String(digitValue);
    
    if (isCorrect) {
      setSlots(prev => ({ ...prev, [slotKey]: digitValue }));
      setSelectedSlot(null);
      narrate([{ text: `Correct digit for the ${slotKey === 'H' ? 'Hundreds' : slotKey === 'T' ? 'Tens' : 'Ones'} place!`, style: 'emphasis' }], true);

      // Check if all slots are locked!
      const nextSlots = { ...slots, [slotKey]: digitValue };
      if (nextSlots.H !== null && nextSlots.T !== null && nextSlots.O !== null) {
        handleRoundSuccess();
      }
    } else {
      setFeedback(`Oops! ${digitValue} is not correct for that place.`);
      narrate(wrongAnswerNarration(), true);
      setSelectedSlot(null); // Clear selected slot so they can try again
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  const handleRoundSuccess = () => {
    setGamePhase('whirring');
    narrate(correctAnswerNarration(), true);
    
    if (rounds + 1 >= 3) {
      setTimeout(() => {
        setGamePhase('complete');
        setTimeout(() => {
          if (typeof onComplete === 'function') {
            onComplete();
          }
        }, 1500);
      }, 1000);
    } else {
      setTimeout(() => {
        setRounds(prev => prev + 1);
      }, 1200);
    }
  };

  // Drag End handler with collision detection
  const handleDragEnd = (event, info, digit) => {
    // Get pointer coordinates
    const { x, y } = info.point;

    // Check collision with slot boundaries
    let droppedInSlot = null;
    for (const [key, ref] of Object.entries(slotRefs)) {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        ) {
          droppedInSlot = key;
          break;
        }
      }
    }

    if (droppedInSlot) {
      assignDigitToSlot(droppedInSlot, digit);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 items-center" id="place-value-machine-game">
      {/* Game Head */}
      <div className="w-full flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Station 2</span>
          <span className="text-sm font-extrabold text-crystal-purple">Place Value Machine</span>
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
        <div className="w-full flex flex-col items-center gap-6">
          <h4 className="text-base font-extrabold text-center text-slate-300">
            Build the place value chart for target: <strong className="text-amber-300 font-black text-xl px-2 py-0.5 bg-slate-900 rounded">{number}</strong>
          </h4>

          {feedback && (
            <div className="text-xs text-red-400 font-bold animate-pulse">
              {feedback}
            </div>
          )}

          {/* Machine Board H-T-O Slots */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md py-4">
            {['H', 'T', 'O'].map((slotKey) => {
              const value = slots[slotKey];
              const isSelected = selectedSlot === slotKey;
              const placeName = slotKey === 'H' ? 'Hundreds' : slotKey === 'T' ? 'Tens' : 'Ones';
              
              const slotColors = {
                H: 'border-crystal-purple/40 text-crystal-purple bg-crystal-purple/5',
                T: 'border-crystal-teal/40 text-crystal-teal bg-crystal-teal/5',
                O: 'border-crystal-yellow/40 text-crystal-yellow bg-crystal-yellow/5',
              };

              const activeGlows = {
                H: 'shadow-glow-purple border-crystal-purple',
                T: 'shadow-glow-teal border-crystal-teal',
                O: 'shadow-glow-yellow border-crystal-yellow',
              };

              return (
                <div
                  ref={slotRefs[slotKey]}
                  key={slotKey}
                  onClick={() => value === null && setSelectedSlot(isSelected ? null : slotKey)}
                  className={`h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    value !== null
                      ? 'border-solid border-crystal-green/80 bg-crystal-green/10 text-white shadow-glow-green cursor-default'
                      : isSelected
                      ? activeGlows[slotKey]
                      : slotColors[slotKey]
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    {placeName}
                  </span>
                  
                  <div className="text-4xl font-black mt-2 min-h-[40px]">
                    {value !== null ? value : '?'}
                  </div>

                  <span className="text-[9px] uppercase font-bold mt-1 text-slate-500">
                    {value !== null ? "Locked!" : isSelected ? "Select digit" : "Tap slot"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Digit Orbs Selector (Bottom Pool) */}
          <div className="w-full flex flex-col items-center gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-900">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {selectedSlot ? `Tap a digit to assign to ${selectedSlot}` : "Drag digit into slot OR tap slot + tap digit"}
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <motion.div
                  key={digit}
                  drag
                  dragSnapToOrigin
                  onDragEnd={(e, info) => handleDragEnd(e, info, digit)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDigitSelect(digit)}
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 hover:border-crystal-blue text-slate-100 hover:text-white flex items-center justify-center font-extrabold text-sm shadow-md cursor-grab active:cursor-grabbing transition-all select-none"
                >
                  {digit}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {gamePhase === 'whirring' && (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -1, 1, -1, 1, 0] }}
          transition={{ duration: 1, repeat: 1 }}
          className="w-full flex flex-col items-center gap-4 py-8"
        >
          <div className="text-lg font-black text-amber-300 animate-pulse">
            Whirr... Clack! Machine processing...
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-crystal-purple rounded-xl border border-purple-400 flex items-center justify-center font-black text-white text-xl shadow-glow-purple">{slots.H}</div>
            <div className="w-12 h-12 bg-crystal-teal rounded-xl border border-teal-400 flex items-center justify-center font-black text-white text-xl shadow-glow-teal">{slots.T}</div>
            <div className="w-12 h-12 bg-crystal-yellow rounded-xl border border-yellow-400 flex items-center justify-center font-black text-white text-xl shadow-glow-yellow">{slots.O}</div>
          </div>
          <div className="text-xs text-slate-400">Match Confirmed! Excellent!</div>
        </motion.div>
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
            Station 2 Complete!
          </h4>
          <p className="text-slate-400 text-xs mt-1">Stellar Place Value alignment explorer! Third station unlocking...</p>
        </motion.div>
      )}
    </div>
  );
};

export default PlaceValueMachine;
