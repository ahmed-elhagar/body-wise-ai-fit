
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, Dumbbell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useMealPlanData } from "@/hooks/useMealPlanData";
import { useExerciseProgramData } from "@/hooks/useExerciseProgramData";
import { useNavigate } from "react-router-dom";
import { memo, useMemo, useCallback } from "react";
import WeightTrackingWidget from "@/components/dashboard/WeightTrackingWidget";
import InteractiveProgressChart from "@/components/dashboard/InteractiveProgressChart";
import EnhancedAnalyticsCard from "@/components/dashboard/EnhancedAnalyticsCard";
import GoalProgressWidget from "@/components/dashboard/GoalProgressWidget";

// Import the existing components
import { DashboardWelcomeHeader } from "@/components/dashboard/DashboardWelcomeHeader";
import { DashboardQuickStatsGrid } from "@/components/dashboard/DashboardQuickStatsGrid";
import { MealList } from "@/components/dashboard/MealList";
import { ExerciseProgress } from "@/components/dashboard/ExerciseProgress";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import { DashboardAchievements } from "@/components/dashboard/DashboardAchievements";

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  
  // Get current week data
  const { data: currentMealPlan } = useMealPlanData(0);
  const { currentProgram: currentExerciseProgram } = useExerciseProgramData(0, "home");

  // Memoized navigation functions
  const handleViewMealPlan = useCallback(() => navigate('/meal-plan'), [navigate]);
  const handleViewExercise = useCallback(() => navigate('/exercise'), [navigate]);
  const handleViewProgress = useCallback(() => navigate('/progress'), [navigate]);
  const handleViewProfile = useCallback(() => navigate('/profile'), [navigate]);
  const handleViewWeight = useCallback(() => navigate('/weight-tracking'), [navigate]);

  // Calculate today's data
  const { todaysMeals, todaysExercises, todaysCalories, todaysProtein, userName } = useMemo(() => {
    const today = new Date().getDay() || 7;
    const meals = currentMealPlan?.dailyMeals?.filter(meal => meal.day_number === today) || [];
    const exercises = currentExerciseProgram?.daily_workouts
      ?.filter(workout => workout.day_number === today)
      .flatMap(workout => workout.exercises || []) || [];

    const calories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const protein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
    const name = profile?.first_name || user?.email?.split('@')[0] || 'User';

    return {
      todaysMeals: meals,
      todaysExercises: exercises,
      todaysCalories: calories,
      todaysProtein: protein,
      userName: name
    };
  }, [currentMealPlan, currentExerciseProgram, profile, user]);

  const completedExercises = todaysExercises.filter(ex => ex.completed).length;
  const exerciseProgress = todaysExercises.length > 0 ? (completedExercises / todaysExercises.length) * 100 : 0;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-3 md:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            {/* Welcome Header */}
            <DashboardWelcomeHeader
              userName={userName}
              onViewMealPlan={handleViewMealPlan}
              onViewExercise={handleViewExercise}
            />

            {/* Quick Stats Grid */}
            <DashboardQuickStatsGrid
              todaysCalories={todaysCalories}
              todaysProtein={todaysProtein}
              todaysMealsLength={todaysMeals.length}
              exerciseProgress={exerciseProgress}
              completedExercises={completedExercises}
              todaysExercisesLength={todaysExercises.length}
              aiGenerationsRemaining={profile?.ai_generations_remaining || 0}
            />

            {/* Main Content Grid */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-12">
              {/* Today's Meals */}
              <Card className="lg:col-span-8">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Apple className="h-5 w-5 text-green-500" />
                    Today's Meals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MealList meals={todaysMeals} onViewMealPlan={handleViewMealPlan} />
                </CardContent>
              </Card>

              {/* Enhanced Analytics Card */}
              <div className="lg:col-span-4">
                <EnhancedAnalyticsCard />
              </div>
            </div>

            {/* Progress Chart and Workout */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
              <InteractiveProgressChart />
              
              {/* Today's Workout */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Dumbbell className="h-5 w-5 text-blue-500" />
                    Today's Workout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ExerciseProgress exercises={todaysExercises} onViewExercise={handleViewExercise} />
                </CardContent>
              </Card>
            </div>

            {/* Weight Tracking and Goals */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
              <WeightTrackingWidget />
              <GoalProgressWidget />
            </div>

            {/* Quick Actions */}
            <DashboardQuickActions
              handleViewMealPlan={handleViewMealPlan}
              handleViewExercise={handleViewExercise}
              handleViewWeight={handleViewWeight}
              handleViewProgress={handleViewProgress}
              handleViewProfile={handleViewProfile}
              handleViewGoals={() => navigate('/goals')}
            />

            {/* Achievements */}
            <DashboardAchievements
              profile={profile}
              currentMealPlan={currentMealPlan}
              currentExerciseProgram={currentExerciseProgram}
            />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default memo(Dashboard);
