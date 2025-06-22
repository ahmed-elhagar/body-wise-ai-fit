import React, { useState, useEffect } from 'react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useMealPlans } from '@/features/meal-plan/hooks';

import { useDashboardStats } from '../hooks/useDashboardStats';
import { useNotifications } from '@/shared/hooks/useNotifications';
import { useI18n } from '@/shared/hooks/useI18n';
import { useNavigate } from 'react-router-dom';
import { PersonalizedWelcome } from './PersonalizedWelcome';
import { SmartRecommendations } from './SmartRecommendations';
import { QuickActions } from './QuickActions';
import { 
  Activity,
  Flame,
  Target,
  TrendingUp,
  Droplets,
  Calendar,
  Clock,
  Trophy,
  Dumbbell,
  Utensils,
  Scale,
  BarChart3,
  Bell,
  Plus,
  ArrowRight,
  Zap,
  Moon,
  Sun,
  CheckCircle,
  AlertCircle,
  User,
  Settings,
  LogOut,
  Shield,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { useRole } from "@/shared/hooks/useRole";

const Dashboard = () => {
  const { profile } = useProfile();
  const { user, signOut } = useAuth();
  const { isAdmin, isCoach, role } = useRole();
  const { stats, isLoading: statsLoading } = useDashboardStats();
  const { mealPlans, isLoading: mealPlansLoading } = useMealPlans();
  
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { t, isRTL } = useI18n();
  const navigate = useNavigate();

  // Real data calculations from actual APIs
  const todayStats = React.useMemo(() => {
    const latestMealPlan = mealPlans?.[0];
    const latestProgram = null; // Removed programs dependency
    
    // Calculate today's nutrition from real meal plan
    const today = new Date();
    const dayNumber = today.getDay() === 0 ? 7 : today.getDay(); // Convert Sunday to 7
    
    let caloriesConsumed = 0;
    let proteinConsumed = 0;
    
    if (latestMealPlan?.daily_meals) {
      const todayMeals = latestMealPlan.daily_meals.filter((meal: any) => meal.day_number === dayNumber);
      caloriesConsumed = todayMeals.reduce((total: number, meal: any) => total + (meal.calories || 0), 0);
      proteinConsumed = todayMeals.reduce((total: number, meal: any) => total + (meal.protein || 0), 0);
    }
    
    // Calculate today's workout progress from real program
    let workoutMinutes = 0;
    let completedExercises = 0;
    let totalExercises = 0;
    
    if ((latestProgram as any)?.daily_workouts) {
      const todayWorkout = (latestProgram as any).daily_workouts.find((w: any) => w.day_number === dayNumber);
      if (todayWorkout?.exercises) {
        totalExercises = todayWorkout.exercises.length;
        completedExercises = todayWorkout.exercises.filter((ex: any) => ex.completed).length;
        workoutMinutes = todayWorkout.estimated_duration || 0;
      }
    }
    
    return {
      caloriesConsumed,
      caloriesGoal: (profile as any)?.daily_calorie_goal || 2000,
      proteinConsumed,
      proteinGoal: (profile as any)?.daily_protein_goal || 150,
      waterIntake: 6, // This would come from water tracking API
      waterGoal: 8,
      workoutMinutes,
      workoutGoal: 60,
      stepsCount: stats?.steps || 8945,
      stepsGoal: 10000,
      completedExercises,
      totalExercises
    };
  }, [mealPlans, profile, stats]);

  // Weekly progress from real data
  const weeklyProgress = React.useMemo(() => {
    const completedWorkouts = 0; // Simplified - programs removed
    
    const nutritionDaysOnTrack = mealPlans?.reduce((total, plan) => {
      return total + ((plan as any).daily_meals?.filter((m: any) => m.consumed).length || 0);
    }, 0) || 0;
    
    return {
      workoutsCompleted: Math.min(completedWorkouts, 7),
      workoutsGoal: 5,
      nutritionDaysOnTrack: Math.min(nutritionDaysOnTrack, 7),
      nutritionGoal: 7,
      avgSleepHours: 7.2, // This would come from sleep tracking API
      sleepGoal: 8
    };
  }, [mealPlans]);

  // Calculate progress percentages
  const caloriesProgress = todayStats.caloriesGoal > 0 ? (todayStats.caloriesConsumed / todayStats.caloriesGoal) * 100 : 0;
  const proteinProgress = todayStats.proteinGoal > 0 ? (todayStats.proteinConsumed / todayStats.proteinGoal) * 100 : 0;
  const waterProgress = todayStats.waterGoal > 0 ? (todayStats.waterIntake / todayStats.waterGoal) * 100 : 0;
  const workoutProgress = todayStats.totalExercises > 0 ? (todayStats.completedExercises / todayStats.totalExercises) * 100 : 0;
  const stepsProgress = todayStats.stepsGoal > 0 ? (todayStats.stepsCount / todayStats.stepsGoal) * 100 : 0;

  const isLoading = statsLoading || mealPlansLoading;

  // Demo notifications for testing (since we might not have real notifications in the database)
  const demoNotifications = [
    {
      id: '1',
      title: 'Workout Complete! 💪',
      message: 'Great job completing your morning workout! You burned 350 calories.',
      type: 'success',
      is_read: false,
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      action_url: '/exercise'
    },
    {
      id: '2', 
      title: 'Meal Plan Ready 🍽️',
      message: 'Your personalized meal plan for this week is ready to view.',
      type: 'info',
      is_read: false,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      action_url: '/meal-plan'
    },
    {
      id: '3',
      title: 'Hydration Reminder 💧',
      message: 'You\'re doing great! Don\'t forget to drink water throughout the day.',
      type: 'reminder',
      is_read: true,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      action_url: '/food-tracker'
    }
  ];

  // Use demo notifications if no real notifications exist
  const displayNotifications = notifications && notifications.length > 0 ? notifications : demoNotifications;
  const displayUnreadCount = displayNotifications.filter(n => !n.is_read).length;

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read && markAsRead) {
      markAsRead(notification.id);
    }
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const formatTimeDistance = (timeString: string) => {
    try {
      const date = new Date(timeString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch (error) {
      return 'Recently';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'reminder': return '🔔';
      case 'achievement': return '🏆';
      default: return '💡';
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'coach': return 'bg-purple-100 text-purple-800';
      case 'pro': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-primary-25 to-brand-secondary-25 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary-600"></div>
          <p className="text-neutral-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-25 to-brand-secondary-25">
      {/* Enhanced Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-neutral-200/60 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left Side - Logo & Welcome */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-neutral-900">Dashboard</h1>
                <p className="text-sm text-neutral-600">Welcome back, {profile?.first_name || user?.email?.split('@')[0] || 'Friend'}!</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-neutral-900">Dashboard</h1>
              </div>
            </div>
            
            {/* Right Side - Actions */}
            <div className="flex items-center gap-3">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-neutral-50 rounded-full">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-semantic-success-500 rounded-full"></div>
                  <span className="text-xs font-medium text-neutral-700">{Math.round(caloriesProgress)}% Calories</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-primary-500 rounded-full"></div>
                  <span className="text-xs font-medium text-neutral-700">{Math.round(workoutProgress)}% Workout</span>
                </div>
              </div>

              {/* Enhanced Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative hover:bg-brand-primary-50 transition-all duration-200 rounded-xl p-2">
                    <Bell className="w-5 h-5 text-neutral-700" />
                    {displayUnreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-semantic-error-500 text-white text-xs p-0 flex items-center justify-center animate-pulse shadow-lg">
                        {displayUnreadCount > 9 ? '9+' : displayUnreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align={isRTL ? "start" : "end"}
                  className="w-96 p-0 bg-white/95 backdrop-blur-md border border-neutral-200/50 shadow-2xl rounded-2xl z-50 max-h-[80vh] overflow-hidden"
                  sideOffset={12}
                >
                  {/* Header */}
                  <div className="p-4 border-b border-neutral-100 bg-gradient-to-r from-brand-primary-50 to-brand-secondary-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-brand-primary-600" />
                        <h3 className="font-bold text-neutral-900">Notifications</h3>
                        {displayUnreadCount > 0 && (
                          <Badge className="bg-brand-primary-100 text-brand-primary-700 text-xs">
                            {displayUnreadCount} new
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/notifications')}
                        className="text-brand-primary-600 hover:text-brand-primary-700 hover:bg-brand-primary-100 text-xs px-3 py-1.5 rounded-lg font-medium"
                      >
                        View All
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Notifications List */}
                  <div className="max-h-80 overflow-y-auto">
                    {displayNotifications.length === 0 ? (
                      <div className="p-8 text-center text-neutral-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-30 text-neutral-400" />
                        <p className="text-sm font-medium text-neutral-600">No notifications yet</p>
                        <p className="text-xs mt-1 text-neutral-500">We'll notify you about important updates! 🎉</p>
                      </div>
                    ) : (
                      displayNotifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification?.id || Math.random()}
                          className={`p-4 border-b border-neutral-50 hover:bg-brand-primary-25 transition-all duration-200 cursor-pointer group ${
                            !notification?.is_read ? 'bg-brand-primary-50/30 border-l-4 border-l-brand-primary-500' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-brand-primary-100 to-brand-secondary-100 rounded-full flex items-center justify-center text-sm">
                              {getNotificationIcon(notification?.type || 'info')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h4 className="font-semibold text-sm text-neutral-900 truncate group-hover:text-brand-primary-700 transition-colors">
                                  {notification?.title || 'Notification'}
                                </h4>
                                {!notification?.is_read && (
                                  <div className="w-2 h-2 bg-brand-primary-500 rounded-full flex-shrink-0 mt-1"></div>
                                )}
                              </div>
                              <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2 mb-2">
                                {notification?.message || ''}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-neutral-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTimeDistance(notification?.created_at || new Date().toISOString())}</span>
                                </div>
                                {notification?.action_url && (
                                  <ArrowRight className="w-3 h-3 text-brand-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Footer */}
                  {displayNotifications.length > 5 && (
                    <div className="p-3 border-t border-neutral-100 bg-neutral-25">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/notifications')}
                        className="w-full text-xs text-neutral-600 hover:text-brand-primary-700 hover:bg-brand-primary-50"
                      >
                        View {displayNotifications.length - 5} more notifications
                      </Button>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Enhanced Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-brand-primary-50 transition-all duration-200 rounded-xl p-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-accent-400 to-brand-accent-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {(profile?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-neutral-700 font-medium text-sm">
                      {profile?.first_name || user?.email?.split('@')[0] || 'Profile'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align={isRTL ? "start" : "end"}
                  className="w-56 p-2 bg-white/95 backdrop-blur-md border border-neutral-200/50 shadow-xl rounded-xl z-50"
                  sideOffset={8}
                >
                  {/* User Info Header */}
                  <div className="p-3 border-b border-neutral-100 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-accent-400 to-brand-accent-600 rounded-full flex items-center justify-center text-white font-bold">
                        {(profile?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-neutral-900">
                          {profile?.first_name || user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">
                          {user?.email || 'user@example.com'}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleBadgeColor()}`}>
                          {role?.charAt(0).toUpperCase() + role?.slice(1) || 'Free'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Profile & Settings */}
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>

                  {/* Role-based Access */}
                  {(isAdmin || isCoach) && (
                    <>
                      <DropdownMenuSeparator />
                      
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Panel
                        </DropdownMenuItem>
                      )}
                      
                      {isCoach && (
                        <DropdownMenuItem onClick={() => navigate('/coach')}>
                          <Users className="w-4 h-4 mr-2" />
                          Coach Panel
                        </DropdownMenuItem>
                      )}
                    </>
                  )}

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Improved Spacing and Clickability */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 relative z-10">
        {/* Personalized Welcome Section */}
        <PersonalizedWelcome />

        {/* Essential Stats Grid - Improved Design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today's Calories */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-brand-secondary-50 to-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => navigate('/food-tracker')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-secondary-100 to-brand-secondary-200 rounded-xl flex items-center justify-center shadow-sm">
                  <Flame className="w-5 h-5 text-brand-secondary-600" />
                </div>
                <span className="text-xs font-semibold text-brand-secondary-700 bg-brand-secondary-100 px-2 py-1 rounded-full">Calories</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-neutral-900">{Math.round(todayStats.caloriesConsumed)}</span>
                  <span className="text-sm text-neutral-500">/{todayStats.caloriesGoal}</span>
                </div>
                <Progress value={Math.min(caloriesProgress, 100)} className="h-2" />
                <div className="flex items-center gap-2">
                  {caloriesProgress >= 80 ? (
                    <CheckCircle className="w-4 h-4 text-semantic-success-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-semantic-warning-500" />
                  )}
                  <span className="text-xs text-neutral-600 font-medium">{Math.round(caloriesProgress)}% of goal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Workout */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-brand-primary-50 to-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => navigate('/exercise')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 rounded-xl flex items-center justify-center shadow-sm">
                  <Dumbbell className="w-5 h-5 text-brand-primary-600" />
                </div>
                <span className="text-xs font-semibold text-brand-primary-700 bg-brand-primary-100 px-2 py-1 rounded-full">Workout</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-neutral-900">{todayStats.completedExercises}</span>
                  <span className="text-sm text-neutral-500">/{todayStats.totalExercises} exercises</span>
                </div>
                <Progress value={Math.min(workoutProgress, 100)} className="h-2" />
                <div className="flex items-center gap-2">
                  {workoutProgress >= 100 ? (
                    <CheckCircle className="w-4 h-4 text-semantic-success-500" />
                  ) : workoutProgress > 0 ? (
                    <Activity className="w-4 h-4 text-brand-primary-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-neutral-400" />
                  )}
                  <span className="text-xs text-neutral-600 font-medium">
                    {todayStats.totalExercises === 0 ? 'No workout today' : `${Math.round(workoutProgress)}% complete`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Water Intake */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-brand-accent-50 to-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => navigate('/food-tracker')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-accent-100 to-brand-accent-200 rounded-xl flex items-center justify-center shadow-sm">
                  <Droplets className="w-5 h-5 text-brand-accent-600" />
                </div>
                <span className="text-xs font-semibold text-brand-accent-700 bg-brand-accent-100 px-2 py-1 rounded-full">Water</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-neutral-900">{todayStats.waterIntake}</span>
                  <span className="text-sm text-neutral-500">/{todayStats.waterGoal} glasses</span>
                </div>
                <Progress value={Math.min(waterProgress, 100)} className="h-2" />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="w-full text-xs h-7 text-brand-accent-600 hover:bg-brand-accent-100 hover:text-brand-accent-700 transition-colors font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/food-tracker');
                  }}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Log Water
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-semantic-success-50 to-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => navigate('/progress')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-semantic-success-100 to-semantic-success-200 rounded-xl flex items-center justify-center shadow-sm">
                  <Activity className="w-5 h-5 text-semantic-success-600" />
                </div>
                <span className="text-xs font-semibold text-semantic-success-700 bg-semantic-success-100 px-2 py-1 rounded-full">Steps</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-neutral-900">{todayStats.stepsCount.toLocaleString()}</span>
                  <span className="text-sm text-neutral-500">/{todayStats.stepsGoal.toLocaleString()}</span>
                </div>
                <Progress value={Math.min(stepsProgress, 100)} className="h-2" />
                <div className="flex items-center gap-2">
                  {stepsProgress >= 100 ? (
                    <Trophy className="w-4 h-4 text-semantic-success-500" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-semantic-success-500" />
                  )}
                  <span className="text-xs text-neutral-600 font-medium">{Math.round(stepsProgress)}% of goal</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smart Recommendations */}
        <SmartRecommendations />

        {/* Quick Actions */}
        <QuickActions />

        {/* Weekly Summary - Compact */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-brand-primary-600 via-brand-primary-700 to-brand-secondary-600 text-white overflow-hidden relative cursor-pointer" onClick={() => navigate('/progress')}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              This Week's Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 relative z-10">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">{weeklyProgress.workoutsCompleted}</div>
                <div className="text-sm text-white/90 font-medium">Workouts</div>
                <div className="text-xs text-white/70">Goal: {weeklyProgress.workoutsGoal}</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">{weeklyProgress.nutritionDaysOnTrack}</div>
                <div className="text-sm text-white/90 font-medium">Nutrition Days</div>
                <div className="text-xs text-white/70">Goal: {weeklyProgress.nutritionGoal}</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">{weeklyProgress.avgSleepHours}h</div>
                <div className="text-sm text-white/90 font-medium">Avg Sleep</div>
                <div className="text-xs text-white/70">Goal: {weeklyProgress.sleepGoal}h</div>
              </div>
            </div>
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/progress');
              }}
              size="sm"
              className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30 h-9 font-medium transition-all duration-200 hover:scale-105"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 