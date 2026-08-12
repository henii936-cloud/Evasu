import React from 'react';
import { Clock } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  questionType: 'emoji' | 'typing';
  timeLeft: number;
  totalTimeSeconds: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  timeLeft,
  totalTimeSeconds,
}) => {
  const progressPercent = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const isLowTime = timeLeft <= 15;

  return (
    <div className="w-full bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-2">
      {/* Top Details Row */}
      <div className="flex items-center justify-between text-xs font-bold mb-2">
        {/* Step Counter */}
        <div className="flex items-center gap-1.5 text-slate-800">
          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-extrabold text-xs border border-slate-200">
            QUESTION {currentStep} OF {totalSteps}
          </span>
        </div>

        {/* Countdown Timer */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono font-bold text-xs ${
            isLowTime
              ? 'bg-rose-500 text-white'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

