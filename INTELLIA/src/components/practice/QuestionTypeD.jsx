// src/components/practice/QuestionTypeD.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const QuestionTypeD = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    onAnswer(option);
  };

  return (
    <div className="w-full flex flex-col gap-6" id="question-type-d">
      <div className="text-center py-6 bg-slate-950/40 rounded-2xl border border-slate-900 shadow-inner px-4">
        <span className="text-[10px] text-crystal-yellow font-extrabold uppercase tracking-widest bg-crystal-yellow/10 border border-crystal-yellow/30 px-3 py-1 rounded-full">
          Type D: Number Comparison
        </span>
        <h3 className="text-xl md:text-2xl font-black text-slate-100 mt-4 leading-snug">
          {question.stem}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full">
        {question.options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === question.correct;
          
          return (
            <motion.button
              whileHover={selected === null ? { scale: 1.05 } : {}}
              whileTap={selected === null ? { scale: 0.95 } : {}}
              disabled={selected !== null}
              onClick={() => handleSelect(option)}
              key={option}
              className={`py-5 rounded-2xl border text-center font-black text-lg transition-all duration-300 flex items-center justify-center gap-1.5 ${
                selected === null
                  ? 'bg-slate-900 border-slate-800 hover:border-crystal-yellow text-slate-200 hover:bg-slate-850 hover:text-white hover:shadow-glow-yellow'
                  : isSelected
                  ? isCorrect
                    ? 'bg-crystal-green/20 border-crystal-green text-green-300 shadow-glow-green'
                    : 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : isCorrect
                  ? 'bg-crystal-green/20 border-crystal-green/60 text-green-300'
                  : 'bg-slate-950/50 border-slate-900 text-slate-655 opacity-40'
              }`}
            >
              <span>{option}</span>
              {selected !== null && (
                <span>
                  {isCorrect ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-crystal-green"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : isSelected ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-red-400"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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

export default QuestionTypeD;
