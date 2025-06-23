
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Users, Bot, Phone, Video, Settings, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCoachSystem } from "@/features/coach/hooks/useCoachSystem";
import { useOptimizedProfile } from "@/features/profile/hooks/useOptimizedProfile";
import TraineeCoachChat from "@/features/coach/components/TraineeCoachChat";
import FitnessChat from "./FitnessChat";
import { cn } from "@/lib/utils";

const EnhancedChatPage = () => {
  const { t } = useLanguage();
  const [activeChat, setActiveChat] = useState<'fitness' | string>('fitness');
  const [selectedCoach, setSelectedCoach] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  
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

  if (isLoadingCoachInfo || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-6">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-white/50 rounded-xl w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-white/50 rounded-xl"></div>
              ))}
            </div>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-6">
        <div className="container mx-auto">
          <TraineeCoachChat
            coachId={selectedCoach.coach_id}
            coachName={coachName}
            onBack={handleBackToList}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Enhanced Header with User Context */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {profile?.first_name ? `Hi ${profile.first_name}!` : t('Chat & Support')}
              </h1>
              <p className="text-gray-600 text-sm">
                {profile?.fitness_goal ? `Working toward: ${profile.fitness_goal}` : t('Your AI fitness companion')}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">AI Assistant</p>
                  <p className="text-sm text-blue-600">{t('Always Available')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">{coaches.length}</p>
                  <p className="text-sm text-purple-600">{t('Personal Coaches')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">{totalUnreadMessages}</p>
                  <p className="text-sm text-green-600">{t('Unread Messages')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-700">{profile?.ai_generations_remaining || 0}</p>
                  <p className="text-sm text-orange-600">{t('AI Credits Left')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Layout with Better Proportions */}
        <div className={cn(
          "grid gap-6 transition-all duration-300",
          sidebarCollapsed ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-5"
        )}>
          {/* Enhanced Sidebar with Toggle */}
          {!sidebarCollapsed && (
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('Chat Options')}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(true)}
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              {/* AI Fitness Chat */}
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1",
                  activeChat === 'fitness' 
                    ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl' 
                    : 'bg-white/80 backdrop-blur-sm hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50'
                )}
                onClick={() => setActiveChat('fitness')}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {t('AI Fitness Assistant')}
                      </span>
                      <p className="text-sm text-gray-600 font-normal mt-1">
                        {profile?.first_name ? `Personalized for ${profile.first_name}` : t('Powered by advanced AI')}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                    {t('Get instant answers with context from your profile, goals, and progress')}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 text-xs">
                      <Bot className="w-3 h-3 mr-1" />
                      {t('AI Powered')}
                    </Badge>
                    <Badge variant="outline" className="border-green-300 text-green-700 text-xs">
                      {profile ? t('Personalized') : t('24/7 Available')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Coaches Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                    {t('Your Coaches')} ({coaches.length})
                  </h3>
                </div>
                
                {coaches.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('No coaches assigned')}</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {t('Coaches will appear here when assigned to you')}
                      </p>
                      <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 text-sm">
                        {t('Learn More')}
                      </Button>
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
                        className={cn(
                          "cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1",
                          activeChat === coach.coach_id 
                            ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl' 
                            : 'bg-white/80 backdrop-blur-sm hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50'
                        )}
                        onClick={() => handleCoachSelect(coach)}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-3 text-base">
                              <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                  {coachName.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              </div>
                              <div>
                                <span className="text-gray-900 text-sm">{coachName}</span>
                                <p className="text-xs text-gray-600 font-normal">
                                  {t('Personal Coach')}
                                </p>
                              </div>
                            </CardTitle>
                            {unreadCount > 0 && (
                              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 animate-pulse text-xs">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-gray-600 mb-3">
                            {coach.coach_profile?.email || t('Coach contact')}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="border-purple-300 text-purple-700 text-xs">
                              {t('Professional')}
                            </Badge>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-purple-100">
                                <Phone className="h-3 w-3 text-purple-600" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-purple-100">
                                <Video className="h-3 w-3 text-purple-600" />
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
          )}

          {/* Enhanced Main Chat Area */}
          <div className={cn(
            "transition-all duration-300",
            sidebarCollapsed ? "col-span-1" : "lg:col-span-4"
          )}>
            {sidebarCollapsed && (
              <div className="mb-4 flex justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSidebarCollapsed(false)}
                  className="flex items-center gap-2 bg-white/80 hover:bg-white border-blue-200"
                >
                  <ChevronRight className="h-4 w-4" />
                  {t('Show Sidebar')}
                </Button>
              </div>
            )}

            {activeChat === 'fitness' ? (
              <Card className="h-[700px] bg-white/90 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
                <FitnessChat />
              </Card>
            ) : (
              <Card className="h-[700px] flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
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
              </Card>
            )}
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default EnhancedChatPage;
