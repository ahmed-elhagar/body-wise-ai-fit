
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompactTasksPanelProps {
  className?: string;
}

export const CompactTasksPanel = ({ className }: CompactTasksPanelProps) => {
  // Mock tasks data - in real app this would come from backend
  const tasks = [
    { id: 1, title: "Review John's meal plan", priority: "high", completed: false },
    { id: 2, title: "Follow up with Sarah", priority: "medium", completed: true },
    { id: 3, title: "Update Mike's workout", priority: "low", completed: false },
  ];

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Quick Tasks
            <Badge variant="secondary">{pendingTasks.length} pending</Badge>
          </CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingTasks.slice(0, 3).map((task) => (
          <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <CheckCircle className="w-4 h-4" />
              </Button>
              <span className="text-sm">{task.title}</span>
            </div>
            <Badge 
              variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {task.priority}
            </Badge>
          </div>
        ))}
        
        {pendingTasks.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">All tasks completed!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
