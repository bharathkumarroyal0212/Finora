import React from 'react';
import { Menu, Bell, TrendingUp, Package, Users, ChevronRight, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { FinoraLogo } from '../components/common/FinoraLogo';
import { BottomNav } from '../components/common/BottomNav';
import { useFinance } from '../context/FinanceContext';

interface ShopDashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export const ShopDashboardScreen: React.FC<ShopDashboardScreenProps> = ({
  onNavigate
}) => {
  const { shopSummary, products } = useFinance();

  // Top products display
  const topProducts = [
    { rank: 1, name: 'Biscuits', units: 48, icon: '🍪', color: 'bg-amber-100 text-amber-800' },
    { rank: 2, name: 'Milk', units: 32, icon: '🥛', color: 'bg-blue-100 text-blue-800' },
    { rank: 3, name: 'Chips', units: 24, icon: '🥔', color: 'bg-orange-100 text-orange-800' },
  ];

  return (
    <div className="relative w-full flex-1 min-h-[100dvh] bg-[#0B1431] text-white flex flex-col justify-between overflow-x-hidden select-none">
      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 pt-3 pb-3 no-scrollbar">
        {/* Top Header */}
        <div className="flex items-center justify-between py-2 mb-3">
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
            onClick={() => onNavigate('shop-insights')}
            className="relative w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white transition-colors"
            aria-label="View shop insights"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0B1431]" />
          </button>
        </div>

        {/* Title */}
        <div className="text-left mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Shop Dashboard
          </h2>
          <p className="text-xs text-slate-300 font-normal mt-0.5">
            Keep track of your store's performance.
          </p>
        </div>

        {/* 2x2 Financial Cards Grid (exact placement per specification) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-5">
          {/* Card 1: Total Sales */}
          <div className="bg-white rounded-3xl p-3 sm:p-3.5 shadow-card text-left flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">Total Sales</span>
              <div className="w-6 h-6 rounded-lg bg-purple-50 text-[#5145D8] flex items-center justify-center shrink-0">
                <ShoppingBag size={13} />
              </div>
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-extrabold text-[#10172A] leading-tight truncate">
              ₹ {shopSummary.totalSales > 0 ? shopSummary.totalSales.toLocaleString('en-IN') : '48,750'}
            </h4>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#15966A] mt-1.5">
              <TrendingUp size={12} className="stroke-[2.5]" />
              <span>18%</span>
            </div>
          </div>

          {/* Card 2: Total Profit */}
          <div className="bg-white rounded-3xl p-3 sm:p-3.5 shadow-card text-left flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">Total Profit</span>
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ArrowUpRight size={13} className="stroke-[2.5]" />
              </div>
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-extrabold text-[#10172A] leading-tight truncate">
              ₹ {shopSummary.netProfit > 0 ? shopSummary.netProfit.toLocaleString('en-IN') : '12,860'}
            </h4>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#15966A] mt-1.5">
              <TrendingUp size={12} className="stroke-[2.5]" />
              <span>22%</span>
            </div>
          </div>

          {/* Card 3: Stock Value */}
          <div className="bg-white rounded-3xl p-3 sm:p-3.5 shadow-card text-left flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">Stock Value</span>
              <div className="w-6 h-6 rounded-lg bg-amber-50 text-[#C8A96B] flex items-center justify-center shrink-0">
                <Package size={13} />
              </div>
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-extrabold text-[#10172A] leading-tight truncate">
              ₹ {shopSummary.stockValue > 0 ? shopSummary.stockValue.toLocaleString('en-IN') : '28,400'}
            </h4>
            <span className="text-[10px] font-semibold text-slate-400 mt-1.5 truncate">
              + {products.length || 6} items
            </span>
          </div>

          {/* Card 4: Customer Credit */}
          <div className="bg-white rounded-3xl p-3 sm:p-3.5 shadow-card text-left flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">Customer Credit</span>
              <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Users size={13} />
              </div>
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-extrabold text-[#10172A] leading-tight truncate">
              ₹ {shopSummary.customerCreditTotal > 0 ? shopSummary.customerCreditTotal.toLocaleString('en-IN') : '5,200'}
            </h4>
            <span className="text-[10px] font-semibold text-slate-400 mt-1.5 truncate">
              {shopSummary.creditCustomerCount || 2} customers
            </span>
          </div>
        </div>

        {/* Top Selling Products */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h4 className="text-sm font-bold text-white tracking-wide">
              Top Selling Products
            </h4>
            <button
              type="button"
              onClick={() => onNavigate('shop-insights')}
              className="text-[11px] font-semibold text-[#8B80F8] hover:text-[#A79FFC] transition-colors"
            >
              View All
            </button>
          </div>

          <div className="bg-white rounded-3xl p-3 sm:p-3.5 shadow-card divide-y divide-slate-100">
            {topProducts.map((p) => (
              <div
                key={p.rank}
                onClick={() => onNavigate('shop-record-sale')}
                className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 rounded-xl px-1 transition-colors"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  {/* Rank badge */}
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {p.rank}
                  </span>

                  {/* Thumbnail / Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${p.color} shrink-0 shadow-sm`}>
                    {p.icon}
                  </div>

                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-[#10172A] leading-tight truncate">
                      {p.name}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-medium truncate">
                      {p.units} units
                    </p>
                  </div>
                </div>

                <ChevronRight size={16} className="text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav activeScreen="shop-dashboard" onNavigate={onNavigate} />
    </div>
  );
};
