import React from 'react';
import { Clock } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  questionType: 'emoji' | 'typing';
  timeLeft: number;
  totalTimeSeconds: number;
  totalElapsedSeconds?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  timeLeft,
  totalTimeSeconds,
  totalElapsedSeconds = 0,
}) => {
  const progressPercent = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  // Countdown timer
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedCountdown = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Total elapsed timer (counting up)
  const elapsedMin = Math.floor(totalElapsedSeconds / 60);
  const elapsedSec = totalElapsedSeconds % 60;
  const formattedElapsed = `${elapsedMin}:${elapsedSec < 10 ? '0' : ''}${elapsedSec}`;

  const isLowTime = timeLeft <= 15;

  return (
    <div className="w-full bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-2 space-y-2">
      {/* Top Details Row */}
      <div className="flex items-center justify-between text-xs font-bold gap-1 flex-wrap">
        {/* Step Counter */}
        <div className="flex items-center gap-1.5 text-slate-800">
          <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-black text-xs border border-slate-200">
            Q{currentStep}/{totalSteps}
          </span>
        </div>

        {/* Timers Row */}
        <div className="flex items-center gap-1.5">
          {/* Total Elapsed Live Counter */}
          <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-1 rounded-lg border border-amber-200 font-mono font-bold text-[11px]" title="Total time taken">
            <Clock className="w-3 h-3 text-amber-600 animate-spin-slow" />
            <span>Time: {formattedElapsed}</span>
          </div>

          {/* Question Countdown Timer */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono font-black text-xs transition-colors ${
              isLowTime
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
            title="Question time remaining"
          >
            <Clock className={`w-3.5 h-3.5 ${isLowTime ? 'animate-bounce' : ''}`} />
            <span>{formattedCountdown}</span>
          </div>
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

