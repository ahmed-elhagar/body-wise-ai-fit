
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  forceLogoutAllUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();

  // Force clear all cached data
  const clearAllData = () => {
    console.log('useAuth - Clearing all cached data');
    
    // Clear React Query cache
    queryClient.clear();
    
    // Clear localStorage and sessionStorage
    const keysToKeep = ['theme'];
    const localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    const sessionStorageKeys = Object.keys(sessionStorage);
    sessionStorageKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        sessionStorage.removeItem(key);
      }
    });
  };

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

  const validateSession = async (currentSession: Session | null) => {
    if (!currentSession) return false;
    
    try {
      // Verify session is still valid by making a simple authenticated request
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', currentSession.user.id)
        .maybeSingle();
      
      if (error) {
        console.log('useAuth - Session validation failed:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('useAuth - Session validation error:', error);
      return false;
    }
  };

  // Session management functions
  const createSession = async (userId: string) => {
    try {
      console.log('useAuth - Creating session for user:', userId);
      
      const userAgent = navigator.userAgent;
      
      const { error } = await supabase
        .from('active_sessions')
        .insert({
          user_id: userId,
          session_id: userId,
          user_agent: userAgent,
          last_activity: new Date().toISOString()
        });

      if (error && error.code !== '23505') {
        console.error('useAuth - Failed to create session:', error);
      }
    } catch (error) {
      console.error('useAuth - Session creation error:', error);
    }
  };

  const updateActivity = async (userId: string) => {
    try {
      await supabase
        .from('active_sessions')
        .update({ 
          last_activity: new Date().toISOString() 
        })
        .eq('user_id', userId)
        .eq('session_id', userId);
    } catch (error) {
      console.error('useAuth - Activity update error:', error);
    }
  };

  const cleanupSession = async (userId: string) => {
    if (userId) {
      try {
        await supabase
          .from('active_sessions')
          .delete()
          .eq('user_id', userId)
          .eq('session_id', userId);
      } catch (error) {
        console.error('useAuth - Session cleanup error:', error);
      }
    }
  };

  const forceLogoutAllUsers = async () => {
    try {
      console.log('useAuth - Forcing logout of all users');
      
      const { error } = await supabase.rpc('force_logout_all_users');
      
      if (error) {
        console.error('useAuth - Force logout error:', error);
        toast.error('Failed to logout all users');
        return;
      }
      
      // Clear local storage and force refresh
      localStorage.clear();
      sessionStorage.clear();
      
      toast.success('All users have been logged out');
      
      // Force page reload to clear any cached data
      window.location.reload();
    } catch (error) {
      console.error('useAuth - Force logout failed:', error);
      toast.error('Failed to logout all users');
    }
  };

  useEffect(() => {
    console.log('useAuth - Setting up auth state listener');
    
    // Clear all data on app start
    clearAllData();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth - Auth state changed:', { 
          event, 
          userEmail: session?.user?.email,
          userId: session?.user?.id 
        });
        
        if (event === 'SIGNED_OUT' || !session) {
          console.log('useAuth - User signed out, clearing all data');
          if (user?.id) {
            await cleanupSession(user.id);
          }
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          clearAllData();
          setLoading(false);
          return;
        }
        
        // Validate session before accepting it
        const isValid = await validateSession(session);
        if (!isValid) {
          console.log('useAuth - Invalid session detected, forcing logout');
          await supabase.auth.signOut();
          clearAllData();
          setLoading(false);
          return;
        }
        
        console.log('useAuth - Setting valid session for user:', session.user.id);
        setSession(session);
        setUser(session.user);
        
        // Create session record
        await createSession(session.user.id);
        
        // Check admin status after setting user
        if (session?.user) {
          setTimeout(() => {
            checkAdminStatus(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Get initial session and validate it
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('useAuth - Initial session check:', { 
        userEmail: session?.user?.email,
        userId: session?.user?.id 
      });
      
      if (session) {
        const isValid = await validateSession(session);
        if (!isValid) {
          console.log('useAuth - Initial session invalid, signing out');
          await supabase.auth.signOut();
          clearAllData();
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session.user);
        
        // Create session record
        await createSession(session.user.id);
        
        if (session.user) {
          setTimeout(() => {
            checkAdminStatus(session.user.id);
          }, 0);
        }
      }
      
      setLoading(false);
    });

    return () => {
      console.log('useAuth - Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, [queryClient]);

  // Set up activity tracking for authenticated users
  useEffect(() => {
    if (!user) return;

    // Update activity every 5 minutes
    const activityInterval = setInterval(() => {
      updateActivity(user.id);
    }, 5 * 60 * 1000);

    // Update activity on user interaction
    const handleActivity = () => updateActivity(user.id);
    
    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);

    // Listen for storage events (other tabs logging out)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'supabase.auth.token' && !e.newValue) {
        console.log('useAuth - Detected logout from another tab');
        signOut();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(activityInterval);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  const signIn = async (email: string, password: string) => {
    console.log('useAuth - Attempting sign in for:', email);
    
    // Clear any existing data before signing in
    clearAllData();
    
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
    
    // Clear any existing data before signing up
    clearAllData();
    
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
    
    // Cleanup session before signing out
    if (user?.id) {
      await cleanupSession(user.id);
    }
    
    // Clear state immediately to prevent data leakage
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    clearAllData();
    
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
      forceLogoutAllUsers,
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
