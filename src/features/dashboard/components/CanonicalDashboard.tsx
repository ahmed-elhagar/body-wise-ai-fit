
import React from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useMealPlans } from '@/features/meal-plan/hooks';
import { useExercisePrograms } from '@/hooks/useExercisePrograms';
import { 
  DashboardHeader,
  EnhancedStatsGrid, 
  GoalProgressWidget, 
  WeightTrackingWidget, 
  ActivityFeed, 
  NotificationWidget,
  QuickActionsGrid,
  DashboardAchievements
} from '@/features/dashboard/components';
import SimpleLoadingIndicator from '@/components/ui/simple-loading-indicator';
import { Grid } from '@/components/ui/layout';

const CanonicalDashboard = () => {
  const { profile, isLoading: profileLoading } = useProfile();
  const { user, isLoading: authLoading } = useAuth();
  const { mealPlans, isLoading: mealPlansLoading } = useMealPlans ? useMealPlans() : { mealPlans: [], isLoading: true };
  const { programs, isLoading: programsLoading } = useExercisePrograms ? useExercisePrograms() : { programs: [], isLoading: true };

  const isLoading = profileLoading || authLoading || mealPlansLoading || programsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <SimpleLoadingIndicator message="Loading Dashboard..." />
      </div>
    );
  }

  if (!profile) {
    return <div>No profile data.</div>;
  }

  const currentMealPlan = mealPlans?.[0];
  const currentExerciseProgram = programs?.[0];

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-full">
      <DashboardHeader user={user} profile={profile} />
      
      <div className="space-y-6">
        <QuickActionsGrid profile={profile} mealPlans={mealPlans} programs={programs}/>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-3 space-y-6">
            <EnhancedStatsGrid />
            <Grid cols={2} gap={6}>
              <GoalProgressWidget />
              <WeightTrackingWidget />
            </Grid>
            <ActivityFeed mealPlans={mealPlans} programs={programs} />
          </div>

          {/* Sidebar-like area */}
          <div className="lg:col-span-1 space-y-6">
            <NotificationWidget />
            <DashboardAchievements 
              profile={profile}
              mealPlans={mealPlans}
              programs={programs}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanonicalDashboard;
