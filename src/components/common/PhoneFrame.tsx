import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  screenNumber?: number;
  screenTitle?: string;
  isDarkTheme?: boolean;
  className?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  screenNumber,
  screenTitle,
  isDarkTheme = true,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Outer Phone Hardware Chasis */}
      <div className="relative w-[340px] sm:w-[360px] h-[720px] bg-[#0A0D18] rounded-[44px] p-3 shadow-2xl border-[4px] border-[#2A334E]/60 ring-1 ring-white/10 flex flex-col overflow-hidden">
        {/* Dynamic Island / Speaker Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
        </div>

        {/* Screen Status Bar */}
        <div
          className={`relative z-30 pt-1 pb-1 px-6 flex items-center justify-between text-[11px] font-semibold tracking-tight ${
            isDarkTheme ? 'text-white' : 'text-[#10172A]'
          }`}
        >
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="12" height="10" viewBox="0 0 12 10" fill="currentColor">
              <rect x="0" y="7" width="2" height="3" rx="0.5" />
              <rect x="3" y="5" width="2" height="5" rx="0.5" />
              <rect x="6" y="3" width="2" height="7" rx="0.5" />
              <rect x="9" y="0" width="2" height="10" rx="0.5" />
            </svg>
            <Wifi size={12} className="stroke-[2.5]" />
            <Battery size={13} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Screen Content Container */}
        <div className="relative flex-1 rounded-[34px] overflow-hidden flex flex-col">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="relative w-full pt-1 pb-0.5 flex justify-center z-30 pointer-events-none">
          <div
            className={`w-32 h-1 rounded-full ${
              isDarkTheme ? 'bg-white/40' : 'bg-black/30'
            }`}
          />
        </div>
      </div>

      {/* Screen Title Label under the phone (matching reference image captions) */}
      {screenTitle && (
        <div className="mt-3 text-center">
          <span className="text-xs font-semibold text-slate-300 tracking-wide">
            {screenNumber ? `${screenNumber}. ` : ''}{screenTitle}
          </span>
        </div>
      )}
    </div>
  );
};
