
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { identifyUser, resetAnalytics } from '@/lib/analytics';

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
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
      return false;
    }

    const adminStatus = !!data;
    console.log('useAuth - Admin check result for user:', userId, 'isAdmin:', adminStatus);
    return adminStatus;
  } catch (error) {
    console.error('useAuth - Admin check error:', error);
    return false;
  }
};

export const handleUserIdentification = async (userId: string, email?: string) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, first_name, last_name')
      .eq('id', userId)
      .single();
    
    identifyUser(userId, {
      email: email,
      role: profile?.role || 'normal',
      first_name: profile?.first_name,
      last_name: profile?.last_name
    });
  } catch (error) {
    console.warn('Failed to identify user in analytics:', error);
  }
};

export const handleSignIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const handleSignUp = async (email: string, password: string, metadata?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata || {}
    }
  });

  if (error) throw error;
  return data;
};

export const clearLocalAuthData = () => {
  try {
    // Clear all possible auth-related localStorage items
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-xnoslfftfktqvyoefccw-auth-token');
    sessionStorage.clear();
    
    // Clear any custom auth data
    Object.keys(localStorage).forEach(key => {
      if (key.includes('auth') || key.includes('supabase')) {
        localStorage.removeItem(key);
      }
    });
    console.log('Local auth data cleared successfully');
  } catch (error) {
    console.error('Error clearing local auth data:', error);
  }
};

export const handleSignOut = async (forceCleanup: boolean = false) => {
  try {
    console.log('Starting sign out process...');
    
    if (forceCleanup) {
      // Force cleanup - clear everything first
      clearLocalAuthData();
    }
    
    const { error } = await supabase.auth.signOut({
      scope: 'global' // Sign out from all sessions
    });
    
    if (error && error.message !== 'Auth session missing!') {
      console.error('Sign out error:', error);
      // If there's an error, still try to clean up locally
      clearLocalAuthData();
    }
    
    // Always clean up analytics and local state
    resetAnalytics();
    
    console.log('Sign out completed successfully');
    return true;
  } catch (error) {
    console.error('Unexpected logout error:', error);
    // Force cleanup on any error
    clearLocalAuthData();
    resetAnalytics();
    return false;
  }
};

export const forceRefreshSession = async () => {
  try {
    console.log('Force refreshing session...');
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Session refresh timeout')), 10000)
    );
    
    const refreshPromise = supabase.auth.refreshSession();
    
    const { data, error } = await Promise.race([refreshPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('Session refresh error:', error);
      return null;
    }
    
    console.log('Session refreshed successfully');
    return data.session;
  } catch (error) {
    console.error('Force refresh error:', error);
    return null;
  }
};

export const handleForceLogoutAllUsers = async () => {
  try {
    const { error } = await supabase.rpc('force_logout_all_users');
    if (error) throw error;
    
    toast.success('All users have been logged out successfully');
    console.log('useAuth - Force logout all users successful');
  } catch (error) {
    console.error('Force logout all users error:', error);
    toast.error('Failed to logout all users');
  }
};

export const initializeAuthCleanup = () => {
  try {
    // Force cleanup on page load if needed
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('force_logout') === 'true') {
      console.log('Force logout requested via URL parameter');
      clearLocalAuthData();
      
      // Remove the parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  } catch (error) {
    console.error('Error during auth cleanup initialization:', error);
  }
};

// Enhanced session check with timeout
export const getSessionWithTimeout = async (timeout: number = 5000) => {
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Session check timeout')), timeout)
    );
    
    const sessionPromise = supabase.auth.getSession();
    
    const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
    return result;
  } catch (error) {
    console.error('Session check with timeout failed:', error);
    return { data: { session: null }, error };
  }
};
