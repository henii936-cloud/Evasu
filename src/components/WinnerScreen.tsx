import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Copy, Check, Gift, Sparkles, Trophy, RotateCcw, ShieldCheck, AlertCircle, Heart } from 'lucide-react';
import { WinnerClaim } from '../types';
import { claimPrize, getRemainingWinnerSlots, getWinners } from '../utils/storage';
import { sounds } from '../utils/audio';

interface WinnerScreenProps {
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  heartsRemaining: number;
  onRestart: () => void;
  onOpenLeaderboard: () => void;
}

export const WinnerScreen: React.FC<WinnerScreenProps> = ({
  score,
  totalQuestions,
  timeTakenSeconds,
  heartsRemaining,
  onRestart,
  onOpenLeaderboard,
}) => {
  const [userName, setUserName] = useState('');
  const [claimed, setClaimed] = useState<WinnerClaim | null>(null);
  const [copied, setCopied] = useState(false);
  const [remainingSlots, setRemainingSlots] = useState(getRemainingWinnerSlots());
  const isPerfectScore = score === totalQuestions;

  useEffect(() => {
    // Play celebratory sound and trigger confetti if perfect or completed
    sounds.playVictory();
    
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#eab308'],
      });
    } catch {
      // ignore
    }
  }, []);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    const res = claimPrize(userName.trim(), score, timeTakenSeconds);
    if (res) {
      setClaimed(res);
      setRemainingSlots(getRemainingWinnerSlots());
      sounds.playVictory();
      try {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
      } catch {}
    } else {
      setRemainingSlots(0);
    }
  };

  const copyToClipboard = () => {
    if (claimed?.cardCode) {
      navigator.clipboard.writeText(claimed.cardCode);
      setCopied(true);
      sounds.playClick();
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const minutes = Math.floor(timeTakenSeconds / 60);
  const seconds = timeTakenSeconds % 60;

  return (
    <div className="w-full max-w-xl mx-auto py-6 px-4 animate-fadeIn flex flex-col gap-6">
      {/* Top Victory Hero Banner */}
      <div className="bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 text-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden border-2 border-amber-300">
        <div className="absolute top-2 right-2 text-6xl opacity-20 select-none">👑</div>
        <div className="absolute bottom-2 left-2 text-6xl opacity-20 select-none">🕊️</div>

        <div className="w-20 h-20 bg-amber-200 text-amber-950 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white animate-bounce">
          <Trophy className="w-10 h-10 fill-amber-500 text-amber-700" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-amber-100 drop-shadow">
          {isPerfectScore ? 'KINGDOM CHAMPION!' : 'QUEST COMPLETED!'}
        </h1>
        <p className="text-amber-100 font-medium text-sm mt-1 max-w-md mx-auto">
          "Hope of the Kingdom" Biblical Quiz Finished!
        </p>

        {/* Stats Summary Pill */}
        <div className="grid grid-cols-3 gap-2 bg-amber-950/40 backdrop-blur-md p-3 rounded-2xl my-4 border border-amber-400/30 text-xs font-bold">
          <div>
            <span className="text-amber-300 block text-[10px] uppercase">Score</span>
            <span className="text-lg text-white font-extrabold">{score}/{totalQuestions}</span>
          </div>
          <div>
            <span className="text-amber-300 block text-[10px] uppercase">Time Taken</span>
            <span className="text-lg text-white font-extrabold">{minutes}m {seconds}s</span>
          </div>
          <div>
            <span className="text-amber-300 block text-[10px] uppercase">Hearts Left</span>
            <span className="text-lg text-rose-300 font-extrabold flex items-center justify-center gap-1">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 inline" />
              {heartsRemaining}
            </span>
          </div>
        </div>
      </div>

      {/* Prize Claiming Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border-2 border-amber-300 dark:border-amber-800 space-y-4">
        {claimed ? (
          /* Card Revealed State */
          <div className="space-y-4 animate-scaleUp text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full text-xs font-black border border-emerald-300 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>13-DIGIT CARD REWARD CLAIMED (#{(5 - remainingSlots)})</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
              Congratulations, {claimed.name}!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Here is your official 13-digit Kingdom Prize Card code. Save or copy this code!
            </p>

            {/* 13-Digit Prize Card Digital Display */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-amber-50 p-6 rounded-2xl shadow-xl border-2 border-amber-300 relative overflow-hidden my-4 text-left">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-200">
                  Hope of the Kingdom • Gift Card
                </span>
                <Gift className="w-6 h-6 text-amber-300" />
              </div>

              <div className="text-center font-mono font-black text-2xl sm:text-3xl tracking-widest bg-amber-950/60 py-3 px-4 rounded-xl border border-amber-400/50 shadow-inner select-all">
                {claimed.cardCode}
              </div>

              <div className="flex justify-between items-end mt-6 text-[10px] text-amber-200 uppercase font-medium">
                <div>
                  <span>Winner:</span>
                  <p className="font-bold text-white text-xs">{claimed.name}</p>
                </div>
                <div>
                  <span>Status:</span>
                  <p className="font-bold text-emerald-300 text-xs">Active Reward</p>
                </div>
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-sm tracking-wide uppercase transition-all shadow-[0_4px_0_0_#b45309] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-emerald-950" />
                  <span>CARD CODE COPIED TO CLIPBOARD!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>COPY 13-DIGIT CODE</span>
                </>
              )}
            </button>
          </div>
        ) : remainingSlots > 0 ? (
          /* Available Prize Claim Form */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" />
                Claim 13-Digit Prize Card
              </h3>
              <span className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 font-extrabold text-xs px-2.5 py-1 rounded-full border border-amber-300">
                {remainingSlots} / 5 Slots Left
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You answered all questions! You are among the top 5 faithful warriors eligible for the 13-digit reward card. Enter your name below to claim your prize!
            </p>

            <form onSubmit={handleClaim} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Warrior Name / Alias:
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g., Samuel the Faithful"
                  className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 focus:border-amber-500 text-slate-900 dark:text-slate-100 text-base font-bold rounded-2xl px-4 py-3 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!userName.trim()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wider transition-all shadow-[0_4px_0_0_#047857] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>CLAIM MY 13-DIGIT PRIZE CARD</span>
              </button>
            </form>
          </div>
        ) : (
          /* Prize Slots Exhausted State */
          <div className="text-center space-y-3 py-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
              Prize Pool Exhausted (5/5 Winners Reached)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              All 5 13-digit prize cards have already been claimed by other players! Thank you for completing the Hope of the Kingdom Biblical Quiz. Your spiritual knowledge is your greatest treasure!
            </p>
          </div>
        )}
      </div>

      {/* Action Navigation */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onOpenLeaderboard}
          className="py-3.5 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 font-extrabold text-xs uppercase tracking-wider transition-all border border-amber-300 dark:border-amber-800 flex items-center justify-center gap-2"
        >
          <Award className="w-4 h-4 text-amber-600" />
          <span>VIEW WINNER WALL</span>
        </button>

        <button
          onClick={onRestart}
          className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
};
