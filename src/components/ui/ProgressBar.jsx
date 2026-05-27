// src/components/ui/ProgressBar.jsx
import React from 'react';

export const ProgressBar = ({ current, total, color = 'blue' }) => {
  const percentage = total > 0 ? Math.min(100, (current / total) * 100) : 0;
  
  const colorMap = {
    blue: 'bg-crystal-blue shadow-glow-blue',
    purple: 'bg-crystal-purple shadow-glow-purple',
    teal: 'bg-crystal-teal shadow-glow-teal',
    green: 'bg-crystal-green shadow-glow-green',
  };

  return (
    <div className="w-full" id="progress-bar-container">
      <div className="flex justify-between items-center mb-1 text-sm font-medium text-slate-400">
        <span>Progress</span>
        <span className="text-slate-200">{current} / {total}</span>
      </div>
      <div className="w-full h-3 bg-slate-900/80 rounded-full overflow-hidden border border-white/5 p-[2px]">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorMap[color] || colorMap.blue}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
