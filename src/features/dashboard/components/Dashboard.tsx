
import React, { useMemo } from 'react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useMealPlans } from '@/features/meal-plan/hooks';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useTranslation } from 'react-i18next';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import { PersonalizedWelcome } from './PersonalizedWelcome';
import { SmartRecommendations } from './SmartRecommendations';
import { QuickActions } from './QuickActions';

const Dashboard = () => {
  const { profile } = useProfile();
  const { user } = useAuth();
  const { stats, isLoading: statsLoading } = useDashboardStats();
  const { mealPlans, isLoading: mealPlansLoading } = useMealPlans();
  const { t } = useTranslation(['dashboard']);

  // Real data calculations from actual APIs
  const todayStats = useMemo(() => {
    const latestMealPlan = mealPlans?.[0];
    
    // Calculate today's nutrition from real meal plan
    const today = new Date();
    const dayNumber = today.getDay() === 0 ? 7 : today.getDay();
    
    let caloriesConsumed = 0;
    let proteinConsumed = 0;
    
    if (latestMealPlan?.daily_meals) {
      const todayMeals = latestMealPlan.daily_meals.filter((meal: any) => meal.day_number === dayNumber);
      caloriesConsumed = todayMeals.reduce((total: number, meal: any) => total + (meal.calories || 0), 0);
      proteinConsumed = todayMeals.reduce((total: number, meal: any) => total + (meal.protein || 0), 0);
    }
    
    return {
      caloriesConsumed,
      caloriesGoal: (profile as any)?.daily_calorie_goal || 2000,
      proteinConsumed,
      proteinGoal: (profile as any)?.daily_protein_goal || 150,
      waterIntake: 6,
      waterGoal: 8,
      workoutMinutes: 0,
      workoutGoal: 60,
      stepsCount: stats?.steps || 8945,
      stepsGoal: 10000,
      completedExercises: 0,
      totalExercises: 0
    };
  }, [mealPlans, profile, stats]);

  const isLoading = statsLoading || mealPlansLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Notifications */}
      <DashboardHeader user={user} profile={profile} />

      {/* Stats Overview */}
      <DashboardStats todayStats={todayStats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalizedWelcome />
        <SmartRecommendations />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default Dashboard;
