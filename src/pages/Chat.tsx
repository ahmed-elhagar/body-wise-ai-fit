
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Bot, Users, AlertCircle, Loader2, RefreshCw, Bug, UserCheck, Calendar, Star } from "lucide-react";
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
        <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
          <PageHeader
            title={t('Chat')}
            description={t('Connect with AI assistant and your coaches')}
            icon={<MessageCircle className="h-6 w-6 text-blue-600" />}
          />

          <div className="max-w-6xl mx-auto px-4 pb-8">
            <Tabs defaultValue="ai" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-1">
                <TabsTrigger 
                  value="ai" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  {t('AI Assistant')}
                </TabsTrigger>
                <TabsTrigger 
                  value="coach" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-lg transition-all duration-200 relative"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {t('Your Coaches')}
                  {totalUnreadMessages > 0 && (
                    <Badge variant="destructive" className="ml-2 text-xs animate-pulse">
                      {totalUnreadMessages}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai" className="mt-6">
                <AIChatInterface />
              </TabsContent>

              <TabsContent value="coach" className="mt-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold">
                            {t('Coach Chat')}
                          </CardTitle>
                          <p className="text-green-100 text-sm">
                            Connect with your personal fitness coaches
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {totalUnreadMessages > 0 && (
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 animate-pulse">
                            {totalUnreadMessages} unread
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDebugInfo(!showDebugInfo)}
                          className="text-white hover:bg-white/20"
                        >
                          <Bug className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    {showDebugInfo && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg text-xs border border-gray-200">
                        <strong className="text-gray-900">Debug Info:</strong><br />
                        <div className="mt-2 space-y-1 text-gray-700">
                          <div>User ID: {user?.id}</div>
                          <div>Is Coach: {isRoleCoach ? 'Yes' : 'No'}</div>
                          <div>Is Admin: {isAdmin ? 'Yes' : 'No'}</div>
                          <div>Loading: {isLoadingCoachInfo ? 'Yes' : 'No'}</div>
                          <div>Coaches Count: {coaches.length}</div>
                          <div>Error: {coachInfoError?.message || 'None'}</div>
                          <div>Total Unread Messages: {totalUnreadMessages}</div>
                          <div>Unread by Coach: {JSON.stringify(unreadMessagesByCoach)}</div>
                        </div>
                      </div>
                    )}

                    {isLoadingCoachInfo ? (
                      <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-6"></div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading your coaches...</h3>
                        <p className="text-gray-600">Checking your coach assignments...</p>
                      </div>
                    ) : coachInfoError ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {t('Error Loading Coach Information')}
                        </h3>
                        <p className="text-red-600 text-sm mb-2 max-w-md mx-auto">
                          {coachInfoError.message || 'Unknown error occurred'}
                        </p>
                        <p className="text-gray-500 text-xs mb-6">
                          Retry count: {retryCount}
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button 
                            onClick={handleRetry}
                            variant="outline" 
                            size="sm"
                            disabled={retryCount > 5}
                            className="border-green-200 hover:bg-green-50"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            {t('Retry')} {retryCount > 0 && `(${retryCount})`}
                          </Button>
                          <Button 
                            onClick={handleForceRefresh}
                            variant="default" 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {t('Refresh Page')}
                          </Button>
                        </div>
                      </div>
                    ) : coaches.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Users className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {t('No Coaches Assigned')}
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          {t('You don\'t have any coaches assigned yet. Contact support to get paired with a coach.')}
                        </p>
                        {totalUnreadMessages > 0 && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-lg mx-auto">
                            <p className="text-yellow-700 text-sm">
                              <strong>Note:</strong> You have {totalUnreadMessages} unread messages, but no coach assignments found. This might be a data inconsistency.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-3">
                            <UserCheck className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-green-800">
                                {coaches.length === 1 
                                  ? t('You have 1 coach assigned')
                                  : t('You have {{count}} coaches assigned', { count: coaches.length })
                                }
                              </p>
                              <p className="text-xs text-green-600">Ready to guide your fitness journey</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => setShowCoachChat(true)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                          >
                            <MessageCircle className="w-4 h-4" />
                            {t('View All Coaches')}
                          </Button>
                        </div>

                        {/* Enhanced Coach Preview */}
                        <div className="grid gap-4">
                          {coaches.slice(0, 3).map((coach) => {
                            const unreadCount = unreadMessagesByCoach[coach.coach_id] || 0;
                            const coachName = getCoachDisplayName(coach);
                            const coachInitials = getCoachInitials(coach);
                            
                            return (
                              <div 
                                key={coach.id} 
                                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white to-green-50 border border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                onClick={() => setShowCoachChat(true)}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="relative p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                          <span className="text-white font-semibold text-sm">
                                            {coachInitials}
                                          </span>
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                                      </div>
                                      
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <h4 className="font-semibold text-green-800 group-hover:text-green-700 transition-colors">
                                            {coachName}
                                          </h4>
                                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-green-600">
                                          <Calendar className="w-3 h-3" />
                                          <span>{t('Assigned')} {new Date(coach.assigned_at).toLocaleDateString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      {unreadCount > 0 && (
                                        <Badge variant="destructive" className="text-xs animate-pulse">
                                          {unreadCount} {t('new')}
                                        </Badge>
                                      )}
                                      <MessageCircle className="w-4 h-4 text-green-600 group-hover:text-green-700 transition-colors" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          
                          {coaches.length > 3 && (
                            <div className="text-center py-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowCoachChat(true)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                {t('View {{count}} more coaches', { count: coaches.length - 3 })} →
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Chat;
