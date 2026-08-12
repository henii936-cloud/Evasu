import React from 'react';
import { Heart, Flame, Zap, Volume2, VolumeX, Smartphone, Monitor, ShieldAlert, Award } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  hearts: number;
  streak: number;
  xp: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
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
  isMobileFrame,
  onToggleMobileFrame,
  remainingPrizes,
  onOpenAdmin,
  onOpenLeaderboard,
}) => {
  return (
    <header className="bg-amber-900 text-amber-50 px-4 py-2.5 shadow-md border-b-2 border-amber-700/60 sticky top-0 z-30">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-amber-950 flex items-center justify-center font-bold shadow-sm text-lg border border-amber-300">
            👑
          </div>
          <div className="hidden sm:block">
            <h1 className="font-extrabold text-sm tracking-wide text-amber-200 uppercase leading-none">
              Hope of the Kingdom
            </h1>
            <span className="text-[10px] text-amber-300/80 font-medium">Spiritual Biblical Game</span>
          </div>
        </div>

        {/* Gamified Status Counters */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hearts */}
          <div 
            className="flex items-center gap-1 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-700/50 text-xs font-bold text-rose-300 shadow-inner"
            title="Remaining Hearts"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span>{hearts}</span>
          </div>

          {/* Streak */}
          <div 
            className="flex items-center gap-1 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-700/50 text-xs font-bold text-orange-300 shadow-inner"
            title="Daily Streak"
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-400" />
            <span>{streak}</span>
          </div>

          {/* XP */}
          <div 
            className="flex items-center gap-1 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-700/50 text-xs font-bold text-amber-300 shadow-inner"
            title="Total Kingdom XP"
          >
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{xp}</span>
          </div>

          {/* Winner Prize Badge */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow transition-all active:scale-95 border border-emerald-400/40"
            title="13-Digit Prize Cards Remaining"
          >
            <Award className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden xs:inline">Prizes:</span>
            <span className="text-amber-200 font-extrabold">{remainingPrizes}/5</span>
          </button>
        </div>

        {/* Utility Controls */}
        <div className="flex items-center gap-1">
          {/* Audio Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sounds.playClick();
            }}
            className="p-1.5 rounded-lg bg-amber-800/80 hover:bg-amber-700 text-amber-200 transition-colors"
            title={soundEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-amber-400/50" />}
          </button>

          {/* Device Frame Toggle */}
          <button
            onClick={() => {
              onToggleMobileFrame();
              sounds.playClick();
            }}
            className="p-1.5 rounded-lg bg-amber-800/80 hover:bg-amber-700 text-amber-200 transition-colors hidden sm:flex"
            title={isMobileFrame ? 'Switch to Fullscreen Mode' : 'Switch to Mobile Device View'}
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Admin / Settings Modal */}
          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded-lg bg-amber-800/80 hover:bg-amber-700 text-amber-200 transition-colors"
            title="Admin & Prize Settings"
          >
            <ShieldAlert className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
