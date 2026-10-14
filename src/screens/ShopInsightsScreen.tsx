import React from 'react';
import { Sparkles, Lightbulb, ArrowLeft } from 'lucide-react';
import { FinoraLogo } from '../components/common/FinoraLogo';
import { useFinance } from '../context/FinanceContext';

interface ShopInsightsScreenProps {
  onBack?: () => void;
  onNavigate: (screen: string) => void;
}

export const ShopInsightsScreen: React.FC<ShopInsightsScreenProps> = ({
  onBack,
  onNavigate
}) => {
  const { shopSummary, products } = useFinance();

  const lowStockItems = products.filter(p => p.stockQuantity <= p.lowStockThreshold);

  return (
    <div className="relative w-full flex-1 min-h-[100dvh] bg-[#F8FAFC] text-[#111B3B] flex flex-col justify-between p-4 sm:p-5 select-none overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pt-2 pb-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={16} />
            </button>
          ) : (
            <FinoraLogo size="sm" variant="dark" />
          )}

          {!onBack && <FinoraLogo size="sm" variant="dark" />}

          <div className="w-8" />
        </div>

        {/* Section Heading with Gold Sparkle */}
        <div className="mt-1 mb-3 text-left">
          <div className="inline-flex items-center gap-1.5 text-base font-bold text-[#10172A]">
            <Sparkles size={16} className="text-[#C8A96B] fill-[#C8A96B]" />
            <span>Shop AI Insights</span>
          </div>
          <p className="text-xs text-[#667085] mt-0.5">
            Your business at a glance.
          </p>
        </div>
      </div>

      {/* Main Insights Content */}
      <div className="flex-1 space-y-3.5">
        {/* 1. Main Highlight Card (Light yellow/amber card matching reference) */}
        <div className="w-full bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-3.5 shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb size={18} />
          </div>
          <p className="text-xs text-[#78350F] leading-relaxed font-medium">
            Great job! Your sales increased by <strong>18%</strong> this week. <strong>Biscuits</strong> are your top seller. Consider increasing stock to avoid shortages.
          </p>
        </div>

        {/* 2. Performance Summary Card (2x2 grid inside white card) */}
        <div className="w-full bg-white rounded-3xl p-4 shadow-card border border-slate-100">
          <h4 className="text-xs font-bold text-[#10172A] mb-3">
            Performance Summary
          </h4>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {/* Total Sales */}
            <div className="p-2.5 bg-slate-50/80 rounded-2xl border border-slate-100 min-w-0">
              <span className="text-[10px] font-semibold text-slate-400 block truncate">Total Sales</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#10172A] block mt-0.5 truncate">
                ₹ {shopSummary.totalSales > 0 ? shopSummary.totalSales.toLocaleString('en-IN') : '48,750'}
              </span>
              <span className="text-[10px] font-bold text-[#15966A] block mt-0.5">
                ↑ 18%
              </span>
            </div>

            {/* Total Profit */}
            <div className="p-2.5 bg-slate-50/80 rounded-2xl border border-slate-100 min-w-0">
              <span className="text-[10px] font-semibold text-slate-400 block truncate">Total Profit</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#10172A] block mt-0.5 truncate">
                ₹ {shopSummary.netProfit > 0 ? shopSummary.netProfit.toLocaleString('en-IN') : '12,860'}
              </span>
              <span className="text-[10px] font-bold text-[#15966A] block mt-0.5">
                ↑ 22%
              </span>
            </div>

            {/* Remaining Stock */}
            <div className="p-2.5 bg-slate-50/80 rounded-2xl border border-slate-100 min-w-0">
              <span className="text-[10px] font-semibold text-slate-400 block truncate">Remaining Stock</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#10172A] block mt-0.5 truncate">
                15 items
              </span>
            </div>

            {/* Customer Credit */}
            <div className="p-2.5 bg-slate-50/80 rounded-2xl border border-slate-100 min-w-0">
              <span className="text-[10px] font-semibold text-slate-400 block truncate">Customer Credit</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#10172A] block mt-0.5 truncate">
                ₹ {shopSummary.customerCreditTotal > 0 ? shopSummary.customerCreditTotal.toLocaleString('en-IN') : '5,200'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Low Stock Alert Card (Light amber/warning card matching reference) */}
        <div className="w-full bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-3.5 shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb size={18} />
          </div>
          <div className="text-xs text-[#78350F] leading-snug font-medium">
            <span className="font-bold block mb-0.5">Low Stock Alert</span>
            <span>
              {lowStockItems.length > 0
                ? `${lowStockItems.map(p => `${p.name} (${p.stockQuantity} items)`).join(' and ')} are running low. Consider restocking.`
                : 'Milk (3 items) and Chips (5 items) are running low. Consider restocking.'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Button: View detailed report */}
      <div className="pt-3">
        <button
          type="button"
          onClick={() => onNavigate('shop-reports')}
          className="w-full py-3.5 px-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-[#5145D8] hover:shadow-md text-[#10172A] font-bold text-xs flex items-center justify-center transition-all group active:scale-[0.98]"
        >
          <span>View detailed report</span>
        </button>
      </div>
    </div>
  );
};
