
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp } from 'lucide-react';
import { CoachTraineeRelationship } from '@/features/coach/types/coach.types';

interface TraineeProgressOverviewProps {
  trainees: CoachTraineeRelationship[];
  onViewAllTrainees: () => void;
}

const TraineeProgressOverview: React.FC<TraineeProgressOverviewProps> = ({
  trainees,
  onViewAllTrainees
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Trainee Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trainees.slice(0, 3).map((trainee) => (
            <div key={trainee.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">
                  {trainee.trainee_profile.first_name} {trainee.trainee_profile.last_name}
                </p>
                <p className="text-sm text-gray-600">
                  Profile: {trainee.trainee_profile.profile_completion_score || 0}% complete
                </p>
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
          ))}
          
          {trainees.length > 3 && (
            <Button variant="outline" onClick={onViewAllTrainees} className="w-full">
              View All Trainees ({trainees.length})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TraineeProgressOverview;
