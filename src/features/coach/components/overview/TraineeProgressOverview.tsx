
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp } from 'lucide-react';

interface TraineeProgress {
  id: string;
  name: string;
  overallProgress: number;
  workoutCompletion: number;
  nutritionAdherence: number;
}

interface TraineeProgressOverviewProps {
  trainees?: TraineeProgress[];
}

const TraineeProgressOverview: React.FC<TraineeProgressOverviewProps> = ({
  trainees = []
}) => {
  if (trainees.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Trainee Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No trainees assigned yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Trainee Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trainees.slice(0, 3).map((trainee) => (
            <div key={trainee.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{trainee.name}</span>
                <span className="text-sm text-gray-600">
                  {trainee.overallProgress}% overall
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Workouts</span>
                  <span>{trainee.workoutCompletion}%</span>
                </div>
                <Progress value={trainee.workoutCompletion} className="h-2" />
                
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Nutrition</span>
                  <span>{trainee.nutritionAdherence}%</span>
                </div>
                <Progress value={trainee.nutritionAdherence} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TraineeProgressOverview;
