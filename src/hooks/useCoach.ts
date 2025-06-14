
import { useRole } from '@/hooks/useRole';

export const useCoach = () => {
  const { isCoach, isLoading } = useRole();

  return {
    isCoach,
    isLoading
  };
};
