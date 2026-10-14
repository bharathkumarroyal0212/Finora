import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';

interface DynamicGreetingProps {
  className?: string;
  subtitle?: string;
}

export const DynamicGreeting: React.FC<DynamicGreetingProps> = ({
  className = '',
  subtitle = 'Your financial journey looks great.'
}) => {
  const { profile } = useFinance();

  const greeting = useMemo(() => {
    const currentHour = new Date().getHours();
    let timeGreeting = 'Good morning';

    if (currentHour >= 5 && currentHour < 12) {
      timeGreeting = 'Good morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      timeGreeting = 'Good afternoon';
    } else if (currentHour >= 17 && currentHour < 21) {
      timeGreeting = 'Good evening';
    } else {
      timeGreeting = 'Good night';
    }

    const firstName = profile?.name ? profile.name.split(' ')[0] : 'there';
    return `${timeGreeting}, ${firstName}!`;
  }, [profile?.name]);

  return (
    <div className={`flex flex-col text-left ${className}`}>
      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
        {greeting}
      </h2>
      <p className="text-xs sm:text-sm text-slate-300/90 font-normal mt-0.5">
        {subtitle}
      </p>
    </div>
  );
};
