
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCoachTrainees } from '../hooks/useCoachTrainees';
import { useCoachTasks } from '../hooks/useCoachTasks';
import { Users, CheckSquare, Clock, AlertCircle } from 'lucide-react';

const CoachDashboard = () => {
  const { trainees, isLoading: traineesLoading } = useCoachTrainees();
  const { tasks, isLoading: tasksLoading } = useCoachTasks();

  const isLoading = traineesLoading || tasksLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed).length;

  const statCards = [
    {
      title: 'Total Trainees',
      value: trainees.length,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Completed Tasks',
      value: completedTasks,
      icon: CheckSquare,
      color: 'text-green-600',
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks,
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'High Priority',
      value: highPriorityTasks,
      icon: AlertCircle,
      color: 'text-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoachDashboard;
