// src/components/practice/QuestionTypeA.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const QuestionTypeA = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    onAnswer(option);
  };

  // Get number from id (e.g. "A_145" -> "145")
  const numVal = question.id.split('_')[1];

  return (
    <div className="w-full flex flex-col gap-6" id="question-type-a">
      <div className="text-center py-5 bg-slate-950/60 rounded-2xl border border-slate-800 shadow-inner px-4">
        <span className="text-xs text-crystal-blue font-black uppercase tracking-widest bg-crystal-blue/20 border border-crystal-blue/40 px-3 py-1 rounded-full">
          Type A: Number Spelling
        </span>
        <h3 className="text-2xl md:text-3xl font-black text-white mt-3 leading-snug">
          What is the word form of <span className="text-amber-300 font-black bg-slate-900 px-4 py-1 rounded-xl border border-amber-400/30 shadow-md inline-block text-2xl md:text-3xl">{numVal}</span>?
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === question.correct;
          
          return (
            <motion.button
              whileHover={selected === null ? { scale: 1.02 } : {}}
              whileTap={selected === null ? { scale: 0.98 } : {}}
              disabled={selected !== null}
              onClick={() => handleSelect(option)}
              key={option}
              className={`w-full py-4 px-6 rounded-2xl text-left border font-black text-base md:text-lg leading-snug transition-all duration-300 flex items-center justify-between cursor-pointer ${
                selected === null
                  ? 'bg-slate-900 border-slate-700 hover:border-crystal-blue text-white hover:bg-slate-800'
                  : isSelected
                  ? isCorrect
                    ? 'bg-crystal-green/20 border-crystal-green text-green-300 shadow-glow-green'
                    : 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : isCorrect
                  ? 'bg-crystal-green/20 border-crystal-green/60 text-green-300'
                  : 'bg-slate-950/50 border-slate-900 text-slate-500 opacity-40'
              }`}
            >
              <span className="capitalize">{option}</span>
              {selected !== null && (
                <span>
                  {isCorrect ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-crystal-green"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : isSelected ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-red-400"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  ) : null}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionTypeA;
