import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, RefreshCw, Gift, Check, KeyRound, AlertCircle, Trash2, CreditCard, Sparkles, Save, ShieldCheck, Lock, Unlock } from 'lucide-react';
import { 
  getWinners, 
  resetAllGameData, 
  clearAllWinners, 
  generate13DigitCardCode, 
  getPresetRewardCards, 
  savePresetRewardCards,
  getPermanentIpClaimsList,
  adminClearAllIpRestrictions
} from '../utils/storage';
import { sounds } from '../utils/audio';
import { maskIp } from '../utils/ipTracker';
import { IpClaimRecord } from '../types';

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
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [winners, setWinners] = useState(getWinners());
  const [presetCards, setPresetCards] = useState<string[]>(getPresetRewardCards());
  const [msg, setMsg] = useState('');
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');
  const [ipClaimsList, setIpClaimsList] = useState<IpClaimRecord[]>([]);

  useEffect(() => {
    if (isOpen && isUnlocked) {
      getPermanentIpClaimsList().then((list) => setIpClaimsList(list));
    }
  }, [isOpen, isUnlocked]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsUnlocked(false);
    setAdminPassword('');
    setAuthError('');
    onClose();
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'GEvasu2016@.') {
      setIsUnlocked(true);
      setAuthError('');
      setAdminPassword('');
      getPermanentIpClaimsList().then((list) => setIpClaimsList(list));
      sounds.playVictory();
    } else {
      setAuthError('Incorrect password! Access denied.');
      sounds.playWrong();
    }
  };

  const handlePresetCardChange = (index: number, val: string) => {
    const updated = [...presetCards];
    updated[index] = val;
    setPresetCards(updated);
  };

  const handleGenerateAllPresetCards = () => {
    const fresh = [1, 2, 3, 4, 5].map(() => generate13DigitCardCode());
    setPresetCards(fresh);
    setMsg('Generated 5 new 13-digit card numbers! Click "Save 5 Reward Cards" to apply.');
    sounds.playClick();
  };

  const handleSavePresetCards = () => {
    const saved = savePresetRewardCards(presetCards);
    setPresetCards(saved);
    setMsg('5 Reward Cards saved successfully!');
    sounds.playVictory();
  };

  const handlePasscodeReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'GEvasu2016@.' || passcode.trim() === '1562') {
      resetAllGameData();
      setWinners([]);
      const freshCards = [1, 2, 3, 4, 5].map(() => generate13DigitCardCode());
      savePresetRewardCards(freshCards);
      setPresetCards(freshCards);
      onResetUserHearts();
      onDataReset?.();
      setMsg('Game reset complete! Cleared active winners list & refreshed 5 slots (IP restrictions remain active).');
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
    const freshCards = [1, 2, 3, 4, 5].map(() => generate13DigitCardCode());
    savePresetRewardCards(freshCards);
    setPresetCards(freshCards);
    onResetUserHearts();
    onDataReset?.();
    setMsg('Restored default state (0 claimed, 5/5 open). Note: IP restrictions remain active!');
    sounds.playClick();
  };

  const handleClearAll = () => {
    clearAllWinners();
    setWinners([]);
    onDataReset?.();
    setMsg('Cleared all active claimed slots (5/5 open)!');
    sounds.playClick();
  };

  const handleFillAll5 = () => {
    const list = [1, 2, 3, 4, 5].map((num) => ({
      id: 'w-mock-' + num,
      name: `Player #${num}`,
      claimedAt: new Date().toISOString(),
      cardCode: presetCards[num - 1] || generate13DigitCardCode(),
      score: 10,
      timeTakenSeconds: 300 + num * 20,
    }));
    localStorage.setItem('hotk_winners_list_v1', JSON.stringify(list));
    setWinners(list);
    onDataReset?.();
    setMsg('Filled all 5 slots (0 open)!');
    sounds.playClick();
  };

  const handleClearAllIpRestrictions = async () => {
    if (confirm('Are you sure you want to clear all permanent IP restrictions? This allows previously claimed IPs to claim again.')) {
      await adminClearAllIpRestrictions();
      setIpClaimsList([]);
      setMsg('All IP restrictions have been cleared!');
      sounds.playVictory();
    }
  };

  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
        <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-lg border border-slate-200 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <KeyRound className="w-4 h-4 text-amber-500" />
              <span>Admin Authentication</span>
            </div>

            <button onClick={handleClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAdminAuth} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Admin Password Required
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setAuthError('');
                }}
                placeholder="Enter password"
                autoFocus
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 text-slate-900 font-mono text-sm font-bold rounded-xl px-3 py-2 outline-none shadow-2xs"
              />
            </div>

            {authError && (
              <p className="text-xs font-bold text-rose-600 flex items-center gap-1.5 bg-rose-50 p-2 rounded-lg border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm active:translate-y-0.5"
            >
              Unlock Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
      <div className="bg-white rounded-2xl p-4 max-w-md w-full shadow-lg border border-slate-200 space-y-3 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Admin Control Panel</span>
          </div>

          <button onClick={handleClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {msg && (
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 leading-snug border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {/* IP Restriction Enforcement Status Badge */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-indigo-950 flex items-center gap-1">
                <span>1 Claim Per IP Restriction</span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">ACTIVE</span>
              </div>
              <p className="text-[10px] text-indigo-700 font-medium">
                {ipClaimsList.length} unique IP(s) permanently registered.
              </p>
            </div>
          </div>

          {ipClaimsList.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllIpRestrictions}
              title="Clear IP restrictions"
              className="text-[10px] text-rose-700 bg-rose-100 hover:bg-rose-200 px-2 py-1 rounded-md font-bold flex items-center gap-1 transition-all"
            >
              <Unlock className="w-3 h-3" />
              <span>Unblock All</span>
            </button>
          )}
        </div>

        {/* Manage 5 Reward Cards */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>5 Reward Cards (1 per 10/10 Winner)</span>
            </div>
            <button
              type="button"
              onClick={handleGenerateAllPresetCards}
              className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 border border-amber-200"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Auto-Generate</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-500 leading-tight font-medium">
            Enter or edit 13-digit card numbers for the 5 reward slots (given to players who score 10/10):
          </p>

          <div className="space-y-1.5 pt-0.5">
            {presetCards.map((card, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-500 font-mono w-14 shrink-0">
                  Card #{idx + 1}:
                </span>
                <input
                  type="text"
                  value={card}
                  onChange={(e) => handlePresetCardChange(idx, e.target.value)}
                  placeholder="e.g. 8492-3019-4821-7"
                  className="flex-1 bg-white border border-slate-200 focus:border-emerald-500 text-slate-900 font-mono text-xs font-bold rounded-lg px-2.5 py-1.5 outline-none shadow-2xs"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSavePresetCards}
            className="w-full mt-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save 5 Reward Cards</span>
          </button>
        </div>

        {/* Code Verification Reset Form */}
        <form onSubmit={handlePasscodeReset} className="bg-slate-900 text-white rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Master Game Reset</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-tight">
            Enter master code (1562) to clear user scores & reset active slots to 0. (IP restrictions are preserved permanently).
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
              placeholder="Enter code (1562)"
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
            Slot Presets ({winners.length}/5 Active Winners)
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
              <span>Clear Active Claimed Slots (5/5 Open)</span>
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
