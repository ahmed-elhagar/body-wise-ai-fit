
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock } from 'lucide-react';

interface CompactTasksPanelProps {
  onCreateTask: () => void;
}

const CompactTasksPanel: React.FC<CompactTasksPanelProps> = ({
  onCreateTask
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={onCreateTask} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompactTasksPanel;
