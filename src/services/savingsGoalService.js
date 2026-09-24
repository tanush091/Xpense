import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_GOALS } from '../data/demo';

const LOCAL_STORAGE_GOALS_KEY = 'xpense_savings_goals';

function getLocalGoals() {
  const stored = localStorage.getItem(LOCAL_STORAGE_GOALS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse savings goals', e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_GOALS_KEY, JSON.stringify(INITIAL_GOALS));
  return INITIAL_GOALS;
}

function saveLocalGoals(goals) {
  localStorage.setItem(LOCAL_STORAGE_GOALS_KEY, JSON.stringify(goals));
}

export const savingsGoalService = {
  async getGoals(userId) {
    if (isSupabaseConfigured && userId) {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    return getLocalGoals();
  },

  async createGoal(goalData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('savings_goals')
        .insert([goalData])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const goals = getLocalGoals();
    const newGoal = {
      id: 'goal-' + Date.now(),
      created_at: new Date().toISOString(),
      current_amount: parseFloat(goalData.current_amount || 0),
      target_amount: parseFloat(goalData.target_amount || 5000),
      icon: goalData.icon || 'Target',
      category: goalData.category || 'General',
      status: 'in_progress',
      ...goalData
    };
    const updated = [newGoal, ...goals];
    saveLocalGoals(updated);
    return newGoal;
  },

  async contributeToGoal(id, amount) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Please enter a valid deposit amount');
    }

    const goals = getLocalGoals();
    const updated = goals.map(g => {
      if (g.id === id) {
        const newCurrent = parseFloat(g.current_amount || 0) + numAmount;
        const isCompleted = newCurrent >= parseFloat(g.target_amount);
        return {
          ...g,
          current_amount: newCurrent,
          status: isCompleted ? 'completed' : 'in_progress'
        };
      }
      return g;
    });
    saveLocalGoals(updated);

    if (isSupabaseConfigured) {
      const target = updated.find(g => g.id === id);
      const { data, error } = await supabase
        .from('savings_goals')
        .update({
          current_amount: target.current_amount,
          status: target.status
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    return updated.find(g => g.id === id);
  },

  async updateGoal(id, updates) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('savings_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const goals = getLocalGoals();
    const updated = goals.map(g => (g.id === id ? { ...g, ...updates } : g));
    saveLocalGoals(updated);
    return updated.find(g => g.id === id);
  },

  async deleteGoal(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    }

    const goals = getLocalGoals();
    const filtered = goals.filter(g => g.id !== id);
    saveLocalGoals(filtered);
    return true;
  }
};
