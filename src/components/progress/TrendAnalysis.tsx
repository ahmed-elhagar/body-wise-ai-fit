
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Brain, TrendingUp, TrendingDown, Target, Activity, Calendar } from "lucide-react";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useGoals } from "@/hooks/useGoals";
import { useMealPlanData } from "@/hooks/useMealPlanData";
import { useExerciseProgramData } from "@/hooks/useExerciseProgramData";
import { useMemo } from "react";

const TrendAnalysis = () => {
  const { t } = useLanguage();
  const { weightEntries } = useWeightTracking();
  const { goals } = useGoals();
  const { data: currentMealPlan } = useMealPlanData(0);
  const { currentProgram: currentExerciseProgram } = useExerciseProgramData(0, "home");

  // Generate AI insights based on real data
  const aiInsights = useMemo(() => {
    const insights = [];
    
    // Weight trend analysis
    if (weightEntries.length >= 3) {
      const recent = weightEntries.slice(0, 3);
      const weightTrend = recent[0].weight - recent[2].weight;
      
      if (Math.abs(weightTrend) > 1) {
        insights.push({
          type: weightTrend > 0 ? 'warning' : 'positive',
          title: weightTrend > 0 ? t('Weight Increase Detected') : t('Weight Loss Progress'),
          message: t(`You've ${weightTrend > 0 ? 'gained' : 'lost'} ${Math.abs(weightTrend).toFixed(1)}kg in recent entries. ${weightTrend > 0 ? 'Consider reviewing your meal plan.' : 'Great progress towards your goal!'}`),
          icon: weightTrend > 0 ? TrendingUp : TrendingDown,
          priority: 'high'
        });
      }
    }

    // Goal progress analysis
    const activeGoals = goals.filter(goal => goal.status === 'active');
    const overachievingGoals = activeGoals.filter(goal => {
      if (!goal.target_value) return false;
      const progress = (goal.current_value / goal.target_value) * 100;
      return progress >= 90;
    });

    if (overachievingGoals.length > 0) {
      insights.push({
        type: 'positive',
        title: t('Exceptional Goal Progress'),
        message: t(`You're excelling at ${overachievingGoals.length} goal(s)! Consider setting more challenging targets.`),
        icon: Target,
        priority: 'medium'
      });
    }

    // Exercise consistency analysis
    if (currentExerciseProgram?.daily_workouts) {
      const totalExercises = currentExerciseProgram.daily_workouts.reduce(
        (sum, workout) => sum + (workout.exercises?.length || 0), 0
      );
      const completedExercises = currentExerciseProgram.daily_workouts.reduce(
        (sum, workout) => sum + (workout.exercises?.filter(ex => ex.completed).length || 0), 0
      );
      
      const completionRate = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
      
      if (completionRate < 50) {
        insights.push({
          type: 'warning',
          title: t('Low Exercise Completion'),
          message: t(`Your exercise completion rate is ${Math.round(completionRate)}%. Try shorter workouts or adjust your schedule.`),
          icon: Activity,
          priority: 'high'
        });
      } else if (completionRate > 80) {
        insights.push({
          type: 'positive',
          title: t('Outstanding Exercise Consistency'),
          message: t(`${Math.round(completionRate)}% completion rate! You're building excellent habits.`),
          icon: Activity,
          priority: 'low'
        });
      }
    }

    // Nutrition pattern analysis
    if (currentMealPlan?.dailyMeals) {
      const avgCalories = currentMealPlan.dailyMeals.reduce(
        (sum, meal) => sum + (meal.calories || 0), 0
      ) / 7;
      
      const avgProtein = currentMealPlan.dailyMeals.reduce(
        (sum, meal) => sum + (meal.protein || 0), 0
      ) / 7;

      if (avgCalories < 1200) {
        insights.push({
          type: 'warning',
          title: t('Low Caloric Intake'),
          message: t(`Your average daily intake is ${Math.round(avgCalories)} calories. Consider consulting a nutritionist.`),
          icon: TrendingDown,
          priority: 'high'
        });
      }

      if (avgProtein < 50) {
        insights.push({
          type: 'tip',
          title: t('Increase Protein Intake'),
          message: t(`Your average protein intake is ${Math.round(avgProtein)}g. Aim for 0.8-1g per kg of body weight.`),
          icon: Target,
          priority: 'medium'
        });
      }
    }

    // If no specific insights, provide general encouragement
    if (insights.length === 0) {
      insights.push({
        type: 'positive',
        title: t('Steady Progress'),
        message: t('You\'re maintaining consistent habits! Keep tracking your progress for better insights.'),
        icon: Brain,
        priority: 'low'
      });
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [weightEntries, goals, currentMealPlan, currentExerciseProgram, t]);

  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-50 text-green-800 border-green-200';
      case 'warning': return 'bg-red-50 text-red-800 border-red-200';
      case 'tip': return 'bg-blue-50 text-blue-800 border-blue-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            {t('AI-Powered Trend Analysis')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiInsights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getInsightStyle(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <Badge className={getPriorityBadge(insight.priority)}>
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-sm">{insight.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Data Quality Indicators */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {t('Data Quality & Recommendations')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-800">{weightEntries.length}</div>
              <div className="text-sm text-blue-600">{t('Weight Entries')}</div>
              {weightEntries.length < 5 && (
                <div className="text-xs text-blue-500 mt-1">{t('Add more for better trends')}</div>
              )}
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-800">{goals.length}</div>
              <div className="text-sm text-purple-600">{t('Active Goals')}</div>
              {goals.length === 0 && (
                <div className="text-xs text-purple-500 mt-1">{t('Set goals for personalized insights')}</div>
              )}
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-800">
                {currentMealPlan ? '✓' : '✗'}
              </div>
              <div className="text-sm text-green-600">{t('Meal Plan Active')}</div>
              {!currentMealPlan && (
                <div className="text-xs text-green-500 mt-1">{t('Generate a meal plan')}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendAnalysis;
