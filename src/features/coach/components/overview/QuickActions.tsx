
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, MessageSquare, CheckSquare, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuickActionsProps {
  unreadMessages: number;
  onAddTrainee: () => void;
  onViewTasks: () => void;
  onViewMessages: () => void;
}

const QuickActions = ({ 
  unreadMessages, 
  onAddTrainee, 
  onViewTasks, 
  onViewMessages 
}: QuickActionsProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('Quick Actions')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={onAddTrainee} 
          className="w-full justify-start"
          variant="outline"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {t('Add New Trainee')}
        </Button>

        <Button 
          onClick={onViewMessages} 
          className="w-full justify-between"
          variant="outline"
        >
          <div className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            {t('View Messages')}
          </div>
          {unreadMessages > 0 && (
            <Badge variant="destructive">
              {unreadMessages}
            </Badge>
          )}
        </Button>

        <Button 
          onClick={onViewTasks} 
          className="w-full justify-start"
          variant="outline"
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          {t('Manage Tasks')}
        </Button>

        <Button 
          className="w-full justify-start"
          variant="outline"
          disabled
        >
          <Calendar className="w-4 h-4 mr-2" />
          {t('Schedule Session')}
          <Badge variant="secondary" className="ml-auto">
            {t('Soon')}
          </Badge>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
