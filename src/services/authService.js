import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_USER } from '../data/demo';

const LOCAL_STORAGE_USER_KEY = 'xpense_current_user';

export const authService = {
  async getCurrentUser() {
    if (isSupabaseConfigured) {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return {
        id: session.user.id,
        email: session.user.email,
        ...profile
      };
    }

    // Local / Offline demo storage
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
  },

  async signIn(email, password) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return this.getCurrentUser();
    }

    // Demo sign in
    const user = {
      ...DEMO_USER,
      email: email || DEMO_USER.email
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    return user;
  },

  async signUp(email, password, fullName) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) throw error;
      return data.user;
    }

    // Demo sign up
    const user = {
      ...DEMO_USER,
      id: 'user-' + Date.now(),
      email,
      full_name: fullName || 'New User'
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    return user;
  },

  async signOut() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    return true;
  },

  async updateProfile(updates) {
    if (isSupabaseConfigured) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const current = await this.getCurrentUser();
    const updated = { ...current, ...updates };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
    return updated;
  }
};
