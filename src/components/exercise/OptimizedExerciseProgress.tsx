
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface OptimizedExerciseProgressProps {
  progressMetrics: any;
  weekStructure: any[];
}

const OptimizedExerciseProgress = ({ progressMetrics, weekStructure }: OptimizedExerciseProgressProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Weekly Progress</span>
              <span>75%</span>
            </div>
            <Progress value={75} />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-semibold">12</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="font-semibold">4</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div>
              <div className="font-semibold">3</div>
              <div className="text-sm text-gray-600">Rest Days</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedExerciseProgress;
