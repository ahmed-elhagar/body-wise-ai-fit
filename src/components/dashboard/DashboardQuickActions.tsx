import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Apple, Dumbbell, Target, Users, Scale, User } from "lucide-react";
import { useLanguage, useNavigate } from "@/hooks";

interface DashboardQuickActionsProps {
  handleViewMealPlan: () => void;
  handleViewExercise: () => void;
  handleViewWeight: () => void;
  handleViewProgress: () => void;
  handleViewProfile: () => void;
  handleViewGoals?: () => void;
}

const DashboardQuickActions = ({ 
  handleViewMealPlan, 
  handleViewExercise, 
  handleViewWeight, 
  handleViewProgress, 
  handleViewProfile,
  handleViewGoals
}: DashboardQuickActionsProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: t('View Meal Plan'),
      description: t('Check today\'s meals'),
      icon: Apple,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      action: handleViewMealPlan
    },
    {
      title: t('Start Workout'),
      description: t('Begin today\'s exercise'),
      icon: Dumbbell,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      action: handleViewExercise
    },
    {
      title: t('Log Weight'),
      description: t('Track your progress'),
      icon: Scale,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      action: handleViewWeight
    },
    {
      title: t('View Goals'),
      description: t('Track your objectives'),
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      action: handleViewGoals || (() => navigate('/goals'))
    },
    {
      title: t('View Progress'),
      description: t('See your analytics'),
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      action: handleViewProgress
    },
    {
      title: t('Edit Profile'),
      description: t('Update your info'),
      icon: User,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100',
      action: handleViewProfile
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              onClick={action.action}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <action.icon className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardQuickActions;
