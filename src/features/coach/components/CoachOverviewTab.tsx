
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Calendar,
  MessageSquare,
  AlertTriangle
} from "lucide-react";
import { CoachTask } from "../hooks/useCoachTasks";
import { format } from "date-fns";

interface CoachOverviewTabProps {
  trainees: any[];
  tasks: CoachTask[];
  totalUnreadMessages: number;
}

const CoachOverviewTab = ({ trainees, tasks, totalUnreadMessages }: CoachOverviewTabProps) => {
  const totalTrainees = trainees.length;
  const activeTrainees = trainees.filter(t => 
    (t.trainee_profile?.ai_generations_remaining || 0) > 0
  ).length;
  
  const pendingTasks = tasks.filter(task => !task.completed);
  const overdueTasks = tasks.filter(task => 
    !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
  );
  const upcomingTasks = tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    new Date(task.dueDate) > new Date() &&
    new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
  );

  const recentTrainees = trainees
    .sort((a, b) => new Date(b.assigned_at).getTime() - new Date(a.assigned_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Trainee Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Trainees</span>
                <span className="font-semibold">{totalTrainees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active</span>
                <span className="font-semibold text-green-600">{activeTrainees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Inactive</span>
                <span className="font-semibold text-gray-500">{totalTrainees - activeTrainees}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Task Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-semibold">{pendingTasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Overdue</span>
                <span className="font-semibold text-red-600">{overdueTasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-semibold text-orange-600">{upcomingTasks.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Unread Messages</span>
                <span className="font-semibold text-blue-600">{totalUnreadMessages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Chats</span>
                <span className="font-semibold">{trainees.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Urgent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overdueTasks.length === 0 && upcomingTasks.length === 0 ? (
              <p className="text-gray-600 text-sm">No urgent tasks at the moment.</p>
            ) : (
              <div className="space-y-3">
                {overdueTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <Clock className="w-4 h-4 text-red-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-gray-600 truncate">{task.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="destructive" className="text-xs">Overdue</Badge>
                        {task.dueDate && (
                          <span className="text-xs text-gray-500">
                            Due: {format(task.dueDate, 'MMM dd')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {upcomingTasks.slice(0, 2).map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-orange-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-gray-600 truncate">{task.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">This Week</Badge>
                        {task.dueDate && (
                          <span className="text-xs text-gray-500">
                            Due: {format(task.dueDate, 'MMM dd')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Trainees */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Recent Trainees
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTrainees.length === 0 ? (
              <p className="text-gray-600 text-sm">No trainees assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {recentTrainees.map((trainee) => {
                  const traineeProfile = trainee.trainee_profile;
                  const traineeName = `${traineeProfile?.first_name || 'Unknown'} ${traineeProfile?.last_name || 'User'}`;
                  
                  return (
                    <div key={trainee.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {(traineeProfile?.first_name?.[0] || 'U').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{traineeName}</p>
                        <p className="text-xs text-gray-600">{traineeProfile?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {traineeProfile?.ai_generations_remaining || 0} credits
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Added: {format(new Date(trainee.assigned_at), 'MMM dd')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="w-6 h-6" />
              <span className="text-sm">Add Trainee</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-sm">Create Task</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm">Send Message</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachOverviewTab;
