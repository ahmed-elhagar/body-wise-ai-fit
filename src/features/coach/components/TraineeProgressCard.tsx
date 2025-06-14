
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, TrendingUp, User, Activity } from "lucide-react";

interface TraineeProgressCardProps {
  trainee: any;
  onChatClick: () => void;
  onProgressClick: () => void;
}

const TraineeProgressCard = ({ trainee, onChatClick, onProgressClick }: TraineeProgressCardProps) => {
  const traineeProfile = trainee.trainee_profile;
  const traineeName = `${traineeProfile?.first_name || 'Unknown'} ${traineeProfile?.last_name || 'User'}`;
  const generationsRemaining = traineeProfile?.ai_generations_remaining || 0;
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              {(traineeProfile?.first_name?.[0] || 'U').toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{traineeName}</h3>
              <p className="text-sm text-gray-600">{traineeProfile?.email || 'No email'}</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <Badge variant={generationsRemaining > 0 ? "default" : "secondary"}>
              {generationsRemaining} credits
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-600">Goal:</span>
            <p className="font-medium">{traineeProfile?.fitness_goal || 'Not set'}</p>
          </div>
          <div>
            <span className="text-gray-600">Activity:</span>
            <p className="font-medium">{traineeProfile?.activity_level || 'Not set'}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onChatClick}
            className="flex-1"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Chat
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onProgressClick}
            className="flex-1"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TraineeProgressCard;
