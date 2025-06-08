
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, User, Video, Phone } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Coach {
  id: string;
  name: string;
  specialization: string;
  isOnline: boolean;
}

interface CoachChatWidgetProps {
  coaches: Coach[];
  onStartChat: (coachId: string) => void;
  onScheduleCall: (coachId: string) => void;
}

const CoachChatWidget = ({ coaches, onStartChat, onScheduleCall }: CoachChatWidgetProps) => {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          {t('dashboard:coachSupport') || 'Coach Support'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {coaches.map((coach) => (
          <div key={coach.id} className="flex items-center gap-3 p-3 rounded-lg border">
            <Avatar className="w-10 h-10">
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium truncate">{coach.name}</h4>
                <div className={`w-2 h-2 rounded-full ${
                  coach.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              <p className="text-sm text-gray-600">{coach.specialization}</p>
            </div>
            
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onStartChat(coach.id)}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onScheduleCall(coach.id)}
              >
                <Video className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {coaches.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('dashboard:noCoachesAvailable') || 'No coaches available'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoachChatWidget;
