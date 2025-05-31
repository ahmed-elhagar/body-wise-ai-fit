import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Bot, Users, AlertCircle, Loader2, RefreshCw, Bug, UserCheck, Calendar, Star, Sparkles, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { TraineeCoachChat } from "@/components/coach/TraineeCoachChat";
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
  const [selectedCoach, setSelectedCoach] = useState<CoachInfo | null>(null);
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
    coaches: coaches.map(c => ({
      id: c.id,
      coach_id: c.coach_id,
      name: getCoachDisplayName(c)
    }))
  });

  // Helper function to get coach display name
  const getCoachDisplayName = (coach: CoachInfo) => {
    if (coach.coach_profile?.first_name || coach.coach_profile?.last_name) {
      const firstName = coach.coach_profile.first_name || '';
      const lastName = coach.coach_profile.last_name || '';
      return `${firstName} ${lastName}`.trim();
    }
    return 'Your Coach';
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

  // Show selected coach chat directly
  if (selectedCoach) {
    return (
      <ProtectedRoute>
        <Layout>
          <TraineeCoachChat
            coachId={selectedCoach.coach_id}
            coachName={getCoachDisplayName(selectedCoach)}
            onBack={() => setSelectedCoach(null)}
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          {/* Enhanced Page Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-gray-900 to-blue-900 text-white">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative max-w-6xl mx-auto px-4 py-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1 text-white">Communication Hub</h1>
                  <p className="text-gray-200 text-sm">Connect with AI assistant and personal coaches</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-300 text-xs">
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>AI-Powered Support</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>Personal Coaching</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>Real-time Chat</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-4">
            <Tabs defaultValue="ai" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 shadow-lg rounded-xl p-1 mb-4">
                <TabsTrigger 
                  value="ai" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:text-blue-600 rounded-lg transition-all duration-200 font-medium py-2"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger 
                  value="coach" 
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:text-green-600 rounded-lg transition-all duration-200 font-medium py-2 relative"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Personal Coaches
                  {totalUnreadMessages > 0 && (
                    <Badge variant="destructive" className="ml-2 text-xs animate-pulse bg-red-500 text-white">
                      {totalUnreadMessages}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai" className="mt-0">
                <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold mb-1 text-white">
                          AI Fitness Assistant
                        </CardTitle>
                        <p className="text-blue-100 text-xs">
                          Get instant answers to your fitness and nutrition questions
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[400px]">
                      <AIChatInterface />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="coach" className="mt-0">
                <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold mb-1 text-white">
                            Personal Coaching
                          </CardTitle>
                          <p className="text-green-100 text-xs">
                            Connect with your dedicated fitness coaches
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {totalUnreadMessages > 0 && (
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 animate-pulse px-2 py-1 text-xs">
                            {totalUnreadMessages} unread
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDebugInfo(!showDebugInfo)}
                          className="text-white hover:bg-white/20 p-1"
                        >
                          <Bug className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    {showDebugInfo && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg text-xs border border-gray-200">
                        <strong className="text-gray-900 block mb-2">Debug Information:</strong>
                        <div className="grid grid-cols-2 gap-2 text-gray-700">
                          <div>User ID: <span className="font-mono text-xs">{user?.id}</span></div>
                          <div>Is Coach: <span className="font-semibold">{isRoleCoach ? 'Yes' : 'No'}</span></div>
                          <div>Is Admin: <span className="font-semibold">{isAdmin ? 'Yes' : 'No'}</span></div>
                          <div>Loading: <span className="font-semibold">{isLoadingCoachInfo ? 'Yes' : 'No'}</span></div>
                          <div>Coaches Count: <span className="font-semibold">{coaches.length}</span></div>
                          <div>Error: <span className="text-red-600">{coachInfoError?.message || 'None'}</span></div>
                          <div>Total Unread: <span className="font-semibold">{totalUnreadMessages}</span></div>
                          <div className="col-span-2">Unread by Coach: <span className="font-mono text-xs">{JSON.stringify(unreadMessagesByCoach)}</span></div>
                        </div>
                      </div>
                    )}

                    {isLoadingCoachInfo ? (
                      <div className="text-center py-12">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-green-600 mx-auto mb-4"></div>
                          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                            <Users className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Finding your coaches...</h3>
                        <p className="text-gray-600 max-w-md mx-auto text-xs">
                          We're checking your coach assignments and setting up your personalized coaching experience.
                        </p>
                      </div>
                    ) : coachInfoError ? (
                      <div className="text-center py-12">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Unable to Load Coach Information
                        </h3>
                        <p className="text-red-600 mb-2 max-w-lg mx-auto text-xs">
                          {coachInfoError.message || 'An unexpected error occurred while loading your coaches'}
                        </p>
                        <p className="text-gray-500 text-xs mb-4">
                          Retry attempts: {retryCount}/5
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Button 
                            onClick={handleRetry}
                            variant="outline" 
                            disabled={retryCount > 5}
                            className="border-green-200 hover:bg-green-50 px-3 py-2 text-xs"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Try Again {retryCount > 0 && `(${retryCount})`}
                          </Button>
                          <Button 
                            onClick={handleForceRefresh}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-xs"
                          >
                            Refresh Page
                          </Button>
                        </div>
                      </div>
                    ) : coaches.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          No Coaches Assigned Yet
                        </h3>
                        <p className="text-gray-600 mb-4 max-w-lg mx-auto text-xs">
                          You don't have any personal coaches assigned to your account yet. Contact our support team to get matched with a qualified fitness coach who can guide your journey.
                        </p>
                        <div className="bg-blue-50 rounded-lg p-3 max-w-lg mx-auto">
                          <h4 className="font-semibold text-gray-900 mb-2 text-xs">Why get a coach?</h4>
                          <ul className="text-xs text-gray-600 space-y-1 text-left">
                            <li>• Personalized workout and nutrition plans</li>
                            <li>• Real-time support and motivation</li>
                            <li>• Expert guidance for faster results</li>
                            <li>• Accountability and progress tracking</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Enhanced Status Card */}
                        <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <UserCheck className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-green-800 mb-1">
                                  {coaches.length === 1 
                                    ? 'You have 1 personal coach'
                                    : `You have ${coaches.length} personal coaches`
                                  }
                                </p>
                                <p className="text-green-600 text-xs">Click on any coach below to start chatting</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Coach List - Direct Click to Chat */}
                        <div className="grid gap-3">
                          {coaches.map((coach) => {
                            const unreadCount = unreadMessagesByCoach[coach.coach_id] || 0;
                            const coachName = getCoachDisplayName(coach);
                            const coachInitials = getCoachInitials(coach);
                            
                            return (
                              <div 
                                key={coach.id} 
                                className="group relative overflow-hidden rounded-xl bg-white border-2 border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                onClick={() => setSelectedCoach(coach)}
                              >
                                <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                
                                <div className="relative p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                                          <span className="text-white font-bold text-sm">
                                            {coachInitials}
                                          </span>
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                      </div>
                                      
                                      <div>
                                        <div className="flex items-center gap-1 mb-1">
                                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                                            {coachName}
                                          </h4>
                                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600 mb-1 text-xs">
                                          <Calendar className="w-2 h-2" />
                                          <span className="font-medium">Assigned {new Date(coach.assigned_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                          <span className="text-xs text-gray-600">Available now</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-2">
                                      {unreadCount > 0 && (
                                        <Badge variant="destructive" className="text-xs px-2 py-1 animate-pulse shadow-sm bg-red-500 text-white">
                                          {unreadCount} new
                                        </Badge>
                                      )}
                                      <div className="flex items-center gap-1">
                                        <MessageCircle className="w-3 h-3 text-green-600 group-hover:text-green-700 transition-colors" />
                                        <span className="text-xs text-gray-600 font-medium">Click to chat</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {coach.notes && (
                                    <div className="mt-3 bg-gray-50 rounded-lg p-2 border border-gray-100">
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
