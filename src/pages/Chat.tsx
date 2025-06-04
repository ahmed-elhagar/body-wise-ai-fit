
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Bot, Users, AlertCircle, Loader2, RefreshCw, UserCheck, Calendar, Star, MessageSquare, Bug, Sparkles, Wifi, WifiOff, Zap, TrendingUp, Activity } from "lucide-react";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import TraineeCoachChat from "@/components/coach/TraineeCoachChat";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t } = useLanguage();
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
          {/* Enhanced Modern Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-2xl">
                      <MessageSquare className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                      Communication Hub
                    </h1>
                    <p className="text-blue-100 text-lg lg:text-xl font-medium">
                      Connect with AI assistant and personal coaches
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 text-sm text-blue-200">
                        <Activity className="h-4 w-4" />
                        <span>Real-time messaging</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-200">
                        <Zap className="h-4 w-4" />
                        <span>AI-powered support</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Stats cards in header */}
                <div className="flex gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-green-300" />
                      <span className="text-sm text-green-300 font-medium">Coaches</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{coaches.length}</div>
                  </div>
                  {totalUnreadMessages > 0 && (
                    <div className="bg-red-500/20 backdrop-blur-md rounded-xl p-4 border border-red-300/30">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageCircle className="h-4 w-4 text-red-300" />
                        <span className="text-sm text-red-300 font-medium">Unread</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{totalUnreadMessages}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Tabs defaultValue="ai" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/90 backdrop-blur-md border-0 shadow-xl rounded-2xl p-2 mb-8 h-16">
                <TabsTrigger 
                  value="ai" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:text-blue-600 data-[state=inactive]:hover:bg-blue-50/50 rounded-xl transition-all duration-300 font-semibold py-4 text-base"
                >
                  <div className="flex items-center gap-3">
                    <Bot className="w-5 h-5" />
                    <div className="flex flex-col">
                      <span>AI Assistant</span>
                      <span className="text-xs opacity-75">Smart & Instant</span>
                    </div>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="coach" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:text-green-600 data-[state=inactive]:hover:bg-green-50/50 rounded-xl transition-all duration-300 font-semibold py-4 text-base relative"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    <div className="flex flex-col">
                      <span>Personal Coaches</span>
                      <span className="text-xs opacity-75">Expert Guidance</span>
                    </div>
                    {totalUnreadMessages > 0 && (
                      <Badge variant="destructive" className="ml-2 animate-bounce bg-red-500 text-white shadow-lg px-2 py-1 text-xs">
                        {totalUnreadMessages}
                      </Badge>
                    )}
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai" className="mt-0">
                <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-3xl overflow-hidden">
                  {/* Enhanced AI Header */}
                  <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 lg:p-8">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                          <Bot className="h-7 w-7 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                          <Sparkles className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                          FitGenius AI
                          <Badge className="bg-yellow-400/20 text-yellow-100 border-yellow-300/30 text-sm px-3 py-1">
                            24/7 Available
                          </Badge>
                        </h2>
                        <p className="text-blue-100 text-base lg:text-lg">
                          Your intelligent fitness & nutrition companion
                        </p>
                        <div className="flex flex-wrap gap-3 mt-3">
                          <div className="flex items-center gap-1 text-sm text-blue-200 bg-white/10 rounded-full px-3 py-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>Personalized advice</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-blue-200 bg-white/10 rounded-full px-3 py-1">
                            <Zap className="h-3 w-3" />
                            <span>Instant responses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-[600px] lg:h-[700px]">
                    <AIChatInterface />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="coach" className="mt-0">
                <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 lg:p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                            <Users className="h-7 w-7 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                            <UserCheck className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <div>
                          <CardTitle className="text-2xl lg:text-3xl font-bold text-white mb-2">
                            Personal Coaching
                          </CardTitle>
                          <p className="text-green-100 text-base lg:text-lg">
                            Connect with dedicated fitness professionals
                          </p>
                          <div className="flex flex-wrap gap-3 mt-3">
                            <div className="flex items-center gap-1 text-sm text-green-200 bg-white/10 rounded-full px-3 py-1">
                              <Star className="h-3 w-3" />
                              <span>Expert guidance</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-green-200 bg-white/10 rounded-full px-3 py-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>Real-time chat</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {totalUnreadMessages > 0 && (
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/20 animate-pulse px-4 py-2 text-base font-semibold">
                            {totalUnreadMessages} unread
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDebugInfo(!showDebugInfo)}
                          className="text-white hover:bg-white/20 p-2"
                        >
                          <Bug className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 lg:p-8">
                    {/* Debug info */}
                    {showDebugInfo && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Bug className="h-4 w-4" />
                          Debug Information
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>User ID:</strong> {user?.id}</p>
                          <p><strong>Is Coach:</strong> {isRoleCoach ? 'Yes' : 'No'}</p>
                          <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
                          <p><strong>Coaches Count:</strong> {coaches.length}</p>
                          <p><strong>Total Unread:</strong> {totalUnreadMessages}</p>
                          <p><strong>Loading:</strong> {isLoadingCoachInfo ? 'Yes' : 'No'}</p>
                          <p><strong>Error:</strong> {coachInfoError?.message || 'None'}</p>
                          <p><strong>Retry Count:</strong> {retryCount}</p>
                        </div>
                      </div>
                    )}

                    {/* Loading state */}
                    {isLoadingCoachInfo && (
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="relative">
                          <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
                          <div className="absolute inset-0 h-12 w-12 border-4 border-green-200 rounded-full"></div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Your Coaches</h3>
                        <p className="text-gray-600 text-center max-w-md">
                          We're fetching your personal coaching connections...
                        </p>
                      </div>
                    )}

                    {/* Error state */}
                    {!isLoadingCoachInfo && coachInfoError && (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Coaches</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          {coachInfoError.message || 'There was an error loading your coach information.'}
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                          <Button onClick={handleRetry} variant="outline" className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Retry ({retryCount + 1})
                          </Button>
                          <Button onClick={handleForceRefresh} variant="outline" className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Force Refresh
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* No coaches state */}
                    {!isLoadingCoachInfo && !coachInfoError && coaches.length === 0 && (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Users className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Personal Coaches Yet</h3>
                        <p className="text-gray-600 text-lg mb-6 max-w-lg mx-auto">
                          You haven't been assigned any personal coaches yet. Contact our support team to get matched with a fitness professional.
                        </p>
                        <div className="bg-blue-50 rounded-xl p-6 max-w-md mx-auto">
                          <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h4>
                          <p className="text-blue-700 text-sm">
                            While you wait, you can chat with our AI assistant for immediate fitness and nutrition guidance!
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Coaches list */}
                    {!isLoadingCoachInfo && !coachInfoError && coaches.length > 0 && (
                      <div className="space-y-6">
                        {/* Status Card */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50 shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                              <UserCheck className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-green-800 mb-1">
                                {coaches.length === 1 
                                  ? 'You have 1 personal coach'
                                  : `You have ${coaches.length} personal coaches`
                                }
                              </p>
                              <p className="text-green-600 text-sm lg:text-base">Click on any coach below to start chatting and get personalized guidance</p>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Coach List */}
                        <div className="grid gap-4 lg:gap-6">
                          {coaches.map((coach) => {
                            const unreadCount = unreadMessagesByCoach[coach.coach_id] || 0;
                            const coachName = getCoachDisplayName(coach);
                            const coachInitials = getCoachInitials(coach);
                            const isOnline = isUserOnline(coach.coach_id);
                            const lastSeen = getUserLastSeen(coach.coach_id);
                            
                            return (
                              <div 
                                key={coach.id} 
                                className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 active:scale-98"
                                onClick={() => setSelectedCoach(coach)}
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-emerald-50/30 to-teal-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="relative p-6 lg:p-8">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 lg:space-x-6">
                                      <div className="relative">
                                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                          <span className="text-white font-bold text-lg lg:text-xl">
                                            {coachInitials}
                                          </span>
                                        </div>
                                        <div className={cn(
                                          "absolute -top-2 -right-2 w-6 h-6 rounded-full border-4 border-white shadow-lg",
                                          isOnline ? "bg-green-400" : "bg-gray-400"
                                        )}>
                                          {isOnline && <div className="absolute inset-1 bg-green-300 rounded-full animate-ping"></div>}
                                        </div>
                                      </div>
                                      
                                      <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                          <h4 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                                            {coachName}
                                          </h4>
                                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                          <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                                            Coach
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600 mb-3">
                                          <div className="flex items-center gap-2">
                                            {isOnline ? (
                                              <Wifi className="w-4 h-4 text-green-500" />
                                            ) : (
                                              <WifiOff className="w-4 h-4 text-gray-400" />
                                            )}
                                            <span className="font-medium text-sm lg:text-base">
                                              {isOnline ? 'Online now' : `Last seen ${formatLastSeen(lastSeen)}`}
                                            </span>
                                          </div>
                                        </div>
                                        {coach.notes && (
                                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                            <p className="text-sm text-gray-700">
                                              <span className="font-semibold text-gray-900">Coach Notes:</span> {coach.notes}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-3">
                                      {unreadCount > 0 && (
                                        <Badge variant="destructive" className="text-sm px-3 py-2 animate-bounce shadow-lg bg-red-500 text-white">
                                          {unreadCount} new message{unreadCount > 1 ? 's' : ''}
                                        </Badge>
                                      )}
                                      <div className="flex items-center gap-2 bg-green-50 rounded-full px-4 py-2 group-hover:bg-green-100 transition-colors">
                                        <MessageCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-semibold text-green-700">Start Chat</span>
                                      </div>
                                    </div>
                                  </div>
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
