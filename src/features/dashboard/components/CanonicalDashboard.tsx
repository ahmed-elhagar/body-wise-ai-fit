
import React from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useMealPlans } from '@/features/meal-plan/hooks';
import { useExercisePrograms } from '@/hooks/useExercisePrograms';
import { 
  DashboardHeader,
  EnhancedStatsGrid, 
  WeightTrackingWidget, 
  ActivityFeed, 
  DashboardAchievements,
  QuickActionsGrid
} from '@/features/dashboard/components';
import { GoalProgressWidget } from '@/features/goals/components';
import SimpleLoadingIndicator from '@/components/ui/simple-loading-indicator';

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

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-full">
      <DashboardHeader user={user} profile={profile} />
      
      <div className="space-y-6">
        <QuickActionsGrid profile={profile} mealPlans={mealPlans} programs={programs}/>
        
        <EnhancedStatsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ActivityFeed mealPlans={mealPlans} programs={programs} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <GoalProgressWidget />
            <WeightTrackingWidget />
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
