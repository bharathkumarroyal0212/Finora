import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, X, AlertTriangle, Trash2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useVoice } from '../../context/VoiceContext';
import { PersonalCategory, TransactionType } from '../../types/finance';
import { ParsedTransactionDraft } from '../../types/speech';

const CATEGORIES: PersonalCategory[] = [
  'Petrol/Fuel',
  'Vegetables',
  'Groceries',
  'Food',
  'Salary',
  'Transport',
  'Electricity',
  'Bills',
  'Shopping',
  'Other'
];

export const TransactionReviewModal: React.FC = () => {
  const { addPersonalTransactions } = useFinance();
  const {
    isReviewModalOpen,
    personalDrafts,
    setPersonalDrafts,
    hasMissingAmount,
    clarificationPrompt,
    clearDrafts
  } = useVoice();

  const [missingAmountInput, setMissingAmountInput] = useState<string>('');
  const [missingCategory] = useState<PersonalCategory>('Petrol/Fuel');
  const [missingDesc] = useState<string>('Petrol');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  if (!isReviewModalOpen) return null;

  const handleUpdateItem = (id: string, updates: Partial<ParsedTransactionDraft>) => {
    setPersonalDrafts(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const handleDeleteItem = (id: string) => {
    setPersonalDrafts(prev => prev.filter(item => item.id !== id));
  };

  const handleAddMissingItem = () => {
    const val = parseFloat(missingAmountInput);
    if (isNaN(val) || val <= 0) return;

    const newItem: ParsedTransactionDraft = {
      id: `draft-${Date.now()}`,
      type: 'expense',
      amount: val,
      category: missingCategory,
      description: missingDesc,
      date: new Date().toISOString().split('T')[0],
      confidence: 1
    };

    setPersonalDrafts(prev => [...prev, newItem]);
    setMissingAmountInput('');
  };

  const handleSaveAll = () => {
    if (personalDrafts.length === 0) return;
    setIsSubmitting(true);

    try {
      const recordsToSave = personalDrafts.map(d => ({
        mode: 'personal' as const,
        type: d.type,
        amount: d.amount,
        currency: 'INR',
        category: d.category,
        description: d.description,
        date: d.date,
        inputSource: 'voice' as const
      }));

      addPersonalTransactions(recordsToSave);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // ignore
      }

      const count = recordsToSave.length;
      setSaveSuccessMessage(`${count} transaction${count > 1 ? 's' : ''} added successfully!`);

      setTimeout(() => {
        setSaveSuccessMessage(null);
        clearDrafts();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-100 flex flex-col max-h-[92dvh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#10172A]">
              Review Recognized Transactions
            </h3>
            <p className="text-xs text-[#667085]">
              Verify or adjust details before saving
            </p>
          </div>
          <button
            type="button"
            onClick={clearDrafts}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success Banner */}
        {saveSuccessMessage && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm font-semibold">
            <Check size={18} className="text-emerald-600" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {/* Missing Amount Alert & Clarification Input */}
        {hasMissingAmount && (
          <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed font-medium">
                {clarificationPrompt || 'Missing amount detected. Please enter the amount to complete the transaction.'}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <div className="relative flex-1 min-w-0">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  placeholder="e.g. 300"
                  value={missingAmountInput}
                  onChange={e => setMissingAmountInput(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 text-sm bg-white rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#5145D8]"
                />
              </div>
              <button
                type="button"
                onClick={handleAddMissingItem}
                className="px-3 py-1.5 bg-[#5145D8] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
              >
                Add Amount
              </button>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 no-scrollbar">
          {personalDrafts.length === 0 && !hasMissingAmount ? (
            <div className="text-center py-8 text-sm text-slate-400">
              No transactions detected in speech.
            </div>
          ) : (
            personalDrafts.map((draft, idx) => (
              <div
                key={draft.id}
                className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 transition-all flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-[#5145D8] text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <select
                      value={draft.type}
                      onChange={e => handleUpdateItem(draft.id, { type: e.target.value as TransactionType })}
                      className="text-xs font-bold rounded-lg px-2 py-0.5 bg-white border border-slate-200"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteItem(draft.id)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="min-w-0">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase truncate block">Description</label>
                    <input
                      type="text"
                      value={draft.description}
                      onChange={e => handleUpdateItem(draft.id, { description: e.target.value })}
                      className="w-full text-xs font-medium bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase truncate block">Amount (₹)</label>
                    <input
                      type="number"
                      value={draft.amount}
                      onChange={e => handleUpdateItem(draft.id, { amount: parseFloat(e.target.value) || 0 })}
                      className="w-full text-xs font-bold text-[#10172A] bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="min-w-0">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase truncate block">Category</label>
                    <select
                      value={draft.category}
                      onChange={e => handleUpdateItem(draft.id, { category: e.target.value as PersonalCategory })}
                      className="w-full text-xs font-medium bg-white px-2 py-1.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-purple-400 focus:outline-none"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="min-w-0">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase truncate block">Date</label>
                    <input
                      type="date"
                      value={draft.date}
                      onChange={e => handleUpdateItem(draft.id, { date: e.target.value })}
                      className="w-full text-xs font-medium bg-white px-2 py-1.5 rounded-xl border border-slate-200 focus:ring-1 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 sm:gap-3">
          <div className="text-xs font-semibold text-slate-600 truncate">
            Total:{' '}
            <span className="text-[#5145D8] font-bold text-sm">
              ₹ {personalDrafts.reduce((sum, item) => sum + (item.type === 'expense' ? item.amount : 0), 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={clearDrafts}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={personalDrafts.length === 0 || isSubmitting}
              onClick={handleSaveAll}
              className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-[#5145D8] to-[#6558E8] hover:from-[#4338CA] hover:to-[#5145D8] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-[0.98]"
            >
              <Check size={14} />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
