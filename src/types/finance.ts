export type TransactionType = 'income' | 'expense';

export type PersonalCategory =
  | 'Petrol/Fuel'
  | 'Vegetables'
  | 'Groceries'
  | 'Food'
  | 'Salary'
  | 'Transport'
  | 'Electricity'
  | 'Bills'
  | 'Shopping'
  | 'Health'
  | 'Entertainment'
  | 'Other';

export interface PersonalTransaction {
  id: string;
  userId?: string;
  mode: 'personal';
  type: TransactionType;
  amount: number;
  currency: string;
  category: PersonalCategory;
  description: string;
  date: string; // ISO date string (YYYY-MM-DD or ISO timestamp)
  paymentMethod?: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
  createdAt: string;
  inputSource: 'voice' | 'manual' | 'scan' | 'seed';
}

export interface Budget {
  category: PersonalCategory;
  allocatedAmount: number;
  period: 'monthly';
}

export interface Product {
  id: string;
  name: string;
  sku?: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  supplier?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ShopSale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  costPrice: number; // For COGS calculation
  customerName?: string;
  isCredit: boolean;
  creditPaid?: boolean;
  date: string;
  createdAt: string;
  inputSource: 'voice' | 'manual' | 'seed';
}

export interface ShopPurchase {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  date: string;
  createdAt: string;
  inputSource: 'voice' | 'manual' | 'seed';
}

export interface CustomerCreditRecord {
  id: string;
  customerName: string;
  customerPhone?: string;
  amountDue: number;
  saleId?: string;
  lastUpdated: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  currency: string;
  preferredLanguage: 'English' | 'Telugu';
  quickSaveEnabled: boolean;
  isDemoUser: boolean;
}

export type AppMode = 'personal' | 'shop';

export type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'all';
