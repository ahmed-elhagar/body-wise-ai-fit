
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, Clock, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseProgramSelectorProps {
  currentProgram: any;
  workoutType: "home" | "gym";
  onCreateProgram?: () => void;
}

export const ExerciseProgramSelector = ({ 
  currentProgram, 
  workoutType,
  onCreateProgram
}: ExerciseProgramSelectorProps) => {
  const { t } = useLanguage();

  if (!currentProgram) {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('exercise.noProgram', 'No Exercise Program')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('exercise.noProgramDescription', 'Create a personalized exercise program to get started')}
            </p>
          </div>

          {onCreateProgram && (
            <Button onClick={onCreateProgram} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {t('exercise.createProgram', 'Create Program')}
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">
              {currentProgram.program_name}
            </h3>
            <Badge variant="outline" className="text-xs">
              Week {currentProgram.current_week}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {currentProgram.difficulty_level}
            </span>
            
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {workoutType === "home" ? t('exercise.home', 'Home') : t('exercise.gym', 'Gym')}
            </span>
            
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {currentProgram.daily_workouts_count || 7} days
            </span>
          </div>
        </div>

        <Badge 
          className={workoutType === "gym" ? "bg-blue-500" : "bg-green-500"}
        >
          {workoutType === "gym" ? "🏋️ Gym" : "🏠 Home"}
        </Badge>
      </div>
    </Card>
  );
};
