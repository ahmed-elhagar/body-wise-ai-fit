
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Phone, User } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Coach {
  id: string;
  name: string;
  specialty: string;
  isOnline: boolean;
}

interface CoachChatWidgetProps {
  coaches?: Coach[];
  onStartChat?: (coachId: string) => void;
  onScheduleCall?: (coachId: string) => void;
}

const CoachChatWidget = ({ coaches, onStartChat, onScheduleCall }: CoachChatWidgetProps) => {
  const { t, isRTL } = useI18n();

  // Default coaches if none provided
  const defaultCoaches: Coach[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      specialty: 'Nutrition Expert',
      isOnline: true
    },
    {
      id: '2',
      name: 'Mike Chen',
      specialty: 'Fitness Trainer',
      isOnline: false
    }
  ];

  const displayCoaches = coaches || defaultCoaches;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right font-arabic' : 'text-left'}`}>
          <MessageCircle className="w-5 h-5 text-green-600" />
          {t('dashboard:coachSupport') || 'Coach Support'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayCoaches.map((coach) => (
          <div key={coach.id} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Avatar className="w-10 h-10">
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h4 className="font-medium text-gray-900">{coach.name}</h4>
                <div className={`w-2 h-2 rounded-full ${coach.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              <p className="text-sm text-gray-600">{coach.specialty}</p>
            </div>
            
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onStartChat?.(coach.id)}
              >
                <MessageCircle className="w-3 h-3" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onScheduleCall?.(coach.id)}
              >
                <Phone className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
        
        <Button 
          variant="ghost" 
          className="w-full text-sm"
          onClick={() => onStartChat?.('general')}
        >
          {t('dashboard:viewAllCoaches') || 'View All Coaches'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CoachChatWidget;
