import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MessageCircle, 
  Calendar,
  TrendingUp,
  Users,
  Clock
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuickActionsProps {
  pendingTasks: number;
  unreadMessages: number;
  onAddTrainee: () => void;
  onViewTasks: () => void;
  onViewMessages: () => void;
}

export const QuickActions = ({ 
  pendingTasks, 
  unreadMessages, 
  onAddTrainee, 
  onViewTasks, 
  onViewMessages 
}: QuickActionsProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {t('Quick Actions')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={onAddTrainee}
          className="w-full justify-start"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('Add New Trainee')}
        </Button>

        <Button 
          onClick={onViewTasks}
          className="w-full justify-between"
          variant="outline"
        >
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {t('View Tasks')}
          </div>
          {pendingTasks > 0 && (
            <Badge variant="secondary">{pendingTasks}</Badge>
          )}
        </Button>

        <Button 
          onClick={onViewMessages}
          className="w-full justify-between"
          variant="outline"
        >
          <div className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            {t('Messages')}
          </div>
          {unreadMessages > 0 && (
            <Badge variant="destructive">{unreadMessages}</Badge>
          )}
        </Button>

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 text-center">
            {t('Need help? Check our coaching guides')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
