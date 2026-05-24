// src/components/phases/PracticePhase.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState.js';
import { useNarration } from '../../hooks/useNarration.js';
import { NumbCharacter } from '../ui/NumbCharacter.jsx';
import ProgressBar from '../ui/ProgressBar.jsx';
import { narrate, playSoundEffect, stopNarration } from '../../utils/audio.js';
import { correctAnswerNarration, wrongAnswerNarration } from '../../utils/narration.js';

// Import question type sub-components
import QuestionTypeA from '../practice/QuestionTypeA.jsx';
import QuestionTypeB from '../practice/QuestionTypeB.jsx';
import QuestionTypeC from '../practice/QuestionTypeC.jsx';
import QuestionTypeD from '../practice/QuestionTypeD.jsx';

export const PracticePhase = () => {
  const { state, recordAnswer, nextQuestion } = useGameState();
  const { 
    questionBank, 
    currentQuestionIndex, 
    answers, 
    streak, 
    maxStreak, 
    totalQuestions,
    sessionScore 
  } = state;

  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(null);
  const [numbyMood, setNumbyMood] = useState('idle');

  const currentQuestion = questionBank[currentQuestionIndex];
  const autoAdvanceTimer = React.useRef(null);

  // Vocalize current question stem audio on question entry
  useEffect(() => {
    if (currentQuestion) {
      setHasAnswered(false);
      setIsCurrentCorrect(null);
      setNumbyMood('thinking');
      
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
      
      // Speak stem
      narrate([{ text: currentQuestion.stemAudio, style: 'question' }], true);
    }
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
      stopNarration();
    };
  }, [currentQuestionIndex]);

  if (!currentQuestion) {
    return (
      <div className="text-center py-12" id="practice-loading">
        <div className="text-sm font-semibold text-slate-400">Loading Exam Arena...</div>
      </div>
    );
  }

  const handleAnswerSubmit = (selectedOption) => {
    if (hasAnswered) return; // Prevent double submit

    const isCorrect = selectedOption === currentQuestion.correct;
    setHasAnswered(true);
    setIsCurrentCorrect(isCorrect);
    
    // Record in global context
    recordAnswer(currentQuestion.id, selectedOption, isCorrect);
    
    // Trigger feedback audio & character expression
    if (isCorrect) {
      setNumbyMood('happy');
      playSoundEffect('correct');
      narrate(correctAnswerNarration(), true);
    } else {
      setNumbyMood('wrong');
      playSoundEffect('wrong');
      narrate(wrongAnswerNarration(), true);
    }

    // EXAM MODE: Auto advance after feedback
    autoAdvanceTimer.current = setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const handleNextForce = (e) => {
    if (e) e.stopPropagation();
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
    }
    nextQuestion(); // Always next, no retry in EXAM mode!
  };

  // Maps question type character to sub-component
  const renderQuestion = () => {
    const props = {
      key: currentQuestion.id,
      question: currentQuestion,
      onAnswer: handleAnswerSubmit
    };
    switch (currentQuestion.type) {
      case 'A': return <QuestionTypeA {...props} />;
      case 'B': return <QuestionTypeB {...props} />;
      case 'C': return <QuestionTypeC {...props} />;
      case 'D': return <QuestionTypeD {...props} />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6" id="practice-phase-container">
      {/* Top dashboard info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#30235C]/60 p-4 rounded-2xl border border-white/10 shadow-lg text-center items-center">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none block mb-0.5">Exam Score</span>
          <span className="text-lg font-black text-amber-300">{sessionScore} / {totalQuestions}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none block mb-0.5">Current Streak</span>
          <span className="text-lg font-black text-crystal-blue">{streak} 🔥</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none block mb-0.5">Best Streak</span>
          <span className="text-lg font-black text-crystal-purple">{maxStreak} 🔥</span>
        </div>
        <div className="col-span-2 md:col-span-1">
          <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} color="blue" />
        </div>
      </div>

      {/* Main split question layout */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        
        {/* Left Panel: Numby status */}
        <div className="w-full md:w-60 glass-card p-6 border-white/5 flex flex-col justify-between items-center text-center shadow-xl">
          <NumbCharacter mood={numbyMood} />
          
          <div className="mt-4 p-3 bg-[#413175]/60 rounded-xl border border-white/10 w-full">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Explorer status</span>
            <p className="text-xs text-slate-300 font-semibold mt-1">
              {streak >= 10 ? "🏆 Number Master!" : streak >= 5 ? "⚡ Counting Hero!" : "🧭 Crystal Explorer"}
            </p>
          </div>
        </div>

        {/* Right Panel: Graded active Question */}
        <div className="flex-1 glass-card p-6 md:p-8 border-white/5 flex flex-col justify-between shadow-xl min-h-[360px] relative overflow-hidden">
          <div className="absolute w-40 h-40 bg-blue-500/5 rounded-full blur-[4px] -top-10 -right-10 pointer-events-none" />

          {/* Active Question Core */}
          <div className="flex-1 w-full flex flex-col justify-center relative z-10">
            {renderQuestion()}
          </div>
        </div>
      </div>

      {/* Central Feedback Modal Overlay */}
      <AnimatePresence>
        {hasAnswered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={handleNextForce}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} 
              className={`flex flex-col items-center justify-center p-8 rounded-[32px] w-[320px] shadow-2xl text-center cursor-pointer transition-all ${
                isCurrentCorrect 
                  ? 'bg-gradient-to-b from-[#4CAF50] to-[#388E3C] shadow-green-500/30' 
                  : 'bg-gradient-to-b from-[#EF5350] to-[#D32F2F] shadow-red-500/30'
              }`}
              onClickCapture={handleNextForce}
            >
              {isCurrentCorrect ? (
                <>
                  <div className="text-6xl mb-4 drop-shadow-md">🎉</div>
                  <h3 className="text-2xl font-extrabold text-white mb-2">Correct! 🎉</h3>
                  <p className="text-white/90 text-sm font-medium">Awesome job, keep going!</p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4 drop-shadow-md">😢</div>
                  <h3 className="text-2xl font-extrabold text-white mb-2">Not quite!</h3>
                  <p className="text-white/90 text-sm font-medium mb-4">
                    The correct answer is recorded.
                  </p>
                </>
              )}
            </motion.div>
            <div className="absolute bottom-10 text-white/50 text-sm font-medium animate-pulse">
              Click anywhere to continue immediately
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PracticePhase;
