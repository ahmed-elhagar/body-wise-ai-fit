
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, Plus } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const CoachTasksTab = () => {
  const { t } = useI18n();

  const mockTasks = [
    {
      id: 1,
      title: "Review Sarah's Progress",
      type: "progress-review",
      dueDate: "Today",
      priority: "high",
      completed: false
    },
    {
      id: 2,
      title: "Create Meal Plan for John",
      type: "meal-plan",
      dueDate: "Tomorrow", 
      priority: "medium",
      completed: false
    },
    {
      id: 3,
      title: "Schedule Call with Maria",
      type: "consultation",
      dueDate: "This Week",
      priority: "low",
      completed: true
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('coach:tasks') || 'Tasks & Schedule'}
        </h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('coach:addTask') || 'Add Task'}
        </Button>
      </div>

      <div className="grid gap-4">
        {mockTasks.map((task) => (
          <Card key={task.id} className={task.completed ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  
                  <div>
                    <h3 className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-500">{task.dueDate}</span>
                    </div>
                  </div>
                </div>
                
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoachTasksTab;
