import React from 'react';
import { PhoneFrame } from '../components/common/PhoneFrame';
import { WelcomeScreen } from './WelcomeScreen';
import { ModeSelectionScreen } from './ModeSelectionScreen';
import { PersonalDashboardScreen } from './PersonalDashboardScreen';
import { VoiceInputPersonalScreen } from './VoiceInputPersonalScreen';
import { PersonalInsightsScreen } from './PersonalInsightsScreen';
import { ShopDashboardScreen } from './ShopDashboardScreen';
import { AddProductScreen } from './AddProductScreen';
import { RecordSaleScreen } from './RecordSaleScreen';
import { ShopInsightsScreen } from './ShopInsightsScreen';
import { MenuProfileScreen } from './MenuProfileScreen';
import { FinoraLogo } from '../components/common/FinoraLogo';
import { Mic, User, Store, Sparkles, Smartphone, Eye } from 'lucide-react';

interface MasterShowcaseViewProps {
  onSelectScreen: (screenId: string) => void;
  onOpenAuth: () => void;
}

export const MasterShowcaseView: React.FC<MasterShowcaseViewProps> = ({
  onSelectScreen,
  onOpenAuth
}) => {
  return (
    <div className="w-full bg-[#0B1431] text-white min-h-screen py-8 px-4 sm:px-8 flex flex-col items-center select-none overflow-x-auto">
      {/* Top Banner exactly matching the reference image top header */}
      <div className="w-full max-w-[1720px] flex flex-col md:flex-row items-center justify-between pb-8 mb-8 border-b border-slate-800/80 gap-4">
        {/* Left: Finora Logo & Tagline */}
        <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-4 text-center sm:text-left">
          <FinoraLogo size="xl" variant="light" />
          <div className="hidden sm:block h-6 w-px bg-slate-700 mx-2" />
          <span className="text-slate-300 font-medium text-sm sm:text-base tracking-wide">
            Smart Money. Better Tomorrow.
          </span>
        </div>

        {/* Right tags */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-widest font-bold text-slate-400">
          <span>PERSONAL FINANCE &nbsp;/&nbsp; SMALL BUSINESS</span>
          <span className="hidden md:inline text-slate-700">•</span>
          <span>VOICE ENABLED &nbsp;/&nbsp; AI INSIGHTS</span>
        </div>
      </div>

      {/* 10 Live Screens Grid: Row 1 (Screens 1 to 5) */}
      <div className="w-full max-w-[1720px] mb-12">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-sm font-bold tracking-wider text-[#C8A96B] uppercase flex items-center gap-2">
            <span>Part 1: Onboarding & Personal Finance</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Screens 1 – 5</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6 justify-items-center">
          {/* Screen 1: Welcome Screen */}
          <div
            onClick={() => onSelectScreen('welcome')}
            className="cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
          >
            <PhoneFrame screenNumber={1} screenTitle="Welcome Screen" isDarkTheme={true}>
              <WelcomeScreen
                onGetStarted={() => onSelectScreen('select-mode')}
                onLogin={onOpenAuth}
              />
            </PhoneFrame>
          </div>

          {/* Screen 2: Mode Selection */}
          <div
            onClick={() => onSelectScreen('select-mode')}
            className="cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
          >
            <PhoneFrame screenNumber={2} screenTitle="Home / Mode Selection" isDarkTheme={false}>
              <ModeSelectionScreen
                onSelectPersonal={() => onSelectScreen('personal-dashboard')}
                onSelectShop={() => onSelectScreen('shop-dashboard')}
              />
            </PhoneFrame>
          </div>

          {/* Screen 3: Personal Dashboard */}
          <div
            onClick={() => onSelectScreen('personal-dashboard')}
            className="cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
          >
            <PhoneFrame screenNumber={3} screenTitle="Personal Dashboard" isDarkTheme={true}>
              <PersonalDashboardScreen onNavigate={onSelectScreen} />
            </PhoneFrame>
          </div>

          {/* Screen 4: Voice Input (Personal) */}
          <div
            onClick={() => onSelectScreen('personal-add-voice')}
            className="cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
          >
            <PhoneFrame screenNumber={4} screenTitle="Voice Input (Personal)" isDarkTheme={false}>
              <VoiceInputPersonalScreen
                onBack={() => onSelectScreen('personal-dashboard')}
                onNavigate={onSelectScreen}
              />
            </PhoneFrame>
          </div>

          {/* Screen 5: Personal AI Insights */}
          <div
            onClick={() => onSelectScreen('personal-insights')}
            className="cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
          >
            <PhoneFrame screenNumber={5} screenTitle="Personal AI Insights" isDarkTheme={false}>
              <PersonalInsightsScreen onNavigate={onSelectScreen} />
            </PhoneFrame>
          </div>
        </div>
      </div>

      {/* 10 Live Screens Grid: Row 2 (Screens 6 to 10) */}
      <div className="w-full max-w-[1720px] mb-12">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-sm font-bold tracking-wider text-[#C8A96B] uppercase flex items-center gap-2">
            <span>Part 2: Shop Management & Profile</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Screens 6 – 10</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6 justify-items-center">
          {/* Screen 6: Shop Dashboard */}
          <div
            onClick={() => onSelectScreen('shop-dashboard')}
            className="cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
          >
            <PhoneFrame screenNumber={6} screenTitle="Shop Dashboard" isDarkTheme={true}>
              <ShopDashboardScreen onNavigate={onSelectScreen} />
            </PhoneFrame>
          </div>

          {/* Screen 7: Add Product */}
          <div
            onClick={() => onSelectScreen('shop-add-product')}
            className="cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
          >
            <PhoneFrame screenNumber={7} screenTitle="Add Product" isDarkTheme={false}>
              <AddProductScreen
                onBack={() => onSelectScreen('shop-dashboard')}
                onNavigate={onSelectScreen}
              />
            </PhoneFrame>
          </div>

          {/* Screen 8: Record Sale (Voice) */}
          <div
            onClick={() => onSelectScreen('shop-record-sale')}
            className="cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
          >
            <PhoneFrame screenNumber={8} screenTitle="Record Sale (Voice)" isDarkTheme={false}>
              <RecordSaleScreen
                onBack={() => onSelectScreen('shop-dashboard')}
                onNavigate={onSelectScreen}
              />
            </PhoneFrame>
          </div>

          {/* Screen 9: Shop AI Insights */}
          <div
            onClick={() => onSelectScreen('shop-insights')}
            className="cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
          >
            <PhoneFrame screenNumber={9} screenTitle="Shop AI Insights" isDarkTheme={false}>
              <ShopInsightsScreen onNavigate={onSelectScreen} />
            </PhoneFrame>
          </div>

          {/* Screen 10: Menu / Profile */}
          <div
            onClick={() => onSelectScreen('menu-profile')}
            className="cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
          >
            <PhoneFrame screenNumber={10} screenTitle="Menu / Profile" isDarkTheme={true}>
              <MenuProfileScreen
                onNavigate={onSelectScreen}
                onLogout={onOpenAuth}
              />
            </PhoneFrame>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar matching reference poster footer */}
      <div className="w-full max-w-[1720px] pt-8 mt-4 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-xs">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <FinoraLogo size="sm" variant="light" />
          <span className="text-slate-300 font-semibold text-xs">Smart Money. Better Tomorrow.</span>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <Mic size={15} className="text-[#8B80F8]" />
            <span>Voice Enabled</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User size={15} className="text-[#8B80F8]" />
            <span>Personal Finance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Store size={15} className="text-[#C8A96B]" />
            <span>Small Business</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={15} className="text-[#C8A96B]" />
            <span>AI Insights</span>
          </div>
        </div>

        {/* Cursive Tagline */}
        <div className="font-serif italic text-base text-slate-300">
          Built for real life.
        </div>
      </div>
    </div>
  );
};
