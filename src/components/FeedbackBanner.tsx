import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, Clock } from 'lucide-react';

interface FeedbackBannerProps {
  isCorrect: boolean;
  correctAnswer: string;
  correctAnswerAmharic?: string;
  scriptureRef: string;
  explanation: string;
  explanationAmharic?: string;
  onNext: () => void;
  isTimeout?: boolean;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  isCorrect,
  correctAnswer,
  correctAnswerAmharic,
  scriptureRef,
  explanation,
  explanationAmharic,
  onNext,
  isTimeout = false,
}) => {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 p-3.5 border-t shadow-lg transition-all animate-slideUp ${
        isCorrect
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
          : 'bg-rose-50 border-rose-200 text-rose-950'
      }`}
    >
      <div className="max-w-md mx-auto flex flex-col gap-2.5">
        <div className="flex items-start gap-2.5">
          {isCorrect ? (
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              {isTimeout ? <Clock className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
          )}

          <div className="space-y-1 text-xs flex-1">
            <h3 className={`font-extrabold text-xs sm:text-sm flex flex-wrap items-center gap-1.5 ${isCorrect ? 'text-emerald-900' : 'text-rose-900'}`}>
              <span>
                {isCorrect
                  ? 'Correct! +20 XP'
                  : isTimeout
                  ? 'Time Expired! (-1 Heart)'
                  : 'Incorrect (-1 Heart)'}
              </span>
              <span className="text-[11px] opacity-80 font-bold">
                {isCorrect
                  ? '• ትክክል ነው!'
                  : isTimeout
                  ? '• ጊዜው አልፏል!'
                  : '• ስህተት ነው'}
              </span>
            </h3>

            {!isCorrect && (
              <div className="font-bold text-rose-900 bg-rose-100/70 px-2 py-1 rounded border border-rose-200/60 my-0.5 text-[11px]">
                <span>Correct Answer / ትክክለኛ መልስ: </span>
                <span className="underline font-black">{correctAnswer}</span>
                {correctAnswerAmharic && (
                  <span className="ml-1 text-rose-950 font-black">({correctAnswerAmharic})</span>
                )}
              </div>
            )}

            <p className="font-bold text-slate-700 text-[10px] uppercase tracking-wider">{scriptureRef}</p>
            
            <div className="space-y-0.5 text-slate-800 text-[11px] leading-snug">
              <p className="font-semibold">{explanation}</p>
              {explanationAmharic && (
                <p className="font-bold text-slate-700 font-sans">{explanationAmharic}</p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className={`w-full py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-white ${
            isCorrect ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
          }`}
        >
          <span>CONTINUE / ቀጥል</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

