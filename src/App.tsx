import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { VoiceProvider } from './context/VoiceContext';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { ModeSelectionScreen } from './screens/ModeSelectionScreen';
import { PersonalDashboardScreen } from './screens/PersonalDashboardScreen';
import { VoiceInputPersonalScreen } from './screens/VoiceInputPersonalScreen';
import { PersonalInsightsScreen } from './screens/PersonalInsightsScreen';
import { ShopDashboardScreen } from './screens/ShopDashboardScreen';
import { AddProductScreen } from './screens/AddProductScreen';
import { RecordSaleScreen } from './screens/RecordSaleScreen';
import { ShopInsightsScreen } from './screens/ShopInsightsScreen';
import { MenuProfileScreen } from './screens/MenuProfileScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AuthModal } from './screens/AuthModal';
import { TransactionReviewModal } from './components/personal/TransactionReviewModal';
import { SalePurchaseReviewModal } from './components/shop/SalePurchaseReviewModal';

const MainAppContent: React.FC = () => {
  const { mode, setMode, isAuthenticated, logout } = useFinance();
  const [currentScreen, setCurrentScreen] = useState<string>(() => {
    return isAuthenticated ? (mode === 'shop' ? 'shop-dashboard' : 'personal-dashboard') : 'welcome';
  });
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onGetStarted={() => setCurrentScreen('select-mode')}
            onLogin={() => setIsAuthOpen(true)}
          />
        );
      case 'select-mode':
        return (
          <ModeSelectionScreen
            onSelectPersonal={() => {
              setMode('personal');
              setCurrentScreen('personal-dashboard');
            }}
            onSelectShop={() => {
              setMode('shop');
              setCurrentScreen('shop-dashboard');
            }}
          />
        );
      case 'personal-dashboard':
        return <PersonalDashboardScreen onNavigate={setCurrentScreen} />;
      case 'personal-add-voice':
        return (
          <VoiceInputPersonalScreen
            onBack={() => setCurrentScreen('personal-dashboard')}
            onNavigate={setCurrentScreen}
          />
        );
      case 'personal-insights':
        return (
          <PersonalInsightsScreen
            onBack={() => setCurrentScreen('personal-dashboard')}
            onNavigate={setCurrentScreen}
          />
        );
      case 'shop-dashboard':
        return <ShopDashboardScreen onNavigate={setCurrentScreen} />;
      case 'shop-add-product':
        return (
          <AddProductScreen
            onBack={() => setCurrentScreen('shop-dashboard')}
            onNavigate={setCurrentScreen}
          />
        );
      case 'shop-record-sale':
        return (
          <RecordSaleScreen
            onBack={() => setCurrentScreen('shop-dashboard')}
            onNavigate={setCurrentScreen}
          />
        );
      case 'shop-insights':
        return (
          <ShopInsightsScreen
            onBack={() => setCurrentScreen('shop-dashboard')}
            onNavigate={setCurrentScreen}
          />
        );
      case 'menu-profile':
        return (
          <MenuProfileScreen
            onNavigate={setCurrentScreen}
            onLogout={() => {
              logout();
              setCurrentScreen('welcome');
            }}
          />
        );
      case 'personal-reports':
        return (
          <ReportsScreen
            reportType="personal"
            onBack={() => setCurrentScreen('personal-dashboard')}
          />
        );
      case 'shop-reports':
        return (
          <ReportsScreen
            reportType="shop"
            onBack={() => setCurrentScreen('shop-dashboard')}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            onBack={() => setCurrentScreen(mode === 'personal' ? 'personal-dashboard' : 'shop-dashboard')}
          />
        );
      case 'help':
        return (
          <div className="p-6 bg-[#F8FAFC] text-[#111B3B] min-h-[100dvh] flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#10172A] mb-2">Help & Support</h3>
              <p className="text-xs text-slate-600 mb-4">
                FINORA provides natural-language voice finance management for personal expenses and small business shopkeeping.
              </p>
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
                  <strong className="block text-[#5145D8] mb-1">Spoken Voice Input:</strong>
                  Say: "I spent 300 rupees on petrol and 200 rupees on vegetables" to instantly create 2 separate records!
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
                  <strong className="block text-[#C8A96B] mb-1">Shop Sales Voice Input:</strong>
                  Say: "Sold 5 biscuit packets for 150 rupees" to update inventory and sales instantly.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentScreen(mode === 'personal' ? 'personal-dashboard' : 'shop-dashboard')}
              className="w-full py-3.5 bg-[#5145D8] hover:bg-[#4338CA] text-white rounded-2xl text-xs font-bold shadow-md transition-all active:scale-[0.98]"
            >
              Back to Dashboard
            </button>
          </div>
        );
      default:
        return <PersonalDashboardScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#070B1E] text-slate-100 flex flex-col items-center justify-start overflow-x-hidden selection:bg-[#5145D8] selection:text-white">
      {/* Responsive Customer Application Container:
          - Fluid full-width edge-to-edge on mobile phones (320px–767px)
          - Centered in a refined, beautifully proportioned mobile-width application frame on tablet & desktop (768px+)
      */}
      <div className="w-full max-w-full md:max-w-[430px] lg:max-w-[450px] min-h-[100dvh] flex flex-col bg-[#0B1431] md:my-6 md:min-h-[820px] md:max-h-[92vh] md:rounded-[40px] md:shadow-2xl md:border md:border-slate-800/80 overflow-hidden relative">
        {renderActiveScreen()}
      </div>

      {/* Interactive Modals & Dialogs */}
      <TransactionReviewModal />
      <SalePurchaseReviewModal />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <FinanceProvider>
      <VoiceProvider>
        <MainAppContent />
      </VoiceProvider>
    </FinanceProvider>
  );
}

export default App;
