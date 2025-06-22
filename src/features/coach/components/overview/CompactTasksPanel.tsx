
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Clock, 
  AlertTriangle, 
  Plus,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCoachTasks } from "@/features/coach/hooks/useCoachTasks";
import { useLanguage } from "@/contexts/LanguageContext";

interface CompactTasksPanelProps {
  onViewAllTasks: () => void;
  onCreateTask: () => void;
}

export const CompactTasksPanel = ({ onViewAllTasks, onCreateTask }: CompactTasksPanelProps) => {
  const { t } = useLanguage();
  const { tasks, toggleTask, isToggling } = useCoachTasks();

  const pendingTasks = tasks.filter(t => !t.completed);
  const overdueTasks = pendingTasks.filter(t => 
    t.dueDate && t.dueDate < new Date()
  );
  const upcomingTasks = pendingTasks.filter(t => 
    !t.dueDate || t.dueDate >= new Date()
  ).slice(0, 3);

  const handleToggleTask = (taskId: string, completed: boolean) => {
    toggleTask({ taskId, completed: !completed });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {t('Tasks & Reminders')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onCreateTask}>
              <Plus className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onViewAllTasks}>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Task Summary */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Badge variant="secondary">{pendingTasks.length}</Badge>
            <span className="text-gray-600">{t('pending')}</span>
          </div>
          {overdueTasks.length > 0 && (
            <div className="flex items-center gap-1">
              <Badge variant="destructive">{overdueTasks.length}</Badge>
              <span className="text-gray-600">{t('overdue')}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {pendingTasks.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600 mb-3">{t('All caught up!')}</p>
            <Button size="sm" onClick={onCreateTask}>
              <Plus className="w-4 h-4 mr-1" />
              {t('Add Task')}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Overdue Tasks First */}
            {overdueTasks.slice(0, 2).map(task => {
              const isOverdue = task.dueDate && task.dueDate < new Date();
              
              return (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                    isOverdue ? "border-red-200 bg-red-50" : "bg-white hover:bg-gray-50"
                  )}
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id, task.completed)}
                    disabled={isToggling}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm leading-tight">
                        {task.title}
                      </h4>
                      {isOverdue && (
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    {task.traineeName && (
                      <p className="text-xs text-blue-600 mt-1">
                        {task.traineeName}
                      </p>
                    )}
                    
                    {task.dueDate && (
                      <p className={cn(
                        "text-xs mt-1",
                        isOverdue ? "text-red-600 font-medium" : "text-gray-500"
                      )}>
                        Due: {task.dueDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Upcoming Tasks */}
            {upcomingTasks.map(task => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleToggleTask(task.id, task.completed)}
                  disabled={isToggling}
                  className="mt-1"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm leading-tight">
                    {task.title}
                  </h4>
                  
                  {task.traineeName && (
                    <p className="text-xs text-blue-600 mt-1">
                      {task.traineeName}
                    </p>
                  )}
                  
                  {task.dueDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {task.dueDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {pendingTasks.length > 5 && (
              <div className="text-center pt-2">
                <Button size="sm" variant="ghost" onClick={onViewAllTasks}>
                  {t('View')} {pendingTasks.length - 5} {t('more tasks')}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
