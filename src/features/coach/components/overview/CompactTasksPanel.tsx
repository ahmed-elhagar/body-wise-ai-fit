
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  type: string;
}

interface CompactTasksPanelProps {
  tasks?: Task[];
}

const CompactTasksPanel: React.FC<CompactTasksPanelProps> = ({
  tasks = []
}) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-gray-600 text-sm">No tasks yet.</p>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-2 rounded border">
                {task.completed ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  getPriorityIcon(task.priority)
                )}
                
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    task.completed ? 'line-through text-gray-500' : ''
                  }`}>
                    {task.title}
                  </p>
                </div>
                
                <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                  {task.priority}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactTasksPanel;
