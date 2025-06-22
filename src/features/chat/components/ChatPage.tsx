import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Bot, Users, AlertCircle, Loader2, RefreshCw, UserCheck, Calendar, Star, MessageSquare, Bug, Sparkles, Wifi, WifiOff, Zap, TrendingUp, Activity } from "lucide-react";
import { useCoachSystem } from "@/features/coach/hooks/useCoachSystem";
import TraineeCoachChat from "@/features/coach/components/TraineeCoachChat";
import { useLanguage } from "@/contexts/LanguageContext";
import AIChatInterface from "@/features/chat/components/AIChatInterface";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRole } from "@/shared/hooks/useRole";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useUserOnlineStatus } from "@/shared/hooks/useUserOnlineStatus";
import { useOnlineStatus } from "@/shared/hooks/useOnlineStatus";
import { useLiveNotifications } from "@/shared/hooks/useLiveNotifications";
import type { CoachInfo } from "@/shared/hooks/coach/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, CheckCircle2 } from "lucide-react";
import { useCoachInfo } from "@/features/chat/hooks/useCoachInfo";

interface CoachInfo {
  coach_id: string;
  coach_name: string | null;
  coach_username: string | null;
  coach_email: string | null;
  last_seen?: string;
  unread_count?: number;
}

const Chat = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isCoach: isRoleCoach, isAdmin } = useRole();
  const isMobile = useIsMobile();
  
  // Initialize real-time features
  useOnlineStatus(); // Track current user's online status
  useLiveNotifications(); // Listen for live notifications
  
  const { 
    trainees, 
    isLoadingTrainees, 
    totalUnreadMessages,
    isCoach 
  } = useCoachSystem();
  
  // Convert trainees to coaches format for compatibility
  const coaches = trainees || [];
  const isLoadingCoachInfo = isLoadingTrainees;
  const coachInfoError = null;
  const unreadMessagesByCoach = {};
  
  const [selectedCoach, setSelectedCoach] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Get coach IDs for online status tracking
  const coachIds = coaches.map(coach => coach.coach_id);
  const { getUserOnlineStatus } = useUserOnlineStatus();

  // Debug logging
  useEffect(() => {
    console.log('💬 Chat page state:', {
      coaches: coaches?.length,
      isLoading: isLoadingCoachInfo,
      error: coachInfoError?.message,
      totalUnreadMessages,
      selectedCoach: selectedCoach?.coach_id
    });
  }, [coaches, isLoadingCoachInfo, coachInfoError, totalUnreadMessages, selectedCoach]);

  // Helper function to get coach display name
  const getCoachDisplayName = (coach: any) => {
    if (coach.coach_profile?.first_name && coach.coach_profile?.last_name) {
      return `${coach.coach_profile.first_name} ${coach.coach_profile.last_name}`;
    }
    if (coach.coach_profile?.first_name) return coach.coach_profile.first_name;
    if (coach.coach_profile?.email) return coach.coach_profile.email.split('@')[0];
    return `Coach ${coach.coach_id?.slice(0, 8) || 'Unknown'}`;
  };

  // Helper function to get coach initials
  const getCoachInitials = (coach: any) => {
    const name = getCoachDisplayName(coach);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return 'Recently active';
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const refetchCoachInfo = () => {
    // Placeholder for refetch functionality
    console.log('Refetching coach info...');
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
      name: getCoachDisplayName(c)
    }))
  });

  // Show selected coach chat directly
  if (selectedCoach) {
    return (
      <div>
        {isMobile ? (
          <TraineeCoachChat
            coachId={selectedCoach.coach_id}
            coachName={getCoachDisplayName(selectedCoach)}
            onBack={() => setSelectedCoach(null)}
          />
        ) : (
          <div>
            <TraineeCoachChat
              coachId={selectedCoach.coach_id}
              coachName={getCoachDisplayName(selectedCoach)}
              onBack={() => setSelectedCoach(null)}
            />
          </div>
        )}
      </div>
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

  // Transform coaches data for display
  const coachesWithUnread = coaches?.map(coach => ({
    ...coach,
    unread_count: Math.floor(Math.random() * 3) // Mock unread count for demo
  })) || [];

  // Calculate total unread from coaches
  const calculatedUnreadMessages = coachesWithUnread.reduce((total, coach) => {
    return total + (coach.unread_count || 0);
  }, 0);

  // Use the higher of the two unread counts
  const displayUnreadMessages = Math.max(totalUnreadMessages || 0, calculatedUnreadMessages);

  // Sort coaches by unread messages first, then by assigned date
  const sortedCoaches = [...coachesWithUnread].sort((a, b) => {
    const aUnread = a.unread_count || 0;
    const bUnread = b.unread_count || 0;
    if (aUnread !== bUnread) return bUnread - aUnread;
    
    const aDate = new Date(a.assigned_at || 0).getTime();
    const bDate = new Date(b.assigned_at || 0).getTime();
    return bDate - aDate;
  });

  return (
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
              {displayUnreadMessages > 0 && (
                <div className="bg-red-500/20 backdrop-blur-md rounded-xl p-4 border border-red-300/30">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="h-4 w-4 text-red-300" />
                    <span className="text-sm text-red-300 font-medium">Unread</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{displayUnreadMessages}</div>
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
                {displayUnreadMessages > 0 && (
                  <Badge variant="destructive" className="ml-2 animate-bounce bg-red-500 text-white shadow-lg px-2 py-1 text-xs">
                    {displayUnreadMessages}
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
                    {displayUnreadMessages > 0 && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/20 animate-pulse px-4 py-2 text-base font-semibold">
                        {displayUnreadMessages} unread
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
                {/* Debug Information */}
                {showDebugInfo && (
                  <Alert className="mb-6 bg-gray-50 border-gray-200">
                    <Bug className="h-4 w-4" />
                    <AlertDescription>
                      <div className="text-sm space-y-1">
                        <div><strong>Loading:</strong> {isLoadingCoachInfo ? 'Yes' : 'No'}</div>
                        <div><strong>Error:</strong> {coachInfoError?.message || 'None'}</div>
                        <div><strong>Coaches Found:</strong> {coaches.length}</div>
                        <div><strong>Total Unread:</strong> {displayUnreadMessages}</div>
                        <div><strong>Retry Count:</strong> {retryCount}</div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Loading State */}
                {isLoadingCoachInfo && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center gap-3 text-lg text-gray-600">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      Loading your coaches...
                    </div>
                  </div>
                )}

                {/* Error State */}
                {coachInfoError && !isLoadingCoachInfo && (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Unable to Load Coaches
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {coachInfoError.message || 'There was a problem loading your coach information.'}
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button onClick={handleRetry} variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Try Again
                        </Button>
                        <Button onClick={handleForceRefresh} variant="default">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Force Refresh
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!isLoadingCoachInfo && !coachInfoError && coaches.length === 0 && (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Coaches Available
                      </h3>
                      <p className="text-gray-600 mb-6">
                        You don't have any assigned coaches yet. Contact support to get connected with a fitness professional.
                      </p>
                      <Button onClick={handleRetry} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </div>
                )}

                {/* Coaches List */}
                {!isLoadingCoachInfo && !coachInfoError && sortedCoaches && sortedCoaches.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Your Coaches ({sortedCoaches.length})
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => refetchCoachInfo()}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {sortedCoaches.map((coach) => (
                        <Card 
                          key={coach.coach_id}
                          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-white/80 backdrop-blur-sm border-gray-200/50"
                          onClick={() => setSelectedCoach(coach)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <Avatar className="h-12 w-12 border-2 border-green-200">
                                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-semibold">
                                    {getCoachInitials(coach)}
                                  </AvatarFallback>
                                </Avatar>
                                {coach.unread_count && coach.unread_count > 0 && (
                                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">
                                      {coach.unread_count > 9 ? '9+' : coach.unread_count}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">
                                  {getCoachDisplayName(coach)}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  <span className="text-sm text-gray-500">
                                    {formatLastSeen(coach.last_seen)}
                                  </span>
                                </div>
                                {coach.unread_count && coach.unread_count > 0 && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <MessageCircle className="h-3 w-3 text-blue-500" />
                                    <span className="text-sm text-blue-600 font-medium">
                                      {coach.unread_count} new message{coach.unread_count > 1 ? 's' : ''}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <span className="text-xs text-gray-400">Active</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Chat;
