
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, Target, TrendingUp, Clock, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FitnessProgressSectionProps {
  // Component props
}

export const FitnessProgressSection = () => {
  const { t } = useLanguage();

  // Mock data - replace with actual data from hooks
  const mockData = {
    workoutsCompleted: 15,
    totalWorkouts: 20,
    weeklyGoal: 4,
    currentStreak: 3
  };

  const progressPercentage = (mockData.workoutsCompleted / mockData.totalWorkouts) * 100;

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-600" />
          Fitness Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white/70 rounded-lg">
            <div className="text-lg font-bold text-green-600">{mockData.workoutsCompleted}</div>
            <div className="text-xs text-green-600">Completed</div>
          </div>
          <div className="text-center p-3 bg-white/70 rounded-lg">
            <div className="text-lg font-bold text-orange-600">{mockData.totalWorkouts - mockData.workoutsCompleted}</div>
            <div className="text-xs text-orange-600">Remaining</div>
          </div>
          <div className="text-center p-3 bg-white/70 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{mockData.weeklyGoal}</div>
            <div className="text-xs text-blue-600">Weekly Goal</div>
          </div>
          <div className="text-center p-3 bg-white/70 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{mockData.currentStreak}</div>
            <div className="text-xs text-purple-600">Day Streak</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};
