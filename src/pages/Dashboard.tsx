
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { DashboardWelcomeHeader } from "@/components/dashboard/DashboardWelcomeHeader";
import EnhancedStatsGrid from "@/components/dashboard/EnhancedStatsGrid";
import EnhancedQuickActions from "@/components/dashboard/EnhancedQuickActions";
import InteractiveProgressChart from "@/components/dashboard/InteractiveProgressChart";
import NotificationWidget from "@/components/dashboard/NotificationWidget";
import CoachChatWidget from "@/components/dashboard/CoachChatWidget";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import WeightTrackingWidget from "@/components/dashboard/WeightTrackingWidget";
import GoalProgressWidget from "@/components/dashboard/GoalProgressWidget";
import { DashboardAchievements } from "@/components/dashboard/DashboardAchievements";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTimeRange, setActiveTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const { profile } = useProfile();
  const navigate = useNavigate();

  const userName = profile?.first_name || 'User';

  const handleViewMealPlan = () => {
    navigate('/meal-plan');
  };

  const handleViewExercise = () => {
    navigate('/exercise');
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-3 md:p-4 lg:p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            <DashboardWelcomeHeader 
              userName={userName}
              onViewMealPlan={handleViewMealPlan}
              onViewExercise={handleViewExercise}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Main Content - Left Side */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                <EnhancedStatsGrid />
                <EnhancedQuickActions />
                <InteractiveProgressChart 
                  activeTimeRange={activeTimeRange}
                  onTimeRangeChange={setActiveTimeRange}
                />
                <GoalProgressWidget />
                <DashboardAchievements 
                  profile={profile}
                  currentMealPlan={null}
                  currentExerciseProgram={null}
                />
              </div>
              
              {/* Sidebar - Right Side */}
              <div className="space-y-4 md:space-y-6">
                <NotificationWidget />
                <CoachChatWidget />
                <WeightTrackingWidget />
                <ActivityFeed />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;
