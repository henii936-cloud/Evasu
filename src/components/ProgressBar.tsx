import React from 'react';
import { Clock, Puzzle, Keyboard, AlertCircle } from 'lucide-react';
import { QuestionType } from '../types';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  questionType: QuestionType;
  timeLeft: number;
  totalTimeSeconds: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  questionType,
  timeLeft,
  totalTimeSeconds,
}) => {
  const progressPercent = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));
  const timePercent = Math.min(100, Math.max(0, (timeLeft / totalTimeSeconds) * 100));

  // Format time mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const isLowTime = timeLeft <= 15;
  const isCriticalTime = timeLeft <= 5;

  return (
    <div className="w-full bg-amber-50/80 dark:bg-slate-900/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-amber-200/60 dark:border-slate-800 mb-4">
      {/* Top Details Row */}
      <div className="flex items-center justify-between text-xs font-bold mb-2">
        {/* Step Counter */}
        <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200">
          <span className="bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-md font-extrabold text-[11px]">
            QUESTION {currentStep} OF {totalSteps}
          </span>

          {/* Type Badge */}
          {questionType === 'emoji' ? (
            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-purple-200 dark:border-purple-800">
              <Puzzle className="w-3 h-3" />
              Emoji Game (2 Min)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-blue-200 dark:border-blue-800">
              <Keyboard className="w-3 h-3" />
              Typing Quest (1 Min)
            </span>
          )}
        </div>

        {/* Countdown Timer */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono font-bold text-xs shadow-sm transition-all ${
            isCriticalTime
              ? 'bg-rose-600 text-white animate-bounce ring-2 ring-rose-400'
              : isLowTime
              ? 'bg-amber-500 text-amber-950 animate-pulse'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
          }`}
        >
          {isLowTime ? (
            <AlertCircle className="w-3.5 h-3.5" />
          ) : (
            <Clock className="w-3.5 h-3.5" />
          )}
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* Main Duolingo-style Progress Bar */}
      <div className="relative w-full h-3.5 bg-amber-200/60 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-amber-300/40 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 relative"
          style={{ width: `${progressPercent}%` }}
        >
          {/* Subtle glossy shimmer overlay */}
          <div className="absolute inset-0 bg-white/20 rounded-full" />
        </div>
      </div>

      {/* Timer Bar (secondary fine indicator) */}
      <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5">
        <div
          className={`h-full transition-all duration-1000 ${
            isLowTime ? 'bg-rose-500' : 'bg-emerald-500/70'
          }`}
          style={{ width: `${timePercent}%` }}
        />
      </div>
    </div>
  );
};
