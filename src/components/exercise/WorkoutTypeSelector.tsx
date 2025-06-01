
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface WorkoutTypeSelectorProps {
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
}

export const WorkoutTypeSelector = ({
  workoutType,
  setWorkoutType
}: WorkoutTypeSelectorProps) => {
  const { t } = useI18n();

  return (
    <Card className="p-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
      <div className="flex items-center gap-2">
        <Button
          variant={workoutType === "home" ? "default" : "ghost"}
          onClick={() => setWorkoutType("home")}
          className={`flex-1 h-12 rounded-xl font-semibold transition-all duration-300 ${
            workoutType === "home" 
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl" 
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Home className="w-5 h-5 mr-2" />
          {t('exercise.home')}
        </Button>
        
        <Button
          variant={workoutType === "gym" ? "default" : "ghost"}
          onClick={() => setWorkoutType("gym")}
          className={`flex-1 h-12 rounded-xl font-semibold transition-all duration-300 ${
            workoutType === "gym" 
              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg hover:shadow-xl" 
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Building2 className="w-5 h-5 mr-2" />
          {t('exercise.gym')}
        </Button>
      </div>
    </Card>
  );
};
