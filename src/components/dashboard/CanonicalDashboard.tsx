
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import DashboardWelcomeHeader from "@/components/dashboard/DashboardWelcomeHeader";
import EnhancedStatsGrid from "@/components/dashboard/EnhancedStatsGrid";
import InteractiveProgressChart from "@/components/dashboard/InteractiveProgressChart";
import WeightTrackingWidget from "@/components/dashboard/WeightTrackingWidget";
import GoalProgressWidget from "@/components/dashboard/GoalProgressWidget";
import CoachChatWidget from "@/components/dashboard/CoachChatWidget";
import HeaderDropdowns from "@/components/dashboard/HeaderDropdowns";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";
import ProfileCompletionBanner from "@/components/profile/ProfileCompletionBanner";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Activity,
  Clock,
  Zap,
  Award,
  ChevronRight
} from "lucide-react";

const CanonicalDashboard = () => {
  const [activeTimeRange, setActiveTimeRange] = useState<'week' | 'month' | 'year'>('week');
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

  // Show simple loading only if actually loading
  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <SimpleLoadingIndicator
              message="Loading Dashboard"
              description="Setting up your personalized fitness dashboard..."
              size="lg"
            />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Handle auth errors with better UX
  if (authError) {
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

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-3 md:p-4 lg:p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            {/* Profile completion banner */}
            <ProfileCompletionBanner />
            
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
                  <HeaderDropdowns 
                    userName={userName}
                    unreadNotifications={0}
                    onProfileClick={() => navigate('/profile')}
                    onSettingsClick={() => navigate('/settings')}
                    onNotificationsClick={() => navigate('/notifications')}
                  />
                </div>
              </div>
            </div>
            
            {/* Enhanced Stats Grid */}
            <EnhancedStatsGrid 
              stats={[
                { key: 'calories', value: '1850', target: '2200', label: 'Calories', percentage: 84 },
                { key: 'protein', value: '120', target: '150', label: 'Protein', percentage: 80 },
                { key: 'workouts', value: '4', target: '5', label: 'Workouts', percentage: 80 },
                { key: 'weight', value: '75', target: '70', label: 'Weight', change: '-2' }
              ]}
            />

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => navigate('/meal-plan')}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Meal Plan</h3>
                  <p className="text-xs text-gray-600">View today's meals</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => navigate('/exercise')}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Workouts</h3>
                  <p className="text-xs text-gray-600">Start exercising</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => navigate('/goals')}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Goals</h3>
                  <p className="text-xs text-gray-600">Track progress</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => navigate('/progress')}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Progress</h3>
                  <p className="text-xs text-gray-600">View analytics</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Progress Chart Section */}
            <InteractiveProgressChart 
              data={[
                { name: 'Mon', value: 2100 },
                { name: 'Tue', value: 1950 },
                { name: 'Wed', value: 2200 },
                { name: 'Thu', value: 2050 },
                { name: 'Fri', value: 1900 },
                { name: 'Sat', value: 2300 },
                { name: 'Sun', value: 2000 }
              ]}
              title="Weekly Progress"
              dataKey="value"
            />
            
            {/* 50-50 Layout for remaining content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Left Column */}
              <div className="space-y-4 md:space-y-6">
                <GoalProgressWidget 
                  goals={[
                    { id: '1', title: 'Lose 5kg', progress: 60, target: 100, current: 60, unit: 'kg' },
                    { id: '2', title: 'Workout 5x/week', progress: 80, target: 100, current: 4, unit: 'workouts' }
                  ]}
                />
                <WeightTrackingWidget />
              </div>
              
              {/* Right Column */}
              <div className="space-y-4 md:space-y-6">
                <CoachChatWidget 
                  coaches={[]}
                  onStartChat={() => navigate('/coach')}
                  onScheduleCall={() => navigate('/schedule')}
                />
                
                {/* Recent Activity Card */}
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        Today
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Workout Completed</p>
                          <p className="text-xs text-gray-600">Upper body strength training</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Meal Plan Updated</p>
                          <p className="text-xs text-gray-600">New recipes for this week</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Goal Achievement</p>
                          <p className="text-xs text-gray-600">Weekly target reached!</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" className="w-full mt-4 text-sm" onClick={() => navigate('/progress')}>
                      View All Activity
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CanonicalDashboard;
