# Xpense – Personal Finance & Expense Management System

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase)](https://supabase.com/)

An end-to-end, high-performance personal finance and expense-management application built according to the **Xpense Project Documentation** and specifications.

---

## 🌟 Key Features

1. **Intelligent Financial Dashboard (Home Screen)**:
   - Live Total Balance with toggleable privacy mask (`••••••••`).
   - Quick action triggers: **Scan & Pay**, **Send Money**, and **Receive Money**.
   - 2x2 Metric Grid: Monthly Spend, Today's Spending, Active Goals counter, and 7-day Avg Daily Spend.
   - **AI Insights & Spending Buddy**: Real-time spending recommendations and envelope health alerts.
   - Live Recent Transactions feed with instant balance updates.

2. **Smart Wallets (Envelopes)**:
   - Dedicated spending categories (*Food & Dining, Transportation, Entertainment, Shopping & Utilities*).
   - Dynamic cycle days counter and visual progress bars tracking spent balance against monthly limits.
   - Categorized health badges (`Good`, `Low`, `Warning`).
   - **Interactive Top Up**: Instantly inject funds into any wallet envelope with quick-select pills (+₹100, +₹500, +₹1,000).
   - Create and Delete wallet envelopes with real-time state synchronization.

3. **Savings Goals Tracker**:
   - Define custom financial milestones with target amounts and completion dates.
   - Real-time progress bars with percentage tracking.
   - Confetti-celebrated deposit modal for contributing funds.
   - **💡 Goal Ideas**: Pre-configured templates (*Emergency Fund, Semester Break Trip, New Laptop, Course Materials*) that populate the setup flow on click.

4. **Scan & Pay (Instant Merchant Payments)**:
   - Verified merchant details with live status badges (*The Coffee House, Campus Cafeteria, etc.*).
   - Dynamic debit source selection across active wallet envelopes.
   - Bottom-sheet confirmation drawer showing *Current Balance → Balance After Transfer*.
   - Instant transaction logging and automatic wallet deduction.

5. **Receive Money via Dynamic UPI QR**:
   - Generates real-time, standards-compliant UPI QR codes (`upi://pay?pa=...&pn=...&am=...`) using canvas rendering.
   - Dynamic amount update reflecting directly inside the QR payload.
   - One-click UPI link clipboard copy & integrated payment simulator.

6. **Send Money (Peer Transfers)**:
   - Recipient selection with contact avatars.
   - Custom transfer amount with instant wallet deduction and transaction logging.

7. **Financial Analytics & AI Insights**:
   - Spending breakdown by category with automatic percentage calculation.
   - Month-over-month trend comparison (*This Month vs. Last Month with +/- percentage change*).
   - Daily spending patterns (*Peak Spending Day, Average Daily Spend, Best Saving Day*).
   - Dynamic AI advisory generated directly from live user transaction history.

8. **Profile & Account Preferences**:
   - Premium gradient user banner (*Aditya Venkata Sai Burle*, Student ID `128003008@sastra.ac.in`).
   - Dynamic stat counters for Active Wallets, Savings Goals, and Transactions.
   - Modals for Account Settings, Security & Privacy (PIN and biometric toggles), Notifications, and Linked Payment Methods.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18+ (Hooks, Context API, Components) |
| **Tooling & Dev Server** | Vite 5 |
| **Icons** | Lucide React |
| **QR Code Engine** | qrcode (Canvas / SVG generation) |
| **Delight & Animations** | canvas-confetti, CSS transitions & keyframe sheets |
| **Database & Auth** | Supabase (PostgreSQL, Row Level Security, Triggers) |
| **Fallback & Offline Mode** | LocalStorage-backed state sync with demo dataset |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional for Supabase)
Copy the template file to `.env`:
```bash
copy .env.example .env
```
Fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
> **Note**: If left blank, Xpense automatically runs in **Seamless Local Preview Mode** with full persistence and zero configuration required!

### 3. Setup Supabase Database Schema
In your Supabase project's **SQL Editor**, paste and execute the entire content of [`supabase/schema.sql`](./supabase/schema.sql). This will set up:
- `profiles`, `wallets`, `transactions`, `budgets`, and `savings_goals` tables.
- Row Level Security (RLS) policies ensuring users only access their own financial records.
- User creation trigger to provision user profiles upon sign up.

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 📂 Project Directory Structure

```
Xpense/
├── .env.example               # Environment variables template
├── .env                       # Local environment configuration
├── index.html                 # Vite HTML entry point
├── package.json               # Dependencies and build scripts
├── vite.config.js             # Vite configuration
├── README.md                  # Complete documentation
├── supabase/
│   └── schema.sql             # PostgreSQL schema, RLS policies & triggers
└── src/
    ├── main.jsx               # React entry point
    ├── App.jsx                # Main application layout and screen router
    ├── styles.css             # Comprehensive design system & mobile styles
    ├── context/
    │   └── AuthContext.jsx    # Authentication context & session state
    ├── data/
    │   └── demo.js            # Initial seed data for wallets, goals, user, txs
    ├── hooks/
    │   └── useAsync.js        # Reusable async state management hook
    ├── lib/
    │   └── supabase.js        # Supabase client initializer
    ├── services/
    │   ├── authService.js     # Auth & profile management service
    │   ├── walletService.js   # Wallet CRUD & top-up service
    │   ├── transactionService.js # Transaction CRUD & balance management
    │   ├── savingsGoalService.js # Goals CRUD & contribution service
    │   ├── budgetService.js   # Category budget limits service
    │   └── analyticsService.js# Real-time financial calculations & AI insights
    └── components/
        ├── Navbar.jsx         # Bottom navigation bar
        ├── HomeScreen.jsx     # Financial overview & quick actions
        ├── WalletsScreen.jsx  # Category wallets & top-up manager
        ├── GoalsScreen.jsx    # Savings milestones & ideas
        ├── AnalyticsScreen.jsx# Breakdown, trends, and AI advice
        ├── ProfileScreen.jsx  # Profile preferences & settings
        ├── ScanPayView.jsx    # QR merchant payment flow
        ├── ReceiveMoneyView.jsx # Dynamic QR generation & link sharing
        └── SendMoneyView.jsx  # Peer-to-peer money transfers
```

---

## 🔒 Security Architecture
- All sensitive financial actions are isolated to authenticated user boundaries.
- Supabase Row Level Security (RLS) ensures that every query is scoped using `auth.uid() = user_id`.
- The frontend strictly consumes the public `anon` key. Secret service keys are never exposed.
