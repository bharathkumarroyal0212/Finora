import { PersonalCategory, Product, TransactionType } from '../types/finance';
import { ParsedShopItemDraft, ParsedTransactionDraft, VoiceParseResult } from '../types/speech';

// Word to number mapper for English and common phrases
const WORD_NUMBERS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  hundred: 100, thousand: 1000, lakh: 100000, crore: 10000000
};

// Telugu basic phonetic recognition support
const TELUGU_KEYWORDS: Record<string, { type: TransactionType; category: PersonalCategory; desc: string }> = {
  petrol: { type: 'expense', category: 'Petrol/Fuel', desc: 'Petrol' },
  kooragayalu: { type: 'expense', category: 'Vegetables', desc: 'Vegetables' },
  paalu: { type: 'expense', category: 'Groceries', desc: 'Milk' },
  jeetham: { type: 'income', category: 'Salary', desc: 'Salary' },
  current: { type: 'expense', category: 'Electricity', desc: 'Current Bill' },
  karchu: { type: 'expense', category: 'Other', desc: 'Expense' },
  vachindi: { type: 'income', category: 'Other', desc: 'Income' }
};

export class VoiceParserService {
  /**
   * Parse text input or spoken transcript into structured financial transactions
   */
  static parseVoiceInput(
    rawText: string,
    existingProducts: Product[] = [],
    forcedMode?: 'personal' | 'shop'
  ): VoiceParseResult {
    const cleanText = rawText.trim();
    if (!cleanText) {
      return {
        rawText,
        personalTransactions: [],
        shopTransactions: [],
        hasMissingAmount: false
      };
    }

    // Check for ambiguous / missing amount patterns like "I spent some money on petrol"
    const missingAmountPattern = /(?:spent|bought|paid|received|purchased)\s+(?:some|a lot of|unknown|undisclosed|few)?\s*(?:money|amount|cash)?\s*(?:on|for)\s+([a-zA-Z\s]+)/i;
    const hasRupeeOrDigits = /\b(\d+[\d,]*|\d+\.\d+|one|two|three|four|five|six|seven|eight|nine|ten|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|lakh)\b/i;

    if (!hasRupeeOrDigits.test(cleanText) && missingAmountPattern.test(cleanText)) {
      const match = cleanText.match(missingAmountPattern);
      const itemDesc = match ? match[1].trim() : 'this item';
      return {
        rawText,
        personalTransactions: [],
        shopTransactions: [],
        hasMissingAmount: true,
        clarificationPrompt: `How much money was spent or received for ${itemDesc}? Please specify the exact amount in rupees.`
      };
    }

    // Check if sentence starts with or is clearly shop related ("sold", "purchased", "customer credit")
    const isShopCommand = forcedMode === 'shop' ||
      /\b(sold|sale|purchased|purchase|stock|inventory|customer credit)\b/i.test(cleanText);

    if (isShopCommand && forcedMode !== 'personal') {
      const shopItems = this.parseShopCommand(cleanText, existingProducts);
      if (shopItems.length > 0) {
        return {
          rawText,
          personalTransactions: [],
          shopTransactions: shopItems,
          hasMissingAmount: false
        };
      }
    }

    // Otherwise, parse as personal transactions (can contain multiple clauses!)
    const personalItems = this.parsePersonalClauses(cleanText);

    return {
      rawText,
      personalTransactions: personalItems,
      shopTransactions: [],
      hasMissingAmount: personalItems.length === 0 && !hasRupeeOrDigits.test(cleanText),
      clarificationPrompt: personalItems.length === 0 ? "Could not detect clear amounts and categories. Example: 'I spent 300 rupees on petrol and 200 on vegetables'" : undefined
    };
  }

  /**
   * Split multiple clauses: "I spent 300 on petrol and 200 on vegetables, plus 100 on snacks"
   */
  private static parsePersonalClauses(text: string): ParsedTransactionDraft[] {
    const results: ParsedTransactionDraft[] = [];

    // Detect target date from utterance
    let targetDate = new Date().toISOString().split('T')[0];
    if (/\byesterday\b/i.test(text)) {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      targetDate = d.toISOString().split('T')[0];
    } else if (/\bday before yesterday\b/i.test(text)) {
      const d = new Date();
      d.setDate(d.getDate() - 2);
      targetDate = d.toISOString().split('T')[0];
    }

    // Split text into clauses by connectors like 'and', 'also', ',', '&', 'plus'
    // but not splitting within numbers like '2,000'
    const clauses = text
      .replace(/(\d),(\d)/g, '$1$2') // Normalize 2,000 to 2000
      .split(/(?:\band\b|\balso\b|;|\bplus\b|(?<!\d),(?!\d))/i)
      .map(c => c.trim())
      .filter(Boolean);

    let defaultType: TransactionType = 'expense';

    for (let index = 0; index < clauses.length; index++) {
      const clause = clauses[index];

      // Determine income or expense context for this clause
      let type: TransactionType = defaultType;
      if (/\b(received|salary|credited|earned|got|income|freelance|dividend|cashback)\b/i.test(clause)) {
        type = 'income';
        // Note: subsequent clauses may reset if they explicitly say 'spent' or 'paid'
      } else if (/\b(spent|paid|bought|expense|cost|purchase|gave)\b/i.test(clause)) {
        type = 'expense';
      }

      // Extract amount
      const amount = this.extractAmount(clause);
      if (amount <= 0) continue;

      // Extract item name & category
      const { category, description } = this.detectCategoryAndDescription(clause, type);

      results.push({
        id: `draft-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`,
        type,
        amount,
        category,
        description: description || (type === 'income' ? 'Income' : 'Expense'),
        date: targetDate,
        confidence: 0.95
      });
    }

    return results;
  }

  /**
   * Parse shop commands like:
   * "Sold 5 biscuit packets for 150 rupees"
   * "Purchased 20 biscuit packets for 400 rupees"
   */
  private static parseShopCommand(text: string, existingProducts: Product[]): ParsedShopItemDraft[] {
    const results: ParsedShopItemDraft[] = [];
    const isSale = /\b(sold|sale)\b/i.test(text);
    const isPurchase = /\b(purchased|bought|purchase)\b/i.test(text);
    const action: 'sale' | 'purchase' = isPurchase ? 'purchase' : 'sale';

    // Quantity extraction: "5 biscuit packets" or "five biscuit packets"
    const qtyMatch = text.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|twenty|thirty|forty|fifty)\s*(?:units|packets|pieces|boxes|items|pcs|bottles|bags|nos)?\s+([a-zA-Z\s]+?)(?:\s+(?:for|at|worth|of)\s+|\s*$)/i);

    let quantity = 1;
    let rawProductName = '';
    let totalAmount = this.extractAmount(text);

    if (qtyMatch) {
      quantity = this.wordOrDigitToNumber(qtyMatch[1]) || 1;
      rawProductName = qtyMatch[2].replace(/(?:packets|packet|boxes|box|pieces|piece|items|units|of)/gi, '').trim();
    } else {
      // Try to find if any existing product name is mentioned
      for (const prod of existingProducts) {
        if (new RegExp(`\\b${prod.name}\\b`, 'i').test(text)) {
          rawProductName = prod.name;
          break;
        }
      }
    }

    if (!rawProductName) {
      // Fallback description from text
      const fallbackMatch = text.match(/(?:sold|purchased)\s+(?:some\s+)?([a-zA-Z\s]+?)(?:\s+(?:for|at)|$)/i);
      rawProductName = fallbackMatch ? fallbackMatch[1].trim() : 'General Item';
    }

    // Capitalize product name
    const formattedProductName = rawProductName.charAt(0).toUpperCase() + rawProductName.slice(1);

    // Find matched product in store inventory
    const matchedProduct = existingProducts.find(
      p => p.name.toLowerCase().includes(formattedProductName.toLowerCase()) ||
           formattedProductName.toLowerCase().includes(p.name.toLowerCase())
    );

    // If totalAmount was not found, calculate from matched product
    if (totalAmount === 0 && matchedProduct) {
      totalAmount = action === 'sale'
        ? matchedProduct.sellingPrice * quantity
        : matchedProduct.purchasePrice * quantity;
    }

    const availableStock = matchedProduct ? matchedProduct.stockQuantity : undefined;
    const isAmbiguous = action === 'sale' && availableStock !== undefined && availableStock < quantity;

    results.push({
      id: `shop-draft-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      action,
      productName: matchedProduct ? matchedProduct.name : formattedProductName,
      quantity,
      unitPrice: quantity > 0 ? Math.round((totalAmount / quantity) * 100) / 100 : totalAmount,
      totalAmount,
      matchedProductId: matchedProduct?.id,
      availableStock,
      confidence: matchedProduct ? 0.98 : 0.85,
      isAmbiguous,
      ambiguityReason: isAmbiguous ? `Stock is only ${availableStock} units, but ${quantity} requested.` : undefined
    });

    return results;
  }

  /**
   * Helper to extract numeric amount from a clause
   */
  private static extractAmount(clause: string): number {
    // Look for rupee patterns: "₹ 300", "300 rupees", "rs 300", "300 rs", "for 300", "300/-"
    const cleaned = clause.replace(/(\d),(\d)/g, '$1$2');

    // First check for explicit ₹ or rupees/rs pattern
    const rupeeRegex = /(?:₹|rs\.?|inr)\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*(?:₹|rupees|rupee|rs\.?|inr|\/-)/i;
    const match = cleaned.match(rupeeRegex);
    if (match) {
      return parseFloat(match[1] || match[2]);
    }

    // Check for "for 300" or "spent 300"
    const verbNumRegex = /(?:spent|received|for|paid|bought|got|salary|cost|amount of)\s+(\d+(?:\.\d+)?)/i;
    const verbMatch = cleaned.match(verbNumRegex);
    if (verbMatch) {
      return parseFloat(verbMatch[1]);
    }

    // Check for word numbers combined with rupees: "two thousand rupees", "sixty rupees"
    const wordNumRegex = /(one|two|three|four|five|six|seven|eight|nine|ten|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|lakh)\s*(?:thousand|hundred)?\s*(?:rupees|rupee|rs)/i;
    const wordMatch = cleaned.match(wordNumRegex);
    if (wordMatch) {
      return this.parseComplexWordNumber(wordMatch[0]);
    }

    // Fallback: any standalone number in the clause
    const anyNumberMatch = cleaned.match(/\b(\d+(?:\.\d+)?)\b/);
    if (anyNumberMatch) {
      return parseFloat(anyNumberMatch[1]);
    }

    return 0;
  }

  /**
   * Convert words like "two thousand", "sixty", "five" to numbers
   */
  private static wordOrDigitToNumber(str: string): number {
    if (!str) return 0;
    const trimmed = str.trim().toLowerCase();
    if (!isNaN(Number(trimmed))) {
      return Number(trimmed);
    }
    return WORD_NUMBERS[trimmed] || 0;
  }

  private static parseComplexWordNumber(str: string): number {
    const tokens = str.toLowerCase().replace(/(?:rupees|rupee|rs)/g, '').trim().split(/\s+/);
    let total = 0;
    let current = 0;

    for (const token of tokens) {
      const val = WORD_NUMBERS[token];
      if (!val) continue;

      if (val === 100) {
        current = (current === 0 ? 1 : current) * 100;
      } else if (val === 1000 || val === 100000) {
        current = (current === 0 ? 1 : current) * val;
        total += current;
        current = 0;
      } else {
        current += val;
      }
    }
    return total + current;
  }

  /**
   * Intelligently classify category and clean description
   */
  private static detectCategoryAndDescription(
    clause: string,
    type: TransactionType
  ): { category: PersonalCategory; description: string } {
    const text = clause.toLowerCase();

    // Check Telugu keywords first
    for (const [teluguWord, mapping] of Object.entries(TELUGU_KEYWORDS)) {
      if (text.includes(teluguWord)) {
        return { category: mapping.category, description: mapping.desc };
      }
    }

    // Petrol / Fuel
    if (text.includes('petrol') || text.includes('fuel') || text.includes('diesel') || text.includes('gas station')) {
      return { category: 'Petrol/Fuel', description: 'Petrol' };
    }

    // Vegetables
    if (text.includes('vegetable') || text.includes('veggie') || text.includes('tomato') || text.includes('onion') || text.includes('potato')) {
      return { category: 'Vegetables', description: 'Vegetables' };
    }

    // Groceries / Food items
    if (text.includes('milk')) return { category: 'Groceries', description: 'Milk' };
    if (text.includes('bread')) return { category: 'Groceries', description: 'Bread' };
    if (text.includes('egg') || text.includes('eggs')) return { category: 'Groceries', description: 'Eggs' };
    if (text.includes('tea') || text.includes('chai')) return { category: 'Food', description: 'Tea' };
    if (text.includes('snack') || text.includes('biscuit') || text.includes('cookies')) return { category: 'Food', description: 'Snacks' };
    if (text.includes('grocery') || text.includes('ration') || text.includes('supermarket')) return { category: 'Groceries', description: 'Groceries' };
    if (text.includes('restaurant') || text.includes('dinner') || text.includes('lunch') || text.includes('swiggy') || text.includes('zomato') || text.includes('food')) {
      return { category: 'Food', description: 'Food' };
    }

    // Salary / Income
    if (type === 'income' || text.includes('salary') || text.includes('paycheck') || text.includes('bonus')) {
      return { category: 'Salary', description: 'Salary' };
    }
    if (text.includes('freelance') || text.includes('client') || text.includes('project payment')) {
      return { category: 'Salary', description: 'Freelance Work' };
    }

    // Transport / Travel
    if (text.includes('transport') || text.includes('metro') || text.includes('bus') || text.includes('auto') || text.includes('uber') || text.includes('ola') || text.includes('cab') || text.includes('train')) {
      return { category: 'Transport', description: 'Transport' };
    }

    // Electricity / Utility Bills
    if (text.includes('electricity') || text.includes('power bill') || text.includes('current bill')) {
      return { category: 'Electricity', description: 'Electricity Bill' };
    }
    if (text.includes('bill') || text.includes('wifi') || text.includes('internet') || text.includes('recharge') || text.includes('water bill')) {
      return { category: 'Bills', description: 'Internet / Utility Bill' };
    }

    // Shopping
    if (text.includes('shopping') || text.includes('clothes') || text.includes('amazon') || text.includes('flipkart') || text.includes('shoes')) {
      return { category: 'Shopping', description: 'Shopping' };
    }

    // Clean up generic description
    const cleaned = clause
      .replace(/(?:i spent|spent|i bought|bought|i paid|paid|i received|received|for|on|worth of|rupees|rupee|rs\.?|inr|\d+)/gi, '')
      .replace(/[^\w\s]/g, '')
      .trim();

    const desc = cleaned ? (cleaned.charAt(0).toUpperCase() + cleaned.slice(1)) : 'Expense';
    return { category: 'Other', description: desc };
  }
}
