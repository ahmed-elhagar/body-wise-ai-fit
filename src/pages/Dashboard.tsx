
import ProtectedRoute from "@/components/ProtectedRoute";
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
      <div className="text-center py-8">
        <Apple className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No meal plan for today</p>
        <Button onClick={onViewMealPlan} className="mt-3" variant="outline">
          Generate Meal Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meals.slice(0, 4).map((meal) => (
        <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium">{meal.name}</h4>
            <p className="text-sm text-gray-600 capitalize">{meal.meal_type}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{meal.calories} cal</p>
            <p className="text-sm text-gray-600">{meal.protein}g protein</p>
          </div>
        </div>
      ))}
      {meals.length > 4 && (
        <p className="text-center text-sm text-gray-500">
          +{meals.length - 4} more meals
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
      <div className="text-center py-8">
        <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Rest day or no workout planned</p>
        <Button onClick={onViewExercise} className="mt-3" variant="outline">
          View Exercise Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Progress</span>
        <Badge variant={exerciseProgress === 100 ? "default" : "secondary"}>
          {completedExercises}/{exercises.length}
        </Badge>
      </div>
      <Progress value={exerciseProgress} />
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {exercises.slice(0, 3).map((exercise) => (
          <div key={exercise.id} className="flex items-center justify-between text-sm">
            <span className={exercise.completed ? "line-through text-gray-500" : ""}>
              {exercise.name}
            </span>
            <span className="text-gray-500">
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
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here's your fitness journey overview for today
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleViewMealPlan} className="bg-fitness-gradient text-white">
                <Apple className="h-4 w-4 mr-2" />
                View Meal Plan
              </Button>
              <Button onClick={handleViewExercise} variant="outline">
                <Dumbbell className="h-4 w-4 mr-2" />
                Start Workout
              </Button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Today's Calories"
              value={todaysCalories}
              description={`${todaysMeals.length} meals planned`}
              icon={Flame}
              className="text-orange-500"
            />
            <StatCard
              title="Protein Intake"
              value={`${todaysProtein.toFixed(1)}g`}
              description="Daily protein goal"
              icon={Target}
              className="text-green-500"
            />
            <StatCard
              title="Exercise Progress"
              value={`${exerciseProgress.toFixed(0)}%`}
              description={`${completedExercises}/${todaysExercises.length} exercises done`}
              icon={Activity}
              className="text-blue-500"
            />
            <StatCard
              title="AI Generations"
              value={profile?.ai_generations_remaining || 0}
              description="Credits remaining"
              icon={Sparkles}
              className="text-purple-500"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Today's Meals */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-green-500" />
                  Today's Meals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MealList meals={todaysMeals} onViewMealPlan={handleViewMealPlan} />
              </CardContent>
            </Card>

            {/* Today's Workout */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-blue-500" />
                  Today's Workout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExerciseProgress exercises={todaysExercises} onViewExercise={handleViewExercise} />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Achievements */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleViewMealPlan} variant="outline" className="w-full justify-start">
                  <Apple className="h-4 w-4 mr-2" />
                  Generate New Meal Plan
                </Button>
                <Button onClick={handleViewExercise} variant="outline" className="w-full justify-start">
                  <Dumbbell className="h-4 w-4 mr-2" />
                  Create Exercise Program
                </Button>
                <Button onClick={handleViewProgress} variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Track Progress
                </Button>
                <Button onClick={handleViewProfile} variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">
                      Keep going! Every step counts towards your fitness goals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default memo(Dashboard);
