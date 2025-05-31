
import { Button } from "@/components/ui/button";
import { Apple, Dumbbell } from "lucide-react";

interface DashboardWelcomeHeaderProps {
  userName: string;
  onViewMealPlan: () => void;
  onViewExercise: () => void;
}

export const DashboardWelcomeHeader = ({ userName, onViewMealPlan, onViewExercise }: DashboardWelcomeHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Here's your fitness journey overview for today
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onViewMealPlan} className="bg-fitness-gradient text-white" size="sm">
          <Apple className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">View </span>Meal Plan
        </Button>
        <Button onClick={onViewExercise} variant="outline" size="sm">
          <Dumbbell className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Start </span>Workout
        </Button>
      </div>
    </div>
  );
};
