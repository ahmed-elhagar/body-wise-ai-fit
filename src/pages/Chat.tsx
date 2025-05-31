
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Bot, Users } from "lucide-react";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { useUnreadMessagesFromCoach } from "@/hooks/useUnreadMessages";
import { TraineeCoachChat } from "@/components/coach/TraineeCoachChat";
import { useLanguage } from "@/contexts/LanguageContext";
import AIChatInterface from "@/components/chat/AIChatInterface";

const Chat = () => {
  const { t } = useLanguage();
  const { coachInfo } = useCoachSystem();
  const { data: unreadCoachMessages = 0 } = useUnreadMessagesFromCoach();
  const [showCoachChat, setShowCoachChat] = useState(false);

  // Show coach chat interface
  if (showCoachChat && coachInfo) {
    return (
      <ProtectedRoute>
        <Layout>
          <TraineeCoachChat
            coachId={coachInfo.coach_profile?.id || ''}
            coachName={`${coachInfo.coach_profile?.first_name || 'Unknown'} ${coachInfo.coach_profile?.last_name || 'Coach'}`}
            onBack={() => setShowCoachChat(false)}
          />
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t('Chat')}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('Connect with AI assistant and your coach')}
              </p>
            </div>
          </div>

          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 shadow-sm">
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
                {t('Your Coach')}
                {unreadCoachMessages > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {unreadCoachMessages}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="mt-6">
              <AIChatInterface />
            </TabsContent>

            <TabsContent value="coach" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    {t('Coach Chat')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!coachInfo ? (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {t('No Coach Assigned')}
                      </h3>
                      <p className="text-gray-600">
                        {t('You don\'t have a coach assigned yet. Contact support to get paired with a coach.')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-700 font-semibold">
                              {coachInfo.coach_profile?.first_name?.[0]}{coachInfo.coach_profile?.last_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-800">
                              {coachInfo.coach_profile?.first_name || 'Unknown'} {coachInfo.coach_profile?.last_name || 'Coach'}
                            </h4>
                            <p className="text-sm text-green-600">
                              {t('Assigned')} {new Date(coachInfo.assigned_at).toLocaleDateString()}
                            </p>
                            {unreadCoachMessages > 0 && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                {unreadCoachMessages} {t('new messages')}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setShowCoachChat(true)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {t('Open Chat')}
                        </button>
                      </div>
                      
                      {coachInfo.notes && (
                        <div className="p-4 bg-gray-50 rounded-lg border">
                          <p className="text-sm text-gray-600">
                            <strong>{t('Coach Notes')}:</strong> {coachInfo.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Chat;
