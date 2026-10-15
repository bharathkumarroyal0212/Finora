import React from 'react';
import { Home, User, Store, FileText, Settings, HelpCircle, LogOut, ChevronRight, X } from 'lucide-react';
import { FinoraLogo } from '../components/common/FinoraLogo';
import { useFinance } from '../context/FinanceContext';

interface MenuProfileScreenProps {
  isDrawer?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export const MenuProfileScreen: React.FC<MenuProfileScreenProps> = ({
  isDrawer = false,
  isOpen = true,
  onClose = () => {},
  onNavigate,
  onLogout
}) => {
  const { profile, mode, setMode } = useFinance();

  const handleSelectMode = (newMode: 'personal' | 'shop') => {
    setMode(newMode);
    onNavigate(newMode === 'personal' ? 'personal-dashboard' : 'shop-dashboard');
  };

  return (
    <div className={isDrawer ? `fixed inset-0 z-40 lg:static lg:inset-auto lg:z-auto ${isOpen ? '' : 'invisible pointer-events-none'} lg:visible lg:pointer-events-auto` : 'relative w-full flex-1 min-h-[100dvh]'}>
      {isDrawer && (
        <button
          type="button"
          onClick={onClose}
          className={`absolute inset-0 bg-black/60 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Close navigation menu"
        />
      )}
      <aside className={isDrawer
        ? `absolute inset-y-0 left-0 z-10 flex w-[min(88vw,20rem)] flex-col bg-[#0B1431] p-4 text-white shadow-2xl transition-transform sm:p-5 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:inset-auto lg:z-auto lg:min-h-[100dvh] lg:w-64 lg:shrink-0 lg:translate-x-0 lg:border-r lg:border-slate-800/80 lg:shadow-none`
        : 'relative flex w-full flex-1 flex-col justify-between overflow-hidden bg-[#0B1431] p-4 text-white sm:p-5'}>
      {/* Decorative Wave Lines at Bottom (matching reference) */}
      <div className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none overflow-hidden opacity-50">
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-20 180 C80 120 180 200 420 130"
            stroke="url(#wavePurpleMenu)"
            strokeWidth="2.5"
            strokeOpacity="0.7"
          />
          <path
            d="M-20 200 C120 150 240 210 420 160"
            stroke="url(#waveGoldMenu)"
            strokeWidth="2"
            strokeOpacity="0.8"
          />
          <defs>
            <linearGradient id="wavePurpleMenu" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5145D8" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="waveGoldMenu" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C8A96B" />
              <stop offset="100%" stopColor="#E6C88A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Top Header */}
      <div className="z-10">
        <div className="flex items-center justify-between gap-2 pt-2 pb-4">
          <FinoraLogo size="sm" variant="light" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white transition-colors lg:hidden"
              aria-label="Close navigation menu"
            >
              <X size={16} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white transition-colors"
              aria-label="Settings"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Profile Avatar Card */}
        <div className="flex flex-col items-center justify-center py-2 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#5145D8] to-[#7C3AED] border-2 border-purple-400/50 flex items-center justify-center text-white font-black text-xl shadow-lg mb-2.5">
            {profile.avatarInitials || 'RK'}
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            {profile.name || 'Ramesh Kumar'}
          </h3>
          <p className="text-xs text-slate-400 font-normal">
            {profile.email || 'ramesh@example.com'}
          </p>
        </div>
      </div>

      {/* Navigation Menu List */}
      <div className="flex-1 my-3 space-y-1.5 z-10 overflow-y-auto no-scrollbar">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => onNavigate(mode === 'personal' ? 'personal-dashboard' : 'shop-dashboard')}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#5145D8]/20 border border-[#5145D8]/40 text-white hover:bg-[#5145D8]/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Home size={18} className="text-[#8B80F8]" />
            <span className="text-xs font-semibold">Home</span>
          </div>
          <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 2. Personal Finance */}
        <button
          type="button"
          onClick={() => handleSelectMode('personal')}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all group"
        >
          <div className="flex items-center gap-3">
            <User size={18} className="text-slate-400 group-hover:text-white" />
            <span className="text-xs font-semibold">Personal Finance</span>
          </div>
          <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 3. Shop Manager */}
        <button
          type="button"
          onClick={() => handleSelectMode('shop')}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all group"
        >
          <div className="flex items-center gap-3">
            <Store size={18} className="text-slate-400 group-hover:text-white" />
            <span className="text-xs font-semibold">Shop Manager</span>
          </div>
          <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 4. Reports */}
        <button
          type="button"
          onClick={() => onNavigate(mode === 'personal' ? 'personal-reports' : 'shop-reports')}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all group"
        >
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-slate-400 group-hover:text-white" />
            <span className="text-xs font-semibold">Reports</span>
          </div>
          <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 5. Settings */}
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all group"
        >
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-slate-400 group-hover:text-white" />
            <span className="text-xs font-semibold">Settings</span>
          </div>
          <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 6. Help & Support */}
        <button
          type="button"
          onClick={() => onNavigate('help')}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all group"
        >
          <div className="flex items-center gap-3">
            <HelpCircle size={18} className="text-slate-400 group-hover:text-white" />
            <span className="text-xs font-semibold">Help & Support</span>
          </div>
          <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 7. Log Out */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-[#D64550] transition-all group"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} className="text-[#D64550]" />
            <span className="text-xs font-bold">Log Out</span>
          </div>
        </button>
      </div>

      {/* Footer Version Tag */}
      <div className="pt-2 text-center z-10">
        <span className="text-[10px] text-slate-500 tracking-wider">
          FINORA v1.0.0
        </span>
      </div>
      </aside>
    </div>
  );
};
