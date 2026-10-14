import React from 'react';
import { FinoraLogo } from '../components/common/FinoraLogo';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onLogin
}) => {
  return (
    <div className="relative w-full flex-1 min-h-[100dvh] bg-[#0B1431] text-white flex flex-col justify-between p-5 sm:p-6 overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#5145D8]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-[#C8A96B]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Wave Lines at Bottom (matching reference) */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none overflow-hidden opacity-60">
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full preserve-3d"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-20 180 C80 120 180 200 420 130"
            stroke="url(#wavePurple)"
            strokeWidth="2.5"
            strokeOpacity="0.7"
          />
          <path
            d="M-20 200 C120 150 240 210 420 160"
            stroke="url(#waveGold)"
            strokeWidth="2"
            strokeOpacity="0.8"
          />
          <defs>
            <linearGradient id="wavePurple" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5145D8" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="waveGold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C8A96B" />
              <stop offset="100%" stopColor="#E6C88A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Center Branding Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto z-10 px-2 py-6">
        {/* Large Logo */}
        <FinoraLogo size="xl" variant="light" className="mb-4" />

        {/* Tagline */}
        <p className="text-sm font-semibold tracking-wide text-[#C8A96B] mb-3">
          Smart Money. Better Tomorrow.
        </p>

        {/* Short AI Finance Description */}
        <p className="text-xs sm:text-sm text-slate-400 max-w-[270px] leading-relaxed font-normal">
          Your AI-powered money assistant for personal life and small business.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-3.5 z-10 mb-4 sm:mb-6">
        {/* Primary Gold Button */}
        <button
          type="button"
          onClick={onGetStarted}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#DFBA73] to-[#C8A96B] hover:from-[#E5C37E] hover:to-[#B59458] text-[#0B1431] font-bold text-sm tracking-wide shadow-lg shadow-[#C8A96B]/20 transition-all duration-200 active:scale-[0.98] flex items-center justify-center"
        >
          Get Started
        </button>

        {/* Secondary Outlined Button */}
        <button
          type="button"
          onClick={onLogin}
          className="w-full py-3.5 px-6 rounded-2xl bg-transparent border border-slate-700/80 hover:border-slate-500 hover:bg-white/5 text-white font-semibold text-sm tracking-wide transition-all duration-200 active:scale-[0.98] flex items-center justify-center"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
};
