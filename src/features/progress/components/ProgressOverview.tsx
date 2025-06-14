
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Activity, 
  Scale, 
  Utensils,
  Calendar,
  Trophy,
  Zap
} from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useMealPlanState } from "@/features/meal-plan/hooks";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useExercisePrograms } from "@/hooks/useExercisePrograms";
import { useGoals } from "@/hooks/useGoals";

export const ProgressOverview = () => {
  const { isRTL } = useI18n();
  const { currentWeekPlan, totalCalories, targetDayCalories } = useMealPlanState();
  const { weightEntries } = useWeightTracking();
  const { programs } = useExercisePrograms();
  const { goals } = useGoals();

  // Calculate metrics
  const calorieProgress = targetDayCalories > 0 ? Math.min(100, (totalCalories / targetDayCalories) * 100) : 0;
  const weightProgress = weightEntries?.length >= 2 ? 
    Math.abs(((weightEntries[0]?.weight - weightEntries[1]?.weight) / weightEntries[1]?.weight) * 100) : 0;
  const activePrograms = programs?.filter(p => p.status === 'active')?.length || 0;
  const completedGoals = goals?.filter(g => g.status === 'completed')?.length || 0;
  const totalGoals = goals?.length || 0;
  const goalProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const overviewCards = [
    {
      title: "Daily Calories",
      value: `${Math.round(calorieProgress)}%`,
      description: `${totalCalories} / ${targetDayCalories} cal`,
      progress: calorieProgress,
      icon: Utensils,
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50",
      trend: calorieProgress >= 90 ? "up" : calorieProgress >= 70 ? "stable" : "down"
    },
    {
      title: "Weight Progress",
      value: weightEntries?.length > 0 ? `${weightEntries[0]?.weight}kg` : "No data",
      description: weightEntries?.length >= 2 ? 
        `${weightProgress > 0 ? '+' : ''}${weightProgress.toFixed(1)}% change` : "Start tracking",
      progress: Math.min(weightProgress * 10, 100),
      icon: Scale,
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50",
      trend: weightEntries?.length >= 2 && weightEntries[0]?.weight < weightEntries[1]?.weight ? "down" : "up"
    },
    {
      title: "Active Programs",
      value: activePrograms.toString(),
      description: `${programs?.length || 0} total programs`,
      progress: programs?.length > 0 ? (activePrograms / programs.length) * 100 : 0,
      icon: Activity,
      color: "from-purple-500 to-violet-600",
      bgColor: "from-purple-50 to-violet-50",
      trend: activePrograms > 0 ? "up" : "stable"
    },
    {
      title: "Goals Completed",
      value: `${completedGoals}/${totalGoals}`,
      description: `${Math.round(goalProgress)}% achievement rate`,
      progress: goalProgress,
      icon: Target,
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-50 to-red-50",
      trend: goalProgress >= 75 ? "up" : goalProgress >= 50 ? "stable" : "down"
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Zap className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewCards.map((card, index) => {
        const IconComponent = card.icon;
        
        return (
          <Card 
            key={index}
            className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-[1.02] overflow-hidden relative"
          >
            {/* Gradient border effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`}>
              <div className="absolute inset-[1px] bg-white rounded-xl" />
            </div>
            
            <CardContent className="relative p-6 z-10">
              <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {getTrendIcon(card.trend)}
                </div>
              </div>
              
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                  {card.title}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-gray-900">{card.value}</span>
                    <span className="text-sm text-gray-500">{Math.round(card.progress)}%</span>
                  </div>
                  
                  <Progress 
                    value={card.progress} 
                    className="h-2 bg-gray-100"
                  />
                  
                  <p className="text-gray-600 text-sm">
                    {card.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
