
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { DashboardWelcomeHeader } from "@/components/dashboard/DashboardWelcomeHeader";
import EnhancedStatsGrid from "@/components/dashboard/EnhancedStatsGrid";
import InteractiveProgressChart from "@/components/dashboard/InteractiveProgressChart";
import WeightTrackingWidget from "@/components/dashboard/WeightTrackingWidget";
import GoalProgressWidget from "@/components/dashboard/GoalProgressWidget";
import CoachChatWidget from "@/components/dashboard/CoachChatWidget";
import HeaderDropdowns from "@/components/dashboard/HeaderDropdowns";
import EnhancedPageLoading from "@/components/ui/enhanced-page-loading";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTimeRange, setActiveTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const { profile, isLoading: profileLoading, error: profileError } = useProfile();
  const { user, loading: authLoading, error: authError } = useAuth();
  const navigate = useNavigate();

  console.log('Dashboard - Render state:', {
    authLoading,
    profileLoading,
    hasUser: !!user,
    hasProfile: !!profile,
    userId: user?.id?.substring(0, 8) + '...' || 'none',
    authError: authError?.message,
    profileError: profileError?.message
  });

  const userName = profile?.first_name || user?.first_name || 'User';
  const isLoading = authLoading || profileLoading;

  // Reduced timeout for faster recovery
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.warn('⚠️ Dashboard loading timeout reached');
        setLoadingTimeout(true);
        
        // If we have critical errors, redirect to auth
        if (authError && !user?.id) {
          console.log('🔄 Critical auth error, redirecting to auth...');
          navigate('/auth?error=dashboard_timeout');
          return;
        }
        
        // If we have a user but profile issues, continue anyway
        if (user?.id && profileError) {
          console.log('🔄 Profile error but user exists, continuing...');
          setLoadingTimeout(false); // Allow dashboard to render
        }
      }, 8000); // Reduced to 8 seconds

      return () => clearTimeout(timeout);
    } else {
      setLoadingTimeout(false);
    }
  }, [isLoading, authError, profileError, user?.id, navigate]);

  // Handle critical auth errors immediately
  useEffect(() => {
    if (authError && !authLoading && !user?.id) {
      console.error('Dashboard - Critical auth error, redirecting:', authError);
      navigate('/auth?error=auth_failed');
      return;
    }
  }, [authError, authLoading, user?.id, navigate]);

  const handleViewMealPlan = () => {
    navigate('/meal-plan');
  };

  const handleViewExercise = () => {
    navigate('/exercise');
  };

  // Show enhanced loading only if actually loading and not timed out
  if (isLoading && !loadingTimeout) {
    return (
      <ProtectedRoute>
        <Layout>
          <EnhancedPageLoading
            isLoading={true}
            type="dashboard"
            title="Loading Your Dashboard"
            description="Setting up your personalized fitness dashboard with the latest data and insights"
            timeout={7000} // Shorter timeout
          />
        </Layout>
      </ProtectedRoute>
    );
  }

  // Handle timeout with better UX
  if (loadingTimeout && authError) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-red-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Authentication Issue
                </h3>
                <p className="text-gray-600 mb-6">
                  There was an issue loading your dashboard. Please sign in again.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/auth')}
                    className="w-full bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-fitness-primary-600 hover:to-fitness-primary-700 transition-all duration-300"
                  >
                    Sign In Again
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Continue with dashboard rendering even if profile loading failed but user exists
  if (loadingTimeout && user?.id) {
    console.log('Dashboard - Continuing with basic user data after timeout');
  }

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
            <InteractiveProgressChart />
            
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
