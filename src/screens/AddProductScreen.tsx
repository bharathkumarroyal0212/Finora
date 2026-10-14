import React, { useState } from 'react';
import { ArrowLeft, Settings, Camera, Check, AlertCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface AddProductScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export const AddProductScreen: React.FC<AddProductScreenProps> = ({
  onBack,
  onNavigate
}) => {
  const { addProduct } = useFinance();

  const [name, setName] = useState<string>('Biscuits');
  const [purchasePrice, setPurchasePrice] = useState<string>('20');
  const [sellingPrice, setSellingPrice] = useState<string>('30');
  const [initialStock, setInitialStock] = useState<string>('50');
  const [category] = useState<string>('Packaged Snacks');
  const [lowStockThreshold] = useState<string>('10');
  const [supplier] = useState<string>('Metro Wholesale');

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const pPrice = parseFloat(purchasePrice);
    const sPrice = parseFloat(sellingPrice);
    const stock = parseInt(initialStock);
    const threshold = parseInt(lowStockThreshold) || 5;

    if (!name.trim()) {
      setError('Please enter a product name');
      return;
    }
    if (isNaN(pPrice) || pPrice <= 0) {
      setError('Please enter a valid purchase price');
      return;
    }
    if (isNaN(sPrice) || sPrice <= 0) {
      setError('Please enter a valid selling price');
      return;
    }
    if (isNaN(stock) || stock < 0) {
      setError('Please enter a valid initial stock');
      return;
    }

    addProduct({
      name: name.trim(),
      sku: `${name.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      category,
      purchasePrice: pPrice,
      sellingPrice: sPrice,
      stockQuantity: stock,
      lowStockThreshold: threshold,
      supplier
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onNavigate('shop-dashboard');
    }, 1200);
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
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </button>

          <h2 className="text-base font-bold text-[#10172A]">
            Add Product
          </h2>

          <button
            type="button"
            onClick={() => onNavigate('menu-profile')}
            className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Open settings"
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Feedback Alerts */}
        {isSuccess && (
          <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
            <Check size={16} className="text-emerald-600" />
            <span>Product saved and added to inventory!</span>
          </div>
        )}

        {error && (
          <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-800 text-xs font-semibold">
            <AlertCircle size={16} className="text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Product Image / Photo Upload Box (matching reference mockup with biscuit packet preview) */}
        <div className="my-3 flex justify-center">
          <div className="relative w-28 h-24 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center shadow-sm group hover:border-[#5145D8] transition-colors cursor-pointer">
            <div className="text-3xl mb-1">🍪</div>
            <span className="text-[10px] font-semibold text-slate-400">Biscuits</span>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#10172A] text-white flex items-center justify-center shadow-md">
              <Camera size={13} />
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between py-2">
        <div className="space-y-3">
          {/* Product Name */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Product Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Biscuits"
              className="w-full mt-1 px-3.5 py-2.5 text-xs font-semibold bg-white rounded-2xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#5145D8]"
            />
          </div>

          {/* Purchase Price */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Purchase Price (₹)
            </label>
            <input
              type="number"
              step="any"
              required
              value={purchasePrice}
              onChange={e => setPurchasePrice(e.target.value)}
              placeholder="20"
              className="w-full mt-1 px-3.5 py-2.5 text-xs font-semibold bg-white rounded-2xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#5145D8]"
            />
          </div>

          {/* Selling Price */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Selling Price (₹)
            </label>
            <input
              type="number"
              step="any"
              required
              value={sellingPrice}
              onChange={e => setSellingPrice(e.target.value)}
              placeholder="30"
              className="w-full mt-1 px-3.5 py-2.5 text-xs font-semibold bg-white rounded-2xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#5145D8]"
            />
          </div>

          {/* Initial Stock */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Initial Stock
            </label>
            <input
              type="number"
              required
              value={initialStock}
              onChange={e => setInitialStock(e.target.value)}
              placeholder="50"
              className="w-full mt-1 px-3.5 py-2.5 text-xs font-semibold bg-white rounded-2xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#5145D8]"
            />
          </div>
        </div>

        {/* Save Product Action Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#5145D8] to-[#6558E8] hover:from-[#4338CA] hover:to-[#5145D8] text-white font-bold text-xs tracking-wide shadow-lg shadow-[#5145D8]/20 transition-all active:scale-[0.98]"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};
