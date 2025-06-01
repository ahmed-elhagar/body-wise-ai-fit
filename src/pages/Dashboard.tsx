
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { DashboardWelcomeHeader } from "@/components/dashboard/DashboardWelcomeHeader";
import EnhancedStatsGrid from "@/components/dashboard/EnhancedStatsGrid";
import InteractiveProgressChart from "@/components/dashboard/InteractiveProgressChart";
import WeightTrackingWidget from "@/components/dashboard/WeightTrackingWidget";
import GoalProgressWidget from "@/components/dashboard/GoalProgressWidget";
import CoachChatWidget from "@/components/dashboard/CoachChatWidget";
import HeaderDropdowns from "@/components/dashboard/HeaderDropdowns";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { useChartData } from "@/components/dashboard/interactive-chart/ChartData";

const Dashboard = () => {
  const [activeTimeRange, setActiveTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const { profile } = useProfile();
  const navigate = useNavigate();
  const chartData = useChartData();

  const userName = profile?.first_name || 'User';

  const handleViewMealPlan = () => {
    navigate('/meal-plan');
  };

  const handleViewExercise = () => {
    navigate('/exercise');
  };

  // Convert chart data to the expected ProgressDataPoint array format
  const progressData = [
    ...chartData.weightData.map(point => ({
      date: point.day,
      weight: point.weight
    })),
    ...chartData.calorieData.map(point => ({
      date: point.day,
      calories: point.consumed
    })),
    ...chartData.workoutData.map(point => ({
      date: point.day,
      exercise: point.completed
    }))
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-3 md:p-4 lg:p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            {/* Enhanced Header with integrated notifications and activity */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 border-0 shadow-xl rounded-2xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
              
              <div className="relative p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <DashboardWelcomeHeader 
                    userName={userName}
                    onViewMealPlan={handleViewMealPlan}
                    onViewExercise={handleViewExercise}
                  />
                  <HeaderDropdowns />
                </div>
              </div>
            </div>
            
            {/* Compact Stats Grid */}
            <EnhancedStatsGrid />
            
            {/* Progress Chart Section */}
            <InteractiveProgressChart data={progressData} />
            
            {/* 50-50 Layout for remaining content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Left Column */}
              <div className="space-y-4 md:space-y-6">
                <GoalProgressWidget />
                <WeightTrackingWidget />
              </div>
              
              {/* Right Column */}
              <div className="space-y-4 md:space-y-6">
                <CoachChatWidget />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;
