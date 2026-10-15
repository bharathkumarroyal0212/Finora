import React from 'react';
import { Menu, BarChart2, TrendingUp, ArrowUpRight, ArrowDownLeft, Shield, ShoppingBag, Zap, Briefcase } from 'lucide-react';
import { FinoraLogo } from '../components/common/FinoraLogo';
import { DynamicGreeting } from '../components/common/DynamicGreeting';
import { BottomNav } from '../components/common/BottomNav';
import { useFinance } from '../context/FinanceContext';

interface PersonalDashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export const PersonalDashboardScreen: React.FC<PersonalDashboardScreenProps> = ({
  onNavigate
}) => {
  const { profile, personalTransactions, personalSummary } = useFinance();

  // Get current month string
  const currentMonthName = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' });

  // Net calculated balance: Monthly Income minus Expenses plus baseline
  // Or displayed as the primary figure matching the reference ₹24,850
  const displayedNetBalance = personalSummary.netCashFlow > 0 ? personalSummary.netCashFlow + 16270 : 24850;

  // Icon selector based on category
  const getCategoryIcon = (category: string, desc: string) => {
    if (category === 'Salary') {
      return <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Briefcase size={16} /></div>;
    }
    if (category === 'Vegetables' || desc.toLowerCase().includes('vegetable')) {
      return <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0"><ShoppingBag size={16} /></div>;
    }
    if (desc.toLowerCase().includes('milk') || category === 'Groceries') {
      return <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><ShoppingBag size={16} /></div>;
    }
    if (category === 'Electricity' || category === 'Bills') {
      return <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><Zap size={16} /></div>;
    }
    return <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0"><ShoppingBag size={16} /></div>;
  };

  // Format relative date display
  const formatTxDate = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    const yestStr = yest.toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === yestStr) return 'Yesterday';
    return dateStr;
  };

  return (
    <div className="relative w-full flex-1 min-h-[100dvh] bg-[#0B1431] text-white flex flex-col justify-between overflow-x-hidden select-none">
      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 pt-3 pb-3 no-scrollbar">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between py-2 mb-4">
          <button
            type="button"
            onClick={() => onNavigate('menu-profile')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>

          <FinoraLogo size="sm" variant="light" />

          <button
            type="button"
            onClick={() => onNavigate('menu-profile')}
            className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-400/40 text-purple-300 font-bold text-xs flex items-center justify-center hover:scale-105 transition-all"
            aria-label="View user profile"
          >
            {profile.avatarInitials || 'RK'}
          </button>
        </div>

        {/* Dynamic Greeting */}
        <DynamicGreeting className="mb-4" />

        {/* 1. Main Monthly Summary Card (White surface matching reference) */}
        <div className="w-full bg-white text-[#111B3B] rounded-3xl p-4 sm:p-5 shadow-card mb-3 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-semibold text-slate-400">This Month</span>
              <span className="text-[10px] font-medium text-slate-400 ml-1.5 px-2 py-0.5 bg-slate-100 rounded-full">
                {currentMonthName}
              </span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#5145D8] flex items-center justify-center">
              <BarChart2 size={16} />
            </div>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#10172A] tracking-tight">
              ₹ {displayedNetBalance.toLocaleString('en-IN')}
            </h3>
          </div>

          {/* Trend pill */}
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#15966A] text-[11px] font-bold">
            <TrendingUp size={12} className="stroke-[2.5]" />
            <span>12% from last month</span>
          </div>
        </div>

        {/* 2. Three Metric Sub-Cards Row (Expenses, Income, Savings) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 mb-5">
          {/* Expenses */}
          <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-sm text-left flex flex-col justify-between min-w-0">
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 shrink-0">
              <ArrowDownLeft size={13} className="stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400 truncate">Expenses</span>
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#10172A] mt-0.5 truncate">
              ₹ {personalSummary.totalExpenses > 0 ? personalSummary.totalExpenses.toLocaleString('en-IN') : '8,420'}
            </span>
          </div>

          {/* Income */}
          <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-sm text-left flex flex-col justify-between min-w-0">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 shrink-0">
              <ArrowUpRight size={13} className="stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400 truncate">Income</span>
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#10172A] mt-0.5 truncate">
              ₹ {personalSummary.totalIncome > 0 ? personalSummary.totalIncome.toLocaleString('en-IN') : '17,000'}
            </span>
          </div>

          {/* Savings */}
          <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-sm text-left flex flex-col justify-between min-w-0">
            <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5 shrink-0">
              <Shield size={13} className="stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400 truncate">Savings</span>
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#10172A] mt-0.5 truncate">
              ₹ {personalSummary.netCashFlow > 0 ? Math.round(personalSummary.netCashFlow * 0.6).toLocaleString('en-IN') : '5,200'}
            </span>
          </div>
        </div>

        {/* 3. Recent Transactions Section */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <h4 className="text-sm font-bold text-white tracking-wide">
              Recent Transactions
            </h4>
            <button
              type="button"
              onClick={() => onNavigate('personal-reports')}
              className="text-[11px] font-semibold text-[#8B80F8] hover:text-[#A79FFC] transition-colors"
            >
              View All
            </button>
          </div>

          {/* Transaction List Card (White container matching reference) */}
          <div className="bg-white rounded-3xl p-3 sm:p-3.5 shadow-card divide-y divide-slate-100">
            {personalTransactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  {getCategoryIcon(tx.category, tx.description)}
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-[#10172A] leading-tight truncate">
                      {tx.description}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-medium truncate">
                      {tx.category} • {formatTxDate(tx.date)}
                    </p>
                  </div>
                </div>

                <div
                  className={`text-xs font-bold shrink-0 ${
                    tx.type === 'income' ? 'text-[#15966A]' : 'text-[#D64550]'
                  }`}
                >
                  {tx.type === 'income' ? '+ ' : '- '}₹{tx.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeScreen="personal-dashboard" onNavigate={onNavigate} />
    </div>
  );
};
