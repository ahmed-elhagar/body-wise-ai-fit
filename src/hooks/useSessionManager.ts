
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSessionManager = () => {
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!user) return;

    const createSession = async () => {
      try {
        console.log('SessionManager - Creating session for user:', user.id);
        
        // Get user agent and IP info
        const userAgent = navigator.userAgent;
        
        // Create session record
        const { error } = await supabase
          .from('active_sessions')
          .insert({
            user_id: user.id,
            session_id: user.id, // Using user ID as session ID for simplicity
            user_agent: userAgent,
            last_activity: new Date().toISOString()
          });

        if (error && error.code !== '23505') { // Ignore duplicate key errors
          console.error('SessionManager - Failed to create session:', error);
        }
      } catch (error) {
        console.error('SessionManager - Session creation error:', error);
      }
    };

    const updateActivity = async () => {
      try {
        await supabase
          .from('active_sessions')
          .update({ 
            last_activity: new Date().toISOString() 
          })
          .eq('user_id', user.id)
          .eq('session_id', user.id);
      } catch (error) {
        console.error('SessionManager - Activity update error:', error);
      }
    };

    // Create session on mount
    createSession();

    // Update activity every 5 minutes
    const activityInterval = setInterval(updateActivity, 5 * 60 * 1000);

    // Update activity on user interaction
    const handleActivity = () => updateActivity();
    
    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);

    // Cleanup session on unmount
    const cleanupSession = async () => {
      if (user?.id) {
        try {
          await supabase
            .from('active_sessions')
            .delete()
            .eq('user_id', user.id)
            .eq('session_id', user.id);
        } catch (error) {
          console.error('SessionManager - Session cleanup error:', error);
        }
      }
    };

    // Listen for storage events (other tabs logging out)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'supabase.auth.token' && !e.newValue) {
        console.log('SessionManager - Detected logout from another tab');
        signOut();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('beforeunload', cleanupSession);

    return () => {
      clearInterval(activityInterval);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('beforeunload', cleanupSession);
      cleanupSession();
    };
  }, [user, signOut]);

  const forceLogoutAllUsers = async () => {
    try {
      console.log('SessionManager - Forcing logout of all users');
      
      const { error } = await supabase.rpc('force_logout_all_users');
      
      if (error) {
        console.error('SessionManager - Force logout error:', error);
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
      console.error('SessionManager - Force logout failed:', error);
      toast.error('Failed to logout all users');
    }
  };

  return {
    forceLogoutAllUsers
  };
};
