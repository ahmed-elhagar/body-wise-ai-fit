
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Calendar, Award } from "lucide-react";

interface ProgressTrackerProps {
  weeklyProgress: number;
  monthlyProgress: number;
  streakDays: number;
  totalWorkouts: number;
}

export const ProgressTracker = ({
  weeklyProgress,
  monthlyProgress,
  streakDays,
  totalWorkouts
}: ProgressTrackerProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weekly Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">This Week</span>
              <span className="text-sm text-gray-600">{weeklyProgress}%</span>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
          </div>

          {/* Monthly Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">This Month</span>
              <span className="text-sm text-gray-600">{monthlyProgress}%</span>
            </div>
            <Progress value={monthlyProgress} className="h-2" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">{streakDays}</p>
              <p className="text-sm text-blue-700">Day Streak</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-900">{totalWorkouts}</p>
              <p className="text-sm text-green-700">Total Workouts</p>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recent Achievements</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">7-Day Streak</Badge>
              <Badge variant="secondary">First Workout</Badge>
              <Badge variant="secondary">Consistency King</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
