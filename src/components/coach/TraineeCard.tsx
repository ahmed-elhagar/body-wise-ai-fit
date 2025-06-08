
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, User, Calendar, TrendingUp } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface TraineeCardProps {
  trainee: {
    id: string;
    name: string;
    email: string;
    status: string;
    lastActivity: string;
    progress: number;
  };
  onMessage: (traineeId: string) => void;
  onViewDetails: (traineeId: string) => void;
}

const TraineeCard = ({ trainee, onMessage, onViewDetails }: TraineeCardProps) => {
  const { t } = useI18n();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{trainee.name}</h3>
              <p className="text-sm text-gray-600">{trainee.email}</p>
            </div>
          </div>
          <Badge variant={trainee.status === 'active' ? 'default' : 'secondary'}>
            {t(`coach:status.${trainee.status}`) || trainee.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{t('coach:lastActivity') || 'Last activity'}: {trainee.lastActivity}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>{t('coach:progress') || 'Progress'}: {trainee.progress}%</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onMessage(trainee.id)}
            className="flex-1"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {t('coach:message') || 'Message'}
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => onViewDetails(trainee.id)}
            className="flex-1"
          >
            {t('coach:viewDetails') || 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TraineeCard;
