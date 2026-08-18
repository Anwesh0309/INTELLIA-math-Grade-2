// src/components/phases/SimulatePhase.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState.js';
import { NumbCharacter } from '../ui/NumbCharacter.jsx';
import { PHASES } from '../../context/AppContext.jsx';

// Import stations
import CrystalCounter from '../simulations/CrystalCounter.jsx';
import PlaceValueMachine from '../simulations/PlaceValueMachine.jsx';
import NumberWordForge from '../simulations/NumberWordForge.jsx';

export const SimulatePhase = () => {
  const { state, completeStation, setActiveStation, setPhase } = useGameState();
  const stationsCompleted = Array.isArray(state?.stationsCompleted) ? state.stationsCompleted : [];
  const activeStation = state?.activeStation || null;

  const handleStationComplete = (stationKey) => {
    completeStation(stationKey);
    setActiveStation(null); // Return to hub
  };

  const stations = [
    {
      key: 'station1',
      title: 'Crystal Counter',
      desc: 'Count crystals beyond 100 to target values!',
      difficulty: 'Easy',
      color: 'border-crystal-blue/40 text-blue-400 bg-crystal-blue/5',
      glow: 'shadow-glow-blue',
      comp: CrystalCounter,
    },
    {
      key: 'station2',
      title: 'Place Value Machine',
      desc: 'Lock H-T-O digits in the machine slots!',
      difficulty: 'Medium',
      color: 'border-crystal-purple/40 text-purple-400 bg-crystal-purple/5',
      glow: 'shadow-glow-purple',
      comp: PlaceValueMachine,
    },
    {
      key: 'station3',
      title: 'Number Word Forge',
      desc: 'Connect numerals with their word forms!',
      difficulty: 'Hard',
      color: 'border-crystal-teal/40 text-teal-400 bg-crystal-teal/5',
      glow: 'shadow-glow-teal',
      comp: NumberWordForge,
    },
  ];

  const allDone = ['station1', 'station2', 'station3'].every(st => stationsCompleted.includes(st));

  return (
    <div className="w-full max-w-5xl mx-auto h-full flex flex-col justify-center overflow-hidden my-auto" id="simulate-phase-container">
      {!['station1', 'station2', 'station3'].includes(activeStation) ? (
        // Station Selection Hub
        <motion.div
          key="hub"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-4 md:gap-6 my-auto"
        >
            {/* Header board */}
            <div className="glass-card p-5 md:p-6 border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left shadow-2xl">
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">The Simulation Cave</h3>
                <p className="text-slate-200 text-sm md:text-base font-bold mt-1">Explore the three interactive math stations to master Place Value!</p>
              </div>
              <div className="bg-[#413175]/80 border border-white/10 rounded-xl px-5 py-2.5 text-xs md:text-sm font-black text-blue-300 shadow-md shrink-0">
                Completed: {stationsCompleted.length} / 3 Stations
              </div>
            </div>

            {/* Stations Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {stations.map((st) => {
                const isCompleted = stationsCompleted.includes(st.key);
                
                return (
                  <motion.div
                    key={st.key}
                    whileHover={{ y: -6 }}
                    className={`glass-card p-6 border flex flex-col justify-between gap-5 relative overflow-hidden transition-all duration-300 ${
                      isCompleted ? 'border-crystal-green/60 shadow-glow-green' : st.color
                    }`}
                  >
                    {/* Glowing corner decoration */}
                    <div className="absolute w-20 h-20 bg-white/5 rounded-full blur-[20px] -top-10 -right-10 pointer-events-none" />

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-1.5 select-none">
                          <span className="text-[11px] uppercase font-black tracking-widest text-slate-300">Level:</span>
                          <div className="flex gap-0.5">
                            {[...Array(st.key === 'station1' ? 1 : st.key === 'station2' ? 2 : 3)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-4 h-4 fill-amber-400 stroke-amber-500 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)] transition-all duration-300 transform hover:scale-130 cursor-pointer"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        {isCompleted && (
                          <span className="bg-crystal-green/20 border border-crystal-green/40 px-2.5 py-1 rounded-full text-[10px] font-black text-green-300 uppercase tracking-widest">
                            Completed
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-xl md:text-2xl font-black text-white tracking-tight">{st.title}</h4>
                      <p className="text-xs md:text-sm text-slate-200 font-bold leading-relaxed">{st.desc}</p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveStation(st.key)}
                      className={`w-full py-3.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 border flex items-center justify-center gap-2 cursor-pointer ${
                        isCompleted
                          ? 'bg-crystal-green/20 border-crystal-green/40 hover:bg-crystal-green/30 text-green-300'
                          : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                      }`}
                    >
                      <span>{isCompleted ? "Play Again" : "Enter Station"}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom transition lock bar - Only shown when all 3 stations are completed */}
            {allDone && (
              <div className="glass-card p-5 border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
                <div className="text-sm md:text-base text-slate-200 font-extrabold">
                  <span className="text-crystal-green font-black flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-crystal-green"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Incredible explorer! All three stations completed. Practice is unlocked!
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPhase(PHASES.PRACTICE)}
                  className="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-sm md:text-base rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 border border-blue-400/20 group cursor-pointer shrink-0"
                  id="unlock-practice-btn"
                >
                  <span>Enter Practice Arena</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </motion.button>
              </div>
            )}
          </motion.div>
        ) : (
          // Active Station Game Screen
        <motion.div
          key="active-station"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="glass-card p-6 md:p-8 border-white/5 relative shadow-2xl min-h-[450px] flex flex-col justify-between overflow-hidden"
        >
          {/* Corner decorator */}
          <div className="absolute w-60 h-60 bg-blue-500/5 rounded-full blur-[60px] -top-10 -left-10 pointer-events-none" />

          {/* Back to Hub Header */}
          <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6 z-10">
            <button
              onClick={() => setActiveStation(null)}
              className="px-4 py-2 bg-[#413175]/60 border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
              id="back-to-hub-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Back to Hub</span>
            </button>

            <div className="text-xs text-slate-400 font-medium">
              Active Round: Explorer Mode
            </div>
          </div>

          {/* Render selected station component */}
          <div className="flex-1 w-full flex items-center justify-center z-10">
            {activeStation && stations.find(st => st.key === activeStation) ? React.createElement(
              stations.find(st => st.key === activeStation).comp,
              { onComplete: () => handleStationComplete(activeStation) }
            ) : null}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SimulatePhase;
