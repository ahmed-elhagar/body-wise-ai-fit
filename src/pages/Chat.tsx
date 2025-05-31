
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Bot, Users, AlertCircle, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { useUnreadMessagesFromCoach } from "@/hooks/useUnreadMessages";
import { TraineeCoachChat } from "@/components/coach/TraineeCoachChat";
import { useLanguage } from "@/contexts/LanguageContext";
import AIChatInterface from "@/components/chat/AIChatInterface";

const Chat = () => {
  const { t } = useLanguage();
  const { coachInfo, isLoadingCoachInfo, coachInfoError } = useCoachSystem();
  const { data: unreadCoachMessages = 0 } = useUnreadMessagesFromCoach();
  const [showCoachChat, setShowCoachChat] = useState(false);

  console.log('Chat page - coachInfo:', coachInfo, 'loading:', isLoadingCoachInfo, 'error:', coachInfoError);

  // Show coach chat interface
  if (showCoachChat && coachInfo) {
    return (
      <ProtectedRoute>
        <Layout>
          <TraineeCoachChat
            coachId={coachInfo.coach_id}
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
        <PageHeader
          title={t('Chat')}
          description={t('Connect with AI assistant and your coach')}
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
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  {t('Coach Chat')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingCoachInfo ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-600">{t('Loading coach information...')}</p>
                  </div>
                ) : coachInfoError ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {t('Error Loading Coach Information')}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {t('Unable to load your coach information. Please try refreshing the page.')}
                    </p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      {t('Refresh Page')}
                    </button>
                  </div>
                ) : !coachInfo ? (
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
      </Layout>
    </ProtectedRoute>
  );
};

export default Chat;
