import { apiClient } from './apiClient';
import { DEMO_USER } from '../data/demo';

const LOCAL_STORAGE_USER_KEY = 'xpense_current_user';

function getLocalUser() {
  const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse cached user', e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(DEMO_USER));
  return DEMO_USER;
}

function saveLocalUser(user) {
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
}

export const authService = {
  async getCurrentUser() {
    try {
      const data = await apiClient.get('/profile');
      if (data && data.email) {
        saveLocalUser(data);
        return data;
      }
    } catch (err) {
      console.warn('Backend /api/profile unreachable, using local store:', err.message);
    }
    return getLocalUser();
  },

  async signIn(email) {
    const user = {
      ...getLocalUser(),
      email: email || DEMO_USER.email
    };
    saveLocalUser(user);
    return user;
  },

  async signUp(email, password, fullName) {
    const user = {
      ...getLocalUser(),
      id: 'user-' + Date.now(),
      email,
      full_name: fullName || 'New User'
    };
    saveLocalUser(user);
    return user;
  },

  async signOut() {
    saveLocalUser(DEMO_USER);
    return true;
  },

  async updateProfile(updates) {
    try {
      const data = await apiClient.put('/profile', updates);
      if (data) {
        saveLocalUser(data);
        return data;
      }
    } catch (err) {
      console.warn('Backend update profile failed, using local store:', err.message);
    }

    const current = getLocalUser();
    const updated = { ...current, ...updates };
    saveLocalUser(updated);
    return updated;
  }
};
