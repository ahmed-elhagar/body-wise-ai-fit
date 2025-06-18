
import { useMemo } from 'react';
import { useAuth } from '@/features/auth';
import type { QuickAction } from '../types';

export const useQuickActions = () => {
  const { user } = useAuth();
  
  const quickActions = useMemo<QuickAction[]>(() => [
    {
      id: 'meal-plan',
      title: 'View Meal Plan',
      description: 'Check your personalized meal plan',
      icon: 'UtensilsCrossed',
      href: '/meal-plan',
      color: 'bg-green-500',
      isAvailable: true
    },
    {
      id: 'exercise',
      title: 'Start Workout',
      description: 'Begin your exercise routine',
      icon: 'Dumbbell',
      href: '/exercise',
      color: 'bg-blue-500',
      isAvailable: true
    },
    {
      id: 'food-tracker',
      title: 'Log Food',
      description: 'Track your daily nutrition',
      icon: 'Apple',
      href: '/food-tracker',
      color: 'bg-orange-500',
      isAvailable: true
    },
    {
      id: 'progress',
      title: 'View Progress',
      description: 'See your fitness journey',
      icon: 'TrendingUp',
      href: '/progress',
      color: 'bg-purple-500',
      isAvailable: true
    }
  ], [user]);

  return { quickActions };
};
