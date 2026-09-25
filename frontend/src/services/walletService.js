import { apiClient } from './apiClient';
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
    try {
      const data = await apiClient.get('/wallets', { userId });
      if (Array.isArray(data) && data.length > 0) {
        saveLocalWallets(data);
        return data;
      }
    } catch (err) {
      console.warn('Backend /api/wallets unreachable, using local store:', err.message);
    }
    return getLocalWallets();
  },

  async getWalletById(id) {
    try {
      const data = await apiClient.get(`/wallets/${id}`);
      if (data) return data;
    } catch (err) {
      console.warn(`Backend /api/wallets/${id} unreachable, using local store:`, err.message);
    }
    const wallets = getLocalWallets();
    return wallets.find(w => w.id === id) || null;
  },

  async createWallet(walletData) {
    try {
      const data = await apiClient.post('/wallets', walletData);
      if (data) {
        const local = getLocalWallets();
        saveLocalWallets([data, ...local]);
        return data;
      }
    } catch (err) {
      console.warn('Backend create wallet failed, using local store:', err.message);
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
    try {
      const data = await apiClient.put(`/wallets/${id}`, updates);
      if (data) {
        const local = getLocalWallets();
        saveLocalWallets(local.map(w => (w.id === id ? { ...w, ...data } : w)));
        return data;
      }
    } catch (err) {
      console.warn('Backend update wallet failed, using local store:', err.message);
    }

    const wallets = getLocalWallets();
    const updated = wallets.map(w => (w.id === id ? { ...w, ...updates } : w));
    saveLocalWallets(updated);
    return updated.find(w => w.id === id);
  },

  async topUpWallet(id, amount) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Please enter a valid top-up amount');
    }

    try {
      const data = await apiClient.post(`/wallets/${id}/topup`, { amount: numAmount });
      if (data) {
        const local = getLocalWallets();
        saveLocalWallets(local.map(w => (w.id === id ? { ...w, ...data } : w)));
        return data;
      }
    } catch (err) {
      console.warn('Backend topup failed, using local store:', err.message);
    }

    const wallets = getLocalWallets();
    const wallet = wallets.find(w => w.id === id);
    if (!wallet) throw new Error('Wallet not found');

    const newBalance = (parseFloat(wallet.balance) || 0) + numAmount;
    let newStatus = wallet.status;
    if (wallet.budget_limit) {
      const ratio = newBalance / parseFloat(wallet.budget_limit);
      if (ratio >= 0.3) newStatus = 'Good';
    }

    const updatedWallet = {
      ...wallet,
      balance: newBalance,
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    const updated = wallets.map(w => (w.id === id ? updatedWallet : w));
    saveLocalWallets(updated);
    return updatedWallet;
  },

  async deductFromWallet(id, amount) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Please enter a valid deduction amount');
    }

    const wallets = getLocalWallets();
    const wallet = wallets.find(w => w.id === id);
    if (!wallet) throw new Error('Wallet not found');

    const currentBalance = parseFloat(wallet.balance) || 0;
    if (currentBalance < numAmount) {
      throw new Error(`Insufficient balance in ${wallet.name} wallet`);
    }

    const newBalance = currentBalance - numAmount;
    let newStatus = wallet.status;
    if (wallet.budget_limit) {
      const ratio = newBalance / parseFloat(wallet.budget_limit);
      if (ratio <= 0.1) newStatus = 'Warning';
      else if (ratio <= 0.25) newStatus = 'Low';
    }

    const updatedWallet = {
      ...wallet,
      balance: newBalance,
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    try {
      await apiClient.put(`/wallets/${id}`, { balance: newBalance, status: newStatus });
    } catch {
      // Local fallback
    }

    const updated = wallets.map(w => (w.id === id ? updatedWallet : w));
    saveLocalWallets(updated);
    return updatedWallet;
  },

  async deleteWallet(id) {
    try {
      await apiClient.delete(`/wallets/${id}`);
    } catch (err) {
      console.warn('Backend delete wallet failed, using local store:', err.message);
    }
    const wallets = getLocalWallets();
    const updated = wallets.filter(w => w.id !== id);
    saveLocalWallets(updated);
    return true;
  }
};
