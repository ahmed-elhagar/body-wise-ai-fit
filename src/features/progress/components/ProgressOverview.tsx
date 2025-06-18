
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Trophy, Activity, Calendar, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProgressOverviewProps {
  // Component props
}

export const ProgressOverview = () => {
  const { t } = useLanguage();

  // Mock data - replace with actual data from hooks
  const mockData = {
    totalGoals: 5,
    completedGoals: 2,
    activeWorkouts: 3,
    weeklyProgress: 75
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Target className="w-5 h-5" />
            Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {mockData.completedGoals}/{mockData.totalGoals}
          </div>
          <div className="text-sm text-blue-600">Completed</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Activity className="w-5 h-5" />
            Workouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 mb-1">
            {mockData.activeWorkouts}
          </div>
          <div className="text-sm text-green-600">This Week</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <TrendingUp className="w-5 h-5" />
            Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {mockData.weeklyProgress}%
          </div>
          <div className="text-sm text-purple-600">Weekly</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <Trophy className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600 mb-1">
            3
          </div>
          <div className="text-sm text-orange-600">Earned</div>
        </CardContent>
      </Card>
    </div>
  );
};
