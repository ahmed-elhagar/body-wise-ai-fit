
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Utensils, Dumbbell, Camera } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const QuickActions = () => {
  const { t, isRTL } = useI18n();

  const actions = [
    {
      icon: Utensils,
      label: t('dashboard:quickActions.generateMealPlan'),
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      icon: Dumbbell,
      label: t('dashboard:quickActions.startWorkout'),
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      icon: Camera,
      label: t('dashboard:quickActions.analyzeMeal'),
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      icon: Plus,
      label: t('dashboard:quickActions.addProgress'),
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    }
  ];

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <h3 className={`text-lg font-semibold text-gray-800 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('dashboard:quickActions.title')}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className={`${action.color} ${action.hoverColor} text-white border-0 h-auto p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-all duration-300`}
          >
            <action.icon className="w-6 h-6" />
            <span className="text-xs font-medium text-center">{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;
