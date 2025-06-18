import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Activity,
  Target,
  MessageCircle,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TraineeProgressCardProps {
  trainee: any;
  onChatClick: (traineeId: string) => void;
  onProgressClick: (traineeId: string) => void;
  className?: string;
}

const TraineeProgressCard = ({ 
  trainee, 
  onChatClick, 
  onProgressClick, 
  className 
}: TraineeProgressCardProps) => {
  const profile = trainee.trainee_profile || {};
  const completionScore = profile.profile_completion_score || 0;
  const generationsRemaining = profile.ai_generations_remaining || 0;
  
  // Mock progress data - in real app this would come from backend
  const progressMetrics = {
    weeklyGoalCompletion: Math.floor(Math.random() * 100),
    workoutStreak: Math.floor(Math.random() * 14) + 1,
    lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    trend: Math.random() > 0.5 ? 'up' : 'down',
    weightChange: (Math.random() - 0.5) * 4 // -2 to +2 kg
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'UN';
  };

  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-200", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-sm">
                {getInitials(profile.first_name, profile.last_name)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {profile.first_name || 'Unknown'} {profile.last_name || 'User'}
              </h3>
              <p className="text-sm text-gray-500">
                {formatLastActivity(progressMetrics.lastActivity)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Profile Completion</span>
            <span className="text-sm text-gray-600">{completionScore}%</span>
          </div>
          <Progress value={completionScore} className="h-2" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-900">Weekly Goal</span>
            </div>
            <p className="text-lg font-bold text-blue-900">
              {progressMetrics.weeklyGoalCompletion}%
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-900">Streak</span>
            </div>
            <p className="text-lg font-bold text-green-900">
              {progressMetrics.workoutStreak} days
            </p>
          </div>
        </div>

        {/* Progress Trend */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            {progressMetrics.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm font-medium">Weight Trend</span>
          </div>
          <span className={cn(
            "text-sm font-bold",
            progressMetrics.weightChange > 0 ? "text-red-600" : "text-green-600"
          )}>
            {progressMetrics.weightChange > 0 ? '+' : ''}{progressMetrics.weightChange.toFixed(1)}kg
          </span>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {profile.fitness_goal || 'General Fitness'}
          </Badge>
          {generationsRemaining > 0 && (
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
              {generationsRemaining} AI credits left
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onChatClick(trainee.trainee_id)}
            className="flex-1"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Chat
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onProgressClick(trainee.trainee_id)}
            className="flex-1"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TraineeProgressCard;
