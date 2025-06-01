
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";
import { 
  TrendingUp, 
  Target, 
  Flame, 
  Dumbbell, 
  Calendar,
  ArrowRight,
  Trophy
} from "lucide-react";

const EnhancedDashboardStats = () => {
  const { t, isRTL } = useI18n();
  const navigate = useNavigate();

  // Mock data - in real app this would come from hooks
  const stats = {
    weeklyProgress: 78,
    todaysCalories: 1847,
    targetCalories: 2200,
    workoutsThisWeek: 4,
    targetWorkouts: 5,
    currentStreak: 12
  };

  const calorieProgress = (stats.todaysCalories / stats.targetCalories) * 100;
  const workoutProgress = (stats.workoutsThisWeek / stats.targetWorkouts) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Weekly Progress */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <Badge className="bg-green-100 text-green-700 border-green-200">
            {t('This Week')}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm font-medium text-gray-700">{t('Overall Progress')}</span>
              <span className="text-2xl font-bold text-green-700">{stats.weeklyProgress}%</span>
            </div>
            <Progress value={stats.weeklyProgress} className="h-2 bg-green-200" />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/progress')}
            className="w-full justify-between text-green-700 hover:text-green-800 hover:bg-green-100"
          >
            {t('View Details')}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Today's Nutrition */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-100 border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
            {t('Today')}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm font-medium text-gray-700">{t('Calories')}</span>
              <span className="text-2xl font-bold text-orange-700">
                {stats.todaysCalories}<span className="text-sm font-normal">/{stats.targetCalories}</span>
              </span>
            </div>
            <Progress value={calorieProgress} className="h-2 bg-orange-200" />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/food-tracker')}
            className="w-full justify-between text-orange-700 hover:text-orange-800 hover:bg-orange-100"
          >
            {t('Log Food')}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Weekly Workouts */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
            {t('This Week')}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm font-medium text-gray-700">{t('Workouts')}</span>
              <span className="text-2xl font-bold text-purple-700">
                {stats.workoutsThisWeek}<span className="text-sm font-normal">/{stats.targetWorkouts}</span>
              </span>
            </div>
            <Progress value={workoutProgress} className="h-2 bg-purple-200" />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/exercise')}
            className="w-full justify-between text-purple-700 hover:text-purple-800 hover:bg-purple-100"
          >
            {t('Start Workout')}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Current Streak */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200 md:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            {t('Streak')}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm font-medium text-gray-700">{t('Active Days')}</span>
              <span className="text-2xl font-bold text-yellow-700">{stats.currentStreak}</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    i < (stats.currentStreak % 7) ? 'bg-yellow-500' : 'bg-yellow-200'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/achievements')}
            className="w-full justify-between text-yellow-700 hover:text-yellow-800 hover:bg-yellow-100"
          >
            {t('View Achievements')}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedDashboardStats;
