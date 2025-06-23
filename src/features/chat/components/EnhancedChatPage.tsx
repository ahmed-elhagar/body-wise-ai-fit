import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Bot, Sparkles, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCoachSystem } from "@/features/coach/hooks/useCoachSystem";
import { useOptimizedProfile } from "@/features/profile/hooks/useOptimizedProfile";
import { useSubscription } from "@/shared/hooks/useSubscription";
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
  const { subscription, isProMember, isLoading: subscriptionLoading } = useSubscription();

  useEffect(() => {
    console.log('Enhanced ChatPage - User Profile:', profile);
    console.log('Enhanced ChatPage - Coaches:', coaches);
    console.log('Enhanced ChatPage - Subscription:', subscription);
    console.log('Enhanced ChatPage - Is Pro Member:', isProMember);
  }, [profile, coaches, subscription, isProMember]);

  // Determine user tier based on actual subscription data
  const getUserTier = () => {
    if (subscriptionLoading) return 'Loading...';
    if (isProMember) return 'Pro Member';
    if (profile?.role === 'admin') return 'Admin';
    if (profile?.role === 'coach') return 'Coach';
    return 'Free Plan';
  };

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

  // More compact stats cards with better visual hierarchy
  const statsCards = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
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

  // Improved header with better user context display
  const headerActions = (
    <div className="flex items-center gap-2">
      {profile && (
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">
              {profile.first_name} {profile.last_name}
            </span>
          </div>
          <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            {getUserTier()}
          </Badge>
        </div>
      )}
    </div>
  );

  if (isLoadingCoachInfo || profileLoading || subscriptionLoading) {
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
        className="p-3"
      >
        {/* Main Chat Content */}
        <Card className="h-[720px] bg-white/95 backdrop-blur-sm shadow-xl border-0 rounded-xl overflow-hidden">
          {activeTab === 'ai-assistant' ? (
            <AIChatInterface />
          ) : selectedCoach ? (
            <div className="h-full flex flex-col">
              {/* Coach Chat Header */}
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToList}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {selectedCoach.coach_profile 
                          ? `${selectedCoach.coach_profile.first_name || ''} ${selectedCoach.coach_profile.last_name || ''}`.trim()
                          : 'Coach'
                        }
                      </h3>
                      <p className="text-xs text-purple-100">{t('Personal Coach')}</p>
                    </div>
                  </div>
                  {unreadMessagesByCoach[selectedCoach.coach_id] > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white text-xs">
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
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto">
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {t('Select a conversation')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('Choose an AI assistant or coach to start chatting')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Enhanced User Context Footer - More Compact */}
        {profile && (
          <div className="mt-3 p-2.5 bg-white/60 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-3">
                <span>👤 {profile.first_name} {profile.last_name}</span>
                {profile.fitness_goal && <span>🎯 {profile.fitness_goal}</span>}
                {profile.activity_level && <span>💪 {profile.activity_level}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span>🔋 {profile.ai_generations_remaining} AI credits left</span>
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  {getUserTier()}
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
