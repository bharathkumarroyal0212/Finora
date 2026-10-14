import { Budget, CustomerCreditRecord, PersonalTransaction, Product, ShopPurchase, ShopSale, UserProfile } from '../types/finance';

const STORAGE_KEYS = {
  PROFILE: 'finora_user_profile',
  PERSONAL_TRANSACTIONS: 'finora_personal_transactions',
  BUDGETS: 'finora_budgets',
  PRODUCTS: 'finora_products',
  SALES: 'finora_shop_sales',
  PURCHASES: 'finora_shop_purchases',
  CREDITS: 'finora_customer_credits',
  CURRENT_MODE: 'finora_current_mode',
  AUTH_STATE: 'finora_auth_state'
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_ramesh_01',
  name: 'Ramesh Kumar',
  email: 'ramesh@example.com',
  avatarInitials: 'RK',
  currency: 'INR',
  preferredLanguage: 'English',
  quickSaveEnabled: false,
  isDemoUser: true
};

const DEFAULT_BUDGETS: Budget[] = [
  { category: 'Food', allocatedAmount: 4000, period: 'monthly' },
  { category: 'Transport', allocatedAmount: 1500, period: 'monthly' },
  { category: 'Bills', allocatedAmount: 2000, period: 'monthly' },
  { category: 'Petrol/Fuel', allocatedAmount: 2000, period: 'monthly' },
  { category: 'Vegetables', allocatedAmount: 1500, period: 'monthly' }
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Biscuits',
    sku: 'BSC-001',
    category: 'Packaged Snacks',
    purchasePrice: 20,
    sellingPrice: 30,
    stockQuantity: 50,
    lowStockThreshold: 10,
    supplier: 'Metro Wholesale',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_2',
    name: 'Milk',
    sku: 'MLK-002',
    category: 'Dairy',
    purchasePrice: 22,
    sellingPrice: 30,
    stockQuantity: 3, // Low stock triggers alert (3 units)
    lowStockThreshold: 5,
    supplier: 'Heritage Dairy',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_3',
    name: 'Chips',
    sku: 'CHP-003',
    category: 'Snacks',
    purchasePrice: 12,
    sellingPrice: 20,
    stockQuantity: 5, // Low stock triggers alert (5 units)
    lowStockThreshold: 10,
    supplier: 'Balaji Distributors',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_4',
    name: 'Tea Powder',
    sku: 'TEA-004',
    category: 'Beverages',
    purchasePrice: 110,
    sellingPrice: 150,
    stockQuantity: 40,
    lowStockThreshold: 8,
    supplier: 'Red Label Agency',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_5',
    name: 'Cooking Oil (1L)',
    sku: 'OIL-005',
    category: 'Cooking Essentials',
    purchasePrice: 130,
    sellingPrice: 165,
    stockQuantity: 60,
    lowStockThreshold: 12,
    supplier: 'Fortune Depot',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_6',
    name: 'Basmati Rice (5kg)',
    sku: 'RCE-006',
    category: 'Grains',
    purchasePrice: 360,
    sellingPrice: 450,
    stockQuantity: 35,
    lowStockThreshold: 5,
    supplier: 'India Gate Depot',
    createdAt: new Date().toISOString()
  }
];

// Seed transactions matching the reference screens
const getInitialPersonalTransactions = (): PersonalTransaction[] => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(today.getDate() - 2);
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);

  const fmtDate = (d: Date) => d.toISOString().split('T')[0];

  return [
    {
      id: 'ptx_1',
      mode: 'personal',
      type: 'expense',
      amount: 300,
      currency: 'INR',
      category: 'Vegetables',
      description: 'Vegetables',
      date: fmtDate(today),
      createdAt: today.toISOString(),
      inputSource: 'voice'
    },
    {
      id: 'ptx_2',
      mode: 'personal',
      type: 'income',
      amount: 12000,
      currency: 'INR',
      category: 'Salary',
      description: 'Salary',
      date: fmtDate(yesterday),
      createdAt: yesterday.toISOString(),
      inputSource: 'seed'
    },
    {
      id: 'ptx_3',
      mode: 'personal',
      type: 'expense',
      amount: 60,
      currency: 'INR',
      category: 'Food',
      description: 'Milk',
      date: fmtDate(yesterday),
      createdAt: yesterday.toISOString(),
      inputSource: 'voice'
    },
    {
      id: 'ptx_4',
      mode: 'personal',
      type: 'expense',
      amount: 780,
      currency: 'INR',
      category: 'Bills',
      description: 'Electricity Bill',
      date: fmtDate(twoDaysAgo),
      createdAt: twoDaysAgo.toISOString(),
      inputSource: 'seed'
    },
    {
      id: 'ptx_5',
      mode: 'personal',
      type: 'income',
      amount: 5000,
      currency: 'INR',
      category: 'Salary',
      description: 'Freelance Project',
      date: fmtDate(fiveDaysAgo),
      createdAt: fiveDaysAgo.toISOString(),
      inputSource: 'seed'
    },
    {
      id: 'ptx_6',
      mode: 'personal',
      type: 'expense',
      amount: 2880,
      currency: 'INR',
      category: 'Food',
      description: 'Monthly Family Groceries',
      date: fmtDate(fiveDaysAgo),
      createdAt: fiveDaysAgo.toISOString(),
      inputSource: 'seed'
    },
    {
      id: 'ptx_7',
      mode: 'personal',
      type: 'expense',
      amount: 1500,
      currency: 'INR',
      category: 'Transport',
      description: 'Monthly Commute Pass',
      date: fmtDate(fiveDaysAgo),
      createdAt: fiveDaysAgo.toISOString(),
      inputSource: 'seed'
    },
    {
      id: 'ptx_8',
      mode: 'personal',
      type: 'expense',
      amount: 2900,
      currency: 'INR',
      category: 'Other',
      description: 'Home Supplies & Misc',
      date: fmtDate(fiveDaysAgo),
      createdAt: fiveDaysAgo.toISOString(),
      inputSource: 'seed'
    }
  ];
};

const getInitialSales = (): ShopSale[] => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  return [
    {
      id: 'sale_1',
      productId: 'prod_1',
      productName: 'Biscuits',
      quantity: 5,
      unitPrice: 30,
      totalAmount: 150,
      costPrice: 20,
      isCredit: false,
      date: today.toISOString().split('T')[0],
      createdAt: today.toISOString(),
      inputSource: 'voice'
    },
    {
      id: 'sale_2',
      productId: 'prod_1',
      productName: 'Biscuits',
      quantity: 43,
      unitPrice: 30,
      totalAmount: 1290,
      costPrice: 20,
      isCredit: false,
      date: yesterday.toISOString().split('T')[0],
      createdAt: yesterday.toISOString(),
      inputSource: 'seed'
    },
    {
      id: 'sale_3',
      productId: 'prod_2',
      productName: 'Milk',
      quantity: 32,
      unitPrice: 30,
      totalAmount: 960,
      costPrice: 22,
      isCredit: false,
      date: yesterday.toISOString().split('T')[0],
      createdAt: yesterday.toISOString(),
      inputSource: 'seed'
    },
    {
      id: 'sale_4',
      productId: 'prod_3',
      productName: 'Chips',
      quantity: 24,
      unitPrice: 20,
      totalAmount: 480,
      costPrice: 12,
      isCredit: false,
      date: yesterday.toISOString().split('T')[0],
      createdAt: yesterday.toISOString(),
      inputSource: 'seed'
    },
    {
      id: 'sale_5',
      productId: 'prod_6',
      productName: 'Basmati Rice (5kg)',
      quantity: 100,
      unitPrice: 450,
      totalAmount: 45000,
      costPrice: 360,
      isCredit: false,
      date: yesterday.toISOString().split('T')[0],
      createdAt: yesterday.toISOString(),
      inputSource: 'seed'
    },
    {
      id: 'sale_6',
      productId: 'prod_4',
      productName: 'Tea Powder',
      quantity: 5,
      unitPrice: 150,
      totalAmount: 750,
      costPrice: 110,
      customerName: 'Anand Kumar',
      isCredit: true,
      creditPaid: false,
      date: today.toISOString().split('T')[0],
      createdAt: today.toISOString(),
      inputSource: 'seed'
    },
    {
      id: 'sale_7',
      productId: 'prod_5',
      productName: 'Cooking Oil (1L)',
      quantity: 27,
      unitPrice: 165,
      totalAmount: 4455,
      costPrice: 130,
      customerName: 'Priya Sharma',
      isCredit: true,
      creditPaid: false,
      date: today.toISOString().split('T')[0],
      createdAt: today.toISOString(),
      inputSource: 'seed'
    }
  ];
};

const getInitialPurchases = (): ShopPurchase[] => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return [
    {
      id: 'pch_1',
      productId: 'prod_1',
      productName: 'Biscuits',
      quantity: 20,
      unitCost: 20,
      totalCost: 400,
      supplier: 'Metro Wholesale',
      date: yesterday.toISOString().split('T')[0],
      createdAt: yesterday.toISOString(),
      inputSource: 'voice'
    }
  ];
};

const DEFAULT_CUSTOMER_CREDITS: CustomerCreditRecord[] = [
  {
    id: 'cred_1',
    customerName: 'Anand Kumar',
    customerPhone: '+91 98480 12345',
    amountDue: 750,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'cred_2',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98480 67890',
    amountDue: 4450,
    lastUpdated: new Date().toISOString()
  }
];

export class StorageService {
  static getProfile(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      this.saveProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  static saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  static getPersonalTransactions(): PersonalTransaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PERSONAL_TRANSACTIONS);
    if (!raw) {
      const initial = getInitialPersonalTransactions();
      this.savePersonalTransactions(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static savePersonalTransactions(txs: PersonalTransaction[]): void {
    localStorage.setItem(STORAGE_KEYS.PERSONAL_TRANSACTIONS, JSON.stringify(txs));
  }

  static addPersonalTransactions(newTxs: PersonalTransaction[]): PersonalTransaction[] {
    const current = this.getPersonalTransactions();
    // Prepend new transactions to maintain reverse chronological order
    const updated = [...newTxs, ...current];
    this.savePersonalTransactions(updated);
    return updated;
  }

  static getBudgets(): Budget[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (!raw) {
      this.saveBudgets(DEFAULT_BUDGETS);
      return DEFAULT_BUDGETS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_BUDGETS;
    }
  }

  static saveBudgets(budgets: Budget[]): void {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }

  static getProducts(): Product[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      this.saveProducts(DEFAULT_PRODUCTS);
      return DEFAULT_PRODUCTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PRODUCTS;
    }
  }

  static saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  static addProduct(product: Product): Product[] {
    const products = this.getProducts();
    const updated = [product, ...products];
    this.saveProducts(updated);
    return updated;
  }

  static updateProduct(product: Product): Product[] {
    const products = this.getProducts();
    const updated = products.map(p => p.id === product.id ? product : p);
    this.saveProducts(updated);
    return updated;
  }

  static getSales(): ShopSale[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SALES);
    if (!raw) {
      const initial = getInitialSales();
      this.saveSales(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveSales(sales: ShopSale[]): void {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }

  static addSale(sale: ShopSale): { sales: ShopSale[]; products: Product[] } {
    const sales = this.getSales();
    const products = this.getProducts();

    // Deduct stock for sold product
    const updatedProducts = products.map(p => {
      if (p.id === sale.productId) {
        return {
          ...p,
          stockQuantity: Math.max(0, p.stockQuantity - sale.quantity)
        };
      }
      return p;
    });

    const updatedSales = [sale, ...sales];
    this.saveSales(updatedSales);
    this.saveProducts(updatedProducts);

    return { sales: updatedSales, products: updatedProducts };
  }

  static getPurchases(): ShopPurchase[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    if (!raw) {
      const initial = getInitialPurchases();
      this.savePurchases(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static savePurchases(purchases: ShopPurchase[]): void {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  }

  static addPurchase(purchase: ShopPurchase): { purchases: ShopPurchase[]; products: Product[] } {
    const purchases = this.getPurchases();
    const products = this.getProducts();

    // Increase stock for purchased product
    const updatedProducts = products.map(p => {
      if (p.id === purchase.productId) {
        return {
          ...p,
          stockQuantity: p.stockQuantity + purchase.quantity
        };
      }
      return p;
    });

    const updatedPurchases = [purchase, ...purchases];
    this.savePurchases(updatedPurchases);
    this.saveProducts(updatedProducts);

    return { purchases: updatedPurchases, products: updatedProducts };
  }

  static getCustomerCredits(): CustomerCreditRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CREDITS);
    if (!raw) {
      this.saveCustomerCredits(DEFAULT_CUSTOMER_CREDITS);
      return DEFAULT_CUSTOMER_CREDITS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_CUSTOMER_CREDITS;
    }
  }

  static saveCustomerCredits(credits: CustomerCreditRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.CREDITS, JSON.stringify(credits));
  }

  static resetToDemoData(): void {
    localStorage.clear();
    this.saveProfile(DEFAULT_PROFILE);
    this.savePersonalTransactions(getInitialPersonalTransactions());
    this.saveBudgets(DEFAULT_BUDGETS);
    this.saveProducts(DEFAULT_PRODUCTS);
    this.saveSales(getInitialSales());
    this.savePurchases(getInitialPurchases());
    this.saveCustomerCredits(DEFAULT_CUSTOMER_CREDITS);
  }
}
