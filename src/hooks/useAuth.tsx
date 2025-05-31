
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  checkAdminStatus, 
  handleUserIdentification, 
  handleSignIn, 
  handleSignUp, 
  handleSignOut, 
  handleForceLogoutAllUsers 
} from './auth/authHelpers';

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
              await handleUserIdentification(session.user.id, session.user.email);
              const adminStatus = await checkAdminStatus(session.user.id);
              setIsAdmin(adminStatus);
            }
          }, 0);
        } else {
          setIsAdmin(false);
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
            setTimeout(async () => {
              if (mounted) {
                const adminStatus = await checkAdminStatus(session.user.id);
                setIsAdmin(adminStatus);
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

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await handleSignIn(email, password);

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
      const data = await handleSignUp(email, password, metadata);

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
      await handleSignOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } catch (error: any) {
      console.error('useAuth - Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  const forceLogoutAllUsers = async () => {
    try {
      await handleForceLogoutAllUsers();
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
