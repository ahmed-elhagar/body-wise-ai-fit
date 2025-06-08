
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Calendar, 
  Target, 
  TrendingUp,
  MessageCircle,
  Edit
} from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface TraineeDetailsDialogProps {
  trainee: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMessage: (traineeId: string) => void;
  onUpdateNotes: (traineeId: string) => void;
}

const TraineeDetailsDialog = ({ 
  trainee, 
  open, 
  onOpenChange, 
  onMessage, 
  onUpdateNotes 
}: TraineeDetailsDialogProps) => {
  const { t } = useI18n();

  if (!trainee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t('coach:traineeDetails') || 'Trainee Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">{t('coach:basicInfo') || 'Basic Information'}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{trainee.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{trainee.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{t('coach:joined') || 'Joined'}: {trainee.joinedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={trainee.status === 'active' ? 'default' : 'secondary'}>
                    {t(`coach:status.${trainee.status}`) || trainee.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals & Progress */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">{t('coach:goalsProgress') || 'Goals & Progress'}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span>{t('coach:currentGoal') || 'Current Goal'}: {trainee.goal || 'Weight Loss'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span>{t('coach:progress') || 'Progress'}: {trainee.progress || 65}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              onClick={() => onMessage(trainee.id)}
              className="flex-1"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {t('coach:sendMessage') || 'Send Message'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => onUpdateNotes(trainee.id)}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-2" />
              {t('coach:updateNotes') || 'Update Notes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TraineeDetailsDialog;
