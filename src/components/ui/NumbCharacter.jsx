// src/components/ui/NumbCharacter.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const NumbCharacter = ({ mood = 'idle' }) => {
  
  // Define Framer Motion animation configurations based on the mood
  const characterVariants = {
    idle: {
      y: [0, -6, 0],
      rotate: [0, 1, -1, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    thinking: {
      rotate: [-3, 3, -3],
      y: [0, -3, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    happy: {
      y: [0, -20, 0],
      scaleY: [1, 0.85, 1.15, 0.95, 1],
      scaleX: [1, 1.15, 0.85, 1.05, 1],
      transition: {
        duration: 0.8,
        repeat: 2,
        ease: "easeInOut"
      }
    },
    encouraging: {
      scale: [1, 1.05, 1],
      y: [0, -8, 0],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    wrong: {
      x: [0, -6, 6, -6, 6, 0],
      rotate: [0, -2, 2, -2, 2, 0],
      transition: {
        duration: 0.5,
        ease: "linear"
      }
    },
    celebration: {
      y: [0, -25, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.2, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // SVG parameters for facial expressions
  const getFacialExpressions = () => {
    switch (mood) {
      case 'happy':
      case 'celebration':
        return {
          eyeL: <path d="M 60,60 Q 70,50 80,60" stroke="#0F172A" strokeWidth="4" fill="none" strokeLinecap="round" />,
          eyeR: <path d="M 100,60 Q 110,50 120,60" stroke="#0F172A" strokeWidth="4" fill="none" strokeLinecap="round" />,
          mouth: <path d="M 75,78 Q 90,95 105,78 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="3" />,
          blush: <><circle cx="52" cy="68" r="6" fill="#F87171" opacity="0.6" /><circle cx="128" cy="68" r="6" fill="#F87171" opacity="0.6" /></>
        };
      case 'thinking':
        return {
          eyeL: <circle cx="70" cy="58" r="4.5" fill="#0F172A" />,
          eyeR: <circle cx="110" cy="54" r="4.5" fill="#0F172A" />, // Right eye slightly higher
          mouth: <path d="M 80,78 Q 90,75 100,78" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />,
          blush: null
        };
      case 'wrong':
        return {
          eyeL: <path d="M 62,55 L 74,63 M 74,55 L 62,63" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />,
          eyeR: <path d="M 106,55 L 118,63 M 118,55 L 106,63" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />,
          mouth: <path d="M 80,82 Q 90,72 100,82" stroke="#0F172A" strokeWidth="3.5" fill="none" strokeLinecap="round" />,
          blush: null
        };
      case 'encouraging':
        return {
          eyeL: <circle cx="70" cy="58" r="5" fill="#0F172A" />,
          eyeR: <circle cx="110" cy="58" r="5" fill="#0F172A" />,
          mouth: <path d="M 80,75 Q 90,85 100,75" stroke="#0F172A" strokeWidth="3.5" fill="none" strokeLinecap="round" />,
          blush: <><circle cx="52" cy="68" r="5" fill="#F87171" opacity="0.5" /><circle cx="128" cy="68" r="5" fill="#F87171" opacity="0.5" /></>
        };
      case 'idle':
      default:
        return {
          eyeL: <circle cx="70" cy="58" r="5" fill="#0F172A" />,
          eyeR: <circle cx="110" cy="58" r="5" fill="#0F172A" />,
          mouth: <path d="M 82,76 Q 90,82 98,76" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />,
          blush: <><circle cx="54" cy="68" r="4.5" fill="#F87171" opacity="0.4" /><circle cx="126" cy="68" r="4.5" fill="#F87171" opacity="0.4" /></>
        };
    }
  };

  const face = getFacialExpressions();

  return (
    <div className="flex flex-col items-center justify-center p-4 relative" id="numb-character-wrapper">
      <motion.div
        variants={characterVariants}
        animate={mood}
        className="w-40 h-40 drop-shadow-[0_8px_20px_rgba(59,130,246,0.3)] relative"
      >
        <svg viewBox="0 0 180 180" className="w-full h-full">
          {/* Defs for gradients */}
          <defs>
            <linearGradient id="numbyBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="hatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          
          {/* Explorer Hat */}
          <path d="M 45,35 Q 90,15 135,35 L 145,45 Q 90,38 35,45 Z" fill="url(#hatGrad)" stroke="#78350F" strokeWidth="2.5" />
          <path d="M 60,30 Q 90,10 120,30" fill="none" stroke="#FEF3C7" strokeWidth="4" strokeLinecap="round" />

          {/* Numby Body - Rounded Blob */}
          <path
            d="M 30,85 Q 30,45 90,45 Q 150,45 150,85 Q 150,135 120,145 Q 90,150 60,145 Q 30,135 30,85 Z"
            fill="url(#numbyBody)"
            stroke="#1D4ED8"
            strokeWidth="3.5"
          />

          {/* Glowing Gem on forehead */}
          <polygon points="90,48 96,58 90,68 84,58" fill="#A7F3D0" stroke="#059669" strokeWidth="1.5" />

          {/* Facial Elements */}
          {face.eyeL}
          {face.eyeR}
          {face.mouth}
          {face.blush}

          {/* Explorer Goggles Band */}
          <path d="M 30,68 C 15,68 15,68 30,68" stroke="#334155" strokeWidth="5" />
          <path d="M 150,68 C 165,68 165,68 150,68" stroke="#334155" strokeWidth="5" />

          {/* Goggles Rim around eyes (only when idle or thinking) */}
          {(mood === 'idle' || mood === 'thinking') && (
            <>
              <circle cx="70" cy="58" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3" opacity="0.6" />
              <circle cx="110" cy="58" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3" opacity="0.6" />
            </>
          )}

          {/* Cute feet */}
          <ellipse cx="60" cy="148" rx="14" ry="7" fill="#1D4ED8" stroke="#172554" strokeWidth="2.5" />
          <ellipse cx="120" cy="148" rx="14" ry="7" fill="#1D4ED8" stroke="#172554" strokeWidth="2.5" />
        </svg>

        {/* Floating Sparks (Celebration / Happy) */}
        <AnimatePresence>
          {(mood === 'happy' || mood === 'celebration') && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 0], 
                    opacity: [0, 1, 0],
                    x: [0, (i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 40)],
                    y: [0, -(40 + Math.random() * 50)]
                  }}
                  transition={{ 
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                  className="absolute w-3 h-3 bg-amber-300 rounded-full"
                  style={{ 
                    top: '40%', 
                    left: '50%',
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Speech bubble/Tag */}
      <div className="mt-3 px-4 py-1.5 bg-slate-900/60 border border-slate-700/80 rounded-full text-xs font-semibold text-blue-300 shadow-sm tracking-wider uppercase">
        Numby
      </div>
    </div>
  );
};

export default NumbCharacter;
