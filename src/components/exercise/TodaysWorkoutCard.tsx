import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Play } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";

interface TodaysWorkoutCardProps {
  currentWorkout: any;
  currentProgram: any;
  onStartWorkout: () => void;
}

export const TodaysWorkoutCard = ({ 
  currentWorkout, 
  currentProgram, 
  onStartWorkout
}: TodaysWorkoutCardProps) => {
  const { t } = useI18n();

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t('exercise.todaysWorkout')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-800">{currentWorkout?.workout_name || 'Rest Day'}</h4>
          <p className="text-sm text-gray-600">{currentProgram?.difficulty_level}</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Duration</span>
            <span className="text-sm font-medium">{currentWorkout?.estimated_duration || 0} min</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Calories</span>
            <span className="text-sm font-medium">{currentWorkout?.estimated_calories || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Muscle Groups</span>
            <span className="text-sm font-medium">{currentWorkout?.muscle_groups?.join(', ') || 'Full Body'}</span>
          </div>
        </div>

        {currentWorkout && (
          <Button 
            onClick={onStartWorkout}
            className="w-full bg-fitness-gradient hover:opacity-90 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Workout
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

