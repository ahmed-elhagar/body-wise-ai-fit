
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, User, Target, Activity, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CoachTraineeRelationship } from "@/features/coach/types/coach.types";

interface TraineeCardProps {
  trainee: CoachTraineeRelationship;
  onMessage?: () => void;
  onViewDetails?: () => void;
}

const TraineeCard = ({ trainee, onMessage, onViewDetails }: TraineeCardProps) => {
  const { t } = useLanguage();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getCompletionColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getActivityColor = (remaining: number) => {
    if (remaining > 3) return 'bg-green-100 text-green-800';
    if (remaining > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const traineeProfile = trainee.trainee_profile;
  const fullName = traineeProfile 
    ? `${traineeProfile.first_name || ''} ${traineeProfile.last_name || ''}`.trim()
    : 'Unknown User';
  
  const profileScore = traineeProfile?.profile_completion_score || 0;
  const generationsRemaining = traineeProfile?.ai_generations_remaining || 0;

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getInitials(traineeProfile?.first_name, traineeProfile?.last_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{fullName}</CardTitle>
            <p className="text-sm text-gray-600 truncate">{traineeProfile?.email}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Profile Completion */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{t('Profile')}</span>
          </div>
          <Badge className={getCompletionColor(profileScore)}>
            {profileScore}% {t('Complete')}
          </Badge>
        </div>

        {/* AI Generations */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{t('AI Credits')}</span>
          </div>
          <Badge className={getActivityColor(generationsRemaining)}>
            {generationsRemaining} {t('remaining')}
          </Badge>
        </div>

        {/* Fitness Goal */}
        {traineeProfile?.fitness_goal && (
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{traineeProfile.fitness_goal}</span>
          </div>
        )}

        {/* Assignment Date */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {t('Assigned')}: {new Date(trainee.assigned_at).toLocaleDateString()}
          </span>
        </div>

        {/* Notes */}
        {trainee.notes && (
          <div className="p-2 bg-gray-50 rounded text-sm">
            <strong>{t('Notes')}:</strong> {trainee.notes}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onMessage}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {t('Message')}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onViewDetails}
          >
            <User className="h-4 w-4 mr-2" />
            {t('Details')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TraineeCard;
