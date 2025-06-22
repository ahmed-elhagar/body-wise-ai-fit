import { supabase } from '@/integrations/supabase/client';

export const handleSignIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const handleSignUp = async (email: string, password: string, metadata?: any) => {
  return await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: metadata
    }
  });
};

export const handleSignOut = async (forceCleanup?: boolean) => {
  if (forceCleanup) {
    clearLocalAuthData();
  }
  return await supabase.auth.signOut();
};

export const forceRefreshSession = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) throw error;
  return data.session;
};

export const initializeAuthCleanup = () => {
  // Clean up any stale auth data
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('supabase') && key.includes('expired')) {
        localStorage.removeItem(key);
      }
    });
  }
};

export const clearLocalAuthData = () => {
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('supabase')) {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn('Failed to clear localStorage key:', key);
        }
      }
    });
  }
};

export const getSessionWithTimeout = async (timeout: number = 5000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Session fetch timeout'));
    }, timeout);

    supabase.auth.getSession()
      .then(result => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
};
