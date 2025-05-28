
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { 
  CalendarDays, 
  Dumbbell, 
  TrendingUp, 
  Target, 
  Camera,
  MessageCircle,
  ChefHat,
  Scale,
  Zap,
  Clock,
  Trophy,
  Heart
} from "lucide-react";
import DashboardStats from "@/components/DashboardStats";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import Navigation from "@/components/Navigation";
import { useInitialAIGeneration } from "@/hooks/useInitialAIGeneration";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isGeneratingContent } = useInitialAIGeneration();

  // Mock data for weekly goals
  const weeklyGoals = [
    { label: "Workouts", current: 3, target: 4, unit: "sessions" },
    { label: "Water", current: 6, target: 8, unit: "glasses" },
    { label: "Steps", current: 7500, target: 10000, unit: "steps" },
    { label: "Sleep", current: 6.5, target: 8, unit: "hours" }
  ];

  const todayStats = {
    calories: { consumed: 1850, burned: 420, target: 2200 },
    water: { consumed: 6, target: 8 },
    steps: { count: 7500, target: 10000 },
    workouts: { completed: 1, planned: 1 }
  };

  const upcomingMeals = [
    { time: "12:30 PM", name: "Grilled Chicken Salad", calories: 450, type: "lunch" },
    { time: "3:00 PM", name: "Greek Yogurt & Berries", calories: 180, type: "snack" },
    { time: "7:00 PM", name: "Salmon with Quinoa", calories: 520, type: "dinner" }
  ];

  const nextWorkout = {
    name: "Upper Body Strength",
    time: "6:00 PM",
    duration: "45 min",
    exercises: 6
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back! 👋</h1>
          <p className="text-gray-600">Here's your fitness progress for today</p>
          
          {isGeneratingContent && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 animate-spin border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="text-blue-700">Generating your personalized content in the background...</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <DashboardStats />

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Today's Summary */}
          <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-fitness-primary" />
                Today's Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Calories */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Calories</span>
                    <span className="text-sm font-medium">
                      {todayStats.calories.consumed}/{todayStats.calories.target}
                    </span>
                  </div>
                  <Progress 
                    value={(todayStats.calories.consumed / todayStats.calories.target) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Consumed: {todayStats.calories.consumed}</span>
                    <span>Burned: {todayStats.calories.burned}</span>
                  </div>
                </div>

                {/* Water */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Water</span>
                    <span className="text-sm font-medium">
                      {todayStats.water.consumed}/{todayStats.water.target} glasses
                    </span>
                  </div>
                  <Progress 
                    value={(todayStats.water.consumed / todayStats.water.target) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Steps */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Steps</span>
                    <span className="text-sm font-medium">
                      {todayStats.steps.count.toLocaleString()}/{todayStats.steps.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={(todayStats.steps.count / todayStats.steps.target) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Workouts */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Workouts</span>
                    <span className="text-sm font-medium">
                      {todayStats.workouts.completed}/{todayStats.workouts.planned} completed
                    </span>
                  </div>
                  <Progress 
                    value={(todayStats.workouts.completed / todayStats.workouts.planned) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <QuickActions />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Upcoming Meals */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <ChefHat className="w-5 h-5 mr-2 text-fitness-primary" />
                  Upcoming Meals
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/meal-plan')}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isGeneratingContent ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingMeals.map((meal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{meal.name}</p>
                        <p className="text-sm text-gray-600">{meal.time}</p>
                      </div>
                      <Badge variant="outline">{meal.calories} cal</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Workout */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Dumbbell className="w-5 h-5 mr-2 text-fitness-primary" />
                  Next Workout
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/exercise')}
                >
                  View Program
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isGeneratingContent ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{nextWorkout.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {nextWorkout.time}
                      </span>
                      <span className="flex items-center">
                        <Target className="w-3 h-3 mr-1" />
                        {nextWorkout.duration}
                      </span>
                      <span>{nextWorkout.exercises} exercises</span>
                    </div>
                  </div>
                  <Button className="w-full bg-fitness-gradient hover:opacity-90 text-white">
                    Start Workout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Weekly Goals Progress */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-fitness-primary" />
              Weekly Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {weeklyGoals.map((goal, index) => (
                <div key={index} className="text-center">
                  <div className="mb-2">
                    <span className="text-2xl font-bold text-gray-800">
                      {typeof goal.current === 'number' && goal.current % 1 !== 0 
                        ? goal.current.toFixed(1) 
                        : goal.current.toLocaleString()}
                    </span>
                    <span className="text-gray-600">/{goal.target.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(goal.current / goal.target) * 100} 
                    className="h-2 mb-2"
                  />
                  <p className="text-sm text-gray-600">{goal.label}</p>
                  <p className="text-xs text-gray-500">{goal.unit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;
