import { useState, useEffect, createContext, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
  signOut: () => void;
  clearError: () => void;
  retryAuth: () => Promise<void>;
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
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
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
      signOut: () => {
        setUser(null);
        setSession(null);
      },
      clearError: () => setError(null),
      retryAuth: async () => {}
    };
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Enhanced error clearing function
  const clearError = () => {
    setError(null);
  };

  // Enhanced retry authentication function
  const retryAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (session?.user) {
        await enrichUserWithProfile(session);
      }
      
      setSession(session);
    } catch (err) {
      console.error('Retry auth error:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced user enrichment with better error handling
  const enrichUserWithProfile = async (session: Session) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, first_name, last_name')
        .eq('id', session.user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.warn('Profile fetch error (non-critical):', profileError);
      }
      
      const enrichedUser: AuthUser = {
        ...session.user,
        role: profile?.role || session.user.user_metadata?.role || 'normal',
        first_name: profile?.first_name || session.user.user_metadata?.first_name,
        last_name: profile?.last_name || session.user.user_metadata?.last_name,
      };
      
      console.log('User enriched with role:', enrichedUser.role);
      setUser(enrichedUser);
    } catch (err) {
      console.warn('User enrichment failed, using basic user data:', err);
      // Create user from session data directly
      const basicUser: AuthUser = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.user_metadata?.role || 'normal',
        first_name: session.user.user_metadata?.first_name,
        last_name: session.user.user_metadata?.last_name,
        user_metadata: session.user.user_metadata
      };
      setUser(basicUser);
    }
  };

  useEffect(() => {
    console.log("AuthProvider - Initializing");
    
    // Check for existing session first
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          setError(error);
        } else {
          console.log("Got initial session:", !!session);
          
          setSession(session);
          
          if (session?.user) {
            await enrichUserWithProfile(session);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        try {
          setSession(session);
          
          if (session?.user) {
            await enrichUserWithProfile(session);
          } else {
            setUser(null);
          }
          
          // Clear any previous errors on successful auth state change
          setError(null);
        } catch (err) {
          console.error('Auth state change error:', err);
          setError(err);
        }
        
        // Only set loading to false after initial session check
        if (event !== 'INITIAL_SESSION') {
          setIsLoading(false);
        }
      }
    );

    // Initialize session
    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log('Sign in successful for:', email);
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        throw error;
      }

      console.log('Sign up successful for:', email);
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      setUser(null);
      setSession(null);
      console.log('Sign out successful');
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError(error);
    }
  };

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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
