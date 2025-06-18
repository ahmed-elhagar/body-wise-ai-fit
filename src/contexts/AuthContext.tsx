
import { createContext } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import type { AuthUser } from '@/features/auth/types';

// Create and export the AuthContext
export const AuthContext = createContext<{
  user: AuthUser | null;
  session: any;
  loading: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  error: any;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signOut: (forceCleanup?: boolean) => Promise<void>;
  clearError: () => void;
  retryAuth: () => Promise<void>;
  forceLogout: () => Promise<void>;
} | undefined>(undefined);

// Re-export the provider and hook
export { AuthProvider, useAuth };
