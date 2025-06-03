
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { 
  handleSignIn, 
  handleSignUp, 
  handleSignOut, 
  forceRefreshSession, 
  initializeAuthCleanup,
  clearLocalAuthData 
} from './auth/authHelpers';

export interface AuthUser {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  user_metadata?: {
    role?: string;
    first_name?: string;
    last_name?: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  error: any;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: (forceCleanup?: boolean) => Promise<void>;
  clearError: () => void;
  retryAuth: () => Promise<void>;
  forceLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simplified hook that doesn't cause violations
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Always call all hooks before any conditional logic
  const fallbackReturn = {
    user: null,
    session: null,
    loading: false,
    isLoading: false,
    isAdmin: false,
    error: null,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
    clearError: () => {},
    retryAuth: async () => {},
    forceLogout: async () => {}
  };
  
  // Return context or fallback - no early returns before hooks
  return context || fallbackReturn;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const forceLogout = useCallback(async () => {
    console.log('Force logout initiated');
    setIsLoading(true);
    
    try {
      await handleSignOut(true);
      setUser(null);
      setSession(null);
      setError(null);
      window.location.href = '/auth?force_logout=true';
    } catch (error) {
      console.error('Force logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retryAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Retrying auth - refreshing session');
      
      const refreshedSession = await forceRefreshSession();
      
      if (refreshedSession?.user?.id) {
        setSession(refreshedSession);
        await enrichUserWithProfile(refreshedSession);
      } else {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user?.id) {
          setSession(session);
          await enrichUserWithProfile(session);
        } else {
          setUser(null);
          setSession(null);
        }
      }
      
    } catch (err) {
      console.error('Retry auth error:', err);
      setError(err);
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enrichUserWithProfile = useCallback(async (session: Session) => {
    try {
      console.log('Enriching user with profile for ID:', session.user.id?.substring(0, 8) + '...');
      
      const baseUser: AuthUser = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.user_metadata?.role || 'normal',
        first_name: session.user.user_metadata?.first_name,
        last_name: session.user.user_metadata?.last_name,
        user_metadata: session.user.user_metadata
      };

      setUser(baseUser);
      console.log('Base user set with ID:', baseUser.id?.substring(0, 8) + '...');
      
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, first_name, last_name')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (profile && !profileError) {
          console.log('Profile data fetched successfully, updating user');
          const enrichedUser: AuthUser = {
            ...baseUser,
            role: profile.role || baseUser.role,
            first_name: profile.first_name || baseUser.first_name,
            last_name: profile.last_name || baseUser.last_name,
          };
          setUser(enrichedUser);
        }
      } catch (profileErr) {
        console.warn('Profile enrichment failed, keeping base user:', profileErr);
      }
      
    } catch (err) {
      console.error('User enrichment failed completely:', err);
      if (session?.user?.id) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: 'normal'
        });
      }
    }
  }, []);

  // Simplified initialization without complex logic
  useEffect(() => {
    console.log("AuthProvider - Simple initialization");
    
    let mounted = true;
    let authSubscription: any = null;
    
    const initAuth = async () => {
      try {
        // Set up auth listener
        authSubscription = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return;
            
            console.log('Auth state changed:', event, session?.user?.email || 'No user');
            
            if (session?.user?.id) {
              setSession(session);
              enrichUserWithProfile(session);
            } else {
              setSession(null);
              setUser(null);
            }
            setError(null);
            setIsLoading(false);
          }
        );

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error('Initial session error:', error);
            setError(error);
          } else if (session?.user?.id) {
            setSession(session);
            await enrichUserWithProfile(session);
          } else {
            setUser(null);
            setSession(null);
          }
          setIsLoading(false);
        }
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setError(error);
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, [enrichUserWithProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Starting sign in process for:', email);
      const data = await handleSignIn(email, password);

      if (data) {
        console.log('Sign in successful for:', email);
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, metadata?: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Starting sign up process for:', email);
      const data = await handleSignUp(email, password, metadata);

      if (data) {
        console.log('Sign up successful for:', email);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async (forceCleanup: boolean = false) => {
    try {
      setError(null);
      
      console.log('Starting sign out process...');
      const success = await handleSignOut(forceCleanup);
      
      if (success || forceCleanup) {
        setUser(null);
        setSession(null);
        console.log('Sign out successful');
      }
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError(error);
    }
  }, []);

  const value = {
    user,
    session,
    loading: isLoading,
    isLoading,
    isAdmin: user?.role === 'admin',
    error,
    signIn,
    signUp,
    signOut,
    clearError,
    retryAuth,
    forceLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
