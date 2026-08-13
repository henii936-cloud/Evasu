import React, { useState } from 'react';
import { X, ShieldAlert, RefreshCw, Gift, Check, KeyRound, AlertCircle, Trash2 } from 'lucide-react';
import { getWinners, resetWinnersToDefault, clearAllWinners, resetAllGameData, generate13DigitCardCode } from '../utils/storage';
import { sounds } from '../utils/audio';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToWin: () => void;
  onResetUserHearts: () => void;
  onDataReset?: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onJumpToWin,
  onResetUserHearts,
  onDataReset,
}) => {
  const [winners, setWinners] = useState(getWinners());
  const [msg, setMsg] = useState('');
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');

  if (!isOpen) return null;

  const handlePasscodeReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === '1562') {
      resetAllGameData();
      setWinners([]);
      onResetUserHearts();
      onDataReset?.();
      setMsg('Game reset complete! All user data removed & claimed slots reset to 0 (5/5 open).');
      setPassError('');
      setPasscode('');
      sounds.playVictory();
    } else {
      setPassError('Invalid master code entered!');
      sounds.playWrong();
    }
  };

  const handleResetToDefault = () => {
    resetAllGameData();
    setWinners([]);
    onResetUserHearts();
    onDataReset?.();
    setMsg('Restored default state (0 claimed, all 5 slots open)!');
    sounds.playClick();
  };

  const handleClearAll = () => {
    clearAllWinners();
    setWinners([]);
    onDataReset?.();
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
    onDataReset?.();
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
          <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 leading-snug">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {/* Code Verification Reset Form */}
        <form onSubmit={handlePasscodeReset} className="bg-slate-900 text-white rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Master Game Reset</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-tight">
            Enter master authorization code to remove all user data & reset claimed slots to 0.
          </p>

          <div className="flex gap-1.5">
            <input
              type="password"
              inputMode="numeric"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setPassError('');
              }}
              placeholder="Enter master code"
              className="flex-1 bg-slate-800 border border-slate-700 focus:border-amber-400 text-white placeholder-slate-500 text-xs font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 shrink-0"
            >
              <Trash2 className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {passError && (
            <p className="text-[10px] font-bold text-rose-400 flex items-center gap-1 pt-0.5">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{passError}</span>
            </p>
          )}
        </form>

        {/* Quick Testing Preset Controls */}
        <div className="space-y-1 text-xs">
          <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Quick Slot Presets ({winners.length}/5 Claimed)
          </span>

          <div className="space-y-1.5">
            <button
              onClick={handleResetToDefault}
              className="w-full p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 flex items-center justify-between"
            >
              <span>Restore Default (0 Claimed, 5/5 Open)</span>
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={handleClearAll}
              className="w-full p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold border border-emerald-200 flex items-center justify-between"
            >
              <span>Clear All (5/5 Open)</span>
              <Gift className="w-3.5 h-3.5 text-emerald-600" />
            </button>

            <button
              onClick={handleFillAll5}
              className="w-full p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold border border-rose-200 flex items-center justify-between"
            >
              <span>Fill All Slots (0 Open)</span>
              <X className="w-3.5 h-3.5 text-rose-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
          <button
            onClick={() => {
              onResetUserHearts();
              setMsg('Hearts refilled to 5!');
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


