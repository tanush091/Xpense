import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Failed to load user', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            await fetchCurrentUser();
          } else {
            setUser(null);
          }
        }
      );
      return () => subscription?.unsubscribe();
    }
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await authService.signIn(email, password);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, fullName) => {
    setLoading(true);
    try {
      const newUser = await authService.signUp(email, password, fullName);
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    const updated = await authService.updateProfile(updates);
    setUser(prev => ({ ...prev, ...updated }));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshUser: fetchCurrentUser,
        isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
