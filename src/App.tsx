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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navigateTo = (screen: string) => {
    if (screen === 'menu-profile') {
      setIsMenuOpen(true);
      return;
    }

    setIsMenuOpen(false);
    setCurrentScreen(screen);
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onGetStarted={() => navigateTo('select-mode')}
            onLogin={() => setIsAuthOpen(true)}
          />
        );
      case 'select-mode':
        return (
          <ModeSelectionScreen
            onSelectPersonal={() => {
              setMode('personal');
              navigateTo('personal-dashboard');
            }}
            onSelectShop={() => {
              setMode('shop');
              navigateTo('shop-dashboard');
            }}
          />
        );
      case 'personal-dashboard':
        return <PersonalDashboardScreen onNavigate={navigateTo} />;
      case 'personal-add-voice':
        return (
          <VoiceInputPersonalScreen
            onBack={() => navigateTo('personal-dashboard')}
            onNavigate={navigateTo}
          />
        );
      case 'personal-insights':
        return (
          <PersonalInsightsScreen
            onBack={() => navigateTo('personal-dashboard')}
            onNavigate={navigateTo}
          />
        );
      case 'shop-dashboard':
        return <ShopDashboardScreen onNavigate={navigateTo} />;
      case 'shop-add-product':
        return (
          <AddProductScreen
            onBack={() => navigateTo('shop-dashboard')}
            onNavigate={navigateTo}
          />
        );
      case 'shop-record-sale':
        return (
          <RecordSaleScreen
            onBack={() => navigateTo('shop-dashboard')}
            onNavigate={navigateTo}
          />
        );
      case 'shop-insights':
        return (
          <ShopInsightsScreen
            onBack={() => navigateTo('shop-dashboard')}
            onNavigate={navigateTo}
          />
        );
      case 'menu-profile':
        return (
          <MenuProfileScreen
            onNavigate={navigateTo}
            onLogout={() => {
              logout();
              navigateTo('welcome');
            }}
          />
        );
      case 'personal-reports':
        return (
          <ReportsScreen
            reportType="personal"
            onBack={() => navigateTo('personal-dashboard')}
          />
        );
      case 'shop-reports':
        return (
          <ReportsScreen
            reportType="shop"
            onBack={() => navigateTo('shop-dashboard')}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            onBack={() => navigateTo(mode === 'personal' ? 'personal-dashboard' : 'shop-dashboard')}
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
              onClick={() => navigateTo(mode === 'personal' ? 'personal-dashboard' : 'shop-dashboard')}
              className="w-full py-3.5 bg-[#5145D8] hover:bg-[#4338CA] text-white rounded-2xl text-xs font-bold shadow-md transition-all active:scale-[0.98]"
            >
              Back to Dashboard
            </button>
          </div>
        );
      default:
        return <PersonalDashboardScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#070B1E] text-slate-100 flex flex-col items-center justify-start overflow-x-hidden selection:bg-[#5145D8] selection:text-white">
      <div className="w-full max-w-full md:max-w-[900px] lg:max-w-[1440px] min-h-[100dvh] md:min-h-[calc(100dvh-3rem)] flex bg-[#0B1431] md:my-6 md:rounded-[32px] md:shadow-2xl md:border md:border-slate-800/80 overflow-hidden relative">
        {currentScreen !== 'welcome' && currentScreen !== 'select-mode' && (
          <MenuProfileScreen
            isDrawer
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onNavigate={navigateTo}
            onLogout={() => {
              logout();
              navigateTo('welcome');
            }}
          />
        )}
        <main className="min-w-0 flex-1 flex flex-col">
          {renderActiveScreen()}
        </main>
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
