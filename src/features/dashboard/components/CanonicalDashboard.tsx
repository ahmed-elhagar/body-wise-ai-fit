
import React from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { 
  DashboardHeader,
  EnhancedStatsGrid, 
  GoalProgressWidget, 
  WeightTrackingWidget, 
  ActivityFeed, 
  NotificationWidget,
  QuickActionsGrid
} from '@/features/dashboard/components';

const CanonicalDashboard = () => {
  const { profile, isLoading } = useProfile();
  const { user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile data.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <main className="flex-1 p-4 lg:p-6 space-y-6">
        <DashboardHeader user={user} profile={profile} />
        
        <div className="space-y-6">
          <EnhancedStatsGrid />
          <QuickActionsGrid />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <GoalProgressWidget />
              <WeightTrackingWidget />
            </div>
            <div className="space-y-6">
              <ActivityFeed />
              <NotificationWidget />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CanonicalDashboard;
