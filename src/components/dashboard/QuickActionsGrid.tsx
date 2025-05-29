
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
  Calendar,
  Zap
} from "lucide-react";

const QuickActionsGrid = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const actions = [
    {
      icon: Scale,
      title: t('quickActions.logWeight'),
      description: t('quickActions.trackProgress'),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
      action: () => navigate('/weight-tracking')
    },
    {
      icon: Camera,
      title: t('quickActions.logFood'),
      description: t('quickActions.checkCalories'),
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
      action: () => navigate('/calorie-checker')
    },
    {
      icon: Utensils,
      title: t('quickActions.mealPlan'),
      description: t('quickActions.viewWeeklyMeals'),
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100",
      action: () => navigate('/meal-plan')
    },
    {
      icon: Dumbbell,
      title: t('quickActions.workout'),
      description: t('quickActions.startExercising'),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
      action: () => navigate('/exercise')
    },
    {
      icon: Target,
      title: t('quickActions.updateGoals'),
      description: t('quickActions.modifyTargets'),
      color: "text-red-600",
      bgColor: "bg-red-50",
      hoverColor: "hover:bg-red-100",
      action: () => navigate('/profile')
    },
    {
      icon: Calendar,
      title: t('quickActions.schedule'),
      description: t('quickActions.planWeek'),
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      hoverColor: "hover:bg-indigo-100",
      action: () => navigate('/dashboard')
    }
  ];

  return (
    <Card className="p-4 bg-white border border-gray-100 shadow-sm">
      <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
          <Zap className="w-3 h-3 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">
          {t('quickActions.title')}
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`h-auto p-3 flex flex-col items-center space-y-2 transition-all duration-200 ${action.bgColor} ${action.hoverColor} border border-transparent hover:border-gray-200 rounded-lg ${isRTL ? 'text-center' : 'text-center'}`}
            onClick={action.action}
          >
            <div className={`w-6 h-6 ${action.color} flex items-center justify-center`}>
              <action.icon className="w-4 h-4" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-medium text-gray-800 text-xs leading-tight">{action.title}</p>
              <p className="text-xs text-gray-500 hidden sm:block leading-tight">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActionsGrid;
