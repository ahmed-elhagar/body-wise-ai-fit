
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Calendar, Ruler, Weight, Target, Activity, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CoachTraineeRelationship } from "@/features/coach/types/coach.types";

interface TraineeDetailsDialogProps {
  trainee: CoachTraineeRelationship | null;
  isOpen: boolean;
  onClose: () => void;
  onMessage?: () => void;
}

const TraineeDetailsDialog = ({ trainee, isOpen, onClose, onMessage }: TraineeDetailsDialogProps) => {
  const { t } = useLanguage();

  if (!trainee) return null;

  const traineeProfile = trainee.trainee_profile;
  const fullName = traineeProfile 
    ? `${traineeProfile.first_name || ''} ${traineeProfile.last_name || ''}`.trim()
    : 'Unknown User';

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getCompletionColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {getInitials(traineeProfile?.first_name, traineeProfile?.last_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{fullName}</h2>
              <p className="text-sm text-gray-600">{t('Trainee Details')}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('Basic Information')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{traineeProfile?.email || 'No email'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{t('Basic profile information')}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Fitness Information */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t('Fitness Information')}
            </h3>
            <div className="space-y-3">
              {traineeProfile?.fitness_goal && (
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('Fitness Goal')}</label>
                  <p className="text-sm text-gray-600">{traineeProfile.fitness_goal}</p>
                </div>
              )}
              {traineeProfile?.activity_level && (
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('Activity Level')}</label>
                  <p className="text-sm text-gray-600">{traineeProfile.activity_level}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Platform Status */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {t('Platform Status')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('Profile Completion')}</span>
                <Badge className={getCompletionColor(traineeProfile?.profile_completion_score || 0)}>
                  {traineeProfile?.profile_completion_score || 0}% {t('Complete')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('AI Generations Remaining')}</span>
                <Badge variant="outline">
                  {traineeProfile?.ai_generations_remaining || 0}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Coach Notes */}
          <div>
            <h3 className="font-medium mb-3">{t('Coach Notes')}</h3>
            {trainee.notes ? (
              <div className="p-3 bg-gray-50 rounded text-sm">
                {trainee.notes}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">{t('No notes added yet')}</p>
            )}
          </div>

          {/* Assignment Information */}
          <div>
            <h3 className="font-medium mb-3">{t('Assignment Information')}</h3>
            <div className="text-sm text-gray-600">
              <p>{t('Assigned on')}: {new Date(trainee.assigned_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={onMessage} className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              {t('Send Message')}
            </Button>
            <Button variant="outline" onClick={onClose}>
              {t('Close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TraineeDetailsDialog;
