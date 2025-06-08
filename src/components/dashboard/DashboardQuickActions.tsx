
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Utensils, 
  Dumbbell, 
  Scale, 
  TrendingUp, 
  Target,
  User
} from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface DashboardQuickActionsProps {
  onViewMealPlan?: () => void;
  onViewExercise?: () => void;
  onViewWeight?: () => void;
  onViewProgress?: () => void;
  onViewGoals?: () => void;
  onViewProfile?: () => void;
  onAction?: (action: string) => void;
}

const DashboardQuickActions = ({ 
  onViewMealPlan,
  onViewExercise,
  onViewWeight,
  onViewProgress,
  onViewGoals,
  onViewProfile,
  onAction
}: DashboardQuickActionsProps) => {
  const { t, isRTL } = useI18n();

  const actions = [
    {
      icon: Utensils,
      label: t('navigation:mealPlan') || 'Meal Plan',
      onClick: onViewMealPlan || (() => onAction?.('meal-plan')),
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Dumbbell,
      label: t('navigation:exercise') || 'Exercise',
      onClick: onViewExercise || (() => onAction?.('exercise')),
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Scale,
      label: t('navigation:weight') || 'Weight',
      onClick: onViewWeight || (() => onAction?.('weight')),
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: TrendingUp,
      label: t('navigation:progress') || 'Progress',
      onClick: onViewProgress || (() => onAction?.('progress')),
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Target,
      label: t('navigation:goals') || 'Goals',
      onClick: onViewGoals || (() => onAction?.('goals')),
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: User,
      label: t('navigation:profile') || 'Profile',
      onClick: onViewProfile || (() => onAction?.('profile')),
      color: "from-indigo-500 to-purple-600"
    }
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      {actions.map((action, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              onClick={action.onClick}
              className="w-full h-full p-0 flex flex-col items-center gap-3"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {action.label}
              </span>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardQuickActions;
