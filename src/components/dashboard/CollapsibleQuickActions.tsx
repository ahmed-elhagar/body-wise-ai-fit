
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus, Target, Calendar, Utensils } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useNavigate } from "react-router-dom";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

const CollapsibleQuickActions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useI18n();
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: 'meal-plan',
      title: t('Generate Meal Plan'),
      description: t('Create your weekly meal plan'),
      icon: <Utensils className="h-5 w-5" />,
      action: () => navigate('/meal-plan'),
      color: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    {
      id: 'workout',
      title: t('Start Workout'),
      description: t('Begin your exercise routine'),
      icon: <Target className="h-5 w-5" />,
      action: () => navigate('/exercise'),
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    {
      id: 'food-tracker',
      title: t('Track Food'),
      description: t('Log your meals and calories'),
      icon: <Plus className="h-5 w-5" />,
      action: () => navigate('/food-tracker'),
      color: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    },
    {
      id: 'goals',
      title: t('Set Goals'),
      description: t('Define your fitness targets'),
      icon: <Calendar className="h-5 w-5" />,
      action: () => navigate('/goals'),
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    }
  ];

  const visibleActions = isExpanded ? quickActions : quickActions.slice(0, 2);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t('Quick Actions')}</h3>
          {quickActions.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {visibleActions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            className={`w-full justify-start h-auto p-3 ${action.color}`}
            onClick={action.action}
          >
            <div className="flex items-center gap-3">
              {action.icon}
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default CollapsibleQuickActions;
