import React from 'react';
import { Home, Plus, Sparkles, MoreHorizontal, Package } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface BottomNavProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  onNavigate,
  className = ''
}) => {
  const { mode } = useFinance();

  const isPersonal = mode === 'personal';

  return (
    <div
      className={`w-full bg-[#0B1431] border-t border-slate-800/80 px-6 py-2.5 flex items-center justify-between text-slate-400 select-none ${className}`}
    >
      {/* 1. Home */}
      <button
        type="button"
        onClick={() => onNavigate(isPersonal ? 'personal-dashboard' : 'shop-dashboard')}
        className={`flex flex-col items-center justify-center transition-colors group ${
          activeScreen === 'personal-dashboard' || activeScreen === 'shop-dashboard'
            ? 'text-[#6558E8]'
            : 'hover:text-slate-200'
        }`}
      >
        <Home
          size={20}
          className={`transition-transform group-hover:scale-110 ${
            activeScreen === 'personal-dashboard' || activeScreen === 'shop-dashboard'
              ? 'stroke-[2.5]'
              : 'stroke-[1.75]'
          }`}
        />
        <span className="text-[10px] font-medium mt-1">Home</span>
      </button>

      {/* 2. Add Button */}
      <button
        type="button"
        onClick={() => onNavigate(isPersonal ? 'personal-add-voice' : 'shop-record-sale')}
        className={`flex flex-col items-center justify-center transition-colors group ${
          activeScreen === 'personal-add-voice' || activeScreen === 'shop-record-sale' || activeScreen === 'shop-add-product'
            ? 'text-[#6558E8]'
            : 'hover:text-slate-200'
        }`}
      >
        <div className="w-8 h-8 rounded-full border border-slate-700/80 flex items-center justify-center bg-slate-900/60 group-hover:border-[#6558E8] group-hover:bg-[#6558E8]/10 transition-all">
          <Plus size={18} className="stroke-[2.5]" />
        </div>
        <span className="text-[10px] font-medium mt-0.5">Add</span>
      </button>

      {/* 3. Insights or Inventory */}
      {isPersonal ? (
        <button
          type="button"
          onClick={() => onNavigate('personal-insights')}
          className={`flex flex-col items-center justify-center transition-colors group ${
            activeScreen === 'personal-insights' ? 'text-[#6558E8]' : 'hover:text-slate-200'
          }`}
        >
          <Sparkles
            size={20}
            className={`transition-transform group-hover:scale-110 ${
              activeScreen === 'personal-insights' ? 'stroke-[2.5]' : 'stroke-[1.75]'
            }`}
          />
          <span className="text-[10px] font-medium mt-1">Insights</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onNavigate('shop-insights')}
          className={`flex flex-col items-center justify-center transition-colors group ${
            activeScreen === 'shop-insights' ? 'text-[#6558E8]' : 'hover:text-slate-200'
          }`}
        >
          <Package
            size={20}
            className={`transition-transform group-hover:scale-110 ${
              activeScreen === 'shop-insights' ? 'stroke-[2.5]' : 'stroke-[1.75]'
            }`}
          />
          <span className="text-[10px] font-medium mt-1">Inventory</span>
        </button>
      )}

      {/* 4. More (Menu / Profile) */}
      <button
        type="button"
        onClick={() => onNavigate('menu-profile')}
        className={`flex flex-col items-center justify-center transition-colors group ${
          activeScreen === 'menu-profile' ? 'text-[#6558E8]' : 'hover:text-slate-200'
        }`}
      >
        <MoreHorizontal
          size={20}
          className={`transition-transform group-hover:scale-110 ${
            activeScreen === 'menu-profile' ? 'stroke-[2.5]' : 'stroke-[1.75]'
          }`}
        />
        <span className="text-[10px] font-medium mt-1">More</span>
      </button>
    </div>
  );
};
