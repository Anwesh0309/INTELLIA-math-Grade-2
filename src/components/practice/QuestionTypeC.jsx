// src/components/practice/QuestionTypeC.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const QuestionTypeC = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    onAnswer(option);
  };

  return (
    <div className="w-full flex flex-col gap-6" id="question-type-c">
      <div className="text-center py-5 bg-slate-950/60 rounded-2xl border border-slate-800 shadow-inner px-4">
        <span className="text-xs text-crystal-teal font-black uppercase tracking-widest bg-crystal-teal/20 border border-crystal-teal/40 px-3 py-1 rounded-full">
          Type C: Digit Place Value
        </span>
        <h3 className="text-2xl md:text-3xl font-black text-white mt-3 leading-snug">
          {question.stem}
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto w-full">
        {question.options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === question.correct;
          
          return (
            <motion.button
              whileHover={selected === null ? { scale: 1.1 } : {}}
              whileTap={selected === null ? { scale: 0.9 } : {}}
              disabled={selected !== null}
              onClick={() => handleSelect(option)}
              key={option}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border text-center font-black text-xl md:text-2xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
                selected === null
                  ? 'bg-slate-900 border-slate-700 hover:border-crystal-teal text-white hover:bg-slate-800 hover:shadow-glow-teal'
                  : isSelected
                  ? isCorrect
                    ? 'bg-crystal-green/20 border-crystal-green text-green-300 shadow-glow-green'
                    : 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : isCorrect
                  ? 'bg-crystal-green/20 border-crystal-green/60 text-green-300'
                  : 'bg-slate-950/50 border-slate-900 text-slate-500 opacity-40'
              }`}
            >
              <span>{option}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionTypeC;
