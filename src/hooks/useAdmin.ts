
import { useRole } from '@/hooks/useRole';

export const useAdmin = () => {
  const { isAdmin, isLoading } = useRole();

  return {
    isAdmin,
    isLoading
  };
};
