import React from 'react';

interface FinoraLogoProps {
  variant?: 'light' | 'dark'; // 'light' means light text for dark background, 'dark' means dark text
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const FinoraLogo: React.FC<FinoraLogoProps> = ({
  variant = 'light',
  size = 'md',
  showTagline = false,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 22, text: 'text-base', gap: 'gap-1.5' },
    md: { icon: 28, text: 'text-xl', gap: 'gap-2' },
    lg: { icon: 38, text: 'text-2xl', gap: 'gap-2.5' },
    xl: { icon: 54, text: 'text-4xl', gap: 'gap-3' },
  };

  const currentSize = sizeMap[size];
  const textColor = variant === 'light' ? 'text-white' : 'text-[#10172A]';
  const taglineColor = variant === 'light' ? 'text-[#C8A96B]' : 'text-[#8A6D3B]';

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div className={`inline-flex items-center ${currentSize.gap}`}>
        {/* Stylized ribbon F logo matching Finora reference */}
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 drop-shadow-sm transition-transform hover:scale-105 duration-200"
        >
          <defs>
            <linearGradient id={`purpleGrad-${size}-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4338CA" />
              <stop offset="50%" stopColor="#5145D8" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id={`goldGrad-${size}-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2C485" />
              <stop offset="50%" stopColor="#C8A96B" />
              <stop offset="100%" stopColor="#A88748" />
            </linearGradient>
          </defs>

          {/* Upper flowing ribbon wing */}
          <path
            d="M24 16 C38 16 66 17 80 25 C88 29.5 86 42 74 46.5 C59 52 44 51.5 36 53 L36 84 C36 89 29 90.5 25 87 C22 84.5 22 81 22 76 Z"
            fill={`url(#purpleGrad-${size}-${variant})`}
          />

          {/* Lower swoosh ribbon wing */}
          <path
            d="M40 45 C52 45 72 45.5 80 52 C87 57.5 83 67 71 71 C58 75.5 45 74.5 40 74 Z"
            fill={`url(#goldGrad-${size}-${variant})`}
          />
        </svg>

        {/* Wordmark FINORA */}
        <span
          className={`font-black tracking-[0.18em] font-sans ${currentSize.text} ${textColor} leading-none`}
        >
          FINORA
        </span>
      </div>

      {showTagline && (
        <span className={`text-[11px] sm:text-xs font-semibold tracking-wide mt-1 ${taglineColor}`}>
          Smart Money. Better Tomorrow.
        </span>
      )}
    </div>
  );
};
