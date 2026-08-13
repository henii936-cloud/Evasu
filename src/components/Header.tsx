import React from 'react';
import { Heart, Flame, Zap, Volume2, VolumeX, ShieldAlert, Award } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  hearts: number;
  streak: number;
  xp: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  remainingPrizes: number;
  onOpenAdmin: () => void;
  onOpenLeaderboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hearts,
  streak,
  xp,
  soundEnabled,
  onToggleSound,
  remainingPrizes,
  onOpenAdmin,
  onOpenLeaderboard,
}) => {
  return (
    <header className="bg-white text-slate-800 px-4 py-3 border-b border-slate-100 sticky top-0 z-30">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm">
            👑
          </div>
          <div>
            <h1 className="font-extrabold text-xs sm:text-sm tracking-wider text-slate-900 uppercase leading-none">
              Evasu Hope for Kingdom
            </h1>
            <span className="text-[10px] text-slate-400 font-medium">Quiz Challenge</span>
          </div>
        </div>

        {/* Gamified Status Counters */}
        <div className="flex items-center gap-2">
          {/* Hearts */}
          <div 
            className="flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-full text-xs font-semibold text-rose-700"
            title="Remaining Hearts"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>{hearts}</span>
          </div>

          {/* XP */}
          <div 
            className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-semibold text-amber-700"
            title="Total Kingdom XP"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{xp}</span>
          </div>

          {/* Winner Prize Badge */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border border-emerald-200"
            title="13-Digit Prize Cards Available"
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono font-bold text-emerald-700">{remainingPrizes}/5 Open</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              onToggleSound();
              sounds.playClick();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            title={soundEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-300" />}
          </button>

          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            title="Admin & Prize Settings"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

