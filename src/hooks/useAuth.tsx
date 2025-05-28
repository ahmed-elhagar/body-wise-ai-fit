
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('useAuth - Checking admin status for user:', userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('useAuth - Admin check error:', error);
        setIsAdmin(false);
        return;
      }
      
      const isUserAdmin = !!data;
      console.log('useAuth - Admin check result for user:', userId, 'isAdmin:', isUserAdmin);
      setIsAdmin(isUserAdmin);
    } catch (error) {
      console.error('useAuth - Admin check failed:', error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    console.log('useAuth - Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth - Auth state changed:', { 
          event, 
          userEmail: session?.user?.email,
          userId: session?.user?.id 
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin status after setting user, not in the callback
        if (session?.user) {
          // Use setTimeout to avoid blocking the auth state change
          setTimeout(() => {
            checkAdminStatus(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('useAuth - Initial session:', { 
        userEmail: session?.user?.email,
        userId: session?.user?.id 
      });
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check admin status on initial load
      if (session?.user) {
        setTimeout(() => {
          checkAdminStatus(session.user.id);
        }, 0);
      }
      setLoading(false);
    });

    return () => {
      console.log('useAuth - Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('useAuth - Attempting sign in for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('useAuth - Sign in error:', error);
      toast.error(error.message);
      throw error;
    }
    
    console.log('useAuth - Sign in successful for:', email);
    toast.success('Welcome back!');
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    console.log('useAuth - Attempting sign up for:', email);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) {
      console.error('useAuth - Sign up error:', error);
      toast.error(error.message);
      throw error;
    }
    
    console.log('useAuth - Sign up successful for:', email);
    toast.success('Account created successfully!');
  };

  const signOut = async () => {
    console.log('useAuth - Attempting sign out for user:', user?.email);
    
    // Clear all state immediately to prevent data leakage
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('useAuth - Sign out error:', error);
      toast.error(error.message);
      throw error;
    }
    
    console.log('useAuth - Sign out successful');
    toast.success('Signed out successfully');
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      isAdmin,
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
