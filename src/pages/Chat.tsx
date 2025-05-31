
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Bot, Users, AlertCircle, Loader2, RefreshCw, Bug } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { MultipleCoachesChat } from "@/components/coach/MultipleCoachesChat";
import { useLanguage } from "@/contexts/LanguageContext";
import AIChatInterface from "@/components/chat/AIChatInterface";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import type { CoachInfo } from "@/hooks/coach/types";

const Chat = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isCoach: isRoleCoach, isAdmin } = useRole();
  const { 
    coaches, 
    totalUnreadMessages, 
    unreadMessagesByCoach, 
    isLoadingCoachInfo, 
    coachInfoError, 
    refetchCoachInfo 
  } = useCoachSystem();
  const [showCoachChat, setShowCoachChat] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  console.log('Chat page - Debug info:', {
    userId: user?.id,
    isRoleCoach,
    isAdmin,
    coachesCount: coaches.length,
    totalUnreadMessages,
    unreadMessagesByCoach,
    isLoadingCoachInfo,
    coachInfoError: coachInfoError?.message,
  });

  // Helper function to get coach display name
  const getCoachDisplayName = (coach: CoachInfo) => {
    if (coach.coach_profile?.first_name || coach.coach_profile?.last_name) {
      const firstName = coach.coach_profile.first_name || '';
      const lastName = coach.coach_profile.last_name || '';
      return `${firstName} ${lastName}`.trim();
    }
    return 'Coach'; // Fallback instead of "Unknown Coach"
  };

  // Helper function to get coach initials
  const getCoachInitials = (coach: CoachInfo) => {
    const firstName = coach.coach_profile?.first_name;
    const lastName = coach.coach_profile?.last_name;
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (lastName) {
      return lastName[0].toUpperCase();
    }
    return 'C'; // Fallback to 'C' for Coach
  };

  // Show coach chat interface
  if (showCoachChat && coaches.length > 0) {
    return (
      <ProtectedRoute>
        <Layout>
          <MultipleCoachesChat
            coaches={coaches}
            unreadMessagesByCoach={unreadMessagesByCoach}
            onBack={() => setShowCoachChat(false)}
          />
        </Layout>
      </ProtectedRoute>
    );
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    console.log('🔄 Chat page: Manual retry triggered, count:', retryCount + 1);
    refetchCoachInfo();
  };

  const handleForceRefresh = () => {
    console.log('🔄 Chat page: Force refresh triggered');
    window.location.reload();
  };

  return (
    <ProtectedRoute>
      <Layout>
        <PageHeader
          title={t('Chat')}
          description={t('Connect with AI assistant and your coaches')}
          icon={<MessageCircle className="h-6 w-6 text-blue-600" />}
        />

        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
            <TabsTrigger 
              value="ai" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Bot className="w-4 h-4 mr-2" />
              {t('AI Assistant')}
            </TabsTrigger>
            <TabsTrigger 
              value="coach" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white relative"
            >
              <Users className="w-4 h-4 mr-2" />
              {t('Your Coaches')}
              {totalUnreadMessages > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {totalUnreadMessages}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="mt-6">
            <AIChatInterface />
          </TabsContent>

          <TabsContent value="coach" className="mt-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    {t('Coach Chat')}
                    {totalUnreadMessages > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {totalUnreadMessages} unread
                      </Badge>
                    )}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDebugInfo(!showDebugInfo)}
                    className="text-gray-500"
                  >
                    <Bug className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showDebugInfo && (
                  <div className="mb-4 p-3 bg-gray-100 rounded-lg text-xs">
                    <strong>Debug Info:</strong><br />
                    User ID: {user?.id}<br />
                    Is Coach: {isRoleCoach ? 'Yes' : 'No'}<br />
                    Is Admin: {isAdmin ? 'Yes' : 'No'}<br />
                    Loading: {isLoadingCoachInfo ? 'Yes' : 'No'}<br />
                    Coaches Count: {coaches.length}<br />
                    Error: {coachInfoError?.message || 'None'}<br />
                    Total Unread Messages: {totalUnreadMessages}<br />
                    Unread by Coach: {JSON.stringify(unreadMessagesByCoach)}
                  </div>
                )}

                {isLoadingCoachInfo ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-600">{t('Loading coach information...')}</p>
                    <p className="text-xs text-gray-500 mt-2">Checking your coach assignments...</p>
                  </div>
                ) : coachInfoError ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {t('Error Loading Coach Information')}
                    </h3>
                    <p className="text-red-600 text-sm mb-2">
                      {coachInfoError.message || 'Unknown error occurred'}
                    </p>
                    <p className="text-gray-500 text-xs mb-4">
                      Retry count: {retryCount}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        onClick={handleRetry}
                        variant="outline" 
                        size="sm"
                        disabled={retryCount > 5}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t('Retry')} {retryCount > 0 && `(${retryCount})`}
                      </Button>
                      <Button 
                        onClick={handleForceRefresh}
                        variant="default" 
                        size="sm"
                      >
                        {t('Refresh Page')}
                      </Button>
                    </div>
                  </div>
                ) : coaches.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {t('No Coaches Assigned')}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {t('You don\'t have any coaches assigned yet. Contact support to get paired with a coach.')}
                    </p>
                    {totalUnreadMessages > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-700 text-sm">
                          <strong>Note:</strong> You have {totalUnreadMessages} unread messages, but no coach assignments found. This might be a data inconsistency.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600">
                        {coaches.length === 1 
                          ? t('You have 1 coach assigned')
                          : t('You have {{count}} coaches assigned', { count: coaches.length })
                        }
                      </p>
                      <button
                        onClick={() => setShowCoachChat(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {t('View All Coaches')}
                      </button>
                    </div>

                    {/* Quick preview of coaches */}
                    <div className="grid gap-3">
                      {coaches.slice(0, 3).map((coach) => {
                        const unreadCount = unreadMessagesByCoach[coach.coach_id] || 0;
                        const coachName = getCoachDisplayName(coach);
                        const coachInitials = getCoachInitials(coach);
                        
                        return (
                          <div 
                            key={coach.id} 
                            className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200 hover:bg-green-100 transition-colors cursor-pointer"
                            onClick={() => setShowCoachChat(true)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-700 font-semibold text-sm">
                                  {coachInitials}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium text-green-800">
                                  {coachName}
                                </h4>
                                <p className="text-sm text-green-600">
                                  {t('Assigned')} {new Date(coach.assigned_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {unreadCount} {t('new')}
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                      
                      {coaches.length > 3 && (
                        <div className="text-center py-2">
                          <p className="text-sm text-gray-500">
                            {t('And {{count}} more coaches...', { count: coaches.length - 3 })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Layout>
    </ProtectedRoute>
  );
};

export default Chat;
