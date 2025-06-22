
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Activity } from 'lucide-react';

interface TraineeProgressViewProps {
  traineeId: string;
}

const TraineeProgressView: React.FC<TraineeProgressViewProps> = ({ traineeId }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Workout Completion</span>
                <span>75%</span>
              </div>
              <Progress value={75} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Nutrition Goals</span>
                <span>60%</span>
              </div>
              <Progress value={60} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>68%</span>
              </div>
              <Progress value={68} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No recent activity data available.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TraineeProgressView;
