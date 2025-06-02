
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

  const clearError = () => {
    setError(null);
  };

  const retryAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      console.log('Retry auth - session retrieved:', !!session, session?.user?.id?.substring(0, 8) + '...');
      
      if (session?.user?.id) {
        setSession(session);
        await enrichUserWithProfile(session);
      } else {
        setUser(null);
        setSession(null);
      }
      
    } catch (err) {
      console.error('Retry auth error:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const enrichUserWithProfile = async (session: Session) => {
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
      
      // Try to enrich with profile data
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, first_name, last_name')
          .eq('id', session.user.id)
          .single();
        
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
      // Even if everything fails, ensure we have a user with ID if session exists
      if (session?.user?.id) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: 'normal'
        });
      }
    }
  };

  useEffect(() => {
    console.log("AuthProvider - Initializing");
    
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email, 'User ID:', session?.user?.id?.substring(0, 8) + '...' || 'none');
        
        try {
          if (session?.user?.id) {
            setSession(session);
            await enrichUserWithProfile(session);
          } else {
            console.log('No session or user ID, clearing state');
            setSession(null);
            setUser(null);
          }
          
          setError(null);
        } catch (err) {
          console.error('Auth state change error:', err);
          setError(err);
        } finally {
          // CRITICAL: Always set loading to false after processing
          if (mounted) {
            setIsLoading(false);
          }
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
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
        console.error('Error in getInitialSession:', error);
        setError(error);
      } finally {
        // CRITICAL: Always set loading to false
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Initialize session
    getInitialSession();

    return () => {
      mounted = false;
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
