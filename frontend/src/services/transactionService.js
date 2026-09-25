import { apiClient } from './apiClient';
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
    try {
      const params = {};
      if (filter.userId) params.userId = filter.userId;
      if (filter.category) params.category = filter.category;
      if (filter.type) params.type = filter.type;
      if (filter.wallet_id) params.walletId = filter.wallet_id;

      const data = await apiClient.get('/transactions', params);
      if (Array.isArray(data) && data.length > 0) {
        saveLocalTransactions(data);
        return data;
      }
    } catch (err) {
      console.warn('Backend /api/transactions unreachable, using local store:', err.message);
    }

    let txs = getLocalTransactions();
    if (filter.category) {
      txs = txs.filter(t => t.category?.toLowerCase() === filter.category.toLowerCase());
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
    try {
      const data = await apiClient.get(`/transactions/${id}`);
      if (data) return data;
    } catch (err) {
      console.warn(`Backend /api/transactions/${id} unreachable, using local store:`, err.message);
    }

    const txs = getLocalTransactions();
    return txs.find(t => t.id === id) || null;
  },

  async createTransaction(txData) {
    const amount = parseFloat(txData.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Please enter a valid transaction amount');
    }

    // Attempt backend first
    try {
      const payload = {
        title: txData.title,
        amount: amount,
        type: txData.type || 'expense',
        category: txData.category || 'General',
        wallet_id: txData.wallet_id || null,
        wallet_name: txData.wallet_name || null,
        recipient: txData.recipient || null,
        merchant: txData.merchant || null,
        payment_method: txData.payment_method || 'UPI',
        status: txData.status || 'completed',
        note: txData.note || null,
      };
      const data = await apiClient.post('/transactions', payload);
      if (data) {
        const local = getLocalTransactions();
        saveLocalTransactions([data, ...local]);
        return data;
      }
    } catch (err) {
      console.warn('Backend create transaction failed, falling back to local:', err.message);
    }

    // Local fallback
    if (txData.wallet_id && txData.type === 'expense') {
      await walletService.deductFromWallet(txData.wallet_id, amount);
    }

    const user = await authService.getCurrentUser();
    if (user) {
      const balanceChange = txData.type === 'income' ? amount : -amount;
      const updatedBalance = Math.max(0, (parseFloat(user.total_balance) || 0) + balanceChange);
      await authService.updateProfile({ total_balance: updatedBalance });
    }

    const txs = getLocalTransactions();
    const newTx = {
      id: 'tx-' + Date.now(),
      created_at: new Date().toISOString(),
      date: new Date().toISOString(),
      ...txData,
      amount
    };

    const updated = [newTx, ...txs];
    saveLocalTransactions(updated);
    return newTx;
  },

  async sendMoneyTransfer(transferData) {
    try {
      const data = await apiClient.post('/transactions/transfer', transferData);
      if (data) {
        const local = getLocalTransactions();
        saveLocalTransactions([data, ...local]);
        return data;
      }
    } catch (err) {
      console.warn('Backend transfer failed, using fallback:', err.message);
    }

    return this.createTransaction({
      title: `Transfer to ${transferData.recipient}`,
      amount: transferData.amount,
      type: 'expense',
      category: 'Transfers',
      wallet_id: transferData.wallet_id,
      recipient: transferData.recipient,
      payment_method: transferData.payment_method || 'UPI',
      note: transferData.note
    });
  },

  async deleteTransaction(id) {
    try {
      await apiClient.delete(`/transactions/${id}`);
    } catch (err) {
      console.warn('Backend delete transaction failed, using local store:', err.message);
    }
    const txs = getLocalTransactions();
    const updated = txs.filter(t => t.id !== id);
    saveLocalTransactions(updated);
    return true;
  }
};
