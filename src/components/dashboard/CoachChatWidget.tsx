
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Phone, Video } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Coach {
  id: string;
  name: string;
  avatar?: string;
  specialization: string;
  isOnline: boolean;
  rating: number;
}

interface CoachChatWidgetProps {
  coaches: Coach[];
  onStartChat: (coachId: string) => void;
  onScheduleCall: (coachId: string) => void;
}

const CoachChatWidget = ({ coaches, onStartChat, onScheduleCall }: CoachChatWidgetProps) => {
  const { t, isRTL } = useI18n();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}>
          <MessageCircle className="w-5 h-5 text-green-500" />
          {t('coach:messages') || 'Coach Support'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {coaches.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 text-sm">
              {t('coach:messagesComingSoon') || 'Coach support coming soon'}
            </p>
          </div>
        ) : (
          coaches.slice(0, 2).map((coach) => (
            <div key={coach.id} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {coach.name.charAt(0)}
                  </span>
                </div>
                {coach.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h4 className="font-medium text-sm">{coach.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    ⭐ {coach.rating}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{coach.specialization}</p>
              </div>
              
              <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button size="sm" variant="ghost" onClick={() => onStartChat(coach.id)}>
                  <MessageCircle className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onScheduleCall(coach.id)}>
                  <Phone className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CoachChatWidget;
