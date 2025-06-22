
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Plus,
  Calendar,
  MessageCircle,
  Users,
  Target,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCoachTasks, CoachTask } from "@/features/coach/hooks/useCoachTasks";
import CreateTaskDialog from "./CreateTaskDialog";

interface CoachTasksPanelProps {
  trainees: any[];
  className?: string;
}

const CoachTasksPanel = ({ trainees, className }: CoachTasksPanelProps) => {
  const { tasks, isLoading, toggleTask, isToggling, refetch } = useCoachTasks();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Handle dialog close with forced refetch
  const handleDialogClose = () => {
    setShowCreateDialog(false);
    setTimeout(() => {
      refetch();
    }, 200);
  };

  const handleToggleTask = (taskId: string, completed: boolean) => {
    toggleTask({ taskId, completed: !completed });
  };

  const handleAddTaskClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCreateDialog(true);
  };

  const getPriorityColor = (priority: CoachTask['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTypeIcon = (type: CoachTask['type']) => {
    switch (type) {
      case 'review': return CheckCircle;
      case 'follow-up': return MessageCircle;
      case 'planning': return Calendar;
      case 'admin': return Users;
      default: return Target;
    }
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'completed': return task.completed;
      case 'pending': return !task.completed;
      default: return true;
    }
  });

  const pendingTasks = tasks.filter(t => !t.completed);
  const overdueTasks = pendingTasks.filter(t => 
    t.dueDate && t.dueDate < new Date()
  );

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading tasks...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tasks & Reminders ({tasks.length})
            </CardTitle>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleAddTaskClick}
              type="button"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>
          
          {/* Task Summary */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Badge variant="secondary">{pendingTasks.length}</Badge>
              <span className="text-gray-600">pending</span>
            </div>
            {overdueTasks.length > 0 && (
              <div className="flex items-center gap-1">
                <Badge variant="destructive">{overdueTasks.length}</Badge>
                <span className="text-gray-600">overdue</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4">
            {[
              { key: 'pending', label: 'Pending', count: pendingTasks.length },
              { key: 'completed', label: 'Completed', count: tasks.filter(t => t.completed).length },
              { key: 'all', label: 'All', count: tasks.length }
            ].map(tab => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(tab.key as any)}
                className="flex items-center gap-2"
              >
                {tab.label}
                <Badge variant="secondary" className="text-xs">
                  {tab.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No {filter === 'all' ? '' : filter} tasks found</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={handleAddTaskClick}
                  type="button"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create your first task
                </Button>
              </div>
            ) : (
              filteredTasks.map(task => {
                const TypeIcon = getTypeIcon(task.type);
                const isOverdue = task.dueDate && task.dueDate < new Date() && !task.completed;
                
                return (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                      task.completed ? "bg-gray-50 opacity-75" : "bg-white hover:bg-gray-50",
                      isOverdue && "border-red-200 bg-red-50"
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
                        <div className="flex-1">
                          <h4 className={cn(
                            "font-medium",
                            task.completed && "line-through text-gray-500"
                          )}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {task.description}
                            </p>
                          )}
                          
                          {task.traineeName && (
                            <p className="text-xs text-blue-600 mt-1">
                              Related to: {task.traineeName}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-gray-400" />
                          <Badge 
                            variant="outline" 
                            className={getPriorityColor(task.priority)}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      {task.dueDate && (
                        <div className={cn(
                          "flex items-center gap-1 mt-2 text-xs",
                          isOverdue ? "text-red-600" : "text-gray-500"
                        )}>
                          <Calendar className="h-3 w-3" />
                          Due: {task.dueDate.toLocaleDateString()} {task.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isOverdue && (
                            <AlertTriangle className="h-3 w-3 ml-1" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <CreateTaskDialog 
        isOpen={showCreateDialog}
        onClose={handleDialogClose}
        trainees={trainees}
      />
    </>
  );
};

export default CoachTasksPanel;
