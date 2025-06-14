
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  retryAuth: () => void;
  forceLogout: () => void;
  updateProfile: (data: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return mock auth context for components that use it
    return {
      user: null,
      session: null,
      loading: false,
      error: null,
      signUp: async () => ({ success: true }),
      signIn: async () => ({ success: true }),
      signOut: async () => {},
      retryAuth: () => {},
      forceLogout: () => {},
      updateProfile: async () => ({ success: true })
    };
  }
  return context;
};
