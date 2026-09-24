export const DEMO_USER = {
  id: 'user-demo-01',
  email: '128003008@sastra.ac.in',
  full_name: 'Aditya Venkata Sai Burle',
  student_id: '128003008@sastra.ac.in',
  role: 'admin',
  account_type: 'Student Account',
  currency: 'INR',
  currency_symbol: '₹',
  total_balance: 2450.00
};

export const INITIAL_WALLETS = [
  {
    id: 'wallet-1',
    name: 'Food & Dining',
    category: 'Food & Dining',
    balance: 850,
    budget_limit: 2000,
    icon: 'ShoppingBag',
    color: '#10B981',
    cycle_days_left: 30,
    daily_avg: 1150,
    status: 'Good'
  },
  {
    id: 'wallet-2',
    name: 'Transportation',
    category: 'Transportation',
    balance: 450,
    budget_limit: 800,
    icon: 'Car',
    color: '#3B82F6',
    cycle_days_left: 30,
    daily_avg: 350,
    status: 'Good'
  },
  {
    id: 'wallet-3',
    name: 'Entertainment',
    category: 'Entertainment',
    balance: 200,
    budget_limit: 1000,
    icon: 'Gamepad2',
    color: '#A855F7',
    cycle_days_left: 30,
    daily_avg: 800,
    status: 'Low'
  },
  {
    id: 'wallet-4',
    name: 'Shopping & Utilities',
    category: 'Shopping',
    balance: 950,
    budget_limit: 1500,
    icon: 'ShoppingCart',
    color: '#F59E0B',
    cycle_days_left: 30,
    daily_avg: 400,
    status: 'Good'
  }
];

export const INITIAL_GOALS = [
  {
    id: 'goal-1',
    title: 'Emergency Fund',
    target_amount: 5000,
    current_amount: 2500,
    target_date: '2026-12-31',
    icon: 'Target',
    category: 'Savings',
    status: 'in_progress'
  },
  {
    id: 'goal-2',
    title: 'Semester Break Trip',
    target_amount: 20000,
    current_amount: 8000,
    target_date: '2026-11-15',
    icon: 'Plane',
    category: 'Travel',
    status: 'in_progress'
  }
];

export const GOAL_IDEAS = [
  {
    id: 'idea-1',
    title: 'Emergency Fund',
    amount: 5000,
    emoji: '🎯',
    label: 'Save ₹5,000 for emergency fund'
  },
  {
    id: 'idea-2',
    title: 'Semester Break Trip',
    amount: 20000,
    emoji: '✈️',
    label: '₹20,000 for next semester break trip'
  },
  {
    id: 'idea-3',
    title: 'New Laptop',
    amount: 5000,
    emoji: '📱',
    label: '₹50,000 for new laptop'
  },
  {
    id: 'idea-4',
    title: 'Course Materials',
    amount: 10000,
    emoji: '🎓',
    label: '₹10,000 for course materials'
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: 'The Coffee House',
    amount: 100,
    type: 'expense',
    category: 'Food & Dining',
    wallet_name: 'Food & Dining',
    date: 'Today, 03:45 PM',
    timestamp: new Date().toISOString(),
    payment_method: 'UPI QR',
    status: 'completed'
  },
  {
    id: 'tx-2',
    title: 'Campus Bookstore',
    amount: 80,
    type: 'expense',
    category: 'Education',
    wallet_name: 'Shopping & Utilities',
    date: 'Today, 11:20 AM',
    timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    payment_method: 'UPI',
    status: 'completed'
  },
  {
    id: 'tx-3',
    title: 'Monthly Allowance / Freelance',
    amount: 2500,
    type: 'income',
    category: 'Salary',
    wallet_name: 'Main Account',
    date: 'Yesterday',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    payment_method: 'Bank Transfer',
    status: 'completed'
  },
  {
    id: 'tx-4',
    title: 'Metro Transit Card Recharge',
    amount: 450,
    type: 'expense',
    category: 'Transportation',
    wallet_name: 'Transportation',
    date: '22 Sep 2026',
    timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    payment_method: 'UPI',
    status: 'completed'
  },
  {
    id: 'tx-5',
    title: 'Cinema Tickets',
    amount: 350,
    type: 'expense',
    category: 'Entertainment',
    wallet_name: 'Entertainment',
    date: '20 Sep 2026',
    timestamp: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    payment_method: 'UPI',
    status: 'completed'
  }
];

export const RECIPIENTS = [
  { id: 'rec-1', name: 'Alex Johnson', email: 'alex@xpense.app', initial: 'A', color: '#8B5CF6' },
  { id: 'rec-2', name: 'Ben Carter', email: 'ben@xpense.app', initial: 'B', color: '#F97316' },
  { id: 'rec-3', name: 'Chloe Davis', email: 'chloe@xpense.app', initial: 'C', color: '#3B82F6' },
  { id: 'rec-4', name: 'David Evans', email: 'david@xpense.app', initial: 'D', color: '#22C55E' },
  { id: 'rec-5', name: 'Emily White', email: 'emily@xpense.app', initial: 'E', color: '#EC4899' }
];

export const MERCHANTS = [
  { id: 'mer-1', name: 'The Coffee House', location: 'Mumbai, IN', verified: true },
  { id: 'mer-2', name: 'Campus Cafeteria', location: 'Main Block, Campus', verified: true },
  { id: 'mer-3', name: 'University Bookstore', location: 'Academic Wing', verified: true },
  { id: 'mer-4', name: 'Metro Fast Transit', location: 'Station Gate 2', verified: true }
];
