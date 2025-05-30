
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  TrendingUp, 
  Target, 
  Apple, 
  Dumbbell, 
  Flame,
  Award,
  Users,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useMealPlanData } from "@/hooks/useMealPlanData";
import { useExerciseProgramData } from "@/hooks/useExerciseProgramData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { memo, useMemo, useCallback } from "react";
import WeightTrackingWidget from "@/components/dashboard/WeightTrackingWidget";
import InteractiveProgressChart from "@/components/dashboard/InteractiveProgressChart";

// Memoized components for better performance
const StatCard = memo(({ title, value, description, icon: Icon, className = "" }: {
  title: string;
  value: string | number;
  description: string;
  icon: any;
  className?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${className}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
));

StatCard.displayName = 'StatCard';

const MealList = memo(({ meals, onViewMealPlan }: {
  meals: any[];
  onViewMealPlan: () => void;
}) => {
  if (meals.length === 0) {
    return (
      <div className="text-center py-6">
        <Apple className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No meal plan for today</p>
        <Button onClick={onViewMealPlan} className="mt-3" variant="outline" size="sm">
          Generate Meal Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meals.slice(0, 3).map((meal) => (
        <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-sm">{meal.name}</h4>
            <p className="text-xs text-gray-600 capitalize">{meal.meal_type}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-sm">{meal.calories} cal</p>
            <p className="text-xs text-gray-600">{meal.protein}g protein</p>
          </div>
        </div>
      ))}
      {meals.length > 3 && (
        <p className="text-center text-xs text-gray-500">
          +{meals.length - 3} more meals
        </p>
      )}
    </div>
  );
});

MealList.displayName = 'MealList';

const ExerciseProgress = memo(({ exercises, onViewExercise }: {
  exercises: any[];
  onViewExercise: () => void;
}) => {
  const completedExercises = exercises.filter(ex => ex.completed).length;
  const exerciseProgress = exercises.length > 0 ? (completedExercises / exercises.length) * 100 : 0;

  if (exercises.length === 0) {
    return (
      <div className="text-center py-6">
        <Dumbbell className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Rest day or no workout planned</p>
        <Button onClick={onViewExercise} className="mt-3" variant="outline" size="sm">
          View Exercise Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Progress</span>
        <Badge variant={exerciseProgress === 100 ? "default" : "secondary"} className="text-xs">
          {completedExercises}/{exercises.length}
        </Badge>
      </div>
      <Progress value={exerciseProgress} />
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {exercises.slice(0, 3).map((exercise) => (
          <div key={exercise.id} className="flex items-center justify-between text-sm">
            <span className={exercise.completed ? "line-through text-gray-500" : ""}>
              {exercise.name}
            </span>
            <span className="text-gray-500 text-xs">
              {exercise.sets} × {exercise.reps}
            </span>
          </div>
        ))}
        {exercises.length > 3 && (
          <p className="text-xs text-gray-500 text-center">
            +{exercises.length - 3} more exercises
          </p>
        )}
      </div>
    </div>
  );
});

ExerciseProgress.displayName = 'ExerciseProgress';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { t } = useLanguage();
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
            {/* Welcome Header - More compact */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                  Welcome back, {userName}! 👋
                </h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  Here's your fitness journey overview for today
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleViewMealPlan} className="bg-fitness-gradient text-white" size="sm">
                  <Apple className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">View </span>Meal Plan
                </Button>
                <Button onClick={handleViewExercise} variant="outline" size="sm">
                  <Dumbbell className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Start </span>Workout
                </Button>
              </div>
            </div>

            {/* Quick Stats Grid - More compact */}
            <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">Today's Calories</CardTitle>
                  <Flame className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{todaysCalories}</div>
                  <p className="text-xs text-muted-foreground">
                    {todaysMeals.length} meals planned
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">Protein Intake</CardTitle>
                  <Target className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{todaysProtein.toFixed(1)}g</div>
                  <p className="text-xs text-muted-foreground">Daily protein goal</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">Exercise Progress</CardTitle>
                  <Activity className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{exerciseProgress.toFixed(0)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {completedExercises}/{todaysExercises.length} exercises done
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">AI Generations</CardTitle>
                  <Sparkles className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{profile?.ai_generations_remaining || 0}</div>
                  <p className="text-xs text-muted-foreground">Credits remaining</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid - Better organized */}
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

              {/* Weight Tracking Widget */}
              <div className="lg:col-span-4">
                <WeightTrackingWidget />
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

            {/* Quick Actions - More compact */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <Button onClick={handleViewMealPlan} variant="outline" size="sm" className="justify-start">
                    <Apple className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Generate </span>Meal Plan
                  </Button>
                  <Button onClick={handleViewExercise} variant="outline" size="sm" className="justify-start">
                    <Dumbbell className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Create </span>Exercise
                  </Button>
                  <Button onClick={handleViewWeight} variant="outline" size="sm" className="justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Track </span>Weight
                  </Button>
                  <Button onClick={handleViewProgress} variant="outline" size="sm" className="justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">View </span>Progress
                  </Button>
                  <Button onClick={handleViewProfile} variant="outline" size="sm" className="justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Update </span>Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Achievements - More compact */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profile Completion</span>
                    <Badge variant="secondary">
                      {profile ? "Complete" : "Incomplete"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Meal Plans Created</span>
                    <Badge variant="secondary">
                      {currentMealPlan ? "1+" : "0"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Workouts Generated</span>
                    <Badge variant="secondary">
                      {currentExerciseProgram ? "1+" : "0"}
                    </Badge>
                  </div>
                </div>
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Keep going! Every step counts towards your fitness goals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default memo(Dashboard);
