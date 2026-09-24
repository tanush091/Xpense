import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_BUDGETS_KEY = 'xpense_budgets';

const INITIAL_BUDGETS = [
  { id: 'b-1', category: 'Food & Dining', limit_amount: 2000, spent_amount: 1150, period: 'monthly' },
  { id: 'b-2', category: 'Transportation', limit_amount: 800, spent_amount: 350, period: 'monthly' },
  { id: 'b-3', category: 'Entertainment', limit_amount: 1000, spent_amount: 800, period: 'monthly' },
  { id: 'b-4', category: 'Shopping', limit_amount: 1500, spent_amount: 550, period: 'monthly' }
];

function getLocalBudgets() {
  const stored = localStorage.getItem(LOCAL_STORAGE_BUDGETS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse budgets', e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_BUDGETS_KEY, JSON.stringify(INITIAL_BUDGETS));
  return INITIAL_BUDGETS;
}

function saveLocalBudgets(budgets) {
  localStorage.setItem(LOCAL_STORAGE_BUDGETS_KEY, JSON.stringify(budgets));
}

export const budgetService = {
  async getBudgets(userId) {
    if (isSupabaseConfigured && userId) {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data;
    }
    return getLocalBudgets();
  },

  async upsertBudget(budgetData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('budgets')
        .upsert(budgetData)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const budgets = getLocalBudgets();
    const existingIndex = budgets.findIndex(b => b.category === budgetData.category);
    if (existingIndex >= 0) {
      budgets[existingIndex] = { ...budgets[existingIndex], ...budgetData };
    } else {
      budgets.push({
        id: 'b-' + Date.now(),
        spent_amount: 0,
        period: 'monthly',
        ...budgetData
      });
    }
    saveLocalBudgets(budgets);
    return budgetData;
  },

  async deleteBudget(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    }

    const budgets = getLocalBudgets();
    const filtered = budgets.filter(b => b.id !== id);
    saveLocalBudgets(filtered);
    return true;
  }
};
