
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Target, Activity } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface WorkoutSummaryData {
  totalExercises: number;
  completedExercises: number;
  totalDuration: number; // in minutes
  totalSets: number;
  completedSets: number;
  caloriesBurned?: number;
}

interface CompactWorkoutSummaryProps {
  data: WorkoutSummaryData;
  workoutDate: Date;
}

const CompactWorkoutSummary = ({ data, workoutDate }: CompactWorkoutSummaryProps) => {
  const { t } = useI18n();

  const completionRate = (data.completedExercises / data.totalExercises) * 100;
  const setCompletionRate = (data.completedSets / data.totalSets) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            {t('exercise:workoutSummary')}
          </div>
          <Badge variant={completionRate === 100 ? 'default' : 'secondary'}>
            {Math.round(completionRate)}% {t('exercise:complete')}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Exercises */}
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-lg font-bold text-blue-900">
              {data.completedExercises}/{data.totalExercises}
            </div>
            <div className="text-xs text-blue-700">
              {t('exercise:exercises')}
            </div>
          </div>

          {/* Duration */}
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Clock className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-lg font-bold text-green-900">
              {data.totalDuration}m
            </div>
            <div className="text-xs text-green-700">
              {t('exercise:duration')}
            </div>
          </div>

          {/* Sets */}
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Target className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-lg font-bold text-purple-900">
              {data.completedSets}/{data.totalSets}
            </div>
            <div className="text-xs text-purple-700">
              {t('exercise:sets')}
            </div>
          </div>

          {/* Calories */}
          {data.caloriesBurned && (
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Activity className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <div className="text-lg font-bold text-orange-900">
                {data.caloriesBurned}
              </div>
              <div className="text-xs text-orange-700">
                {t('exercise:calories')}
              </div>
            </div>
          )}
        </div>

        {/* Date */}
        <div className="text-center text-sm text-gray-600">
          {t('exercise:workoutDate')}: {workoutDate.toLocaleDateString()}
        </div>

        {/* Completion Message */}
        {completionRate === 100 && (
          <div className="text-center p-3 bg-green-100 rounded-lg">
            <p className="text-green-800 font-medium">
              🎉 {t('exercise:congratulations')}
            </p>
            <p className="text-green-700 text-sm">
              {t('exercise:workoutCompleted')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactWorkoutSummary;
