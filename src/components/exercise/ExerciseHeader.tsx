import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Dumbbell, Target } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface ExerciseHeaderProps {
  selectedDay: number;
  workoutType: "home" | "gym";
  currentProgram?: any;
}

export const ExerciseHeader = ({ selectedDay, workoutType, currentProgram }: ExerciseHeaderProps) => {
  const { t } = useI18n();

  const dayNames = [
    t('monday'), t('tuesday'), t('wednesday'), t('thursday'),
    t('friday'), t('saturday'), t('sunday')
  ];

  const currentDayName = dayNames[selectedDay - 1];

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{t('exercise.todaysWorkout')}</h3>
          <p className="text-sm text-gray-600">
            {currentDayName}, {workoutType === "home" ? t('exercise.homeWorkout') : t('exercise.gymWorkout')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-white/80">
            {currentProgram?.difficulty_level || 'Beginner'}
          </Badge>
          <Badge variant="outline" className="bg-white/80">
            {currentProgram?.estimated_duration || '30'} min
          </Badge>
        </div>
      </div>
    </Card>
  );
};
