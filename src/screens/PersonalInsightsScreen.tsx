import React from 'react';
import { Settings, Sparkles, Lightbulb, TrendingDown, ArrowRight, ArrowLeft } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FinoraLogo } from '../components/common/FinoraLogo';
import { useFinance } from '../context/FinanceContext';

interface PersonalInsightsScreenProps {
  onBack?: () => void;
  onNavigate: (screen: string) => void;
}

export const PersonalInsightsScreen: React.FC<PersonalInsightsScreenProps> = ({
  onBack,
  onNavigate
}) => {
  const { personalSummary } = useFinance();

  // Reference donut chart default distribution or dynamic from real transactions
  const defaultChartData = [
    { name: 'Food', value: 35, color: '#1E1B4B' },       // Dark indigo
    { name: 'Travel', value: 18, color: '#38BDF8' },     // Light blue
    { name: 'Bills', value: 14, color: '#14B8A6' },      // Teal
    { name: 'Others', value: 33, color: '#DFBA73' }      // Gold
  ];

  const chartData = personalSummary.categoryBreakdown.length >= 2
    ? personalSummary.categoryBreakdown.slice(0, 4).map(c => ({
        name: c.category,
        value: c.percentage || 1,
        color: c.color
      }))
    : defaultChartData;

  // Food percentage calculation
  const foodItem = personalSummary.categoryBreakdown.find(c => c.category === 'Food' || c.category === 'Vegetables');
  const foodPercentage = foodItem ? foodItem.percentage : 35;

  return (
    <div className="relative w-full flex-1 min-h-[100dvh] bg-[#F8FAFC] text-[#111B3B] flex flex-col justify-between p-4 sm:p-5 select-none overflow-y-auto no-scrollbar">
      {/* Header */}
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

          <button
            type="button"
            onClick={() => onNavigate('menu-profile')}
            className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Open settings"
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Section Heading with Gold Sparkle */}
        <div className="mt-2 mb-4 text-left">
          <div className="inline-flex items-center gap-1.5 text-base font-bold text-[#10172A]">
            <Sparkles size={16} className="text-[#C8A96B] fill-[#C8A96B]" />
            <span>AI Insights</span>
          </div>
          <p className="text-xs text-[#667085] mt-0.5">
            Here's what your data is telling you.
          </p>
        </div>
      </div>

      {/* Main Body Insights */}
      <div className="flex-1 space-y-3.5">
        {/* 1. Main Insight Card (Yellow / amber highlight matching reference) */}
        <div className="w-full bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-3.5 shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb size={18} />
          </div>
          <p className="text-xs text-[#78350F] leading-relaxed font-medium">
            You spent <strong>{foodPercentage}%</strong> of your total expenses on food this month. Consider cooking at home to save more!
          </p>
        </div>

        {/* 2. Spending Breakdown Donut Chart Card */}
        <div className="w-full bg-white rounded-3xl p-4 shadow-card border border-slate-100">
          <h4 className="text-xs font-bold text-[#10172A] mb-3">
            Spending Breakdown
          </h4>

          <div className="flex items-center justify-between gap-2">
            {/* Donut Chart */}
            <div className="w-28 sm:w-32 h-28 sm:h-32 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={48}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Inner label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[9px] font-bold text-slate-400">Total</span>
                <span className="text-[11px] sm:text-xs font-extrabold text-[#10172A]">100%</span>
              </div>
            </div>

            {/* Legend with percentages */}
            <div className="flex-1 pl-2 sm:pl-4 space-y-2 min-w-0">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600 font-medium truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-[#10172A] shrink-0">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Quick Suggestions Card */}
        <div className="w-full bg-white rounded-3xl p-4 shadow-card border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#10172A] mb-2.5">
            <Lightbulb size={14} className="text-[#C8A96B]" />
            <span>Quick Suggestions</span>
          </div>

          <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100/80 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#5145D8] text-white flex items-center justify-center shrink-0 mt-0.5">
              <TrendingDown size={14} />
            </div>
            <p className="text-[11px] text-[#1E1B4B] leading-snug font-medium">
              You could save <strong>~₹2,500</strong> next month by reducing food expenses by 20%.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Button: View detailed report */}
      <div className="pt-3">
        <button
          type="button"
          onClick={() => onNavigate('personal-reports')}
          className="w-full py-3 px-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-[#5145D8] hover:shadow-md text-[#10172A] font-bold text-xs flex items-center justify-between transition-all group active:scale-[0.98]"
        >
          <span>View detailed report</span>
          <ArrowRight size={16} className="text-slate-400 group-hover:text-[#5145D8] group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </div>
  );
};
