
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Target, Play } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface TodaysWorkoutCardProps {
  workout?: {
    name: string;
    duration: number;
    exercises: number;
    difficulty: string;
  };
  onStartWorkout: () => void;
}

export const TodaysWorkoutCard = ({ workout, onStartWorkout }: TodaysWorkoutCardProps) => {
  const { t, isRTL } = useI18n();

  if (!workout) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('exercise:noWorkoutToday') || 'No Workout Today'}
          </h3>
          <p className="text-gray-600">
            {t('exercise:restDayMessage') || 'Today is your rest day. Take time to recover!'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Target className="w-5 h-5 text-green-600" />
          {t('exercise:todaysWorkout') || "Today's Workout"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{workout.name}</h3>
          <div className={`flex items-center gap-4 mt-2 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className="w-4 h-4" />
              <span>{workout.duration} {t('exercise:minutes') || 'min'}</span>
            </div>
            <span>{workout.exercises} {t('exercise:exercises') || 'exercises'}</span>
            <span className="capitalize">{workout.difficulty}</span>
          </div>
        </div>
        
        <Button onClick={onStartWorkout} className="w-full bg-green-600 hover:bg-green-700">
          <Play className="w-4 h-4 mr-2" />
          {t('exercise:startWorkout') || 'Start Workout'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TodaysWorkoutCard;
