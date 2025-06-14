
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdmin = () => {
  const { user, isLoading } = useAuth();
  const [adminData, setAdminData] = useState<any>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Enhanced admin check
      const isAdmin = user?.user_metadata?.role === 'admin' || 
                     user?.role === 'admin';
      
      setAdminData({
        isAdmin,
        permissions: isAdmin ? ['read', 'write', 'delete'] : []
      });
      setIsAdminLoading(false);
    }
  }, [user, isLoading]);

  const forceLogoutAllUsers = async () => {
    try {
      console.log('Force logout all users called');
      
      // Call the Supabase function to force logout all users
      const { error } = await supabase.rpc('force_logout_all_users');
      
      if (error) {
        console.error('Force logout error:', error);
        toast.error(`Failed to logout all users: ${error.message}`);
        return;
      }
      
      // Clear all active sessions from the database
      const { error: sessionError } = await supabase
        .from('active_sessions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all sessions
      
      if (sessionError) {
        console.error('Session cleanup error:', sessionError);
      }
      
      toast.success('All users have been logged out successfully');
      console.log('Force logout all users completed successfully');
    } catch (error) {
      console.error('Force logout all users error:', error);
      toast.error('Failed to logout all users');
    }
  };

  return {
    adminData,
    isLoading: isAdminLoading,
    forceLogoutAllUsers,
    isAdmin: adminData?.isAdmin || false
  };
};
