import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, BookOpen, Clock } from 'lucide-react';

interface FeedbackBannerProps {
  isCorrect: boolean;
  correctAnswer: string;
  scriptureRef: string;
  explanation: string;
  onNext: () => void;
  isTimeout?: boolean;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  isCorrect,
  correctAnswer,
  scriptureRef,
  explanation,
  onNext,
  isTimeout = false,
}) => {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6 border-t-4 shadow-2xl transition-all duration-300 animate-slideUp ${
        isCorrect
          ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-950 dark:text-emerald-100'
          : 'bg-rose-50 dark:bg-rose-950 border-rose-500 text-rose-950 dark:text-rose-100'
      }`}
    >
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Side: Icon & Details */}
        <div className="flex items-start gap-3.5 flex-1">
          {isCorrect ? (
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md">
              {isTimeout ? <Clock className="w-7 h-7 stroke-[2.5]" /> : <XCircle className="w-7 h-7 stroke-[2.5]" />}
            </div>
          )}

          <div className="space-y-1">
            <h3 className={`text-lg sm:text-xl font-black ${isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>
              {isCorrect
                ? 'Brilliant! +20 XP'
                : isTimeout
                ? 'Time Expired! (-1 Heart)'
                : 'Incorrect Answer (-1 Heart)'}
            </h3>

            {!isCorrect && (
              <p className="text-sm font-extrabold text-rose-900 dark:text-rose-200">
                Correct Answer:{' '}
                <span className="bg-rose-200/80 dark:bg-rose-900/80 px-2 py-0.5 rounded text-rose-950 dark:text-rose-100">
                  {correctAnswer}
                </span>
              </p>
            )}

            <div className="flex items-center gap-1.5 text-xs font-bold opacity-90 mt-1">
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>{scriptureRef}</span>
            </div>

            <p className="text-xs sm:text-sm font-medium line-clamp-3 opacity-95 pt-0.5">
              {explanation}
            </p>
          </div>
        </div>

        {/* Right Side: Next Action Button */}
        <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
          <button
            onClick={onNext}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base tracking-wide uppercase transition-all shadow-lg active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 ${
              isCorrect
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_0_0_#047857]'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_4px_0_0_#be123c]'
            }`}
          >
            <span>{isCorrect ? 'CONTINUE' : 'GOT IT'}</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
