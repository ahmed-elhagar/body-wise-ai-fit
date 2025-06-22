
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthError, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthUser extends User {
  id: string;
  email?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isLoading: boolean; // Added for compatibility
  error?: AuthError | null;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: AuthError; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: AuthError; data?: any }>;
  signOut: () => Promise<{ error?: AuthError }>;
  resetPassword: (email: string) => Promise<{ error?: AuthError }>;
  retryAuth?: () => void;
  forceLogout?: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    console.info('AuthProvider - Initializing with enhanced timeout protection');
    
    const getInitialSession = async () => {
      try {
        console.info('Getting initial session with timeout...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error);
        } else {
          setUser(session?.user as AuthUser || null);
          console.info('Got initial session:', !!session);
          setError(null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setError(error as AuthError);
      } finally {
        setLoading(false);
        console.info('Auth setup complete, setting loading to false');
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.info('Auth state changed:', event, session ? 'User logged in' : 'No user');
        
        if (session?.user) {
          setUser(session.user as AuthUser);
          console.info('User signed in:', session.user.email);
          setError(null);
        } else {
          setUser(null);
          console.info('User signed out or no session');
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {}
        }
      });

      if (result.error) {
        return { error: result.error };
      }

      return { data: result.data };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (result.error) {
        return { error: result.error };
      }

      return { data: result.data };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error };
      }
      return {};
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        return { error };
      }
      return {};
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const retryAuth = () => {
    setError(null);
    setLoading(true);
    // Trigger auth state refresh
    supabase.auth.getSession();
  };

  const forceLogout = async () => {
    await signOut();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isLoading: loading, // Added for compatibility
      error,
      signUp,
      signIn,
      signOut,
      resetPassword,
      retryAuth,
      forceLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
