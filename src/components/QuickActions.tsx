
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
      color: "bg-blue-500",
      action: () => navigate('/weight-tracking')
    },
    {
      icon: Camera,
      title: t('quickActions.logFood'),
      description: t('quickActions.checkCalories'),
      color: "bg-green-500",
      action: () => navigate('/calorie-checker')
    },
    {
      icon: Utensils,
      title: t('quickActions.mealPlan'),
      description: t('quickActions.viewWeeklyMeals'),
      color: "bg-orange-500",
      action: () => navigate('/meal-plan')
    },
    {
      icon: Dumbbell,
      title: t('quickActions.workout'),
      description: t('quickActions.startExercising'),
      color: "bg-purple-500",
      action: () => navigate('/exercise')
    },
    {
      icon: Target,
      title: t('quickActions.updateGoals'),
      description: t('quickActions.modifyTargets'),
      color: "bg-red-500",
      action: () => navigate('/profile')
    },
    {
      icon: Calendar,
      title: t('quickActions.schedule'),
      description: t('quickActions.planWeek'),
      color: "bg-indigo-500",
      action: () => navigate('/dashboard')
    }
  ];

  return (
    <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <h3 className={`text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('quickActions.title')}
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className={`h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 hover:bg-gray-50 transition-all duration-200 ${isRTL ? 'text-right' : 'text-left'}`}
            onClick={action.action}
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 ${action.color} rounded-full flex items-center justify-center`}>
              <action.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="text-center">
              <p className="font-medium text-xs sm:text-sm">{action.title}</p>
              <p className="text-xs text-gray-500 hidden sm:block">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;
