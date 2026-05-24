// src/components/ui/XPCounter.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const XPCounter = ({ xp }) => {
  const [prevXp, setPrevXp] = useState(xp);
  const [increment, setIncrement] = useState(0);

  useEffect(() => {
    if (xp > prevXp) {
      setIncrement(xp - prevXp);
      const timer = setTimeout(() => {
        setIncrement(0);
        setPrevXp(xp);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setPrevXp(xp);
    }
  }, [xp, prevXp]);

  return (
    <div className="flex items-center gap-2 relative bg-slate-900/60 border border-slate-700/60 px-4 py-2 rounded-xl shadow-inner select-none" id="xp-counter-container">
      {/* Golden Star Gem */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-6 h-6 bg-amber-400 rounded-full blur-[4px] animate-pulse" />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-amber-400 stroke-amber-600 relative z-10" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest leading-none font-bold">XP Points</span>
        <span className="text-lg font-extrabold text-amber-300 leading-tight">
          {xp}
        </span>
      </div>

      {/* Floating XP Increment Anim */}
      <AnimatePresence>
        {increment > 0 && (
          <motion.div
            initial={{ y: 0, opacity: 0, scale: 0.8 }}
            animate={{ y: -30, opacity: 1, scale: 1.2 }}
            exit={{ y: -45, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute -top-3 right-2 bg-amber-400 text-slate-950 font-black text-xs px-1.5 py-0.5 rounded-full shadow-lg z-20"
          >
            +{increment} XP
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default XPCounter;
