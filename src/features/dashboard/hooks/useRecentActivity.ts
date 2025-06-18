
import { useMemo } from 'react';
import { useAuth } from '@/features/auth';
import type { RecentActivity } from '../types';

export const useRecentActivity = () => {
  const { user } = useAuth();
  
  const recentActivity = useMemo<RecentActivity[]>(() => [
    {
      id: '1',
      type: 'meal',
      description: 'Logged breakfast - Oatmeal with berries',
      timestamp: new Date().toISOString(),
      icon: 'UtensilsCrossed'
    },
    {
      id: '2',
      type: 'workout',
      description: 'Completed 30-minute cardio session',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      icon: 'Dumbbell'
    }
  ], [user]);

  return { recentActivity };
};
