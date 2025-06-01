import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";

interface WorkoutContentLayoutProps {
  children: React.ReactNode;
  workoutName: string;
  estimatedDuration: number;
  estimatedCalories: number;
  muscleGroups: string[];
}

export const WorkoutContentLayout = ({
  children,
  workoutName,
  estimatedDuration,
  estimatedCalories,
  muscleGroups
}: WorkoutContentLayoutProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{workoutName}</h3>
            <p className="text-sm text-gray-600">Today's Workout</p>
          </div>
          <Badge variant="outline" className="bg-white/80">
            Week 1 of 4
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-fitness-primary" />
            <span className="text-sm text-gray-600">
              {estimatedDuration} {t('exercise.minutes')}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-fitness-primary" />
            <span className="text-sm text-gray-600">
              {estimatedCalories} {t('exercise.calories')}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-fitness-primary" />
            <span className="text-sm text-gray-600">
              {muscleGroups.join(', ')}
            </span>
          </div>
        </div>
      </Card>
      
      {children}
    </div>
  );
};
