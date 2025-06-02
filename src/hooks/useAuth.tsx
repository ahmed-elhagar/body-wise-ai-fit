
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a default implementation when used outside provider
    const [user, setUser] = useState<AuthUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
      // Simulate auth check
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }, []);

    return {
      user,
      session,
      loading: isLoading,
      isLoading,
      isAdmin: false,
      error,
      signIn: async (email: string, password: string) => {
        console.log('Sign in called with:', email);
      },
      signUp: async (email: string, password: string, metadata?: any) => {
        console.log('Sign up called with:', email);
      },
      signOut: async (forceCleanup?: boolean) => {
        setUser(null);
        setSession(null);
      },
      clearError: () => setError(null),
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
  const [authInitialized, setAuthInitialized] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const forceLogout = useCallback(async () => {
    console.log('Force logout initiated');
    setIsLoading(true);
    
    try {
      // Clear everything
      await handleSignOut(true);
      setUser(null);
      setSession(null);
      setError(null);
      
      // Reload the page to ensure clean state
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
      
      // Try to refresh session first
      const refreshedSession = await forceRefreshSession();
      
      if (refreshedSession?.user?.id) {
        setSession(refreshedSession);
        await enrichUserWithProfile(refreshedSession);
      } else {
        // If refresh fails, get current session
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
      // On retry failure, clear everything
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enrichUserWithProfile = useCallback(async (session: Session) => {
    try {
      console.log('Enriching user with profile for ID:', session.user.id?.substring(0, 8) + '...');
      
      // CRITICAL: Always create user with ID first
      const baseUser: AuthUser = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.user_metadata?.role || 'normal',
        first_name: session.user.user_metadata?.first_name,
        last_name: session.user.user_metadata?.last_name,
        user_metadata: session.user.user_metadata
      };

      // Set the base user immediately
      setUser(baseUser);
      console.log('Base user set with ID:', baseUser.id?.substring(0, 8) + '...');
      
      // Try to enrich with profile data (but don't block on it)
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, first_name, last_name')
          .eq('id', session.user.id)
          .maybeSingle(); // Use maybeSingle to avoid errors if no profile exists
        
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
        // Keep the base user, don't clear it
      }
      
    } catch (err) {
      console.error('User enrichment failed completely:', err);
      // Even if everything fails, ensure we have a user with ID if session exists
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
    console.log("AuthProvider - Initializing");
    
    // Initialize cleanup
    initializeAuthCleanup();
    
    let mounted = true;
    let authSubscription: any = null;
    
    // Set up auth state listener first
    const setupAuth = async () => {
      try {
        authSubscription = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log('Auth state changed:', event, session?.user?.email, 'User ID:', session?.user?.id?.substring(0, 8) + '...' || 'none');
            
            try {
              if (event === 'SIGNED_OUT' || !session?.user?.id) {
                console.log('User signed out or no session, clearing state');
                setSession(null);
                setUser(null);
                setError(null);
              } else if (session?.user?.id) {
                console.log('User signed in, setting session and enriching profile');
                setSession(session);
                await enrichUserWithProfile(session);
                setError(null);
              }
            } catch (err) {
              console.error('Auth state change error:', err);
              setError(err);
            } finally {
              // CRITICAL: Always set loading to false and mark as initialized
              if (mounted) {
                console.log('Setting isLoading to false after auth state change');
                setIsLoading(false);
                setAuthInitialized(true);
              }
            }
          }
        );

        // Get initial session after setting up listener
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          setError(error);
        } else {
          console.log("Got initial session:", !!session, 'User ID:', session?.user?.id?.substring(0, 8) + '...' || 'none');
          
          if (session?.user?.id) {
            setSession(session);
            await enrichUserWithProfile(session);
          } else {
            setUser(null);
            setSession(null);
          }
        }
      } catch (error) {
        console.error('Error in setupAuth:', error);
        setError(error);
      } finally {
        // CRITICAL: Always set loading to false and mark as initialized
        if (mounted) {
          console.log('Setting isLoading to false after initial session check');
          setIsLoading(false);
          setAuthInitialized(true);
        }
      }
    };

    setupAuth();

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
