import React, { useState } from 'react';
import { X, ShieldAlert, RefreshCw, Gift, Check } from 'lucide-react';
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
    setMsg('Reset to default (2 claimed, 3 open)!');
    sounds.playClick();
  };

  const handleClearAll = () => {
    clearAllWinners();
    setWinners([]);
    setMsg('Cleared all (5/5 open)!');
    sounds.playClick();
  };

  const handleFillAll5 = () => {
    const list = [1, 2, 3, 4, 5].map((num) => ({
      id: 'w-mock-' + num,
      name: `Player #${num}`,
      claimedAt: new Date().toISOString(),
      cardCode: generate13DigitCardCode(),
      score: 10,
      timeTakenSeconds: 300 + num * 20,
    }));
    localStorage.setItem('hotk_winners_list_v1', JSON.stringify(list));
    setWinners(list);
    setMsg('Filled all 5 slots (0 open)!');
    sounds.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-lg border border-slate-200 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Admin Testing Panel</span>
          </div>

          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {msg && (
          <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-1.5 text-xs">
          <button
            onClick={handleResetTo2}
            className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 flex items-center justify-between"
          >
            <span>Reset (2 Claimed, 3 Open)</span>
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={handleClearAll}
            className="w-full p-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold border border-emerald-200 flex items-center justify-between"
          >
            <span>Reset All (5 Open)</span>
            <Gift className="w-3.5 h-3.5 text-emerald-600" />
          </button>

          <button
            onClick={handleFillAll5}
            className="w-full p-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold border border-rose-200 flex items-center justify-between"
          >
            <span>Fill All (0 Open)</span>
            <X className="w-3.5 h-3.5 text-rose-600" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
          <button
            onClick={() => {
              onResetUserHearts();
              setMsg('Hearts refilled!');
            }}
            className="py-2 px-3 rounded-lg bg-slate-100 text-slate-800 font-bold"
          >
            Refill Hearts ❤️
          </button>

          <button
            onClick={() => {
              onJumpToWin();
              onClose();
            }}
            className="py-2 px-3 rounded-lg bg-slate-900 text-white font-bold"
          >
            Jump to Win 🏆
          </button>
        </div>
      </div>
    </div>
  );
};

