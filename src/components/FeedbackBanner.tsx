import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, Clock } from 'lucide-react';

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
      className={`fixed bottom-0 left-0 right-0 z-40 p-4 border-t shadow-lg transition-all animate-slideUp ${
        isCorrect
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
          : 'bg-rose-50 border-rose-200 text-rose-950'
      }`}
    >
      <div className="max-w-md mx-auto flex flex-col gap-3">
        <div className="flex items-start gap-3">
          {isCorrect ? (
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              {isTimeout ? <Clock className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
          )}

          <div className="space-y-0.5 text-xs">
            <h3 className={`font-extrabold text-sm ${isCorrect ? 'text-emerald-900' : 'text-rose-900'}`}>
              {isCorrect
                ? 'Correct! +20 XP'
                : isTimeout
                ? 'Time Expired! (-1 Heart)'
                : 'Incorrect (-1 Heart)'}
            </h3>

            {!isCorrect && (
              <p className="font-bold text-rose-900">
                Answer: <span className="underline">{correctAnswer}</span>
              </p>
            )}

            <p className="font-semibold text-slate-700">{scriptureRef}</p>
            <p className="text-slate-600 line-clamp-2">{explanation}</p>
          </div>
        </div>

        <button
          onClick={onNext}
          className={`w-full py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-white ${
            isCorrect ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
          }`}
        >
          <span>CONTINUE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

