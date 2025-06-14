
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  Activity
} from "lucide-react";
import { useCoachSystem } from "@/hooks/useCoachSystem";
import { useCoachTasks } from "../hooks/useCoachTasks";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  TraineesTab,
  CoachTasksPanel,
  CoachAnalyticsTab,
  AssignTraineeDialog,
  CreateTaskDialog,
  CoachMessagesTab
} from ".";
import { TraineeProgressOverview } from "@/components/coach/overview/TraineeProgressOverview";
import { QuickActions } from "@/components/coach/overview/QuickActions";
import { CompactTasksPanel } from "@/components/coach/overview/CompactTasksPanel";

export const CoachDashboard = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false);
  
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
    !task.completed && task.due_date && new Date(task.due_date) < new Date()
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
            {/* Main Content - Trainee Progress */}
            <div className="lg:col-span-2">
              <TraineeProgressOverview 
                trainees={trainees || []}
                onViewAllTrainees={() => setActiveTab('trainees')}
              />
            </div>

            {/* Sidebar - Quick Actions & Tasks */}
            <div className="space-y-6">
              <QuickActions 
                pendingTasks={pendingTasks}
                unreadMessages={totalUnreadMessages}
                onAddTrainee={() => setShowAssignDialog(true)}
                onViewTasks={() => setActiveTab('tasks')}
                onViewMessages={() => setActiveTab('messages')}
              />
              
              <CompactTasksPanel 
                onViewAllTasks={() => setActiveTab('tasks')}
                onCreateTask={() => setShowCreateTaskDialog(true)}
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

      {/* Dialogs */}
      <AssignTraineeDialog 
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
      />
      
      <CreateTaskDialog 
        open={showCreateTaskDialog}
        onOpenChange={setShowCreateTaskDialog}
        trainees={trainees || []}
      />
    </div>
  );
};
