
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
    return 'Your Coach'; // Better fallback
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Enhanced Page Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative max-w-6xl mx-auto px-4 py-12">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Chat Hub</h1>
                  <p className="text-blue-100 text-lg">Connect with AI assistant and personal coaches</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span>AI-Powered Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Personal Coaching</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Real-time Chat</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-8">
            <Tabs defaultValue="ai" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl p-2 mb-8">
                <TabsTrigger 
                  value="ai" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-xl transition-all duration-300 font-semibold py-3"
                >
                  <Bot className="w-5 h-5 mr-2" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger 
                  value="coach" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl transition-all duration-300 font-semibold py-3 relative"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Personal Coaches
                  {totalUnreadMessages > 0 && (
                    <Badge variant="destructive" className="ml-2 text-xs animate-pulse">
                      {totalUnreadMessages}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai" className="mt-0">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Bot className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold mb-2">
                          AI Fitness Assistant
                        </CardTitle>
                        <p className="text-blue-100">
                          Get instant answers to your fitness and nutrition questions
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <AIChatInterface />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="coach" className="mt-0">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                          <Users className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold mb-2">
                            Personal Coaching
                          </CardTitle>
                          <p className="text-green-100">
                            Connect with your dedicated fitness coaches
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {totalUnreadMessages > 0 && (
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 animate-pulse px-3 py-1">
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
                  
                  <CardContent className="p-8">
                    {showDebugInfo && (
                      <div className="mb-8 p-6 bg-gray-50 rounded-xl text-sm border border-gray-200">
                        <strong className="text-gray-900 block mb-3">Debug Information:</strong>
                        <div className="grid grid-cols-2 gap-4 text-gray-700">
                          <div>User ID: {user?.id}</div>
                          <div>Is Coach: {isRoleCoach ? 'Yes' : 'No'}</div>
                          <div>Is Admin: {isAdmin ? 'Yes' : 'No'}</div>
                          <div>Loading: {isLoadingCoachInfo ? 'Yes' : 'No'}</div>
                          <div>Coaches Count: {coaches.length}</div>
                          <div>Error: {coachInfoError?.message || 'None'}</div>
                          <div>Total Unread: {totalUnreadMessages}</div>
                          <div className="col-span-2">Unread by Coach: {JSON.stringify(unreadMessagesByCoach)}</div>
                        </div>
                      </div>
                    )}

                    {isLoadingCoachInfo ? (
                      <div className="text-center py-20">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-8"></div>
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                            <Users className="h-8 w-8 text-green-600" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Finding your coaches...</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                          We're checking your coach assignments and setting up your personalized coaching experience.
                        </p>
                      </div>
                    ) : coachInfoError ? (
                      <div className="text-center py-20">
                        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
                          <AlertCircle className="h-10 w-10 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          Unable to Load Coach Information
                        </h3>
                        <p className="text-red-600 mb-2 max-w-lg mx-auto">
                          {coachInfoError.message || 'An unexpected error occurred while loading your coaches'}
                        </p>
                        <p className="text-gray-500 text-sm mb-8">
                          Retry attempts: {retryCount}/5
                        </p>
                        <div className="flex gap-4 justify-center">
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
                            className="bg-green-600 hover:bg-green-700 px-6 py-3"
                          >
                            Refresh Page
                          </Button>
                        </div>
                      </div>
                    ) : coaches.length === 0 ? (
                      <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-8">
                          <Users className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          No Coaches Assigned Yet
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                          You don't have any personal coaches assigned to your account yet. Contact our support team to get matched with a qualified fitness coach who can guide your journey.
                        </p>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 max-w-lg mx-auto">
                          <h4 className="font-semibold text-gray-900 mb-2">Why get a coach?</h4>
                          <ul className="text-sm text-gray-600 space-y-1 text-left">
                            <li>• Personalized workout and nutrition plans</li>
                            <li>• Real-time support and motivation</li>
                            <li>• Expert guidance for faster results</li>
                            <li>• Accountability and progress tracking</li>
                          </ul>
                        </div>
                        {totalUnreadMessages > 0 && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-lg mx-auto mt-6">
                            <p className="text-yellow-800 text-sm">
                              <strong>Note:</strong> You have {totalUnreadMessages} unread messages, but no coach assignments were found. This might indicate a temporary data sync issue.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Enhanced Status Card */}
                        <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 border border-green-200">
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
                                <p className="text-green-600">Ready to support your fitness journey</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => setShowCoachChat(true)}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                              <MessageCircle className="w-5 h-5" />
                              Start Chatting
                            </Button>
                          </div>
                        </div>

                        {/* Enhanced Coach Preview Grid */}
                        <div className="grid gap-6">
                          {coaches.slice(0, 3).map((coach) => {
                            const unreadCount = unreadMessagesByCoach[coach.coach_id] || 0;
                            const coachName = getCoachDisplayName(coach);
                            const coachInitials = getCoachInitials(coach);
                            
                            return (
                              <div 
                                key={coach.id} 
                                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-white via-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-300 hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                                onClick={() => setShowCoachChat(true)}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="relative p-8">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-6">
                                      <div className="relative">
                                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                                          <span className="text-white font-bold text-xl">
                                            {coachInitials}
                                          </span>
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white animate-pulse"></div>
                                      </div>
                                      
                                      <div>
                                        <div className="flex items-center gap-3 mb-2">
                                          <h4 className="text-2xl font-bold text-green-800 group-hover:text-green-700 transition-colors">
                                            {coachName}
                                          </h4>
                                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                        </div>
                                        <div className="flex items-center gap-3 text-green-600 mb-3">
                                          <Calendar className="w-4 h-4" />
                                          <span className="font-medium">Assigned {new Date(coach.assigned_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                          <span className="text-sm text-green-700">Available now</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-4">
                                      {unreadCount > 0 && (
                                        <Badge variant="destructive" className="text-sm px-3 py-1 animate-pulse shadow-lg">
                                          {unreadCount} new messages
                                        </Badge>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5 text-green-600 group-hover:text-green-700 transition-colors" />
                                        <span className="text-sm text-green-700 font-medium">Tap to chat</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {coach.notes && (
                                    <div className="mt-6 bg-white/80 rounded-xl p-4 border border-green-100">
                                      <p className="text-sm text-gray-700">
                                        <span className="font-semibold text-green-800">Coach Notes:</span> {coach.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          
                          {coaches.length > 3 && (
                            <div className="text-center py-6">
                              <Button
                                variant="ghost"
                                onClick={() => setShowCoachChat(true)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 px-8 py-3 rounded-xl font-semibold"
                              >
                                View {coaches.length - 3} more coaches →
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
