import React, { useState } from 'react';
import { X, ShieldAlert, RefreshCw, Trash2, Gift, Check } from 'lucide-react';
import { getWinners, resetWinnersToDefault, clearAllWinners, generate13DigitCardCode } from '../utils/storage';
import { sounds } from '../utils/audio';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToWin: () => void;
  onResetUserHearts: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onJumpToWin,
  onResetUserHearts,
}) => {
  const [winners, setWinners] = useState(getWinners());
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleResetTo2 = () => {
    resetWinnersToDefault();
    setWinners(getWinners());
    setMsg('Reset winner slots to default (2 claimed, 3 available)!');
    sounds.playClick();
  };

  const handleClearAll = () => {
    clearAllWinners();
    setWinners([]);
    setMsg('Cleared all winners (5/5 slots now available)!');
    sounds.playClick();
  };

  const handleFillAll5 = () => {
    const list = [1, 2, 3, 4, 5].map((num) => ({
      id: 'w-mock-' + num,
      name: `Warrior #${num} (Sample)`,
      claimedAt: new Date().toISOString(),
      cardCode: generate13DigitCardCode(),
      score: 10,
      timeTakenSeconds: 300 + num * 20,
    }));
    localStorage.setItem('hotk_winners_list_v1', JSON.stringify(list));
    setWinners(list);
    setMsg('Filled all 5 winner slots (0 slots available to test exhaustion)!');
    sounds.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-amber-500 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-base">
            <ShieldAlert className="w-5 h-5" />
            <span>Kingdom Admin & Evaluator Controls</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {/* Winner Slot Controls */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
            Test Prize Slot Scenarios ({5 - winners.length} / 5 Open)
          </label>

          <div className="grid grid-cols-1 gap-2 text-xs">
            <button
              onClick={handleResetTo2}
              className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800 flex items-center justify-between"
            >
              <span>Reset to Default (2 Claimed, 3 Open)</span>
              <RefreshCw className="w-4 h-4 text-amber-600" />
            </button>

            <button
              onClick={handleClearAll}
              className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-300 dark:border-emerald-800 flex items-center justify-between"
            >
              <span>Set 0 Claimed (All 5 Slots Open)</span>
              <Gift className="w-4 h-4 text-emerald-600" />
            </button>

            <button
              onClick={handleFillAll5}
              className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-900 dark:text-rose-200 font-bold border border-rose-300 dark:border-rose-800 flex items-center justify-between"
            >
              <span>Fill All 5 Slots (Test Exhausted State)</span>
              <Trash2 className="w-4 h-4 text-rose-600" />
            </button>
          </div>
        </div>

        {/* Quick Test Shortcuts */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <label className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
            Quick Testing Tools
          </label>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onResetUserHearts();
                setMsg('Hearts refilled to 3!');
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold"
            >
              Refill Hearts ❤️
            </button>

            <button
              onClick={() => {
                onJumpToWin();
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold"
            >
              Jump to Victory 🏆
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase"
        >
          Close Panel
        </button>
      </div>
    </div>
  );
};
