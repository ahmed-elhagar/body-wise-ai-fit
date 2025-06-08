
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Utensils, Dumbbell, Camera, Scale, Target, TrendingUp } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface DashboardQuickActionsProps {
  onViewMealPlan?: () => void;
  onViewExercise?: () => void;
  onViewWeight?: () => void;
  onViewProgress?: () => void;
  onViewGoals?: () => void;
  onViewProfile?: () => void;
}

const DashboardQuickActions = ({ 
  onViewMealPlan, 
  onViewExercise, 
  onViewWeight, 
  onViewProgress, 
  onViewGoals, 
  onViewProfile 
}: DashboardQuickActionsProps) => {
  const { t, isRTL } = useI18n();

  const actions = [
    {
      icon: Utensils,
      label: t('dashboard:quickActions.generateMealPlan'),
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      onClick: onViewMealPlan
    },
    {
      icon: Dumbbell,
      label: t('dashboard:quickActions.startWorkout'),
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      onClick: onViewExercise
    },
    {
      icon: Camera,
      label: t('dashboard:quickActions.analyzeMeal'),
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      onClick: () => console.log('Analyze meal')
    },
    {
      icon: Scale,
      label: t('dashboard:quickActions.trackWeight'),
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      onClick: onViewWeight
    },
    {
      icon: Target,
      label: t('dashboard:quickActions.updateGoals'),
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      onClick: onViewGoals
    },
    {
      icon: TrendingUp,
      label: t('dashboard:quickActions.addProgress'),
      color: 'bg-teal-500',
      hoverColor: 'hover:bg-teal-600',
      onClick: onViewProgress
    }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className={`text-lg ${isRTL ? 'text-right font-arabic' : 'text-left'}`}>
          {t('dashboard:quickActions.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={action.onClick}
              className={`${action.color} ${action.hoverColor} text-white border-0 h-auto p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-all duration-300`}
            >
              <action.icon className="w-6 h-6" />
              <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardQuickActions;
