import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { TimeFilter } from '../types/finance';

interface ReportsScreenProps {
  onBack: () => void;
  reportType?: 'personal' | 'shop';
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  onBack,
  reportType = 'personal'
}) => {
  const {
    timeFilter,
    setTimeFilter,
    personalSummary,
    shopSummary,
    products
  } = useFinance();

  return (
    <div className="relative w-full flex-1 min-h-[100dvh] bg-[#F8FAFC] text-[#111B3B] flex flex-col justify-between p-4 sm:p-5 select-none overflow-y-auto no-scrollbar">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pt-2 pb-3">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </button>

          <h2 className="text-base font-bold text-[#10172A]">
            {reportType === 'personal' ? 'Personal Financial Report' : 'Shop Business Report'}
          </h2>

          <div className="w-8" />
        </div>

        {/* Time Filters: Daily, Weekly, Monthly, All */}
        <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl mb-4">
          {(['daily', 'weekly', 'monthly', 'all'] as TimeFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setTimeFilter(f)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl capitalize transition-all ${
                timeFilter === f
                  ? 'bg-[#5145D8] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      <div className="flex-1 space-y-4">
        {reportType === 'personal' ? (
          <>
            {/* Personal Key Financials */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              <div className="p-3 bg-white rounded-2xl shadow-card border border-slate-100 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase truncate block">Total Income</span>
                <h4 className="text-xs sm:text-sm md:text-base font-extrabold text-[#15966A] mt-1 truncate">
                  ₹ {personalSummary.totalIncome.toLocaleString('en-IN')}
                </h4>
              </div>

              <div className="p-3 bg-white rounded-2xl shadow-card border border-slate-100 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase truncate block">Total Expenses</span>
                <h4 className="text-xs sm:text-sm md:text-base font-extrabold text-[#D64550] mt-1 truncate">
                  ₹ {personalSummary.totalExpenses.toLocaleString('en-IN')}
                </h4>
              </div>

              <div className="p-3 bg-white rounded-2xl shadow-card border border-slate-100 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase truncate block">Net Cash Flow</span>
                <h4 className={`text-xs sm:text-sm md:text-base font-extrabold mt-1 truncate ${personalSummary.netCashFlow >= 0 ? 'text-[#10172A]' : 'text-[#D64550]'}`}>
                  ₹ {personalSummary.netCashFlow.toLocaleString('en-IN')}
                </h4>
              </div>

              <div className="p-3 bg-white rounded-2xl shadow-card border border-slate-100 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase truncate block">Savings Rate</span>
                <h4 className="text-xs sm:text-sm md:text-base font-extrabold text-[#5145D8] mt-1 truncate">
                  {personalSummary.savingsRate}%
                </h4>
              </div>
            </div>

            {/* Category Breakdown Table */}
            <div className="bg-white rounded-3xl p-4 shadow-card border border-slate-100">
              <h4 className="text-xs font-bold text-[#10172A] mb-3">
                Spending by Category
              </h4>
              <div className="space-y-2.5">
                {personalSummary.categoryBreakdown.map((cat, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="font-semibold text-slate-700 truncate">{cat.category}</span>
                      <span className="font-bold text-[#10172A] shrink-0">₹{cat.amount.toLocaleString('en-IN')} ({cat.percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Shop Key Financials */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              <div className="p-3 bg-white rounded-2xl shadow-card border border-slate-100 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase truncate block">Sales Revenue</span>
                <h4 className="text-xs sm:text-sm md:text-base font-extrabold text-[#10172A] mt-1 truncate">
                  ₹ {shopSummary.totalSales.toLocaleString('en-IN')}
                </h4>
              </div>

              <div className="p-3 bg-white rounded-2xl shadow-card border border-slate-100 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase truncate block">Cost of Goods (COGS)</span>
                <h4 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-700 mt-1 truncate">
                  ₹ {shopSummary.costOfGoodsSold.toLocaleString('en-IN')}
                </h4>
              </div>

              <div className="p-3 bg-white rounded-2xl shadow-card border border-slate-100 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase truncate block">Gross Profit</span>
                <h4 className="text-xs sm:text-sm md:text-base font-extrabold text-[#15966A] mt-1 truncate">
                  ₹ {shopSummary.grossProfit.toLocaleString('en-IN')}
                </h4>
              </div>

              <div className="p-3 bg-white rounded-2xl shadow-card border border-slate-100 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase truncate block">Stock Valuation</span>
                <h4 className="text-xs sm:text-sm md:text-base font-extrabold text-[#C8A96B] mt-1 truncate">
                  ₹ {shopSummary.stockValue.toLocaleString('en-IN')}
                </h4>
              </div>
            </div>

            {/* Inventory Status */}
            <div className="bg-white rounded-3xl p-4 shadow-card border border-slate-100">
              <h4 className="text-xs font-bold text-[#10172A] mb-3">
                Inventory Stock & Reorder Levels
              </h4>
              <div className="divide-y divide-slate-100">
                {products.map(p => (
                  <div key={p.id} className="py-2 flex items-center justify-between text-xs gap-2">
                    <div className="min-w-0 truncate">
                      <span className="font-bold text-[#10172A]">{p.name}</span>
                      <span className="text-slate-400 ml-2 font-medium">₹{p.sellingPrice}/unit</span>
                    </div>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0 ${
                        p.stockQuantity <= p.lowStockThreshold
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {p.stockQuantity} in stock
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
