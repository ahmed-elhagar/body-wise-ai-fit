
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

const CanonicalDashboard = () => {
  const { profile, isLoading: profileLoading } = useProfile();
  const { user, isLoading: authLoading } = useAuth();
  const { mealPlans, isLoading: mealPlansLoading } = useMealPlans ? useMealPlans() : { mealPlans: [], isLoading: true };
  const { programs, isLoading: programsLoading } = useExercisePrograms ? useExercisePrograms() : { programs: [], isLoading: true };

  const isLoading = profileLoading || authLoading || mealPlansLoading || programsLoading;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile data.</div>;
  }

  const currentMealPlan = mealPlans?.[0];
  const currentExerciseProgram = programs?.[0];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <main className="flex-1 p-4 lg:p-6 space-y-6">
        <DashboardHeader user={user} profile={profile} />
        
        <div className="space-y-6">
          <EnhancedStatsGrid />
          <QuickActionsGrid profile={profile} mealPlans={mealPlans} programs={programs}/>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <GoalProgressWidget />
              <WeightTrackingWidget />
            </div>
            <div className="space-y-6">
              <ActivityFeed mealPlans={mealPlans} programs={programs} />
              <NotificationWidget />
              <DashboardAchievements 
                profile={profile}
                currentMealPlan={currentMealPlan}
                currentExerciseProgram={currentExerciseProgram}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CanonicalDashboard;
