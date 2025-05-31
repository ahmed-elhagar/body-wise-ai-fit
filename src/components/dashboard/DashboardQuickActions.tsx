
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Apple, Dumbbell, Target, Users } from "lucide-react";

interface DashboardQuickActionsProps {
  handleViewMealPlan: () => void;
  handleViewExercise: () => void;
  handleViewWeight: () => void;
  handleViewProgress: () => void;
  handleViewProfile: () => void;
}

export const DashboardQuickActions = ({
  handleViewMealPlan,
  handleViewExercise,
  handleViewWeight,
  handleViewProgress,
  handleViewProfile
}: DashboardQuickActionsProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Button onClick={handleViewMealPlan} variant="outline" size="sm" className="justify-start">
            <Apple className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Generate </span>Meal Plan
          </Button>
          <Button onClick={handleViewExercise} variant="outline" size="sm" className="justify-start">
            <Dumbbell className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Create </span>Exercise
          </Button>
          <Button onClick={handleViewWeight} variant="outline" size="sm" className="justify-start">
            <Target className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Track </span>Weight
          </Button>
          <Button onClick={handleViewProgress} variant="outline" size="sm" className="justify-start">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">View </span>Progress
          </Button>
          <Button onClick={handleViewProfile} variant="outline" size="sm" className="justify-start">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Update </span>Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
