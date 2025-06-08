
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Home, Dumbbell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkoutTypeToggleProps {
  workoutType: "home" | "gym";
  onWorkoutTypeChange: (type: "home" | "gym") => void;
}

export const WorkoutTypeToggle = ({ 
  workoutType, 
  onWorkoutTypeChange 
}: WorkoutTypeToggleProps) => {
  const { t } = useLanguage();

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">
            {t('exercise.workoutType', 'Workout Type')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('exercise.chooseWorkoutType', 'Choose your preferred workout environment')}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={workoutType === "home" ? "default" : "outline"}
            size="sm"
            onClick={() => onWorkoutTypeChange("home")}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t('exercise.home', 'Home')}
          </Button>
          
          <Button
            variant={workoutType === "gym" ? "default" : "outline"}
            size="sm"
            onClick={() => onWorkoutTypeChange("gym")}
            className="flex items-center gap-2"
          >
            <Dumbbell className="w-4 h-4" />
            {t('exercise.gym', 'Gym')}
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <Badge variant="secondary" className="text-xs">
          {workoutType === "home" 
            ? t('exercise.homeWorkoutSelected', 'Home workout selected') 
            : t('exercise.gymWorkoutSelected', 'Gym workout selected')
          }
        </Badge>
      </div>
    </Card>
  );
};
