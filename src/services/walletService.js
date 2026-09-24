import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_WALLETS } from '../data/demo';

const LOCAL_STORAGE_WALLETS_KEY = 'xpense_wallets';

function getLocalWallets() {
  const stored = localStorage.getItem(LOCAL_STORAGE_WALLETS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse wallets', e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_WALLETS_KEY, JSON.stringify(INITIAL_WALLETS));
  return INITIAL_WALLETS;
}

function saveLocalWallets(wallets) {
  localStorage.setItem(LOCAL_STORAGE_WALLETS_KEY, JSON.stringify(wallets));
}

export const walletService = {
  async getWallets(userId) {
    if (isSupabaseConfigured && userId) {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    return getLocalWallets();
  },

  async getWalletById(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    }
    const wallets = getLocalWallets();
    return wallets.find(w => w.id === id) || null;
  },

  async createWallet(walletData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('wallets')
        .insert([walletData])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const wallets = getLocalWallets();
    const newWallet = {
      id: 'wallet-' + Date.now(),
      created_at: new Date().toISOString(),
      balance: parseFloat(walletData.balance || 0),
      budget_limit: parseFloat(walletData.budget_limit || 1000),
      cycle_days_left: 30,
      daily_avg: Math.round(parseFloat(walletData.budget_limit || 1000) / 30),
      status: 'Good',
      icon: walletData.icon || 'Wallet',
      color: walletData.color || '#3B82F6',
      ...walletData
    };
    const updated = [newWallet, ...wallets];
    saveLocalWallets(updated);
    return newWallet;
  },

  async updateWallet(id, updates) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('wallets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const wallets = getLocalWallets();
    const updated = wallets.map(w => (w.id === id ? { ...w, ...updates } : w));
    saveLocalWallets(updated);
    return updated.find(w => w.id === id);
  },

  async topUpWallet(id, amount) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Invalid top up amount');
    }

    if (isSupabaseConfigured) {
      const wallet = await this.getWalletById(id);
      const newBalance = parseFloat(wallet.balance) + numAmount;
      return this.updateWallet(id, { balance: newBalance });
    }

    const wallets = getLocalWallets();
    const updated = wallets.map(w => {
      if (w.id === id) {
        const newBalance = parseFloat(w.balance) + numAmount;
        return {
          ...w,
          balance: newBalance,
          status: newBalance >= w.budget_limit * 0.25 ? 'Good' : 'Low'
        };
      }
      return w;
    });
    saveLocalWallets(updated);
    return updated.find(w => w.id === id);
  },

  async deductFromWallet(id, amount) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Invalid deduction amount');
    }

    const wallets = getLocalWallets();
    const target = wallets.find(w => w.id === id);
    if (!target) throw new Error('Wallet not found');
    if (target.balance < numAmount) {
      throw new Error(`Insufficient funds in ${target.name}. Available: ₹${target.balance}`);
    }

    const newBalance = target.balance - numAmount;
    return this.updateWallet(id, {
      balance: newBalance,
      status: newBalance <= target.budget_limit * 0.2 ? 'Low' : 'Good'
    });
  },

  async deleteWallet(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('wallets')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    }

    const wallets = getLocalWallets();
    const filtered = wallets.filter(w => w.id !== id);
    saveLocalWallets(filtered);
    return true;
  }
};
