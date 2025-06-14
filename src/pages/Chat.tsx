
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { AIChatInterface } from "@/components/chat/AIChatInterface";
import { MobileChatInterface } from "@/components/chat/MobileChatInterface";
import { ConnectionStatus } from "@/components/chat/ConnectionStatus";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { ConversationAnalytics } from "@/components/chat/ConversationAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, BarChart3, History, Settings, Smartphone, Monitor, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCoach } from "@/hooks/useCoach";
import { useRole } from "@/hooks/useRole";
import { useMobile } from "@/hooks/use-mobile";

const Chat = () => {
  const { user } = useAuth();
  const { role } = useRole();
  const { assignedCoaches, isLoading: coachLoading } = useCoach();
  const isMobile = useMobile();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const hasCoaches = assignedCoaches && assignedCoaches.length > 0;

  if (isMobile) {
    return (
      <ProtectedRoute>
        <Layout>
          <MobileChatInterface />
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
          <PageHeader
            title="FitFatta Chat"
            description="Get personalized fitness advice and connect with your coaches"
            icon={<MessageCircle className="h-7 w-7 text-blue-600" />}
          >
            <div className="flex items-center gap-4">
              <ConnectionStatus isOnline={isOnline} />
              
              {hasCoaches && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {assignedCoaches.length} Coach{assignedCoaches.length > 1 ? 'es' : ''} Available
                </Badge>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {isMobile ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                {isMobile ? 'Mobile' : 'Desktop'}
              </div>
            </div>
          </PageHeader>

          <div className="max-w-7xl mx-auto px-6 py-8">
            <Tabs defaultValue="chat" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  History
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="space-y-6">
                {!isOnline && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 text-orange-800">
                        <WifiOff className="h-5 w-5" />
                        <div>
                          <p className="font-medium">You're currently offline</p>
                          <p className="text-sm opacity-80">Some features may be limited. Messages will be sent when you're back online.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <AIChatInterface />
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Chat History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChatHistory />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <ConversationAnalytics />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Chat;
