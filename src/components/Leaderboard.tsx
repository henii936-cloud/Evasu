import React from 'react';
import { Trophy, Gift, ShieldCheck, ArrowLeft, Crown, Award, Clock, Sparkles } from 'lucide-react';
import { getWinners, getRemainingWinnerSlots } from '../utils/storage';

interface LeaderboardProps {
  onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const winners = getWinners();
  const remaining = getRemainingWinnerSlots();

  return (
    <div className="w-full max-w-xl mx-auto py-6 px-4 animate-fadeIn space-y-5">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-50 rounded-3xl p-6 shadow-xl border-2 border-amber-500 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-amber-950/60 text-amber-200 hover:bg-amber-950 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="bg-amber-500 text-amber-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
            {remaining > 0 ? `${remaining} / 5 PRIZES REMAINING` : 'ALL 5 PRIZES CLAIMED'}
          </span>
        </div>

        <div className="text-center py-2">
          <Crown className="w-10 h-10 text-amber-300 mx-auto mb-2 fill-amber-400" />
          <h2 className="text-2xl font-black uppercase text-amber-100 tracking-wide">
            13-Digit Prize Winners Wall
          </h2>
          <p className="text-xs text-amber-200/90 max-w-md mx-auto mt-1 font-medium">
            First 5 players who complete all 10 biblical questions receive a 13-digit digital card number!
          </p>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 font-medium">
        <Gift className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Prize Claim Rules:</strong> The 13-digit card numbers are limited strictly to the <strong>first 5 winners</strong>. Once 5 players claim their cards, no additional cards will be distributed.
        </div>
      </div>

      {/* Winner List Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider px-1">
          Registered Card Winners ({winners.length} / 5)
        </h3>

        {winners.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-500 border border-slate-200 dark:border-slate-800">
            <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="font-bold text-sm">No winners yet!</p>
            <p className="text-xs mt-1">Be the very first player to complete the quiz and claim a 13-digit card!</p>
          </div>
        ) : (
          winners.map((w, idx) => {
            const rankColors = [
              'from-amber-400 to-amber-600 text-amber-950', // 1st Gold
              'from-slate-300 to-slate-400 text-slate-900', // 2nd Silver
              'from-amber-700 to-amber-800 text-amber-100', // 3rd Bronze
              'from-slate-700 to-slate-800 text-slate-200',
              'from-slate-700 to-slate-800 text-slate-200',
            ];

            // Mask center digits of 13 digit card for privacy e.g. "8492-****-****-7"
            const parts = w.cardCode.split('-');
            const maskedCard = parts.length === 4 ? `${parts[0]}-****-****-${parts[3]}` : w.cardCode;

            return (
              <div
                key={w.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border-2 ${
                  w.isCurrentUser
                    ? 'border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-950'
                    : 'border-slate-200 dark:border-slate-800'
                } shadow-md flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${rankColors[idx] || 'bg-slate-700 text-white'} flex items-center justify-center font-black text-sm shadow shrink-0`}
                  >
                    #{idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                        {w.name}
                      </h4>
                      {w.isCurrentUser && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          YOU
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      <span className="font-bold text-amber-600 dark:text-amber-400">Card: {maskedCard}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <Award className="w-3.5 h-3.5" />
                    {w.score}/10
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                    {Math.floor(w.timeTakenSeconds / 60)}m {w.timeTakenSeconds % 60}s
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>RETURN TO HOME</span>
      </button>
    </div>
  );
};
