import React, { useState } from 'react';
import { ArrowLeft, Globe, ChevronDown, Camera, Check, AlertCircle } from 'lucide-react';
import { MicrophoneButton } from '../components/common/MicrophoneButton';
import { useVoice } from '../context/VoiceContext';
import { useFinance } from '../context/FinanceContext';
import { PersonalCategory, TransactionType } from '../types/finance';

interface VoiceInputPersonalScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

const SAMPLE_COMMANDS = [
  "I spent 300 rupees on petrol and 200 rupees on vegetables.",
  "I bought milk for 60 rupees, bread for 45 rupees, and eggs for 90 rupees.",
  "I received 2,000 rupees as salary and spent 150 rupees on transport.",
  "I spent 100 rupees on tea, 80 rupees on snacks, and 250 rupees on petrol.",
  "I spent some money on petrol." // Test missing amount
];

const CATEGORIES: PersonalCategory[] = [
  'Petrol/Fuel', 'Vegetables', 'Groceries', 'Food', 'Salary', 'Transport', 'Electricity', 'Bills', 'Shopping', 'Other'
];

export const VoiceInputPersonalScreen: React.FC<VoiceInputPersonalScreenProps> = ({
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'manual' | 'scan'>('voice');
  const { isListening, transcript, processTextInput, activeLanguage, setLanguage, errorMessage } = useVoice();
  const { addPersonalTransactions } = useFinance();

  // Manual Form States
  const [manualType, setManualType] = useState<TransactionType>('expense');
  const [manualAmount, setManualAmount] = useState<string>('');
  const [manualCategory, setManualCategory] = useState<PersonalCategory>('Vegetables');
  const [manualDesc, setManualDesc] = useState<string>('');
  const [manualSuccess, setManualSuccess] = useState<boolean>(false);

  // Scan State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(manualAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    addPersonalTransactions([
      {
        mode: 'personal',
        type: manualType,
        amount: amountVal,
        currency: 'INR',
        category: manualCategory,
        description: manualDesc || manualCategory,
        date: new Date().toISOString().split('T')[0],
        inputSource: 'manual'
      }
    ]);

    setManualSuccess(true);
    setManualAmount('');
    setManualDesc('');
    setTimeout(() => {
      setManualSuccess(false);
      onBack();
    }, 1200);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult("Scanned Receipt: Supermarket - ₹450 (Groceries)");
      processTextInput("Spent 450 rupees on groceries from supermarket receipt");
    }, 1500);
  };

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
            Add Transaction
          </h2>

          <div className="w-8" /> {/* Balance spacer */}
        </div>

        {/* Segmented Control Tabs (Voice, Manual, Scan) */}
        <div className="w-full bg-slate-200/70 p-1 rounded-2xl flex items-center gap-1 mt-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'voice'
                ? 'bg-[#5145D8] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Voice
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'manual'
                ? 'bg-[#5145D8] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manual
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'scan'
                ? 'bg-[#5145D8] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scan
          </button>
        </div>
      </div>

      {/* TAB 1: VOICE INPUT (Screen 4 exact match) */}
      {activeTab === 'voice' && (
        <div className="flex-1 flex flex-col items-center justify-between py-2">
          {/* Central Microphone with concentric rings */}
          <div className="my-auto py-4 sm:py-6">
            <MicrophoneButton size="lg" />
          </div>

          {/* Guidance text */}
          <div className="text-center px-2 sm:px-4 mb-2 max-w-full">
            <h3 className="text-base font-bold text-[#10172A] mb-1">
              Tap to speak
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Say something like:
              <br />
              <span className="text-slate-700 font-medium">"I spent 300 rupees on vegetables"</span>
              <br />
              <span className="text-slate-400 text-[11px]">(or in Telugu)</span>
            </p>

            {/* Error banner if permission or audio issue */}
            {errorMessage && (
              <div className="mt-2 p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[11px] flex items-center justify-center gap-1.5">
                <AlertCircle size={14} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Active interim transcript if listening */}
            {transcript && (
              <div className="mt-2 p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-[#5145D8] text-xs font-semibold animate-pulse">
                "{transcript}"
              </div>
            )}
          </div>

          {/* Language Selector Dropdown Pill */}
          <div className="relative mb-3 sm:mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200/90 shadow-sm text-xs font-semibold text-slate-700">
              <Globe size={14} className="text-slate-400" />
              <select
                value={activeLanguage}
                onChange={e => setLanguage(e.target.value as 'English' | 'Telugu')}
                className="bg-transparent focus:outline-none cursor-pointer pr-1"
                aria-label="Select voice recognition language"
              >
                <option value="English">English</option>
                <option value="Telugu">Telugu</option>
              </select>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>

          {/* Subtle Audio Waveform Visualizer */}
          <div className="w-full flex items-center justify-center gap-1.5 h-10 px-4 sm:px-6 mb-2">
            {[16, 24, 32, 20, 28, 36, 18, 30, 22, 14, 26, 34, 18, 28].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full bg-[#6558E8] transition-all duration-300 ${
                  isListening ? 'animate-pulse' : 'opacity-40'
                }`}
                style={{
                  height: isListening ? `${Math.max(8, (h + (i % 3) * 6)) % 38}px` : `${Math.min(18, h * 0.5)}px`
                }}
              />
            ))}
          </div>

          {/* Quick Voice Simulation Buttons for 1-click testing */}
          <div className="w-full pt-2 border-t border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-1.5">
              Quick Test Examples
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center max-h-24 overflow-y-auto no-scrollbar">
              {SAMPLE_COMMANDS.map((cmd, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => processTextInput(cmd)}
                  className="text-[10px] font-medium bg-white hover:bg-purple-50 hover:text-[#5145D8] hover:border-purple-300 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition-all text-left truncate max-w-full sm:max-w-[300px]"
                >
                  ⚡ {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANUAL FORM */}
      {activeTab === 'manual' && (
        <form onSubmit={handleManualSubmit} className="flex-1 flex flex-col justify-between py-2">
          {manualSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold mb-3">
              <Check size={16} className="text-emerald-600" />
              <span>Transaction saved successfully!</span>
            </div>
          )}

          <div className="space-y-3.5">
            {/* Income / Expense Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setManualType('expense')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  manualType === 'expense' ? 'bg-[#D64550] text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setManualType('income')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  manualType === 'income' ? 'bg-[#15966A] text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                Income
              </button>
            </div>

            {/* Amount */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Amount (₹)
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={manualAmount}
                  onChange={e => setManualAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 text-base font-bold bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5145D8]"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Category
              </label>
              <select
                value={manualCategory}
                onChange={e => setManualCategory(e.target.value as PersonalCategory)}
                className="w-full mt-1 px-3 py-2.5 text-xs font-semibold bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5145D8]"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Description
              </label>
              <input
                type="text"
                placeholder="e.g. Vegetables or Petrol"
                value={manualDesc}
                onChange={e => setManualDesc(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 text-xs font-semibold bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5145D8]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-4 rounded-2xl bg-[#5145D8] hover:bg-[#4338CA] text-white font-bold text-xs tracking-wide shadow-lg shadow-[#5145D8]/20 transition-all active:scale-[0.98]"
          >
            Save Transaction
          </button>
        </form>
      )}

      {/* TAB 3: SCAN */}
      {activeTab === 'scan' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="w-20 h-20 rounded-3xl bg-purple-50 text-[#5145D8] flex items-center justify-center mb-4">
            <Camera size={36} />
          </div>
          <h3 className="text-base font-bold text-[#10172A] mb-1">
            Smart Receipt Scanner
          </h3>
          <p className="text-xs text-slate-500 max-w-[240px] mb-6">
            Take a photo of any grocery, fuel, or retail bill to automatically extract items and amounts.
          </p>

          <button
            type="button"
            disabled={isScanning}
            onClick={handleSimulateScan}
            className="w-full py-3 px-6 rounded-2xl bg-[#5145D8] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Camera size={16} />
            <span>{isScanning ? 'Scanning Receipt...' : 'Scan Sample Receipt'}</span>
          </button>

          {scanResult && (
            <div className="mt-4 p-3 bg-white rounded-2xl border border-purple-200 text-xs text-[#10172A] font-semibold text-left w-full shadow-sm">
              {scanResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
