
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, MessageSquare, Calendar, BarChart3 } from 'lucide-react';

interface QuickActionsProps {
  onAssignTrainee?: () => void;
  onSendMessage?: () => void;
  onScheduleSession?: () => void;
  onViewAnalytics?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onAssignTrainee,
  onSendMessage,
  onScheduleSession,
  onViewAnalytics
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onAssignTrainee}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Assign Trainee
          </Button>
          
          <Button
            variant="outline"
            onClick={onSendMessage}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Send Message
          </Button>
          
          <Button
            variant="outline"
            onClick={onScheduleSession}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Schedule Session
          </Button>
          
          <Button
            variant="outline"
            onClick={onViewAnalytics}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            View Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
