
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageCircle, Plus } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface CoachDashboardProps {
  trainees: any[];
  onAddTrainee: () => void;
}

export const CoachDashboard = ({ trainees, onAddTrainee }: CoachDashboardProps) => {
  const { t } = useI18n();
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('coach:dashboard') || 'Coach Dashboard'}</h1>
          <p className="text-gray-600 mt-2">{t('coach:manageTrainees') || 'Manage your trainees and track their progress'}</p>
        </div>
        <Button onClick={onAddTrainee} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('coach:addNewTrainee') || 'Add New Trainee'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('coach:trainees') || 'Trainees'}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainees.length}</div>
            <p className="text-xs text-muted-foreground">{t('coach:activeClients') || 'Active clients'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('coach:messagesToday') || 'Messages Today'}</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">{t('coach:clientInteractions') || 'Client interactions'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('coach:successRate') || 'Success Rate'}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">{t('coach:clientGoalAchievement') || 'Client goal achievement'}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t('common:overview') || 'Overview'}</TabsTrigger>
          <TabsTrigger value="clients">{t('coach:clients') || 'Clients'}</TabsTrigger>
          <TabsTrigger value="analytics">{t('coach:analytics') || 'Analytics'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('coach:recentActivity') || 'Recent Activity'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('coach:noRecentActivity') || 'No recent activity to display'}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-4">
          {trainees.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('coach:noTrainees') || 'No trainees yet'}</h3>
                <p className="text-gray-600 mb-4">{t('coach:addFirstTrainee') || 'Add your first trainee to get started'}</p>
                <Button onClick={onAddTrainee}>{t('coach:addTrainee') || 'Add Trainee'}</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trainees.map((trainee: any, index: number) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-900">{trainee.name || `Trainee ${index + 1}`}</h3>
                    <p className="text-sm text-gray-600">{trainee.goal || t('common:noGoal') || 'No goal set'}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('coach:performanceAnalytics') || 'Performance Analytics'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('coach:analyticsComingSoon') || 'Advanced analytics coming soon'}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
