
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkoutTypeSelectorProps {
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
}

export const WorkoutTypeSelector = ({
  workoutType,
  setWorkoutType
}: WorkoutTypeSelectorProps) => {
  const { t } = useLanguage();

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant={workoutType === "home" ? "default" : "outline"}
            onClick={() => setWorkoutType("home")}
            className={`${workoutType === "home" ? "bg-health-primary hover:bg-health-primary/90" : ""}`}
          >
            <Home className="w-4 h-4 mr-2" />
            {t('exercise.home')}
          </Button>
          <Button
            variant={workoutType === "gym" ? "default" : "outline"}
            onClick={() => setWorkoutType("gym")}
            className={`${workoutType === "gym" ? "bg-health-primary hover:bg-health-primary/90" : ""}`}
          >
            <Building2 className="w-4 h-4 mr-2" />
            {t('exercise.gym')}
          </Button>
        </div>
      </div>
    </Card>
  );
};
