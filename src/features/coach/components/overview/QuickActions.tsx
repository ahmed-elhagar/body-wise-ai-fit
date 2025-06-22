
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, MessageSquare, CheckSquare, TrendingUp } from 'lucide-react';

interface QuickActionsProps {
  unreadMessages: number;
  onAddTrainee: () => void;
  onViewTasks: () => void;
  onViewMessages: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  unreadMessages,
  onAddTrainee,
  onViewTasks,
  onViewMessages
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={onAddTrainee} className="w-full justify-start">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Trainee
        </Button>
        
        <Button onClick={onViewMessages} variant="outline" className="w-full justify-start">
          <MessageSquare className="w-4 h-4 mr-2" />
          Messages
          {unreadMessages > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {unreadMessages}
            </Badge>
          )}
        </Button>
        
        <Button onClick={onViewTasks} variant="outline" className="w-full justify-start">
          <CheckSquare className="w-4 h-4 mr-2" />
          View Tasks
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
