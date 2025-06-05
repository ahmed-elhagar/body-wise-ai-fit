
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Activity
} from "lucide-react";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { useCoachTasks } from "@/hooks/useCoachTasks";
import { useLanguage } from "@/contexts/LanguageContext";
import { TraineesTab } from "./TraineesTab";
import CoachTasksPanel from "./CoachTasksPanel";
import { CoachMessagesTab } from "./CoachMessagesTab";
import { CoachAnalyticsTab } from "./CoachAnalyticsTab";

const EnhancedCoachDashboard = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  
  const { 
    trainees, 
    isLoadingTrainees, 
    totalUnreadMessages,
    isCoach 
  } = useCoachSystem();
  
  const { 
    tasks, 
    isLoading: isLoadingTasks 
  } = useCoachTasks();

  // Calculate quick stats
  const totalTrainees = trainees?.length || 0;
  const activeTrainees = trainees?.filter(t => 
    (t.trainee_profile?.ai_generations_remaining || 0) > 0
  ).length || 0;
  
  const pendingTasks = tasks?.filter(task => !task.completed).length || 0;
  const overdueTasks = tasks?.filter(task => 
    !task.completed && task.dueDate && task.dueDate < new Date()
  ).length || 0;

  const completedProfiles = trainees?.filter(t => 
    (t.trainee_profile?.profile_completion_score || 0) >= 80
  ).length || 0;

  if (!isCoach) {
    return (
      <Card className="text-center">
        <CardContent className="p-8">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('Access Denied')}
          </h2>
          <p className="text-gray-600">
            {t('This page is only available to certified coaches.')}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingTrainees || isLoadingTasks) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('Total Trainees')}</p>
                <p className="text-2xl font-bold text-gray-900">{totalTrainees}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('Active Trainees')}</p>
                <p className="text-2xl font-bold text-gray-900">{activeTrainees}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('Pending Tasks')}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{pendingTasks}</p>
                  {overdueTasks > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {overdueTasks} overdue
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('Unread Messages')}</p>
                <p className="text-2xl font-bold text-gray-900">{totalUnreadMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">{t('Overview')}</span>
          </TabsTrigger>
          <TabsTrigger value="trainees" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">{t('Trainees')}</span>
            {totalTrainees > 0 && (
              <Badge variant="secondary" className="ml-1">
                {totalTrainees}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t('Tasks')}</span>
            {pendingTasks > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingTasks}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">{t('Messages')}</span>
            {totalUnreadMessages > 0 && (
              <Badge variant="destructive" className="ml-1">
                {totalUnreadMessages}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Overview Cards */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {t('Trainee Progress Overview')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {totalTrainees === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">{t('No trainees assigned yet')}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {t('Start by adding your first trainee to begin coaching')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round((completedProfiles / totalTrainees) * 100)}%
                          </div>
                          <div className="text-sm text-gray-600">Profile Completion</div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {Math.round((activeTrainees / totalTrainees) * 100)}%
                          </div>
                          <div className="text-sm text-gray-600">Active Users</div>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {totalTrainees}
                          </div>
                          <div className="text-sm text-gray-600">Total Trainees</div>
                        </div>
                      </div>
                      
                      {/* Recent Trainee Activity */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">{t('Recent Activity')}</h4>
                        {trainees?.slice(0, 3).map((trainee) => (
                          <div key={trainee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">
                                {trainee.trainee_profile?.first_name} {trainee.trainee_profile?.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Profile: {trainee.trainee_profile?.profile_completion_score || 0}% complete
                              </div>
                            </div>
                            <Badge 
                              variant={(trainee.trainee_profile?.ai_generations_remaining || 0) > 0 ? "default" : "secondary"}
                            >
                              {(trainee.trainee_profile?.ai_generations_remaining || 0) > 0 ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tasks Summary */}
            <div className="space-y-6">
              <CoachTasksPanel 
                trainees={trainees || []} 
                className="h-fit"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trainees" className="mt-6">
          <TraineesTab 
            trainees={trainees || []} 
            onChatClick={(traineeId) => {
              console.log('Opening chat for trainee:', traineeId);
              // This will be handled by TraineesTab internally
            }}
          />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <CoachTasksPanel trainees={trainees || []} />
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <CoachMessagesTab trainees={trainees || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCoachDashboard;
