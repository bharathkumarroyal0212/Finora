import { VoiceParserService } from '../services/voiceParserService';
import { CalculationService } from '../services/calculationService';
import { Product, PersonalTransaction } from '../types/finance';

const mockProducts: Product[] = [
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
    stockQuantity: 3,
    lowStockThreshold: 5,
    supplier: 'Heritage Dairy',
    createdAt: new Date().toISOString()
  }
];

function runAllTests() {
  console.log('==============================================');
  console.log('FINORA COMPREHENSIVE AUTOMATED VERIFICATION SUITE');
  console.log('==============================================\n');

  let passed = 0;
  let total = 0;

  // --- Test A: Multiple expenses ---
  total++;
  const testA = VoiceParserService.parseVoiceInput(
    "I spent 300 rupees on petrol and 200 rupees on vegetables.",
    mockProducts
  );
  console.log('Test A: "I spent 300 rupees on petrol and 200 rupees on vegetables."');
  console.log('Extracted:', testA.personalTransactions.map(t => `${t.description}: ₹${t.amount} (${t.type})`));
  const sumA = testA.personalTransactions.reduce((acc, t) => acc + t.amount, 0);
  if (
    testA.personalTransactions.length === 2 &&
    testA.personalTransactions[0].amount === 300 &&
    testA.personalTransactions[1].amount === 200 &&
    sumA === 500
  ) {
    console.log('✅ Test A PASSED: Two separate expenses (₹300 petrol, ₹200 vegetables), total ₹500.\n');
    passed++;
  } else {
    console.error('❌ Test A FAILED\n');
  }

  // --- Test B: Multiple products ---
  total++;
  const testB = VoiceParserService.parseVoiceInput(
    "I bought milk for 60 rupees, bread for 45 rupees, and eggs for 90 rupees.",
    mockProducts
  );
  console.log('Test B: "I bought milk for 60 rupees, bread for 45 rupees, and eggs for 90 rupees."');
  console.log('Extracted:', testB.personalTransactions.map(t => `${t.description}: ₹${t.amount}`));
  const sumB = testB.personalTransactions.reduce((acc, t) => acc + t.amount, 0);
  if (testB.personalTransactions.length === 3 && sumB === 195) {
    console.log('✅ Test B PASSED: Three separate expense records, combined total ₹195.\n');
    passed++;
  } else {
    console.error('❌ Test B FAILED\n');
  }

  // --- Test C: Income and expense ---
  total++;
  const testC = VoiceParserService.parseVoiceInput(
    "I received 2,000 rupees as salary and spent 150 rupees on transport.",
    mockProducts
  );
  console.log('Test C: "I received 2,000 rupees as salary and spent 150 rupees on transport."');
  console.log('Extracted:', testC.personalTransactions.map(t => `${t.description}: ₹${t.amount} (${t.type})`));
  const incomeC = testC.personalTransactions.find(t => t.type === 'income')?.amount || 0;
  const expenseC = testC.personalTransactions.find(t => t.type === 'expense')?.amount || 0;
  const netC = incomeC - expenseC;
  if (incomeC === 2000 && expenseC === 150 && netC === 1850) {
    console.log('✅ Test C PASSED: Income ₹2,000, Expense ₹150, Net cash-flow contribution: ₹1,850.\n');
    passed++;
  } else {
    console.error('❌ Test C FAILED\n');
  }

  // --- Test D: Three expenses ---
  total++;
  const testD = VoiceParserService.parseVoiceInput(
    "I spent 100 rupees on tea, 80 rupees on snacks, and 250 rupees on petrol.",
    mockProducts
  );
  console.log('Test D: "I spent 100 rupees on tea, 80 rupees on snacks, and 250 rupees on petrol."');
  console.log('Extracted:', testD.personalTransactions.map(t => `${t.description}: ₹${t.amount}`));
  const sumD = testD.personalTransactions.reduce((acc, t) => acc + t.amount, 0);
  if (testD.personalTransactions.length === 3 && sumD === 430) {
    console.log('✅ Test D PASSED: Three separate records, combined total ₹430.\n');
    passed++;
  } else {
    console.error('❌ Test D FAILED\n');
  }

  // --- Test E: Missing amount ---
  total++;
  const testE = VoiceParserService.parseVoiceInput(
    "I spent some money on petrol.",
    mockProducts
  );
  console.log('Test E: "I spent some money on petrol."');
  console.log('Has Missing Amount:', testE.hasMissingAmount);
  console.log('Clarification Prompt:', testE.clarificationPrompt);
  if (testE.hasMissingAmount === true && testE.personalTransactions.length === 0) {
    console.log('✅ Test E PASSED: Missing amount detected, no fabricated record created, clarification prompted.\n');
    passed++;
  } else {
    console.error('❌ Test E FAILED\n');
  }

  // --- Test F: Shop sale ---
  total++;
  const testF = VoiceParserService.parseVoiceInput(
    "Sold five biscuit packets for 150 rupees.",
    mockProducts
  );
  console.log('Test F: "Sold five biscuit packets for 150 rupees."');
  console.log('Extracted Shop Items:', testF.shopTransactions);
  if (
    testF.shopTransactions.length === 1 &&
    testF.shopTransactions[0].productName === 'Biscuits' &&
    testF.shopTransactions[0].quantity === 5 &&
    testF.shopTransactions[0].totalAmount === 150
  ) {
    console.log('✅ Test F PASSED: Product Biscuits identified, qty 5, total ₹150.\n');
    passed++;
  } else {
    console.error('❌ Test F FAILED\n');
  }

  // --- Test G: Financial Calculation Layer ---
  total++;
  const testTransactions: PersonalTransaction[] = [
    {
      id: 'tx1',
      mode: 'personal',
      type: 'income',
      amount: 17000,
      currency: 'INR',
      category: 'Salary',
      description: 'Monthly Salary',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      inputSource: 'seed'
    },
    {
      id: 'tx2',
      mode: 'personal',
      type: 'expense',
      amount: 8420,
      currency: 'INR',
      category: 'Food',
      description: 'Food & Groceries',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      inputSource: 'seed'
    }
  ];
  const summary = CalculationService.calculatePersonalSummary(testTransactions, [], 'monthly');
  console.log('Test G: Financial Calculation Summary');
  console.log(`Income: ₹${summary.totalIncome}, Expenses: ₹${summary.totalExpenses}, Net: ₹${summary.netCashFlow}`);
  if (summary.totalIncome === 17000 && summary.totalExpenses === 8420 && summary.netCashFlow === 8580) {
    console.log('✅ Test G PASSED: Accurate income, expense, and net cash flow calculations.\n');
    passed++;
  } else {
    console.error('❌ Test G FAILED\n');
  }

  console.log('==============================================');
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED SUCCESSFULLY!`);
  console.log('==============================================');
}

runAllTests();
