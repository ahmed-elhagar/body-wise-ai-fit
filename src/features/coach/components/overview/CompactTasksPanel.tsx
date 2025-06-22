
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Clock, CheckCircle2 } from "lucide-react";
import { useCoachTasks } from "@/features/coach/hooks/useCoachTasks";
import { useLanguage } from "@/contexts/LanguageContext";

interface CompactTasksPanelProps {
  onCreateTask: () => void;
}

const CompactTasksPanel = ({ onCreateTask }: CompactTasksPanelProps) => {
  const { t } = useLanguage();
  const { tasks, toggleTask, isToggling } = useCoachTasks();

  const pendingTasks = tasks.filter(task => !task.completed).slice(0, 3);
  const totalPending = tasks.filter(task => !task.completed).length;

  const handleToggleTask = (taskId: string, completed: boolean) => {
    toggleTask({ taskId, completed: !completed });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {t('Pending Tasks')}
          </CardTitle>
          <Button size="sm" variant="outline" onClick={onCreateTask}>
            <Plus className="w-3 h-3 mr-1" />
            {t('Add')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingTasks.length > 0 ? (
          <>
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleToggleTask(task.id, task.completed)}
                  disabled={isToggling}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </Badge>
                    {task.traineeName && (
                      <span className="text-xs text-gray-500 truncate">
                        {task.traineeName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {totalPending > 3 && (
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  {t('and')} {totalPending - 3} {t('more tasks')}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm text-gray-600">{t('All tasks completed!')}</p>
            <p className="text-xs text-gray-500">{t('Great work!')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactTasksPanel;
