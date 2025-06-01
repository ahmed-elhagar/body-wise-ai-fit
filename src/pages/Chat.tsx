import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Bot, Users, AlertCircle, Loader2, RefreshCw, UserCheck, Calendar, Star, MessageSquare, Bug, Sparkles, Wifi, WifiOff } from "lucide-react";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import TraineeCoachChat from "@/components/coach/TraineeCoachChat";
import { useI18n } from "@/hooks/useI18n"; // Replace LanguageContext import
import AIChatInterface from "@/components/chat/AIChatInterface";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserOnlineStatus } from "@/hooks/useUserOnlineStatus";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useLiveNotifications } from "@/hooks/useLiveNotifications";
import type { CoachInfo } from "@/hooks/coach/types";
import { cn } from "@/lib/utils";

const Chat = () => {
  const { t } = useI18n(); // Replace useLanguage with useI18n
  
  const { user } = useAuth();
  const { isCoach: isRoleCoach, isAdmin } = useRole();
  const isMobile = useIsMobile();
  
  // Initialize real-time features
  useOnlineStatus(); // Track current user's online status
  useLiveNotifications(); // Listen for live notifications
  
  const { 
    coaches, 
    totalUnreadMessages, 
    unreadMessagesByCoach, 
    isLoadingCoachInfo, 
    coachInfoError, 
    refetchCoachInfo 
  } = useCoachSystem();
  
  const [selectedCoach, setSelectedCoach] = useState<CoachInfo | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Get coach IDs for online status tracking
  const coachIds = coaches.map(coach => coach.coach_id);
  const { isUserOnline, getUserLastSeen } = useUserOnlineStatus(coachIds);

  // Helper function to get coach display name
  const getCoachDisplayName = (coach: CoachInfo) => {
    if (coach.coach_profile?.first_name || coach.coach_profile?.last_name) {
      const firstName = coach.coach_profile.first_name || '';
      const lastName = coach.coach_profile.last_name || '';
      return `${firstName} ${lastName}`.trim();
    }
    return coach.coach_profile?.email || 'Your Coach';
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
    return 'C';
  };

  const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return 'Never';
    
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  console.log('Chat page - Debug info:', {
    userId: user?.id,
    isRoleCoach,
    isAdmin,
    coachesCount: coaches.length,
    totalUnreadMessages,
    unreadMessagesByCoach,
    isLoadingCoachInfo,
    coachInfoError: coachInfoError?.message,
    coaches: coaches.map(c => ({
      id: c.id,
      coach_id: c.coach_id,
      name: getCoachDisplayName(c),
      online: isUserOnline(c.coach_id)
    }))
  });

  // Show selected coach chat directly
  if (selectedCoach) {
    return (
      <ProtectedRoute>
        {isMobile ? (
          <TraineeCoachChat
            coachId={selectedCoach.coach_id}
            coachName={getCoachDisplayName(selectedCoach)}
            onBack={() => setSelectedCoach(null)}
          />
        ) : (
          <Layout>
            <TraineeCoachChat
              coachId={selectedCoach.coach_id}
              coachName={getCoachDisplayName(selectedCoach)}
              onBack={() => setSelectedCoach(null)}
            />
          </Layout>
        )}
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Enhanced Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative max-w-7xl mx-auto px-4 py-6 lg:py-8">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-1 text-white">Communication Hub</h1>
                  <p className="text-blue-100 text-sm lg:text-base">Connect with AI assistant and personal coaches</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-6">
            <Tabs defaultValue="ai" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl p-1.5 mb-6">
                <TabsTrigger 
                  value="ai" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:text-blue-600 data-[state=inactive]:hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium py-3 text-base"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger 
                  value="coach" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:text-green-600 data-[state=inactive]:hover:bg-green-50 rounded-lg transition-all duration-200 font-medium py-3 text-base relative"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Personal Coaches
                  {totalUnreadMessages > 0 && (
                    <Badge variant="destructive" className="ml-2 text-xs animate-pulse bg-red-500 text-white shadow-md px-2">
                      {totalUnreadMessages}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai" className="mt-0">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  {/* Single AI Header */}
                  <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold mb-1 text-white flex items-center gap-2">
                          FitGenius AI
                          <Sparkles className="h-4 w-4 text-yellow-300" />
                        </h2>
                        <p className="text-blue-100 text-sm">
                          Your personal fitness & nutrition assistant
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-[500px]">
                    <AIChatInterface />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="coach" className="mt-0">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-xl lg:rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-lg lg:rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Users className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base lg:text-xl font-bold mb-1 text-white">
                            Personal Coaching
                          </CardTitle>
                          <p className="text-green-100 text-xs lg:text-sm">
                            Connect with your dedicated fitness coaches for personalized guidance
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 lg:gap-3">
                        {totalUnreadMessages > 0 && (
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/20 animate-pulse px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm">
                            {totalUnreadMessages} unread
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDebugInfo(!showDebugInfo)}
                          className="text-white hover:bg-white/20 p-1 lg:p-2"
                        >
                          <Bug className="h-3 w-3 lg:h-4 lg:w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 lg:p-6">
                    {/* ... keep existing code (debug info, loading states, error states, no coaches state) the same ... */

                    {!isLoadingCoachInfo && !coachInfoError && coaches.length > 0 && (
                      <div className="space-y-3 lg:space-y-4">
                        {/* Status Card */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg lg:rounded-xl p-3 lg:p-4 border border-green-200">
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-lg lg:rounded-xl flex items-center justify-center">
                              <UserCheck className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm lg:text-base font-bold text-green-800 mb-1">
                                {coaches.length === 1 
                                  ? 'You have 1 personal coach'
                                  : `You have ${coaches.length} personal coaches`
                                }
                              </p>
                              <p className="text-green-600 text-xs lg:text-sm">Click on any coach below to start chatting</p>
                            </div>
                          </div>
                        </div>

                        {/* Coach List with Real-time Status */}
                        <div className="grid gap-2 lg:gap-3">
                          {coaches.map((coach) => {
                            const unreadCount = unreadMessagesByCoach[coach.coach_id] || 0;
                            const coachName = getCoachDisplayName(coach);
                            const coachInitials = getCoachInitials(coach);
                            const isOnline = isUserOnline(coach.coach_id);
                            const lastSeen = getUserLastSeen(coach.coach_id);
                            
                            return (
                              <div 
                                key={coach.id} 
                                className="group relative overflow-hidden rounded-lg lg:rounded-xl bg-white border-2 border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 active:scale-95"
                                onClick={() => setSelectedCoach(coach)}
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="relative p-3 lg:p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 lg:space-x-3">
                                      <div className="relative">
                                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md">
                                          <span className="text-white font-bold text-xs lg:text-sm">
                                            {coachInitials}
                                          </span>
                                        </div>
                                        <div className={cn(
                                          "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                                          isOnline ? "bg-green-400" : "bg-gray-400"
                                        )}></div>
                                      </div>
                                      
                                      <div>
                                        <div className="flex items-center gap-1 lg:gap-2 mb-1">
                                          <h4 className="text-sm lg:text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                                            {coachName}
                                          </h4>
                                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                        </div>
                                        <div className="flex items-center gap-1 lg:gap-2 text-gray-600 text-xs">
                                          <div className="flex items-center gap-1">
                                            {isOnline ? (
                                              <Wifi className="w-3 h-3 text-green-500" />
                                            ) : (
                                              <WifiOff className="w-3 h-3 text-gray-400" />
                                            )}
                                            <span className="font-medium">
                                              {isOnline ? 'Online now' : `Last seen ${formatLastSeen(lastSeen)}`}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-1 lg:gap-2">
                                      {unreadCount > 0 && (
                                        <Badge variant="destructive" className="text-xs px-1 lg:px-2 py-1 animate-pulse shadow-sm bg-red-500 text-white">
                                          {unreadCount} new
                                        </Badge>
                                      )}
                                      <div className="flex items-center gap-1">
                                        <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-600 group-hover:text-green-700 transition-colors" />
                                        <span className="text-xs text-gray-600 font-medium">Chat</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {coach.notes && (
                                    <div className="mt-2 lg:mt-3 bg-gray-50 rounded-lg p-2 lg:p-3 border border-gray-100">
                                      <p className="text-xs text-gray-700">
                                        <span className="font-semibold text-gray-900">Coach Notes:</span> {coach.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
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
