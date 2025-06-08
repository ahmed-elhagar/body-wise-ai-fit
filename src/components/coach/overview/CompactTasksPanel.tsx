
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Task {
  id: string;
  title: string;
  trainee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'overdue';
}

interface CompactTasksPanelProps {
  tasks: Task[];
  onAddTask: () => void;
  onViewAll: () => void;
}

const CompactTasksPanel = ({ tasks, onAddTask, onViewAll }: CompactTasksPanelProps) => {
  const { t } = useI18n();

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const overdueTasks = tasks.filter(task => task.status === 'overdue');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {t('coach:tasks') || 'Tasks'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onAddTask}>
          <Plus className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Quick Stats */}
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {pendingTasks.length} {t('coach:pending') || 'pending'}
          </Badge>
          {overdueTasks.length > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {overdueTasks.length} {t('coach:overdue') || 'overdue'}
            </Badge>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="space-y-2">
          {tasks.slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{task.title}</p>
                <p className="text-xs text-gray-500">{task.trainee}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={task.status === 'completed' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {t(`coach:taskStatus.${task.status}`) || task.status}
                </Badge>
                {task.status === 'completed' && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {tasks.length > 3 && (
          <Button variant="outline" size="sm" onClick={onViewAll} className="w-full">
            <MoreHorizontal className="w-4 h-4 mr-2" />
            {t('coach:viewAllTasks') || 'View All Tasks'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactTasksPanel;
