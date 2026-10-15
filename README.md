# FINORA — Smart Money. Better Tomorrow.

> Premium AI-Powered Personal Finance & Small Business Application for Individuals and Shop Owners.

Built to faithfully recreate the visual specification and mobile interfaces of the FINORA design system.

---

## 🌟 Overview & Core Differentiators

FINORA provides dual-mode financial management tailored for everyday Indian financial life:

1. **Personal Finance Mode**:
   - Monthly summary overview, Income, Expense, and Savings tracking.
   - Dynamic greetings personalized to local time (`Good morning, Ramesh!`, `Good afternoon`, `Good evening`, `Good night`).
   - Categorized transactions (Petrol/Fuel, Vegetables, Groceries, Food, Salary, Transport, Bills, Shopping).
   - Real-time Category Spending Breakdown Donut Chart.
   - Actionable AI Insights and proactive savings suggestions.

2. **Shop Manager Mode**:
   - 2x2 summary grid: Total Sales, Total Profit, Stock Value, and Customer Credit.
   - Inventory tracking with low-stock warnings (e.g. Milk & Chips alert).
   - Top Selling Products leaderboard with units sold.
   - Voice-enabled Sale & Purchase entry with automatic inventory deduction and restock.

3. **Natural-Language Voice Financial Engine**:
   - Web Speech API integration with continuous speech recognition.
   - Concentric animated purple microphone matching the reference image.
   - **Multi-Transaction Parsing**: Extracts multiple distinct transactions from a single spoken sentence (e.g. `"I spent 300 rupees on petrol and 200 rupees on vegetables"` yields 2 separate records, total ₹500).
   - **Missing Amount Guard**: When an utterance lacks an explicit amount (e.g. `"I spent some money on petrol"`), FINORA halts and prompts for clarification rather than creating a fabricated transaction.
   - Language selector: Indian English (`en-IN`) and Telugu phonetic recognition (`te-IN`).

---

## 📱 The 10 Visual Reference Screens

FINORA reproduces all 10 mobile screens shown in the reference poster:

| # | Screen | Description |
|---|--------|-------------|
| **1** | **Welcome Screen** | Dark navy background (`#0B1431`), brand ribbon F logo, gold tagline, "Get Started" gold button, and bottom wave accents. |
| **2** | **Home / Mode Selection** | Clean white surface, "Choose Your Mode", Personal Finance (purple user badge) & Shop Manager (gold store badge) interactive cards. |
| **3** | **Personal Dashboard** | Dark navy header, dynamic greeting, monthly balance card (`₹24,850`), 3 metric cards (Expenses `₹8,420`, Income `₹17,000`, Savings `₹5,200`), recent transactions, and bottom nav. |
| **4** | **Voice Input (Personal)** | Segmented tabs (Voice / Manual / Scan), concentric purple microphone, waveform audio visualizer, language picker, and quick test presets. |
| **5** | **Personal AI Insights** | Clean white screen, gold sparkle header, amber food percentage highlight (`35% on food`), Recharts donut breakdown, and quick saving suggestions. |
| **6** | **Shop Dashboard** | Dark navy background, 2x2 grid (Total Sales `₹48,750`, Total Profit `₹12,860`, Stock Value `₹28,400`, Customer Credit `₹5,200`), and Top Selling Products. |
| **7** | **Add Product** | Clean product form, image upload badge with biscuit packet thumbnail, SKU generation, purchase price, selling price, and initial stock. |
| **8** | **Record Sale (Voice)** | Segmented Sale/Purchase tabs, purple microphone, spoken example box, and recent entries (`Sold 5 Biscuit Packets +₹150`, `Purchased 20 -₹400`). |
| **9** | **Shop AI Insights** | Business overview, performance summary card, remaining stock (`15 items`), and Low Stock Alerts (`Milk & Chips running low`). |
| **10**| **Menu / Profile** | Dark navy screen with bottom waves, user avatar (`RK`), Ramesh Kumar profile, navigation menu (Home, Personal, Shop, Reports, Settings, Help, Log Out). |

---

## 🎨 Design System & Color Palette

- **Deep Navy**: `#0B1431` & `#10172A`
- **Primary Indigo**: `#5145D8`
- **Purple Accent**: `#6558E8`
- **Soft Lavender Light**: `#EEF0FF`
- **Warm Gold Accent**: `#C8A96B` (and gold gradient `#DFBA73` to `#B59458`)
- **Card White**: `#FFFFFF`
- **Soft Background**: `#F8FAFC` / `#F5F6FA`
- **Success Green**: `#15966A`
- **Error / Expense Red**: `#D64550`

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v20+ recommended)
- npm (v10+)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser to `http://localhost:5173`.

### 3. Run Automated Voice & Financial Logic Tests
```bash
npm run test:verify
```
Verifies all 7 core tests:
- **Test A**: Multiple expenses (`"I spent 300 rupees on petrol and 200 rupees on vegetables"`)
- **Test B**: Multiple products (`"I bought milk for 60 rupees, bread for 45 rupees, and eggs for 90 rupees"`)
- **Test C**: Income and expense (`"I received 2,000 rupees as salary and spent 150 rupees on transport"`)
- **Test D**: Three expenses (`"I spent 100 rupees on tea, 80 rupees on snacks, and 250 rupees on petrol"`)
- **Test E**: Missing amount verification (`"I spent some money on petrol"`)
- **Test F**: Shop voice sale (`"Sold five biscuit packets for 150 rupees"`)
- **Test G**: Financial calculation precision

### 4. Build for Production
```bash
npm run build
```

---

## ☁️ Backend & Authentication Configuration

FINORA runs by default in **Persistent Demo Mode**:
- All transactions, products, stock levels, and profile settings persist across browser refreshes in `localStorage`.
- Includes initial seed data matching the reference numbers (`₹24,850`, `₹8,420`, `₹48,750`, etc.).
- A 1-click **Reset Demo** button is available in the top bar and Settings.

### Optional Supabase Cloud Integration
To enable live Supabase Cloud authentication and database synchronization:
1. Create a Supabase project at [https://supabase.com](https://supabase.com).
2. Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
3. Restart the dev server. FINORA will automatically detect the credentials and switch from local demo to cloud sync.

---

## 📊 Financial Calculation Formulas

- **Personal Net Cash Flow** = $\sum \text{Income} - \sum \text{Expenses}$
- **Savings Rate** = $(\text{Net Cash Flow} / \text{Total Income}) \times 100$
- **Shop Gross Profit** = $\text{Sales Revenue} - \text{Cost of Goods Sold (COGS)}$
- **Shop Net Profit** = $\text{Gross Profit} - \text{Operating Expenses}$
- **Stock Valuation** = $\sum (\text{Stock Quantity} \times \text{Purchase Price})$
- **Customer Credit Total** = $\sum \text{Unpaid Credit Amounts}$

---

## 🛠️ View Modes Available in the UI

In the top header bar, you can seamlessly toggle between:
1. **10 Screens Poster View**: Displays all 10 phones lined up in two rows, exactly mirroring the visual poster specification. Every phone is live and interactive!
2. **Phone Frame View**: Renders the active screen inside a sleek iPhone chassis with dynamic island, status bar (9:41, wifi, battery), and bottom nav.
3. **Full Screen View**: Responsive full-viewport layout for tablet and desktop displays.
