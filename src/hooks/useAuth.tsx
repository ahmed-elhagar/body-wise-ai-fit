
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
      }
    };
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    console.log("AuthProvider - Initializing");
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile to get role information
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role, first_name, last_name')
              .eq('id', session.user.id)
              .single();
            
            const enrichedUser = {
              ...session.user,
              role: profile?.role || session.user.user_metadata?.role || 'normal',
              first_name: profile?.first_name || session.user.user_metadata?.first_name,
              last_name: profile?.last_name || session.user.user_metadata?.last_name,
            };
            
            console.log('User with role:', enrichedUser.role);
            setUser(enrichedUser);
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser(session.user);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error);
        } else {
          console.log("Got initial session:", !!session);
          if (session?.user) {
            // Fetch user profile for initial session too
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('role, first_name, last_name')
                .eq('id', session.user.id)
                .single();
              
              const enrichedUser = {
                ...session.user,
                role: profile?.role || session.user.user_metadata?.role || 'normal',
                first_name: profile?.first_name || session.user.user_metadata?.first_name,
                last_name: profile?.last_name || session.user.user_metadata?.last_name,
              };
              
              setUser(enrichedUser);
            } catch (error) {
              console.error('Error fetching initial user profile:', error);
              setUser(session.user);
            }
          }
          setSession(session);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

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
        setError(error);
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
        setError(error);
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
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error);
        throw error;
      }
      
      setUser(null);
      setSession(null);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
