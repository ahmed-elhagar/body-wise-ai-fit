
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, MessageSquare, Calendar } from 'lucide-react';

interface TraineeProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  fitness_goal?: string;
}

interface TraineeCardProps {
  trainee: {
    id: string;
    assigned_at: string;
    notes?: string;
    trainee_profile: TraineeProfile;
  };
  onMessage?: (traineeId: string) => void;
  onViewProgress?: (traineeId: string) => void;
}

const TraineeCard: React.FC<TraineeCardProps> = ({
  trainee,
  onMessage,
  onViewProgress
}) => {
  const { trainee_profile: profile } = trainee;
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="w-5 h-5" />
          {fullName || 'Unknown User'}
        </CardTitle>
        {profile.fitness_goal && (
          <Badge variant="secondary" className="w-fit">
            {profile.fitness_goal}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            Assigned: {new Date(trainee.assigned_at).toLocaleDateString()}
          </div>
          
          {trainee.notes && (
            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
              {trainee.notes}
            </p>
          )}
          
          <div className="flex gap-2">
            {onMessage && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMessage(trainee.id)}
                className="flex items-center gap-1"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </Button>
            )}
            {onViewProgress && (
              <Button
                size="sm"
                onClick={() => onViewProgress(trainee.id)}
              >
                View Progress
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TraineeCard;
