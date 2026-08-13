import React from 'react';
import { Play, Gift, Trophy } from 'lucide-react';
import { getRemainingWinnerSlots } from '../utils/storage';
import { sounds } from '../utils/audio';

interface HomeViewProps {
  onStartQuiz: () => void;
  onOpenLeaderboard: () => void;
  xp: number;
  streak: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartQuiz,
  onOpenLeaderboard,
}) => {
  const remainingSlots = getRemainingWinnerSlots();

  return (
    <div className="w-full max-w-sm mx-auto h-full flex flex-col justify-center items-center py-2 px-2 animate-fadeIn gap-3 my-auto">
      {/* Main Hero Card */}
      <div className="w-full bg-white text-slate-900 rounded-2xl p-4 text-center shadow-sm border border-slate-200">
        {/* Crown Badge */}
        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2 text-2xl border border-amber-200 shadow-sm">
          👑
        </div>

        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
          Evasu Hope for Kingdom
        </h1>
        <p className="text-slate-500 font-bold text-[10px] tracking-widest uppercase mt-0.5">
          Quiz Challenge
        </p>

        <p className="text-xs text-slate-600 leading-snug mt-2 max-w-xs mx-auto">
          Explore 1st Peter (Chapters 1–3) — Seeing, Living & Preaching the Hope of God's Kingdom! Complete 10 questions to claim 1 of 5 reward cards!
        </p>

        {/* English & Amharic Spelling Notice */}
        <div className="mt-2.5 bg-amber-50 border border-amber-200/80 rounded-xl p-2 text-center">
          <p className="text-[11px] font-extrabold text-amber-900">
            ⚠️ Check your spelling, while you type
          </p>
          <p className="text-[10px] font-bold text-amber-800 mt-0.5">
            በሚጽፉበት ጊዜ የፊደል አጻጻፍዎን ያረጋግጡ
          </p>
        </div>

        {/* Prize Status Badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 text-xs font-bold text-emerald-800">
          <Gift className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {remainingSlots > 0
              ? `PRIZE ALERT: ${remainingSlots}/5 Open`
              : 'PRIZE ALERT: All Claimed'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-2">
        <button
          onClick={() => {
            onStartQuiz();
            sounds.playClick();
          }}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>START QUIZ CHALLENGE</span>
        </button>

        <button
          onClick={onOpenLeaderboard}
          className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all border border-slate-200 shadow-sm flex items-center justify-center gap-2"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>VIEW WINNERS WALL</span>
        </button>
      </div>
    </div>
  );
};

