import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, Plus, ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { CoachTraineeChat, MultipleCoachesChat } from "@/features/coach/components";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { useRole } from "@/hooks/useRole";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CoachInfo } from "@/hooks/coach/types";

const Chat = () => {
  const { t } = useLanguage();
  const { isCoach } = useRole();
  const { coaches, unreadMessagesByCoach, isLoadingCoachInfo } = useCoachSystem();
  const [selectedView, setSelectedView] = useState<'list' | 'chat'>('list');

  // For coaches - show a simple message since they use the coach dashboard
  if (isCoach) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            <PageHeader
              title={t('Coach Communications')}
              description={t('Manage trainee conversations from your coach dashboard')}
              icon={<MessageCircle className="h-6 w-6 text-green-600" />}
            />
            
            <div className="max-w-4xl mx-auto p-4 md:p-6">
              <Card className="text-center">
                <CardContent className="p-8">
                  <Users className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('Coach Dashboard Available')}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {t('Access your trainee communications through the dedicated coach dashboard for enhanced management features.')}
                  </p>
                  <Button onClick={() => window.location.href = '/coach'}>
                    {t('Go to Coach Dashboard')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // For trainees - show coach chat interface
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
          <PageHeader
            title={t('Coach Chat')}
            description={t('Connect with your personal fitness coaches')}
            icon={<MessageCircle className="h-6 w-6 text-green-600" />}
          />
          
          <div className="max-w-6xl mx-auto p-4 md:p-6">
            {isLoadingCoachInfo ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">{t('Loading your coaches...')}</p>
                </CardContent>
              </Card>
            ) : coaches.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('No Coaches Assigned')}
                  </h2>
                  <p className="text-gray-600">
                    {t('You don\'t have any coaches assigned yet. Contact support to get paired with a qualified fitness coach.')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <MultipleCoachesChat 
                coaches={coaches}
                unreadMessagesByCoach={unreadMessagesByCoach}
              />
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Chat;
