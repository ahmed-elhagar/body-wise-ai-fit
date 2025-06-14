
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Calendar, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface OptimizedExerciseProgressProps {
  progressMetrics: any;
  weekStructure: any[];
}

export const OptimizedExerciseProgress = ({ progressMetrics, weekStructure }: OptimizedExerciseProgressProps) => {
  const { t } = useLanguage();

  const completedDays = weekStructure.filter(day => day.isCompleted).length;
  const totalDays = weekStructure.length;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold">{t('Progress Overview')}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{progressMetrics.completedWorkouts}</div>
          <div className="text-sm text-gray-600">{t('Workouts Completed')}</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{completedDays}</div>
          <div className="text-sm text-gray-600">{t('Days Completed')}</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{progressMetrics.progressPercentage}%</div>
          <div className="text-sm text-gray-600">{t('Overall Progress')}</div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{t('Weekly Progress')}</span>
            <span className="text-sm text-gray-600">
              {progressMetrics.progressPercentage}%
            </span>
          </div>
          <Progress value={progressMetrics.progressPercentage} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {t('This Week')}: {completedDays}/{totalDays} days
            </span>
          </div>
          
          <Badge className="bg-purple-100 text-purple-800">
            <Award className="w-3 h-3 mr-1" />
            {progressMetrics.progressPercentage >= 80 ? 'Excellent' : 
             progressMetrics.progressPercentage >= 60 ? 'Good' : 
             progressMetrics.progressPercentage >= 40 ? 'Fair' : 'Getting Started'}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default OptimizedExerciseProgress;
