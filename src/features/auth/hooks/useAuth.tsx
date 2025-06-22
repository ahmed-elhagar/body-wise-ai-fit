import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { 
  handleSignIn, 
  handleSignUp, 
  handleSignOut, 
  forceRefreshSession, 
  initializeAuthCleanup,
  clearLocalAuthData,
  getSessionWithTimeout
} from './authHelpers';

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
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signOut: (forceCleanup?: boolean) => Promise<void>;
  clearError: () => void;
  retryAuth: () => Promise<void>;
  forceLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Simplified fallback for outside provider usage
    return {
      user: null,
      session: null,
      loading: false,
      isLoading: false,
      isAdmin: false,
      error: null,
      signIn: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => {},
      clearError: () => {},
      retryAuth: async () => {},
      forceLogout: async () => {}
    };
  }
  return context;
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
        const sessionResult = await getSessionWithTimeout(5000);
        
        if (sessionResult.error) {
          throw sessionResult.error;
        }
        
        if (sessionResult.data?.session?.user?.id) {
          setSession(sessionResult.data.session);
          await enrichUserWithProfile(sessionResult.data.session);
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
        // Add timeout to profile fetch to prevent hanging
        const profilePromise = supabase
          .from('profiles')
          .select('role, first_name, last_name')
          .eq('id', session.user.id)
          .maybeSingle();
          
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
        );
        
        const { data: profile, error: profileError } = await Promise.race([
          profilePromise, 
          timeoutPromise
        ]) as any;
        
        if (profile && !profileError) {
          console.log('Profile data fetched successfully, updating user');
          const enrichedUser: AuthUser = {
            ...baseUser,
            role: profile.role || baseUser.role,
            first_name: profile.first_name || baseUser.first_name,
            last_name: profile.last_name || baseUser.last_name,
          };
          setUser(enrichedUser);
        } else {
          console.log('Profile fetch failed or no data, keeping base user:', profileError?.message);
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

  useEffect(() => {
    console.log("AuthProvider - Initializing with enhanced timeout protection");
    
    initializeAuthCleanup();
    
    let mounted = true;
    let authSubscription: any = null;
    let initializationTimeout: NodeJS.Timeout;
    
    const setupAuth = async () => {
      try {
        // Set initialization timeout to prevent infinite loading
        initializationTimeout = setTimeout(() => {
          if (mounted && isLoading) {
            console.error('Auth initialization timeout - forcing completion');
            setIsLoading(false);
            setError(new Error('Authentication initialization timed out'));
          }
        }, 10000); // 10 second timeout
        
        // Set up auth state listener first
        authSubscription = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log('Auth state changed:', event, session?.user?.email || 'No user');
            
            if (event === 'SIGNED_OUT' || !session?.user?.id) {
              console.log('User signed out or no session');
              setSession(null);
              setUser(null);
              setError(null);
              if (mounted) setIsLoading(false);
            } else if (session?.user?.id) {
              console.log('User signed in');
              setSession(session);
              await enrichUserWithProfile(session);
              setError(null);
              if (mounted) setIsLoading(false);
            }
          }
        );

        // Get initial session with timeout protection
        console.log('Getting initial session with timeout...');
        
        try {
          const sessionResult = await getSessionWithTimeout(8000);
          
          if (!mounted) return;
          
          if (sessionResult.error) {
            console.error('Error getting initial session:', sessionResult.error);
            setError(sessionResult.error);
            setIsLoading(false);
            return;
          }
          
          console.log("Got initial session:", !!sessionResult.data?.session);
          
          if (sessionResult.data?.session?.user?.id) {
            setSession(sessionResult.data.session);
            await enrichUserWithProfile(sessionResult.data.session);
          } else {
            setUser(null);
            setSession(null);
          }
          
        } catch (sessionError) {
          console.error('Session check failed:', sessionError);
          setError(sessionError);
        }
        
      } catch (error) {
        console.error('Error in setupAuth:', error);
        setError(error);
      } finally {
        // Always set loading to false after setup
        if (mounted) {
          console.log('Auth setup complete, setting loading to false');
          setIsLoading(false);
        }
        
        // Clear initialization timeout
        if (initializationTimeout) {
          clearTimeout(initializationTimeout);
        }
      }
    };

    setupAuth();

    return () => {
      mounted = false;
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
      if (initializationTimeout) {
        clearTimeout(initializationTimeout);
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
      
      return data;
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error);
      return { error };
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
      
      return data;
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error);
      return { error };
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
