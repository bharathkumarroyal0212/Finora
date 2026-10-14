import React, { createContext, useContext, useEffect, useState } from 'react';
import { CalculationService, PersonalSummaryMetrics, ShopSummaryMetrics } from '../services/calculationService';
import { StorageService } from '../services/storageService';
import { isSupabaseConfigured, supabase } from '../services/supabaseClient';
import {
    AppMode,
    Budget,
    CustomerCreditRecord,
    PersonalTransaction,
    Product,
    ShopPurchase,
    ShopSale,
    TimeFilter,
    UserProfile
} from '../types/finance';

interface FinanceContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  timeFilter: TimeFilter;
  setTimeFilter: (filter: TimeFilter) => void;
  // Personal finance
  personalTransactions: PersonalTransaction[];
  addPersonalTransactions: (transactions: Omit<PersonalTransaction, 'id' | 'createdAt'>[]) => PersonalTransaction[];
  deletePersonalTransaction: (id: string) => void;
  budgets: Budget[];
  updateBudget: (budget: Budget) => void;
  personalSummary: PersonalSummaryMetrics;
  // Shop manager
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (product: Product) => void;
  sales: ShopSale[];
  recordSale: (sale: Omit<ShopSale, 'id' | 'createdAt'>) => { success: boolean; message?: string; sale?: ShopSale };
  purchases: ShopPurchase[];
  recordPurchase: (purchase: Omit<ShopPurchase, 'id' | 'createdAt'>) => ShopPurchase;
  credits: CustomerCreditRecord[];
  shopSummary: ShopSummaryMetrics;
  // Auth & system
  isAuthenticated: boolean;
  isCloudSyncActive: boolean;
  login: (email: string) => void;
  logout: () => void;
  resetDemoData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<AppMode>(() => {
    return (localStorage.getItem('finora_mode') as AppMode) || 'personal';
  });

  const [profile, setProfileState] = useState<UserProfile>(() => StorageService.getProfile());
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('monthly');

  const [personalTransactions, setPersonalTransactions] = useState<PersonalTransaction[]>(() =>
    StorageService.getPersonalTransactions()
  );

  const [budgets, setBudgets] = useState<Budget[]>(() => StorageService.getBudgets());
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [sales, setSales] = useState<ShopSale[]>(() => StorageService.getSales());
  const [purchases, setPurchases] = useState<ShopPurchase[]>(() => StorageService.getPurchases());
  const [credits, setCredits] = useState<CustomerCreditRecord[]>(() => StorageService.getCustomerCredits());

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const authSaved = localStorage.getItem('finora_auth');
    return authSaved ? JSON.parse(authSaved) : true; // Default logged in for smooth demo showcase
  });

  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
    localStorage.setItem('finora_mode', newMode);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfileState(updated);
    StorageService.saveProfile(updated);
  };

  // Add multiple personal transactions at once (e.g. from voice utterance)
  const addPersonalTransactions = (newItems: Omit<PersonalTransaction, 'id' | 'createdAt'>[]): PersonalTransaction[] => {
    const now = new Date().toISOString();
    const createdItems: PersonalTransaction[] = newItems.map((item, idx) => ({
      ...item,
      id: `ptx_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: now
    }));

    const updated = StorageService.addPersonalTransactions(createdItems);
    setPersonalTransactions(updated);
    return createdItems;
  };

  const deletePersonalTransaction = (id: string) => {
    const updated = personalTransactions.filter(t => t.id !== id);
    setPersonalTransactions(updated);
    StorageService.savePersonalTransactions(updated);
  };

  const updateBudget = (budget: Budget) => {
    const updated = budgets.map(b => b.category === budget.category ? budget : b);
    if (!budgets.some(b => b.category === budget.category)) {
      updated.push(budget);
    }
    setBudgets(updated);
    StorageService.saveBudgets(updated);
  };

  const addProduct = (p: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProd: Product = {
      ...p,
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    const updated = StorageService.addProduct(newProd);
    setProducts(updated);
    return newProd;
  };

  const updateProduct = (p: Product) => {
    const updated = StorageService.updateProduct(p);
    setProducts(updated);
  };

  const recordSale = (saleData: Omit<ShopSale, 'id' | 'createdAt'>): { success: boolean; message?: string; sale?: ShopSale } => {
    const targetProduct = products.find(p => p.id === saleData.productId);
    if (targetProduct && targetProduct.stockQuantity < saleData.quantity) {
      return {
        success: false,
        message: `Insufficient stock! Only ${targetProduct.stockQuantity} units available of ${targetProduct.name}.`
      };
    }

    const newSale: ShopSale = {
      ...saleData,
      id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };

    const { sales: updatedSales, products: updatedProducts } = StorageService.addSale(newSale);
    setSales(updatedSales);
    setProducts(updatedProducts);

    // If sale is on credit, update customer credit list
    if (newSale.isCredit && newSale.customerName) {
      const currentCredits = StorageService.getCustomerCredits();
      const existing = currentCredits.find(c => c.customerName.toLowerCase() === newSale.customerName?.toLowerCase());
      let updatedCredits: CustomerCreditRecord[];
      if (existing) {
        updatedCredits = currentCredits.map(c => c.id === existing.id ? {
          ...c,
          amountDue: c.amountDue + newSale.totalAmount,
          lastUpdated: new Date().toISOString()
        } : c);
      } else {
        updatedCredits = [
          ...currentCredits,
          {
            id: `cred_${Date.now()}`,
            customerName: newSale.customerName,
            amountDue: newSale.totalAmount,
            lastUpdated: new Date().toISOString()
          }
        ];
      }
      StorageService.saveCustomerCredits(updatedCredits);
      setCredits(updatedCredits);
    }

    return { success: true, sale: newSale };
  };

  const recordPurchase = (purchaseData: Omit<ShopPurchase, 'id' | 'createdAt'>): ShopPurchase => {
    const newPurchase: ShopPurchase = {
      ...purchaseData,
      id: `pch_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };

    const { purchases: updatedPurchases, products: updatedProducts } = StorageService.addPurchase(newPurchase);
    setPurchases(updatedPurchases);
    setProducts(updatedProducts);

    return newPurchase;
  };

  const login = (email: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('finora_auth', 'true');
    updateProfile({ email, name: email.split('@')[0] || 'Ramesh Kumar' });
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('finora_auth', 'false');
  };

  const resetDemoData = () => {
    StorageService.resetToDemoData();
    setProfileState(StorageService.getProfile());
    setPersonalTransactions(StorageService.getPersonalTransactions());
    setBudgets(StorageService.getBudgets());
    setProducts(StorageService.getProducts());
    setSales(StorageService.getSales());
    setPurchases(StorageService.getPurchases());
    setCredits(StorageService.getCustomerCredits());
  };

  // Recalculate metrics whenever transactions change
  const personalSummary = CalculationService.calculatePersonalSummary(
    personalTransactions,
    budgets,
    timeFilter
  );

  const shopSummary = CalculationService.calculateShopSummary(
    products,
    sales,
    purchases,
    credits
  );

  return (
    <FinanceContext.Provider
      value={{
        mode,
        setMode,
        profile,
        updateProfile,
        timeFilter,
        setTimeFilter,
        personalTransactions,
        addPersonalTransactions,
        deletePersonalTransaction,
        budgets,
        updateBudget,
        personalSummary,
        products,
        addProduct,
        updateProduct,
        sales,
        recordSale,
        purchases,
        recordPurchase,
        credits,
        shopSummary,
        isAuthenticated,
        isCloudSyncActive: isSupabaseConfigured,
        login,
        logout,
        resetDemoData
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
