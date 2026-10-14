import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Truck, AlertCircle } from 'lucide-react';
import { MicrophoneButton } from '../components/common/MicrophoneButton';
import { useVoice } from '../context/VoiceContext';
import { useFinance } from '../context/FinanceContext';

interface RecordSaleScreenProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

export const RecordSaleScreen: React.FC<RecordSaleScreenProps> = ({
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'sale' | 'purchase'>('sale');
  const { transcript, processTextInput, errorMessage } = useVoice();

  const sampleSaleCommand = "Sold 5 biscuit packets for 150 rupees";
  const samplePurchaseCommand = "Purchased 20 biscuit packets for 400 rupees";

  return (
    <div className="relative w-full flex-1 min-h-[100dvh] bg-[#F8FAFC] text-[#111B3B] flex flex-col justify-between p-4 sm:p-5 select-none overflow-y-auto no-scrollbar">
      {/* Top Header */}
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
            Record Sale / Purchase
          </h2>

          <div className="w-8" />
        </div>

        {/* Segmented Tabs (Sale vs Purchase) */}
        <div className="w-full bg-slate-200/70 p-1 rounded-2xl flex items-center gap-1 mt-1 mb-3">
          <button
            type="button"
            onClick={() => setActiveTab('sale')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'sale'
                ? 'bg-[#5145D8] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sale
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('purchase')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'purchase'
                ? 'bg-[#5145D8] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Purchase
          </button>
        </div>
      </div>

      {/* Central Microphone Area */}
      <div className="flex-1 flex flex-col items-center justify-center py-2">
        <div className="my-auto py-2 sm:py-4">
          <MicrophoneButton size="lg" />
        </div>

        <div className="text-center px-2 sm:px-4 mb-2 max-w-full">
          <h3 className="text-base font-bold text-[#10172A] mb-1">
            Tap to speak
          </h3>

          {/* Example Box matching reference */}
          <button
            type="button"
            onClick={() => processTextInput(activeTab === 'sale' ? sampleSaleCommand : samplePurchaseCommand)}
            className="mt-1 p-2.5 bg-slate-100 hover:bg-purple-50 hover:border-purple-300 border border-slate-200/80 rounded-2xl text-xs text-slate-600 transition-all text-center block max-w-full sm:max-w-[280px] mx-auto"
          >
            <span className="font-semibold text-slate-700">Example:</span>{' '}
            "{activeTab === 'sale' ? sampleSaleCommand : samplePurchaseCommand}"
          </button>

          {/* Active transcript if listening */}
          {transcript && (
            <div className="mt-2 p-2 bg-purple-50 border border-purple-200 text-[#5145D8] text-xs font-semibold rounded-xl">
              "{transcript}"
            </div>
          )}

          {errorMessage && (
            <div className="mt-2 p-2 bg-red-50 text-red-600 text-xs rounded-xl flex items-center justify-center gap-1">
              <AlertCircle size={14} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Recent Entries Section */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-[#10172A] mb-2 px-1">
          Recent Entries
        </h4>

        <div className="bg-white rounded-3xl p-3 sm:p-3.5 shadow-card divide-y divide-slate-100">
          {/* Sale entry */}
          <div className="py-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShoppingBag size={14} />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-[#10172A] truncate">
                  Sold 5 Biscuit Packets
                </h5>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  Today, 10:32 AM
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#15966A] shrink-0">
              + ₹150
            </span>
          </div>

          {/* Purchase entry */}
          <div className="py-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Truck size={14} />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-[#10172A] truncate">
                  Purchased 20 Biscuit Packets
                </h5>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  Yesterday, 4:15 PM
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#D64550] shrink-0">
              - ₹400
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
