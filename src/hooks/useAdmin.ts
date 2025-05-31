
import { useAuth } from './useAuth';

export const useAdmin = () => {
  const { user } = useAuth();
  
  // Check if user has admin role (you can adjust this logic based on your user structure)
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.email?.endsWith('@admin.fitfatta.com');
  
  return { isAdmin };
};
