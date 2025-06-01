import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Bell } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";
import { useNavigate } from 'react-router-dom';

const CoachChatWidget = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleOpenChat = () => {
    setIsChatOpen(true);
    navigate('/coach-chat');
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-medium">Coach Chat</CardTitle>
            <p className="text-xs text-muted-foreground">
              {t('Get personalized support')}
            </p>
          </div>
        </div>
        <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
          <Bell className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Button onClick={handleOpenChat} className="w-full">
          <Users className="w-4 h-4 mr-2" />
          {t('Connect with a coach')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CoachChatWidget;
