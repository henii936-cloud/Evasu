import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Copy, Check, Gift, Trophy, RotateCcw, ShieldCheck, AlertCircle, Heart } from 'lucide-react';
import { WinnerClaim } from '../types';
import { claimPrize, getRemainingWinnerSlots } from '../utils/storage';
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
    sounds.playVictory();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
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
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
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
    <div className="w-full max-w-sm mx-auto h-full flex flex-col justify-center py-2 px-2 animate-fadeIn gap-2 my-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 text-center shadow-sm shrink-0">
        <div className="w-10 h-10 bg-amber-400 text-slate-900 rounded-xl flex items-center justify-center mx-auto mb-1 text-xl font-bold">
          🏆
        </div>

        <h1 className="text-lg font-extrabold uppercase tracking-wide">
          {isPerfectScore ? 'CHAMPION!' : 'QUEST COMPLETED!'}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 bg-slate-800 p-2 rounded-xl my-2 text-xs font-bold">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">Score</span>
            <span className="text-xs text-white">{score}/{totalQuestions}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">Time</span>
            <span className="text-xs text-white">{minutes}m {seconds}s</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">Hearts</span>
            <span className="text-xs text-rose-400 flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500 inline" />
              {heartsRemaining}
            </span>
          </div>
        </div>
      </div>

      {/* Prize Claim Box */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        {claimed ? (
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>13-DIGIT CARD CLAIMED</span>
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Congratulations, {claimed.name}!
            </h3>

            {/* Code */}
            <div className="bg-slate-900 text-amber-400 p-4 rounded-xl text-center font-mono font-extrabold text-xl tracking-widest border border-slate-800 select-all">
              {claimed.cardCode}
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY CODE</span>
                </>
              )}
            </button>
          </div>
        ) : remainingSlots > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-emerald-600" />
                Claim 13-Digit Prize Card
              </h3>
              <span className="bg-emerald-50 text-emerald-800 font-bold text-[11px] px-2 py-0.5 rounded-full border border-emerald-200">
                {remainingSlots}/5 Left
              </span>
            </div>

            <form onSubmit={handleClaim} className="space-y-2">
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 text-slate-900 text-sm font-semibold rounded-xl px-3.5 py-2.5 outline-none"
              />

              <button
                type="submit"
                disabled={!userName.trim()}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
              >
                CLAIM PRIZE CARD
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center space-y-2 py-2">
            <AlertCircle className="w-6 h-6 text-rose-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">
              Prize Pool Exhausted (5/5 Reached)
            </h3>
            <p className="text-xs text-slate-500">
              All 5 prize cards have been claimed!
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOpenLeaderboard}
          className="py-3 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase border border-slate-200 flex items-center justify-center gap-1.5"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>WINNERS WALL</span>
        </button>

        <button
          onClick={onRestart}
          className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
};

