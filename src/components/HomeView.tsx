import React from 'react';
import { Play, Gift, Award, Flame, Zap, Heart, BookOpen, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
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
  xp,
  streak,
}) => {
  const remainingSlots = getRemainingWinnerSlots();

  return (
    <div className="w-full max-w-xl mx-auto py-6 px-4 animate-fadeIn space-y-6">
      {/* Main Kingdom Hero Card */}
      <div className="bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 text-amber-50 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-500/80 relative overflow-hidden text-center">
        {/* Background Accents */}
        <div className="absolute -top-6 -right-6 text-8xl opacity-10 select-none">👑</div>
        <div className="absolute -bottom-6 -left-6 text-8xl opacity-10 select-none">📖</div>

        {/* Crown Badge */}
        <div className="w-20 h-20 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg border-2 border-amber-200 animate-pulse">
          👑
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-amber-100 uppercase drop-shadow-md">
          Hope of the Kingdom
        </h1>
        <p className="text-amber-200/90 font-bold text-xs sm:text-sm tracking-wider uppercase mt-1">
          The Gamified Biblical Quiz Quest
        </p>

        {/* 13-Digit Prize Status Badge */}
        <div className="mt-5 inline-flex items-center gap-2 bg-amber-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-400/40 text-xs font-black text-amber-200 shadow-inner">
          <Gift className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>
            {remainingSlots > 0
              ? `🎁 PRIZE ALERT: ${remainingSlots} / 5 Card Slots Open!`
              : '🎁 PRIZE ALERT: All 5 Cards Claimed!'}
          </span>
        </div>
      </div>

      {/* Prize Card Challenge Promo Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-5 shadow-xl border-2 border-emerald-400/50 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-emerald-900/60 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-200 uppercase">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Special Winner Event
          </div>
          <h3 className="text-base font-black text-emerald-100">
            Win a 13-Digit Digital Card Code
          </h3>
          <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
            Answer all 10 questions (3 Emoji Games + 7 Typing Quests) to claim 1 of 5 exclusive 13-digit reward cards!
          </p>
        </div>

        <button
          onClick={onOpenLeaderboard}
          className="shrink-0 bg-white text-emerald-900 hover:bg-emerald-50 px-3.5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow transition-all active:scale-95"
        >
          Check Wall
        </button>
      </div>

      {/* Daily Scripture Inspiration Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-lg border-2 border-amber-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-600" />
            Daily Word of Hope
          </span>
          <span className="text-[10px] text-slate-400 font-normal">Matthew 6:33</span>
        </div>
        <p className="text-sm font-serif italic text-slate-700 dark:text-slate-300 leading-relaxed">
          "But seek first the kingdom of God and His righteousness, and all these things shall be added to you."
        </p>
      </div>

      {/* Quiz Structure Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-purple-50 dark:bg-purple-950/50 border-2 border-purple-200 dark:border-purple-800/60 rounded-2xl p-4 text-purple-900 dark:text-purple-200">
          <span className="text-2xl font-black block mb-1">🧩 3 Emoji Games</span>
          <span className="text-xs font-semibold block text-purple-700 dark:text-purple-300">
            2 Minutes Per Question
          </span>
          <p className="text-[11px] opacity-80 mt-1">Decode parables, miracles, and heroes of faith!</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/50 border-2 border-blue-200 dark:border-blue-800/60 rounded-2xl p-4 text-blue-900 dark:text-blue-200">
          <span className="text-2xl font-black block mb-1">✍️ 7 Typing Quests</span>
          <span className="text-xs font-semibold block text-blue-700 dark:text-blue-300">
            1 Minute Per Question
          </span>
          <p className="text-[11px] opacity-80 mt-1">Recall scripture memory verses and key biblical words.</p>
        </div>
      </div>

      {/* Main Start Action Button */}
      <div className="pt-2">
        <button
          onClick={() => {
            onStartQuiz();
            sounds.playClick();
          }}
          className="w-full py-5 rounded-3xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xl tracking-wider uppercase transition-all duration-150 shadow-[0_6px_0_0_#b45309] active:translate-y-1.5 active:shadow-none flex items-center justify-center gap-3 border-2 border-amber-300"
        >
          <Play className="w-7 h-7 fill-amber-950" />
          <span>START 10-QUESTION QUEST</span>
        </button>
      </div>
    </div>
  );
};
