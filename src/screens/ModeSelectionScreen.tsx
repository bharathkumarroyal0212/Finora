import React from 'react';
import { User, Store, ArrowRight } from 'lucide-react';
import { FinoraLogo } from '../components/common/FinoraLogo';
import { useFinance } from '../context/FinanceContext';

interface ModeSelectionScreenProps {
  onSelectPersonal: () => void;
  onSelectShop: () => void;
}

export const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({
  onSelectPersonal,
  onSelectShop
}) => {
  const { setMode } = useFinance();

  const handlePersonal = () => {
    setMode('personal');
    onSelectPersonal();
  };

  const handleShop = () => {
    setMode('shop');
    onSelectShop();
  };

  return (
    <div className="relative w-full flex-1 min-h-[100dvh] bg-white text-[#111B3B] flex flex-col justify-between p-5 sm:p-6 select-none">
      {/* Header with FINORA Logo */}
      <div className="pt-2 flex justify-center">
        <FinoraLogo size="md" variant="dark" />
      </div>

      {/* Title Section */}
      <div className="mt-6 mb-5 text-left">
        <h1 className="text-2xl font-bold text-[#10172A] tracking-tight">
          Choose Your Mode
        </h1>
        <p className="text-xs text-[#667085] mt-1 font-normal">
          What would you like to manage today?
        </p>
      </div>

      {/* Mode Cards Container */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Card 1: Personal Finance */}
        <button
          type="button"
          onClick={handlePersonal}
          className="w-full text-left p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:border-[#6558E8] hover:shadow-lg transition-all duration-200 group flex items-center justify-between"
        >
          <div className="flex items-start gap-3.5 pr-2">
            {/* Purple Icon Badge */}
            <div className="w-12 h-12 rounded-2xl bg-[#EEF0FF] text-[#5145D8] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#5145D8] group-hover:text-white transition-all">
              <User size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#10172A] group-hover:text-[#5145D8] transition-colors">
                Personal Finance
              </h3>
              <p className="text-xs text-[#667085] mt-1 leading-snug">
                Track your expenses, income, savings and get AI insights.
              </p>
            </div>
          </div>
          <ArrowRight
            size={18}
            className="text-slate-400 group-hover:text-[#5145D8] group-hover:translate-x-1 transition-all shrink-0"
          />
        </button>

        {/* Card 2: Shop Manager */}
        <button
          type="button"
          onClick={handleShop}
          className="w-full text-left p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:border-[#C8A96B] hover:shadow-lg transition-all duration-200 group flex items-center justify-between"
        >
          <div className="flex items-start gap-3.5 pr-2">
            {/* Gold Icon Badge */}
            <div className="w-12 h-12 rounded-2xl bg-[#FDF6E9] text-[#C8A96B] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#C8A96B] group-hover:text-white transition-all">
              <Store size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#10172A] group-hover:text-[#C8A96B] transition-colors">
                Shop Manager
              </h3>
              <p className="text-xs text-[#667085] mt-1 leading-snug">
                Manage inventory, sales, profit and customer credit.
              </p>
            </div>
          </div>
          <ArrowRight
            size={18}
            className="text-slate-400 group-hover:text-[#C8A96B] group-hover:translate-x-1 transition-all shrink-0"
          />
        </button>
      </div>

      {/* Bottom Subtitle */}
      <div className="py-4 text-center">
        <span className="text-[11px] font-medium text-slate-400 tracking-wide">
          Same goal. Two powerful ways.
        </span>
      </div>
    </div>
  );
};
