
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { identifyUser, resetAnalytics } from '@/lib/analytics';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  forceLogoutAllUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('useAuth - Auth state changed:', { 
          event, 
          userEmail: session?.user?.email,
          userId: session?.user?.id 
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle analytics identification
        if (session?.user) {
          // Identify user in analytics
          setTimeout(async () => {
            if (mounted) {
              try {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('role, first_name, last_name')
                  .eq('id', session.user.id)
                  .single();
                
                identifyUser(session.user.id, {
                  email: session.user.email,
                  role: profile?.role || 'normal',
                  first_name: profile?.first_name,
                  last_name: profile?.last_name
                });
              } catch (error) {
                console.warn('Failed to identify user in analytics:', error);
              }
              
              checkAdminStatus(session.user.id);
            }
          }, 0);
        } else {
          setIsAdmin(false);
          // Reset analytics on logout
          resetAnalytics();
        }
        
        // Always set loading to false after auth state change
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setSession(null);
        } else {
          setUser(session?.user ?? null);
          setSession(session);
          
          if (session?.user) {
            console.log('useAuth - Initial session found for:', session.user.email);
            // Check admin status in background
            setTimeout(() => {
              if (mounted) {
                checkAdminStatus(session.user.id);
              }
            }, 0);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setUser(null);
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Remove all dependencies to prevent loops

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('useAuth - Checking admin status for user:', userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('useAuth - Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      const adminStatus = !!data;
      setIsAdmin(adminStatus);
      console.log('useAuth - Admin check result for user:', userId, 'isAdmin:', adminStatus);
    } catch (error) {
      console.error('useAuth - Admin check error:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && data.session) {
        console.log('useAuth - Sign in successful for:', email);
        setUser(data.user);
        setSession(data.session);
        // Admin check will be handled by onAuthStateChange
      }
    } catch (error: any) {
      console.error('useAuth - Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {}
        }
      });

      if (error) throw error;

      if (data.user) {
        console.log('useAuth - Sign up successful for:', email);
        setUser(data.user);
        setSession(data.session);
      }
    } catch (error: any) {
      console.error('useAuth - Sign up error:', error);
      throw new Error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      resetAnalytics();
      console.log('useAuth - Sign out successful');
    } catch (error: any) {
      console.error('useAuth - Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  const forceLogoutAllUsers = async () => {
    try {
      const { error } = await supabase.rpc('force_logout_all_users');
      if (error) throw error;
      
      toast.success('All users have been logged out successfully');
      console.log('useAuth - Force logout all users successful');
    } catch (error: any) {
      console.error('useAuth - Force logout all users error:', error);
      toast.error(`Failed to logout all users: ${error.message}`);
      throw new Error(error.message || 'Failed to logout all users');
    }
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    forceLogoutAllUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
