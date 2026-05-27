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
      <div className="text-center py-6 bg-slate-950/40 rounded-2xl border border-slate-900 shadow-inner px-4">
        <span className="text-[10px] text-crystal-teal font-extrabold uppercase tracking-widest bg-crystal-teal/10 border border-crystal-teal/30 px-3 py-1 rounded-full">
          Type C: Digit Place Value
        </span>
        <h3 className="text-xl md:text-2xl font-black text-slate-100 mt-4 leading-snug">
          {question.stem}
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto w-full">
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
              className={`w-12 h-12 rounded-full border text-center font-black text-lg transition-all duration-300 flex items-center justify-center ${
                selected === null
                  ? 'bg-slate-900 border-slate-800 hover:border-crystal-teal text-slate-200 hover:bg-slate-850 hover:text-white hover:shadow-glow-teal'
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
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionTypeC;
