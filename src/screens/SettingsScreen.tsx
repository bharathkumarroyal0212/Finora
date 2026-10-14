import React, { useState } from 'react';
import { ArrowLeft, Save, RotateCcw, Check, Database } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { profile, updateProfile, resetDemoData, isCloudSyncActive } = useFinance();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [language, setLanguage] = useState(profile.preferredLanguage);
  const [quickSave, setQuickSave] = useState(profile.quickSaveEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      avatarInitials: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'RK',
      preferredLanguage: language,
      quickSaveEnabled: quickSave
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all transactions and inventory to initial sample state?')) {
      resetDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 1500);
    }
  };

  return (
    <div className="relative w-full flex-1 min-h-[100dvh] bg-[#F8FAFC] text-[#111B3B] flex flex-col justify-between p-4 sm:p-5 select-none overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pt-2 pb-3">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>

          <h2 className="text-base font-bold text-[#10172A]">
            Settings
          </h2>

          <div className="w-8" />
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold mb-3">
            <Check size={16} className="text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        {resetSuccess && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-800 text-xs font-semibold mb-3">
            <Check size={16} className="text-amber-600" />
            <span>Reset to original sample data!</span>
          </div>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="flex-1 space-y-4 py-2">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-4 shadow-card border border-slate-100 space-y-3">
          <h4 className="text-xs font-bold text-[#10172A]">
            User Profile
          </h4>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5145D8]"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5145D8]"
            />
          </div>
        </div>

        {/* Preferences Card */}
        <div className="bg-white rounded-3xl p-4 shadow-card border border-slate-100 space-y-3">
          <h4 className="text-xs font-bold text-[#10172A]">
            Preferences & Voice
          </h4>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase">Default Speech Language</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as 'English' | 'Telugu')}
              className="w-full mt-1 px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5145D8]"
            >
              <option value="English">English (en-IN)</option>
              <option value="Telugu">Telugu (te-IN)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="pr-2">
              <span className="text-xs font-bold text-[#10172A] block">Quick Save Confident Entries</span>
              <span className="text-[10px] text-slate-400">Save unambiguous voice records with 1-click undo</span>
            </div>
            <input
              type="checkbox"
              checked={quickSave}
              onChange={e => setQuickSave(e.target.checked)}
              className="w-4 h-4 accent-[#5145D8] rounded shrink-0"
            />
          </div>
        </div>

        {/* Storage Info */}
        <div className="p-3 bg-slate-100 rounded-2xl flex items-center justify-between text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-[#5145D8]" />
            <span>Storage Status:</span>
          </div>
          <span className="font-bold text-[#10172A]">
            {isCloudSyncActive ? 'Cloud Sync Active' : 'Offline Secure Storage'}
          </span>
        </div>

        {/* Buttons */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#5145D8] hover:bg-[#4338CA] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            <Save size={14} />
            <span>Save Preferences</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            <RotateCcw size={14} />
            <span>Reset Sample Data</span>
          </button>
        </div>
      </form>
    </div>
  );
};
