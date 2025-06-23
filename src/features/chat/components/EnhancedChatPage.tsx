
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Bot, Sparkles, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCoachSystem } from "@/features/coach/hooks/useCoachSystem";
import { useOptimizedProfile } from "@/features/profile/hooks/useOptimizedProfile";
import TraineeCoachChat from "@/features/coach/components/TraineeCoachChat";
import AIChatInterface from "./AIChatInterface";
import { FeatureLayout, TabItem } from "@/shared/components/design-system/FeatureLayout";
import { TabGroup } from "@/shared/components/design-system/TabButton";
import GradientStatsCard from "@/shared/components/design-system/GradientStatsCard";

const EnhancedChatPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ai-assistant' | string>('ai-assistant');
  const [selectedCoach, setSelectedCoach] = useState<any>(null);
  
  const { 
    coaches, 
    totalUnreadMessages, 
    unreadMessagesByCoach,
    isLoadingCoachInfo 
  } = useCoachSystem();

  const { profile, isLoading: profileLoading } = useOptimizedProfile();

  useEffect(() => {
    console.log('Enhanced ChatPage - User Profile:', profile);
    console.log('Enhanced ChatPage - Coaches:', coaches);
    console.log('Enhanced ChatPage - Unread messages:', totalUnreadMessages);
  }, [profile, coaches, totalUnreadMessages]);

  // Prepare tabs for the chat interface
  const chatTabs: TabItem[] = [
    {
      id: 'ai-assistant',
      label: t('AI Assistant'),
      icon: Bot,
      badge: profile?.ai_generations_remaining || 0,
    },
    ...coaches.map((coach) => {
      const coachName = coach.coach_profile 
        ? `${coach.coach_profile.first_name || ''} ${coach.coach_profile.last_name || ''}`.trim()
        : 'Coach';
      
      return {
        id: coach.coach_id,
        label: coachName,
        icon: Users,
        badge: unreadMessagesByCoach[coach.coach_id] || undefined,
      };
    })
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    if (tabId !== 'ai-assistant') {
      const coach = coaches.find(c => c.coach_id === tabId);
      setSelectedCoach(coach);
    } else {
      setSelectedCoach(null);
    }
  };

  const handleBackToList = () => {
    setActiveTab('ai-assistant');
    setSelectedCoach(null);
  };

  // Stats cards for the header
  const statsCards = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <GradientStatsCard
        title={t('AI Assistant')}
        stats={[{
          label: t('Always Available'),
          value: "24/7",
          color: 'blue' as const
        }]}
      />
      <GradientStatsCard
        title={coaches.length.toString()}
        stats={[{
          label: t('Personal Trainers'),
          value: t('Coaches'),
          color: 'purple' as const
        }]}
      />
      <GradientStatsCard
        title={totalUnreadMessages.toString()}
        stats={[{
          label: t('New Messages'),
          value: t('Unread'),
          color: 'green' as const
        }]}
      />
      <GradientStatsCard
        title={(profile?.ai_generations_remaining || 0).toString()}
        stats={[{
          label: t('AI Generations Left'),
          value: t('Credits'),
          color: 'orange' as const
        }]}
      />
    </div>
  );

  // Header actions
  const headerActions = (
    <div className="flex items-center gap-3">
      {profile && (
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{profile.first_name} {profile.last_name}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {profile.role === 'pro' ? 'Pro Member' : 'Free Plan'}
          </Badge>
        </div>
      )}
    </div>
  );

  if (isLoadingCoachInfo || profileLoading) {
    return (
      <FeatureLayout
        title={t('Chat & Support')}
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        isLoading={true}
        loadingIcon={MessageSquare}
        loadingMessage={t('Loading chat...')}
      >
        <div></div>
      </FeatureLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
      <FeatureLayout
        title={
          profile?.first_name 
            ? `${t('Hi')} ${profile.first_name}! ${t('Chat & Support')}`
            : t('Chat & Support')
        }
        tabs={chatTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        headerActions={headerActions}
        showStatsCards={true}
        statsCards={statsCards}
        className="p-6"
      >
        {/* Main Chat Content */}
        <Card className="h-[700px] bg-white/90 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
          {activeTab === 'ai-assistant' ? (
            <AIChatInterface />
          ) : selectedCoach ? (
            <div className="h-full flex flex-col">
              {/* Coach Chat Header */}
              <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToList}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {selectedCoach.coach_profile 
                          ? `${selectedCoach.coach_profile.first_name || ''} ${selectedCoach.coach_profile.last_name || ''}`.trim()
                          : 'Coach'
                        }
                      </h3>
                      <p className="text-sm text-purple-100">{t('Personal Coach')}</p>
                    </div>
                  </div>
                  {unreadMessagesByCoach[selectedCoach.coach_id] > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white">
                      {unreadMessagesByCoach[selectedCoach.coach_id]}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Coach Chat Content */}
              <div className="flex-1 overflow-hidden">
                <TraineeCoachChat
                  coachId={selectedCoach.coach_id}
                  coachName={
                    selectedCoach.coach_profile 
                      ? `${selectedCoach.coach_profile.first_name || ''} ${selectedCoach.coach_profile.last_name || ''}`.trim()
                      : 'Coach'
                  }
                  onBack={handleBackToList}
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto">
                  <MessageSquare className="h-10 w-10 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t('Select a conversation')}
                  </h3>
                  <p className="text-gray-600">
                    {t('Choose an AI assistant or coach to start chatting')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Enhanced User Context Footer */}
        {profile && (
          <div className="mt-6 p-4 bg-white/50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>👤 {profile.first_name} {profile.last_name}</span>
                {profile.fitness_goal && <span>🎯 {profile.fitness_goal}</span>}
                {profile.activity_level && <span>💪 {profile.activity_level}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span>🔋 {profile.ai_generations_remaining} AI credits left</span>
                <Badge variant="outline" className="text-xs">
                  {profile.role === 'pro' ? 'Pro Member' : 'Free Plan'}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </FeatureLayout>
    </div>
  );
};

export default EnhancedChatPage;
