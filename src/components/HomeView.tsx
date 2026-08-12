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
    <div className="w-full max-w-md mx-auto h-full flex flex-col justify-center items-center py-6 px-4 animate-fadeIn gap-5 my-auto">
      {/* Main Hero Card */}
      <div className="w-full bg-white text-slate-900 rounded-3xl p-6 text-center shadow-sm border border-slate-200">
        {/* Crown Badge */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 text-3xl border border-amber-200 shadow-sm">
          👑
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
          Evasu Hope for Kingdom
        </h1>
        <p className="text-slate-500 font-bold text-xs tracking-widest uppercase mt-1">
          Quiz Challenge
        </p>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3 max-w-sm mx-auto">
          Test your biblical knowledge with 10 spiritual questions. Complete the challenge to claim 1 of 5 exclusive 13-digit digital reward cards!
        </p>

        {/* Prize Status Badge */}
        <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 text-xs font-bold text-emerald-800">
          <Gift className="w-4 h-4 text-emerald-600" />
          <span>
            {remainingSlots > 0
              ? `🎁 PRIZE ALERT: ${remainingSlots} / 5 Card Slots Open!`
              : '🎁 PRIZE ALERT: All 5 Cards Claimed!'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-3">
        <button
          onClick={() => {
            onStartQuiz();
            sounds.playClick();
          }}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-lg tracking-wider uppercase transition-all shadow-[0_4px_0_#047857] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>START QUIZ CHALLENGE</span>
        </button>

        <button
          onClick={onOpenLeaderboard}
          className="w-full py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all border border-slate-200 shadow-sm flex items-center justify-center gap-2"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>VIEW WINNERS WALL</span>
        </button>
      </div>
    </div>
  );
};

