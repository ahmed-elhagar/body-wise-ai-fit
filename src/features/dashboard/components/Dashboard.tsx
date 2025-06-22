
import React, { useMemo } from 'react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useMealPlans } from '@/features/meal-plan/hooks';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FeatureLayout } from '@/shared/components/design-system';
import { BarChart3 } from 'lucide-react';
import DashboardStats from './DashboardStats';
import SimplifiedDashboardHeader from './SimplifiedDashboardHeader';
import { PersonalizedWelcome } from './PersonalizedWelcome';
import { SmartRecommendations } from './SmartRecommendations';
import { QuickActions } from './QuickActions';

const Dashboard = () => {
  const { profile } = useProfile();
  const { user } = useAuth();
  const { stats, isLoading: statsLoading } = useDashboardStats();
  const { mealPlans, isLoading: mealPlansLoading } = useMealPlans();
  const { t } = useTranslation(['dashboard']);
  const navigate = useNavigate();

  const userName = profile?.first_name || user?.email?.split('@')[0] || 'Friend';

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

  // No tabs for dashboard - it's a single overview page
  const tabs = [];

  return (
    <FeatureLayout
      title=""
      tabs={tabs}
      activeTab=""
      onTabChange={() => {}}
      isLoading={isLoading}
      loadingIcon={BarChart3}
      loadingMessage={t('common:loading.dashboard')}
      showStatsCards={true}
      statsCards={<DashboardStats todayStats={todayStats} />}
    >
      {/* Custom Header */}
      <SimplifiedDashboardHeader userName={userName} />

      {/* Main Content */}
      <div className="space-y-6">
        <PersonalizedWelcome />
        <SmartRecommendations />
        <QuickActions />
      </div>
    </FeatureLayout>
  );
};

export default Dashboard;
