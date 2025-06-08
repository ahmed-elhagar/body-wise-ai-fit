
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Calendar, Users } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Coach {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
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
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Users className="w-5 h-5 text-green-600" />
          {t('dashboard:coachSupport') || 'Coach Support'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {coaches.length === 0 ? (
          <div className="text-center py-6">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-3">
              {t('dashboard:noCoachAssigned') || 'No coach assigned yet'}
            </p>
            <Button size="sm" variant="outline">
              {t('dashboard:findCoach') || 'Find a Coach'}
            </Button>
          </div>
        ) : (
          coaches.map((coach) => (
            <div key={coach.id} className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  {coach.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{coach.name}</p>
                  <p className="text-xs text-gray-500">
                    {coach.isOnline ? t('dashboard:online') || 'Online' : coach.lastSeen}
                  </p>
                </div>
              </div>
              <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button size="sm" variant="ghost" onClick={() => onStartChat(coach.id)}>
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onScheduleCall(coach.id)}>
                  <Calendar className="w-4 h-4" />
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
