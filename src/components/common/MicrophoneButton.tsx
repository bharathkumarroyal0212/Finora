import React from 'react';
import { Mic, MicOff, Loader2, Check, AlertCircle } from 'lucide-react';
import { useVoice } from '../../context/VoiceContext';

interface MicrophoneButtonProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onTap?: () => void;
  showStatusLabel?: boolean;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  size = 'lg',
  className = '',
  onTap,
  showStatusLabel = false
}) => {
  const { isListening, speechState, startListening, stopListening, errorMessage } = useVoice();

  const handleClick = () => {
    if (onTap) {
      onTap();
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Dimensions
  const dimensions = {
    sm: { button: 'w-12 h-12', icon: 20, ring1: 'w-16 h-16', ring2: 'w-20 h-20' },
    md: { button: 'w-16 h-16', icon: 26, ring1: 'w-24 h-24', ring2: 'w-32 h-32' },
    lg: { button: 'w-24 h-24', icon: 38, ring1: 'w-36 h-36', ring2: 'w-48 h-48', ring3: 'w-60 h-60' },
    xl: { button: 'w-28 h-28', icon: 44, ring1: 'w-44 h-44', ring2: 'w-56 h-56', ring3: 'w-68 h-68' },
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Concentric ambient background rings */}
      <div className="relative flex items-center justify-center">
        {/* Ring 3 (outermost) */}
        {size === 'lg' || size === 'xl' ? (
          <div
            className={`absolute rounded-full pointer-events-none transition-all duration-700 ${dimensions.ring3} ${
              isListening
                ? 'bg-purple-200/40 animate-mic-ring-3'
                : 'bg-purple-100/30'
            }`}
          />
        ) : null}

        {/* Ring 2 */}
        <div
          className={`absolute rounded-full pointer-events-none transition-all duration-700 ${dimensions.ring2} ${
            isListening
              ? 'bg-purple-200/60 animate-mic-ring-2'
              : 'bg-purple-100/50'
          }`}
        />

        {/* Ring 1 (closest) */}
        <div
          className={`absolute rounded-full pointer-events-none transition-all duration-700 ${dimensions.ring1} ${
            isListening
              ? 'bg-purple-300/60 animate-mic-ring-1'
              : 'bg-purple-100/70'
          }`}
        />

        {/* Central Core Button */}
        <button
          type="button"
          onClick={handleClick}
          aria-label={isListening ? 'Stop listening' : 'Start voice recognition'}
          className={`relative z-10 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300 ${dimensions.button} ${
            isListening
              ? 'bg-gradient-to-tr from-[#5145D8] to-[#7C3AED] scale-105 shadow-glow-purple'
              : speechState === 'error'
              ? 'bg-[#D64550]'
              : speechState === 'success'
              ? 'bg-[#15966A]'
              : 'bg-gradient-to-tr from-[#5145D8] to-[#6558E8] hover:scale-105 hover:shadow-glow-purple active:scale-95'
          }`}
        >
          {speechState === 'processing' ? (
            <Loader2 size={dimensions.icon} className="animate-spin text-white" />
          ) : speechState === 'error' ? (
            <AlertCircle size={dimensions.icon} className="text-white" />
          ) : speechState === 'success' && !isListening ? (
            <Check size={dimensions.icon} className="text-white" />
          ) : isListening ? (
            <Mic size={dimensions.icon} className="text-white animate-pulse" />
          ) : (
            <Mic size={dimensions.icon} className="text-white" />
          )}
        </button>
      </div>

      {/* Optional Status Label underneath */}
      {showStatusLabel && (
        <div className="mt-4 text-center">
          <p className="text-base font-bold text-[#10172A]">
            {isListening ? 'Listening... Speak now' : 'Tap to speak'}
          </p>
          <p className="text-xs text-[#667085] mt-0.5">
            {isListening
              ? 'Tap microphone again when finished'
              : 'Say items, amounts, or shop sales'}
          </p>
        </div>
      )}
    </div>
  );
};
