// src/components/ui/StarRating.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const StarRating = ({ rating, maxStars = 3 }) => {
  return (
    <div className="flex gap-2 justify-center items-center" id="star-rating-container">
      {[...Array(maxStars)].map((_, index) => {
        const isActive = index < rating;
        return (
          <motion.div
            key={index}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 260, 
              damping: 20, 
              delay: index * 0.15 
            }}
            className="relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`w-10 h-10 transition-all duration-300 ${
                isActive
                  ? 'fill-amber-400 stroke-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                  : 'fill-slate-800 stroke-slate-700'
              }`}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StarRating;
