import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  isMobileFrame: boolean;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ isMobileFrame, children }) => {
  if (!isMobileFrame) {
    return <div className="w-full min-h-screen bg-slate-100 dark:bg-slate-950">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-2 flex items-center justify-center font-sans">
      {/* Outer Smartphone Body */}
      <div className="w-full max-w-[420px] h-[850px] bg-slate-950 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-4 border-slate-800 relative flex flex-col overflow-hidden">
        {/* Top Notch / Dynamic Island */}
        <div className="w-full bg-slate-950 pt-2 pb-1 px-6 flex items-center justify-between text-slate-400 text-[10px] font-semibold shrink-0 z-50 select-none">
          <span>09:41</span>

          {/* Camera / Speaker Notch */}
          <div className="w-24 h-4 bg-black rounded-full mx-auto flex items-center justify-center gap-2 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-blue-900/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          </div>

          <div className="flex items-center gap-1">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 fill-slate-200" />
          </div>
        </div>

        {/* Screen Area */}
        <div className="w-full flex-1 bg-amber-50/20 dark:bg-slate-950 rounded-[36px] overflow-y-auto overflow-x-hidden relative flex flex-col custom-scrollbar">
          {children}
        </div>

        {/* Bottom Home Bar Indicator */}
        <div className="w-full pt-2 pb-1 flex justify-center shrink-0 z-50 bg-slate-950">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
