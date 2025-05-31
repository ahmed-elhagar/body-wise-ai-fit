
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

export const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  
  resetAnalytics();
  console.log('useAuth - Sign out successful');
};

export const handleForceLogoutAllUsers = async () => {
  const { error } = await supabase.rpc('force_logout_all_users');
  if (error) throw error;
  
  toast.success('All users have been logged out successfully');
  console.log('useAuth - Force logout all users successful');
};
