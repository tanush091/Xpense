import { apiClient } from './apiClient';
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
    try {
      const data = await apiClient.get('/savings-goals', { userId });
      if (Array.isArray(data) && data.length > 0) {
        saveLocalGoals(data);
        return data;
      }
    } catch (err) {
      console.warn('Backend /api/savings-goals unreachable, using local store:', err.message);
    }
    return getLocalGoals();
  },

  async createGoal(goalData) {
    try {
      const data = await apiClient.post('/savings-goals', {
        title: goalData.title,
        target_amount: parseFloat(goalData.target_amount || 5000),
        current_amount: parseFloat(goalData.current_amount || 0),
        target_date: goalData.target_date || null,
        icon: goalData.icon || 'Target',
        category: goalData.category || 'Savings',
        status: 'in_progress'
      });
      if (data) {
        const local = getLocalGoals();
        saveLocalGoals([data, ...local]);
        return data;
      }
    } catch (err) {
      console.warn('Backend create goal failed, using local store:', err.message);
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

    try {
      const data = await apiClient.post(`/savings-goals/${id}/deposit`, { amount: numAmount });
      if (data) {
        const local = getLocalGoals();
        saveLocalGoals(local.map(g => (g.id === id ? { ...g, ...data } : g)));
        return data;
      }
    } catch (err) {
      console.warn('Backend deposit failed, using local store:', err.message);
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
    return updated.find(g => g.id === id);
  },

  async updateGoal(id, updates) {
    try {
      const data = await apiClient.put(`/savings-goals/${id}`, updates);
      if (data) {
        const local = getLocalGoals();
        saveLocalGoals(local.map(g => (g.id === id ? { ...g, ...data } : g)));
        return data;
      }
    } catch (err) {
      console.warn('Backend update goal failed, using local store:', err.message);
    }

    const goals = getLocalGoals();
    const updated = goals.map(g => (g.id === id ? { ...g, ...updates } : g));
    saveLocalGoals(updated);
    return updated.find(g => g.id === id);
  },

  async deleteGoal(id) {
    try {
      await apiClient.delete(`/savings-goals/${id}`);
    } catch (err) {
      console.warn('Backend delete goal failed, using local store:', err.message);
    }
    const goals = getLocalGoals();
    const updated = goals.filter(g => g.id !== id);
    saveLocalGoals(updated);
    return true;
  }
};
