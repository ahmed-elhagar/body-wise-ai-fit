
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Apple, 
  Dumbbell, 
  Scale, 
  BarChart3, 
  User,
  Target,
  Utensils,
  Bell
} from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useNavigate } from "react-router-dom";

interface DashboardQuickActionsProps {
  handleViewMealPlan: () => void;
  handleViewExercise: () => void;
  handleViewWeight: () => void;
  handleViewProgress: () => void;
  handleViewProfile: () => void;
  handleViewGoals: () => void;
}

const DashboardQuickActions = ({
  handleViewMealPlan,
  handleViewExercise,
  handleViewWeight,
  handleViewProgress,
  handleViewProfile,
  handleViewGoals,
}: DashboardQuickActionsProps) => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: t('Meal Plan'),
      description: t('View today\'s meals'),
      icon: Apple,
      action: handleViewMealPlan,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: t('Workout'),
      description: t('Start exercising'),
      icon: Dumbbell,
      action: handleViewExercise,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: t('Food Tracker'),
      description: t('Log your meals'),
      icon: Utensils,
      action: () => navigate('/food-tracker'),
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      title: t('Weight'),
      description: t('Track progress'),
      icon: Scale,
      action: handleViewWeight,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: t('Goals'),
      description: t('Manage objectives'),
      icon: Target,
      action: handleViewGoals,
      color: 'bg-red-500 hover:bg-red-600',
    },
    {
      title: t('Progress'),
      description: t('View analytics'),
      icon: BarChart3,
      action: handleViewProgress,
      color: 'bg-indigo-500 hover:bg-indigo-600',
    },
    {
      title: t('Notifications'),
      description: t('Check updates'),
      icon: Bell,
      action: () => navigate('/notifications'),
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      title: t('Profile'),
      description: t('Edit settings'),
      icon: User,
      action: handleViewProfile,
      color: 'bg-gray-500 hover:bg-gray-600',
    },
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('Quick Actions')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                onClick={action.action}
                className={`h-auto p-4 flex flex-col items-center space-y-2 text-white border-0 ${action.color} transition-all hover:scale-105`}
              >
                <IconComponent className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardQuickActions;
