
import { Button } from '@/components/ui/button';
import { 
  UtensilsCrossed, 
  Dumbbell, 
  Camera, 
  ShoppingCart,
  MessageCircle,
  Target,
  TrendingUp,
  Calendar,
  Plus,
  BarChart3
} from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface DashboardQuickActionsProps {
  onAction: (action: string) => void;
}

const DashboardQuickActions = ({ onAction }: DashboardQuickActionsProps) => {
  const { t } = useI18n();

  const actions = [
    {
      id: 'meal-plan',
      icon: UtensilsCrossed,
      label: t('dashboard:actions.generateMealPlan') || 'Generate Meal Plan',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'exercise-program',
      icon: Dumbbell,
      label: t('dashboard:actions.startWorkout') || 'Start Workout',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'food-scan',
      icon: Camera,
      label: t('dashboard:actions.scanFood') || 'Scan Food',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'shopping-list',
      icon: ShoppingCart,
      label: t('dashboard:actions.shoppingList') || 'Shopping List',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      id: 'chat-coach',
      icon: MessageCircle,
      label: t('dashboard:actions.chatCoach') || 'Chat with Coach',
      color: 'bg-pink-500 hover:bg-pink-600'
    },
    {
      id: 'set-goals',
      icon: Target,
      label: t('dashboard:actions.setGoals') || 'Set Goals',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      id: 'track-progress',
      icon: TrendingUp,
      label: t('dashboard:actions.trackProgress') || 'Track Progress',
      color: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      id: 'schedule',
      icon: Calendar,
      label: t('dashboard:actions.schedule') || 'Schedule',
      color: 'bg-teal-500 hover:bg-teal-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {actions.map((action) => (
        <Button
          key={action.id}
          variant="outline"
          className={`h-20 flex flex-col gap-2 border-0 text-white ${action.color} transition-all duration-200 hover:scale-105`}
          onClick={() => onAction(action.id)}
        >
          <action.icon className="w-6 h-6" />
          <span className="text-xs font-medium text-center leading-tight">
            {action.label}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default DashboardQuickActions;
