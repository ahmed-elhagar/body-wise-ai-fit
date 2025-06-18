
import { useMemo } from 'react';
import { useAuth } from '@/features/auth';

export const useCalorieCalculations = () => {
  const { user } = useAuth();
  
  const calculations = useMemo(() => {
    // Default calorie targets
    const dailyTarget = 2000;
    const consumed = 1200;
    const remaining = dailyTarget - consumed;
    
    return {
      dailyTarget,
      consumed,
      remaining,
      percentage: (consumed / dailyTarget) * 100
    };
  }, [user]);

  return calculations;
};
