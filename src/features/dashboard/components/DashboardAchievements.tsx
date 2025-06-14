
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

interface DashboardAchievementsProps {
  profile: any;
  currentMealPlan: any;
  currentExerciseProgram: any;
}

export const DashboardAchievements = ({ profile, currentMealPlan, currentExerciseProgram }: DashboardAchievementsProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="h-5 w-5 text-yellow-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Profile Completion</span>
            <Badge variant="secondary">
              {profile ? "Complete" : "Incomplete"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Meal Plans Created</span>
            <Badge variant="secondary">
              {currentMealPlan ? "1+" : "0"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Workouts Generated</span>
            <Badge variant="secondary">
              {currentExerciseProgram ? "1+" : "0"}
            </Badge>
          </div>
        </div>
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Keep going! Every step counts towards your fitness goals.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
