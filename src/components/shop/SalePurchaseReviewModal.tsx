import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, X, AlertTriangle, Trash2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useVoice } from '../../context/VoiceContext';
import { ParsedShopItemDraft } from '../../types/speech';

export const SalePurchaseReviewModal: React.FC = () => {
  const { products, recordSale, recordPurchase } = useFinance();
  const {
    isReviewModalOpen,
    shopDrafts,
    setShopDrafts,
    clearDrafts
  } = useVoice();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isReviewModalOpen || shopDrafts.length === 0) return null;

  const handleUpdateItem = (id: string, updates: Partial<ParsedShopItemDraft>) => {
    setShopDrafts(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const handleDeleteItem = (id: string) => {
    setShopDrafts(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveShopItems = () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      let savedCount = 0;

      for (const item of shopDrafts) {
        // Find or create product
        const matchedProduct = products.find(p => p.id === item.matchedProductId || p.name.toLowerCase() === item.productName.toLowerCase());
        const productId = matchedProduct ? matchedProduct.id : products[0]?.id || 'prod_1';
        const costPrice = matchedProduct ? matchedProduct.purchasePrice : 20;

        if (item.action === 'sale') {
          const res = recordSale({
            productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice || (item.quantity > 0 ? item.totalAmount / item.quantity : item.totalAmount),
            totalAmount: item.totalAmount,
            costPrice,
            isCredit: false,
            date: new Date().toISOString().split('T')[0],
            inputSource: 'voice'
          });

          if (!res.success) {
            setErrorMessage(res.message || 'Error recording sale');
            setIsSubmitting(false);
            return;
          }
          savedCount++;
        } else {
          recordPurchase({
            productId,
            productName: item.productName,
            quantity: item.quantity,
            unitCost: item.unitPrice || (item.quantity > 0 ? item.totalAmount / item.quantity : item.totalAmount),
            totalCost: item.totalAmount,
            date: new Date().toISOString().split('T')[0],
            inputSource: 'voice'
          });
          savedCount++;
        }
      }

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // ignore
      }

      setFeedbackMessage(`${savedCount} shop record${savedCount > 1 ? 's' : ''} saved & inventory updated!`);
      setTimeout(() => {
        setFeedbackMessage(null);
        clearDrafts();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error saving transaction');
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
              Confirm Shop Transaction
            </h3>
            <p className="text-xs text-[#667085]">
              Verify items, stock impact, and amounts
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

        {/* Feedback / Errors */}
        {feedbackMessage && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm font-semibold">
            <Check size={18} className="text-emerald-600" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-semibold">
            <AlertTriangle size={16} className="text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Draft List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 no-scrollbar">
          {shopDrafts.map((draft) => {
            const matchedProd = products.find(p => p.id === draft.matchedProductId || p.name.toLowerCase() === draft.productName.toLowerCase());
            const currentStock = matchedProd?.stockQuantity ?? draft.availableStock ?? 0;
            const isInsufficientStock = draft.action === 'sale' && currentStock < draft.quantity;

            return (
              <div
                key={draft.id}
                className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase shrink-0 ${
                        draft.action === 'sale'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {draft.action}
                    </span>
                    <span className="text-xs font-bold text-[#10172A] truncate">{draft.productName}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteItem(draft.id)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors shrink-0"
                    title="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Stock Warning if insufficient */}
                {isInsufficientStock && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] flex items-center gap-1.5 font-medium">
                    <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                    <span>Warning: Available stock is only {currentStock} units!</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="min-w-0">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase truncate block">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={draft.quantity}
                      onChange={e => {
                        const qty = parseInt(e.target.value) || 1;
                        const unitP = draft.unitPrice || 30;
                        handleUpdateItem(draft.id, {
                          quantity: qty,
                          totalAmount: qty * unitP
                        });
                      }}
                      className="w-full text-xs font-bold bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase truncate block">Total Amount (₹)</label>
                    <input
                      type="number"
                      value={draft.totalAmount}
                      onChange={e => handleUpdateItem(draft.id, { totalAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full text-xs font-bold text-[#10172A] bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 gap-1">
                  <span className="truncate">In-Stock: <strong className="text-slate-800">{currentStock}</strong></span>
                  <span className="truncate">
                    New Stock:{' '}
                    <strong className={isInsufficientStock ? 'text-red-600' : 'text-emerald-700'}>
                      {draft.action === 'sale' ? Math.max(0, currentStock - draft.quantity) : currentStock + draft.quantity}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 sm:gap-3">
          <div className="text-xs font-semibold text-slate-600 truncate">
            Total:{' '}
            <span className="text-[#5145D8] font-bold text-sm">
              ₹ {shopDrafts.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={clearDrafts}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSaveShopItems}
              className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-[#5145D8] to-[#6558E8] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 active:scale-[0.98]"
            >
              <Check size={14} />
              <span>Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
