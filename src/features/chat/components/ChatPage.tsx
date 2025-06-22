
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Bot, Phone, Video, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCoachSystem } from "@/features/coach/hooks/useCoachSystem";
import TraineeCoachChat from "@/features/coach/components/TraineeCoachChat";
import FitnessChat from "./FitnessChat";

const ChatPage = () => {
  const { t } = useLanguage();
  const [activeChat, setActiveChat] = useState<'fitness' | string>('fitness');
  const [selectedCoach, setSelectedCoach] = useState<any>(null);
  
  const { 
    coaches, 
    totalUnreadMessages, 
    unreadMessagesByCoach,
    isLoadingCoachInfo 
  } = useCoachSystem();

  useEffect(() => {
    console.log('ChatPage - Coaches:', coaches);
    console.log('ChatPage - Unread messages:', totalUnreadMessages);
  }, [coaches, totalUnreadMessages]);

  if (isLoadingCoachInfo) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleCoachSelect = (coach: any) => {
    setSelectedCoach(coach);
    setActiveChat(coach.coach_id);
  };

  const handleBackToList = () => {
    setActiveChat('fitness');
    setSelectedCoach(null);
  };

  // If a coach chat is selected, show the chat interface
  if (activeChat !== 'fitness' && selectedCoach) {
    const coachName = selectedCoach.coach_profile 
      ? `${selectedCoach.coach_profile.first_name || ''} ${selectedCoach.coach_profile.last_name || ''}`.trim()
      : 'Coach';

    return (
      <div className="container mx-auto p-6">
        <TraineeCoachChat
          coachId={selectedCoach.coach_id}
          coachName={coachName}
          onBack={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Chat & Support')}</h1>
          <p className="text-gray-600 mt-2">
            {t('Get help from AI assistant or chat with your coaches')}
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          {t('Settings')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Options Sidebar */}
        <div className="space-y-4">
          {/* AI Fitness Chat */}
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeChat === 'fitness' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => setActiveChat('fitness')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Bot className="h-5 w-5 text-green-600" />
                </div>
                {t('AI Fitness Assistant')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                {t('Get instant answers to your fitness and nutrition questions')}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {t('Always Available')}
                </Badge>
                <Badge variant="outline">
                  {t('AI Powered')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Coaches List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('Your Coaches')} ({coaches.length})
            </h3>
            
            {coaches.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 mb-2">{t('No coaches assigned')}</p>
                  <p className="text-sm text-gray-500">
                    {t('Coaches will appear here when assigned to you')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              coaches.map((coach) => {
                const coachName = coach.coach_profile 
                  ? `${coach.coach_profile.first_name || ''} ${coach.coach_profile.last_name || ''}`.trim()
                  : 'Coach';
                
                const unreadCount = unreadMessagesByCoach[coach.coach_id] || 0;
                
                return (
                  <Card 
                    key={coach.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      activeChat === coach.coach_id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleCoachSelect(coach)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                          </div>
                          {coachName}
                        </CardTitle>
                        {unreadCount > 0 && (
                          <Badge variant="destructive">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        {coach.coach_profile?.email || t('Coach contact')}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {t('Personal Coach')}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Video className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          {activeChat === 'fitness' ? (
            <FitnessChat />
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{t('Select a conversation to start chatting')}</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
