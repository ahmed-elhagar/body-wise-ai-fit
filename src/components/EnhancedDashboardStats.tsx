import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Flame, Dumbbell, Zap, Activity } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface EnhancedDashboardStatsProps {
  todaysCalories: number;
  targetCalories: number;
  exerciseStreak: number;
  weeklyGoal: number;
  proteinIntake: number;
  targetProtein: number;
}

const EnhancedDashboardStats = ({ todaysCalories, targetCalories, exerciseStreak, weeklyGoal, proteinIntake, targetProtein }: EnhancedDashboardStatsProps) => {
  const { t, isRTL } = useI18n();

  const calorieProgress = Math.min((todaysCalories / targetCalories) * 100, 100);
  const proteinProgress = Math.min((proteinIntake / targetProtein) * 100, 100);

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calorie Intake */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500" />
              <h4 className="text-sm font-medium text-gray-800">{t('Calories')}</h4>
            </div>
            <span className="text-sm text-gray-600">
              {todaysCalories} / {targetCalories} kcal
            </span>
          </div>
          <Progress value={calorieProgress} className="h-2" />
        </div>

        {/* Protein Intake */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <h4 className="text-sm font-medium text-gray-800">{t('Protein')}</h4>
            </div>
            <span className="text-sm text-gray-600">
              {proteinIntake} / {targetProtein} g
            </span>
          </div>
          <Progress value={proteinProgress} className="h-2" />
        </div>

        {/* Exercise Streak */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-blue-500" />
              <h4 className="text-sm font-medium text-gray-800">{t('Exercise Streak')}</h4>
            </div>
            <Badge variant="secondary" className="rounded-full">
              {exerciseStreak} {t('days')}
            </Badge>
          </div>
          <p className="text-xs text-gray-500">
            {t('Keep up the great work!')}
          </p>
        </div>

        {/* Weekly Goal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              <h4 className="text-sm font-medium text-gray-800">{t('Weekly Goal')}</h4>
            </div>
            <span className="text-sm font-medium text-gray-800">{weeklyGoal}%</span>
          </div>
          <Progress value={weeklyGoal} className="h-2" />
        </div>
      </div>
    </Card>
  );
};

export default EnhancedDashboardStats;
