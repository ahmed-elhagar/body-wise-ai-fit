
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Scale, 
  Utensils, 
  Dumbbell, 
  Camera, 
  Target,
  Calendar
} from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const actions = [
    {
      icon: Scale,
      title: t('quickActions.logWeight'),
      description: t('quickActions.trackProgress'),
      color: "bg-health-primary",
      action: () => navigate('/weight-tracking')
    },
    {
      icon: Camera,
      title: t('quickActions.logFood'),
      description: t('quickActions.checkCalories'),
      color: "bg-health-accent",
      action: () => navigate('/calorie-checker')
    },
    {
      icon: Utensils,
      title: t('quickActions.mealPlan'),
      description: t('quickActions.viewWeeklyMeals'),
      color: "bg-health-secondary",
      action: () => navigate('/meal-plan')
    },
    {
      icon: Dumbbell,
      title: t('quickActions.workout'),
      description: t('quickActions.startExercising'),
      color: "bg-health-primary",
      action: () => navigate('/exercise')
    },
    {
      icon: Target,
      title: t('quickActions.updateGoals'),
      description: t('quickActions.modifyTargets'),
      color: "bg-health-accent",
      action: () => navigate('/profile')
    },
    {
      icon: Calendar,
      title: t('quickActions.schedule'),
      description: t('quickActions.planWeek'),
      color: "bg-health-secondary",
      action: () => navigate('/dashboard')
    }
  ];

  return (
    <Card className="p-6 bg-white border border-health-border shadow-sm rounded-2xl">
      <h3 className={`text-xl font-semibold text-health-text-primary mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('quickActions.title')}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className={`h-auto p-4 flex flex-col items-center space-y-3 hover:bg-health-soft border-health-border transition-all duration-200 hover:border-health-primary group ${isRTL ? 'text-right' : 'text-left'} rounded-xl`}
            onClick={action.action}
          >
            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <p className="font-medium text-sm text-health-text-primary">{action.title}</p>
              <p className="text-xs text-health-text-secondary hidden sm:block mt-1">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;
