import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans">
      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col bg-slate-50 min-h-screen shadow-sm">
        {children}
      </div>
    </div>
  );
};

