
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, Target, Calendar, Activity, Apple, Dumbbell, Scale } from "lucide-react";
import { WeightEntry } from "@/hooks/useWeightTracking";
import { Goal } from "@/hooks/useGoals";
import { useMealPlanData } from "@/hooks/useMealPlanData";
import { useExerciseProgramData } from "@/hooks/useExerciseProgramData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useMemo } from "react";

interface ProgressAnalyticsProps {
  weightEntries: WeightEntry[];
  macroGoals: Goal[];
}

const ProgressAnalytics = ({ weightEntries, macroGoals }: ProgressAnalyticsProps) => {
  const { t } = useLanguage();
  const { data: currentMealPlan } = useMealPlanData(0);
  const { currentProgram: currentExerciseProgram } = useExerciseProgramData(0, "home");

  // Calculate real analytics data
  const analyticsData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayNumber = new Date(date).getDay() || 7;
      
      // Get meals for this day
      const dayMeals = currentMealPlan?.dailyMeals?.filter(meal => meal.day_number === dayNumber) || [];
      const dayCalories = dayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
      const dayProtein = dayMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
      
      // Get exercises for this day
      const dayWorkouts = currentExerciseProgram?.daily_workouts?.filter(workout => workout.day_number === dayNumber) || [];
      const dayExercises = dayWorkouts.flatMap(workout => workout.exercises || []);
      const completedExercises = dayExercises.filter(ex => ex.completed).length;
      const workoutProgress = dayExercises.length > 0 ? (completedExercises / dayExercises.length) * 100 : 0;
      
      // Get weight for this day (if available)
      const dayWeight = weightEntries.find(entry => 
        entry.recorded_at.split('T')[0] === date
      )?.weight || null;

      return {
        date,
        calories: dayCalories,
        protein: dayProtein,
        workoutProgress,
        weight: dayWeight,
        exerciseCount: dayExercises.length,
        completedExercises
      };
    });
  }, [currentMealPlan, currentExerciseProgram, weightEntries]);

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const totalCalories = analyticsData.reduce((sum, day) => sum + day.calories, 0);
    const avgCalories = totalCalories / 7;
    const totalProtein = analyticsData.reduce((sum, day) => sum + day.protein, 0);
    const avgProtein = totalProtein / 7;
    const avgWorkoutProgress = analyticsData.reduce((sum, day) => sum + day.workoutProgress, 0) / 7;
    const totalExercises = analyticsData.reduce((sum, day) => sum + day.exerciseCount, 0);
    const totalCompleted = analyticsData.reduce((sum, day) => sum + day.completedExercises, 0);

    return {
      avgCalories: Math.round(avgCalories),
      avgProtein: Math.round(avgProtein),
      avgWorkoutProgress: Math.round(avgWorkoutProgress),
      exerciseCompletionRate: totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0
    };
  }, [analyticsData]);

  return (
    <div className="space-y-6">
      {/* Weekly Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <Apple className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-800">{weeklyStats.avgCalories}</div>
            <div className="text-sm text-blue-600">{t('Avg Daily Calories')}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-800">{weeklyStats.avgProtein}g</div>
            <div className="text-sm text-green-600">{t('Avg Daily Protein')}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <Dumbbell className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-800">{weeklyStats.exerciseCompletionRate}%</div>
            <div className="text-sm text-purple-600">{t('Exercise Completion')}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-800">{weeklyStats.avgWorkoutProgress}%</div>
            <div className="text-sm text-orange-600">{t('Avg Workout Progress')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Nutrition Trends Chart */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="w-5 h-5 text-green-600" />
            {t('7-Day Nutrition Trends')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [
                  name === 'calories' ? `${value} cal` : `${value}g`,
                  name === 'calories' ? 'Calories' : 'Protein'
                ]}
              />
              <Line type="monotone" dataKey="calories" stroke="#3b82f6" strokeWidth={2} name="calories" />
              <Line type="monotone" dataKey="protein" stroke="#10b981" strokeWidth={2} name="protein" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Exercise Progress Chart */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            {t('7-Day Exercise Progress')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [
                  `${value}%`,
                  'Workout Progress'
                ]}
              />
              <Bar dataKey="workoutProgress" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights Based on Real Data */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-orange-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <TrendingUp className="w-5 h-5" />
            {t('Weekly Insights')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weeklyStats.avgCalories > 0 && (
            <div className="p-3 bg-white/60 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                📊 {t('Your average daily intake is')} {weeklyStats.avgCalories} {t('calories with')} {weeklyStats.avgProtein}g {t('protein')}.
              </p>
            </div>
          )}
          
          {weeklyStats.exerciseCompletionRate > 0 && (
            <div className="p-3 bg-white/60 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                💪 {t('You completed')} {weeklyStats.exerciseCompletionRate}% {t('of your planned exercises this week')}.
              </p>
            </div>
          )}
          
          {weightEntries.length >= 2 && (
            <div className="p-3 bg-white/60 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                ⚖️ {t('Latest weight:')} {weightEntries[0].weight}kg 
                ({weightEntries[0].weight > weightEntries[1].weight ? '+' : ''}{(weightEntries[0].weight - weightEntries[1].weight).toFixed(1)}kg {t('change')})
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressAnalytics;
