
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Bot, Users, AlertCircle, Loader2, RefreshCw, Bug, UserCheck, Calendar, Star, Sparkles, MessageSquare, Zap, Heart } from "lucide-react";
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

  // Helper function to get coach display name - moved to top
  const getCoachDisplayName = (coach: CoachInfo) => {
    if (coach.coach_profile?.first_name || coach.coach_profile?.last_name) {
      const firstName = coach.coach_profile.first_name || '';
      const lastName = coach.coach_profile.last_name || '';
      return `${firstName} ${lastName}`.trim();
    }
    return 'Your Coach';
  };

  // Helper function to get coach initials - moved to top
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Enhanced Modern Page Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 text-white">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-indigo-400/20 to-cyan-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative max-w-7xl mx-auto px-6 py-8">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-xl">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-white">Communication Hub</h1>
                  <p className="text-blue-100 text-lg">Connect with AI assistant and personal coaches</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-blue-200 text-sm">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>AI-Powered Support</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <Users className="h-4 w-4" />
                  <span>Personal Coaching</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <Heart className="h-4 w-4" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            <Tabs defaultValue="ai" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-2 mb-8">
                <TabsTrigger 
                  value="ai" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:text-blue-600 data-[state=inactive]:hover:bg-blue-50 rounded-xl transition-all duration-200 font-semibold py-4 text-lg"
                >
                  <Bot className="w-5 h-5 mr-3" />
                  AI Assistant
                  <Zap className="w-4 h-4 ml-2" />
                </TabsTrigger>
                <TabsTrigger 
                  value="coach" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:text-green-600 data-[state=inactive]:hover:bg-green-50 rounded-xl transition-all duration-200 font-semibold py-4 text-lg relative"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Personal Coaches
                  {totalUnreadMessages > 0 && (
                    <Badge variant="destructive" className="ml-3 text-sm animate-pulse bg-red-500 text-white shadow-lg">
                      {totalUnreadMessages}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai" className="mt-0">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Bot className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold mb-2 text-white">
                          AI Fitness Assistant
                        </CardTitle>
                        <p className="text-blue-100 text-base">
                          Get instant, personalized answers to your fitness and nutrition questions
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[500px]">
                      <AIChatInterface />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="coach" className="mt-0">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold mb-2 text-white">
                            Personal Coaching
                          </CardTitle>
                          <p className="text-green-100 text-base">
                            Connect with your dedicated fitness coaches for personalized guidance
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {totalUnreadMessages > 0 && (
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 animate-pulse px-4 py-2 text-base">
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
                  
                  <CardContent className="p-8">
                    {showDebugInfo && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-xl text-sm border border-gray-200">
                        <strong className="text-gray-900 block mb-3">Debug Information:</strong>
                        <div className="grid grid-cols-2 gap-3 text-gray-700">
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
                      <div className="text-center py-16">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-6"></div>
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                            <Users className="h-8 w-8 text-green-600" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Finding your coaches...</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                          We're checking your coach assignments and setting up your personalized coaching experience.
                        </p>
                      </div>
                    ) : coachInfoError ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          Unable to Load Coach Information
                        </h3>
                        <p className="text-red-600 mb-3 max-w-lg mx-auto">
                          {coachInfoError.message || 'An unexpected error occurred while loading your coaches'}
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                          Retry attempts: {retryCount}/5
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button 
                            onClick={handleRetry}
                            variant="outline" 
                            disabled={retryCount > 5}
                            className="border-green-200 hover:bg-green-50 px-6 py-3"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again {retryCount > 0 && `(${retryCount})`}
                          </Button>
                          <Button 
                            onClick={handleForceRefresh}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                          >
                            Refresh Page
                          </Button>
                        </div>
                      </div>
                    ) : coaches.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Users className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          No Coaches Assigned Yet
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                          You don't have any personal coaches assigned to your account yet. Contact our support team to get matched with a qualified fitness coach who can guide your journey.
                        </p>
                        <div className="bg-blue-50 rounded-2xl p-6 max-w-lg mx-auto">
                          <h4 className="font-semibold text-gray-900 mb-3">Why get a coach?</h4>
                          <ul className="text-sm text-gray-600 space-y-2 text-left">
                            <li>• Personalized workout and nutrition plans</li>
                            <li>• Real-time support and motivation</li>
                            <li>• Expert guidance for faster results</li>
                            <li>• Accountability and progress tracking</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Enhanced Status Card */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                          <div className="flex items-center justify-between">
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
                                <p className="text-green-600">Click on any coach below to start chatting</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Coach List - Direct Click to Chat */}
                        <div className="grid gap-4">
                          {coaches.map((coach) => {
                            const unreadCount = unreadMessagesByCoach[coach.coach_id] || 0;
                            const coachName = getCoachDisplayName(coach);
                            const coachInitials = getCoachInitials(coach);
                            
                            return (
                              <div 
                                key={coach.id} 
                                className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                                onClick={() => setSelectedCoach(coach)}
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="relative p-6">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                          <span className="text-white font-bold text-lg">
                                            {coachInitials}
                                          </span>
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                                      </div>
                                      
                                      <div>
                                        <div className="flex items-center gap-2 mb-2">
                                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                                            {coachName}
                                          </h4>
                                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
                                          <Calendar className="w-4 h-4" />
                                          <span className="font-medium">Assigned {new Date(coach.assigned_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                          <span className="text-sm text-gray-600">Available now</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-3">
                                      {unreadCount > 0 && (
                                        <Badge variant="destructive" className="text-sm px-3 py-1 animate-pulse shadow-sm bg-red-500 text-white">
                                          {unreadCount} new
                                        </Badge>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5 text-green-600 group-hover:text-green-700 transition-colors" />
                                        <span className="text-sm text-gray-600 font-medium">Click to chat</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {coach.notes && (
                                    <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                                      <p className="text-sm text-gray-700">
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
