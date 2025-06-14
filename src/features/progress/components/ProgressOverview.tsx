
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Scale, Calendar, Activity, Utensils } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useWeightTracking } from "@/features/dashboard/hooks/useWeightTracking";
import { useGoals } from "@/features/dashboard/hooks/useGoals";
import { useFoodTracking } from "@/features/food-tracker/hooks/useFoodTracking";

export const ProgressOverview = () => {
  const { profile } = useProfile();
  const { goals } = useGoals();
  const { entries: weightEntries } = useWeightTracking();
  const { getTodaysConsumption, getNutritionSummary } = useFoodTracking();

  // Calculate overall progress metrics
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const totalGoals = goals.length;
  const goalsProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  // Weight progress
  const currentWeight = weightEntries?.[0]?.weight || profile?.weight || 0;
  const weightEntryCount = weightEntries?.length || 0;
  const weightProgress = Math.min((weightEntryCount / 30) * 100, 100); // 30 days target

  // Nutrition progress
  const todayConsumption = getTodaysConsumption();
  const todayNutrition = getNutritionSummary();
  const nutritionProgress = todayConsumption.length > 0 ? 
    Math.min((todayNutrition.totalCalories / 2200) * 100, 100) : 0;

  const progressMetrics = [
    {
      title: 'Goals Achievement',
      value: `${completedGoals}/${totalGoals}`,
      progress: goalsProgress,
      icon: Target,
      color: 'blue',
      description: totalGoals === 0 ? 'No goals set' : `${Math.round(goalsProgress)}% completed`
    },
    {
      title: 'Weight Tracking',
      value: currentWeight > 0 ? `${currentWeight.toFixed(1)} kg` : 'Not set',
      progress: weightProgress,
      icon: Scale,
      color: 'green',
      description: `${weightEntryCount} entries logged`
    },
    {
      title: 'Nutrition Today',
      value: `${Math.round(todayNutrition.totalCalories)} kcal`,
      progress: nutritionProgress,
      icon: Utensils,
      color: 'orange',
      description: `${todayConsumption.length} items logged`
    },
    {
      title: 'Weekly Consistency',
      value: '75%',
      progress: 75,
      icon: Activity,
      color: 'purple',
      description: 'Activity streak'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {progressMetrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${metric.color}-500 rounded-xl flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">{metric.value}</p>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{metric.title}</span>
                  <span className="text-sm text-gray-500">{Math.round(metric.progress)}%</span>
                </div>
                <Progress value={metric.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
