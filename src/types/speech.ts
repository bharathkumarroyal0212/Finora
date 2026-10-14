import { PersonalCategory, TransactionType } from './finance';

export interface ParsedTransactionDraft {
  id: string;
  type: TransactionType;
  amount: number;
  category: PersonalCategory;
  description: string;
  date: string; // YYYY-MM-DD
  confidence: number;
  isAmbiguous?: boolean;
  ambiguityReason?: string;
}

export interface ParsedShopItemDraft {
  id: string;
  action: 'sale' | 'purchase';
  productName: string;
  quantity: number;
  unitPrice?: number;
  totalAmount: number;
  matchedProductId?: string;
  availableStock?: number;
  confidence: number;
  isAmbiguous?: boolean;
  ambiguityReason?: string;
}

export interface VoiceParseResult {
  rawText: string;
  personalTransactions: ParsedTransactionDraft[];
  shopTransactions: ParsedShopItemDraft[];
  hasMissingAmount: boolean;
  clarificationPrompt?: string;
}
