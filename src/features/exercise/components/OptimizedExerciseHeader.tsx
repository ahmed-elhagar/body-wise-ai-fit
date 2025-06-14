
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Calendar, Target, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface OptimizedExerciseHeaderProps {
  program: any;
  progressMetrics: any;
  onGenerateNew: () => void;
}

export const OptimizedExerciseHeader = ({ program, progressMetrics, onGenerateNew }: OptimizedExerciseHeaderProps) => {
  const { t } = useLanguage();

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {program?.program_name || 'Exercise Program'}
            </h1>
            <p className="text-gray-600">
              {program?.difficulty_level} • {program?.workout_type} Training
            </p>
            
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Week {program?.week_number || 1}
              </Badge>
              
              <Badge variant="outline" className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {progressMetrics.completedWorkouts}/{progressMetrics.totalWorkouts} Workouts
              </Badge>
            </div>
          </div>
        </div>
        
        <Button onClick={onGenerateNew} className="bg-purple-600 hover:bg-purple-700">
          <Sparkles className="w-4 h-4 mr-2" />
          {t('Generate New')}
        </Button>
      </div>
    </Card>
  );
};

export default OptimizedExerciseHeader;
