import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_TRANSACTIONS } from '../data/demo';
import { walletService } from './walletService';
import { authService } from './authService';

const LOCAL_STORAGE_TX_KEY = 'xpense_transactions';

function getLocalTransactions() {
  const stored = localStorage.getItem(LOCAL_STORAGE_TX_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse transactions', e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_TX_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
  return INITIAL_TRANSACTIONS;
}

function saveLocalTransactions(txs) {
  localStorage.setItem(LOCAL_STORAGE_TX_KEY, JSON.stringify(txs));
}

export const transactionService = {
  async getTransactions(filter = {}) {
    if (isSupabaseConfigured && filter.userId) {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', filter.userId)
        .order('date', { ascending: false });

      if (filter.category) {
        query = query.eq('category', filter.category);
      }
      if (filter.type) {
        query = query.eq('type', filter.type);
      }
      if (filter.wallet_id) {
        query = query.eq('wallet_id', filter.wallet_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }

    let txs = getLocalTransactions();
    if (filter.category) {
      txs = txs.filter(t => t.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.type) {
      txs = txs.filter(t => t.type === filter.type);
    }
    if (filter.wallet_id) {
      txs = txs.filter(t => t.wallet_id === filter.wallet_id);
    }
    return txs;
  },

  async getTransactionById(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    }

    const txs = getLocalTransactions();
    return txs.find(t => t.id === id) || null;
  },

  async createTransaction(txData) {
    const amount = parseFloat(txData.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Please enter a valid transaction amount');
    }

    // 1. If linked to a wallet and is an expense, deduct from wallet
    if (txData.wallet_id && txData.type === 'expense') {
      await walletService.deductFromWallet(txData.wallet_id, amount);
    }

    // 2. Adjust total balance on user profile
    const user = await authService.getCurrentUser();
    if (user) {
      const balanceChange = txData.type === 'income' ? amount : -amount;
      const updatedBalance = Math.max(0, (parseFloat(user.total_balance) || 0) + balanceChange);
      await authService.updateProfile({ total_balance: updatedBalance });
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...txData,
          amount,
          date: txData.date || new Date().toISOString()
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const txs = getLocalTransactions();
    const newTx = {
      id: 'tx-' + Date.now(),
      title: txData.title || (txData.type === 'expense' ? 'Payment' : 'Income received'),
      amount,
      type: txData.type || 'expense',
      category: txData.category || 'General',
      wallet_id: txData.wallet_id || null,
      wallet_name: txData.wallet_name || 'Main Wallet',
      recipient: txData.recipient || null,
      merchant: txData.merchant || null,
      payment_method: txData.payment_method || 'UPI',
      status: 'completed',
      date: 'Just now',
      timestamp: new Date().toISOString(),
      ...txData
    };

    const updated = [newTx, ...txs];
    saveLocalTransactions(updated);
    return newTx;
  },

  async updateTransaction(id, updates) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const txs = getLocalTransactions();
    const updated = txs.map(t => (t.id === id ? { ...t, ...updates } : t));
    saveLocalTransactions(updated);
    return updated.find(t => t.id === id);
  },

  async deleteTransaction(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    }

    const txs = getLocalTransactions();
    const filtered = txs.filter(t => t.id !== id);
    saveLocalTransactions(filtered);
    return true;
  }
};
