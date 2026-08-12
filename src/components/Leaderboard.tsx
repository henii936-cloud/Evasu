import React from 'react';
import { Trophy, Gift, ArrowLeft, Award, Sparkles } from 'lucide-react';
import { getWinners, getRemainingWinnerSlots } from '../utils/storage';

interface LeaderboardProps {
  onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const winners = getWinners();
  const remaining = getRemainingWinnerSlots();

  return (
    <div className="w-full max-w-md mx-auto py-4 px-3 animate-fadeIn space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm relative">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {remaining > 0 ? `${remaining}/5 REMAINING` : 'ALL CLAIMED'}
          </span>
        </div>

        <div className="text-center py-1">
          <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-1" />
          <h2 className="text-lg font-extrabold uppercase tracking-wide">
            13-Digit Prize Winners
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto mt-0.5">
            First 5 players to finish receive a digital card!
          </p>
        </div>
      </div>

      {/* Winner List Cards */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider px-1">
          Registered Card Winners ({winners.length}/5)
        </h3>

        {winners.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-slate-500 border border-slate-200">
            <Sparkles className="w-6 h-6 text-amber-500 mx-auto mb-1" />
            <p className="font-bold text-xs text-slate-800">No winners yet!</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Be the first to complete the quiz and claim a card!</p>
          </div>
        ) : (
          winners.map((w, idx) => {
            const parts = w.cardCode.split('-');
            const maskedCard = parts.length === 4 ? `${parts[0]}-****-****-${parts[3]}` : w.cardCode;

            return (
              <div
                key={w.id}
                className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-bold text-xs text-slate-900">
                        {w.name}
                      </h4>
                      {w.isCurrentUser && (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-amber-700 font-mono font-semibold">
                      {maskedCard}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Award className="w-3 h-3" />
                    {w.score}/10
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
        className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>RETURN HOME</span>
      </button>
    </div>
  );
};

