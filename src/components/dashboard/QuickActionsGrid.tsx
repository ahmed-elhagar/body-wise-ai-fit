
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
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      action: () => navigate('/weight-tracking')
    },
    {
      icon: Camera,
      title: t('quickActions.logFood'),
      description: t('quickActions.checkCalories'),
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      action: () => navigate('/calorie-checker')
    },
    {
      icon: Utensils,
      title: t('quickActions.mealPlan'),
      description: t('quickActions.viewWeeklyMeals'),
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      action: () => navigate('/meal-plan')
    },
    {
      icon: Dumbbell,
      title: t('quickActions.workout'),
      description: t('quickActions.startExercising'),
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      action: () => navigate('/exercise')
    },
    {
      icon: Target,
      title: t('quickActions.updateGoals'),
      description: t('quickActions.modifyTargets'),
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-50 to-pink-50",
      action: () => navigate('/profile')
    },
    {
      icon: Calendar,
      title: t('quickActions.schedule'),
      description: t('quickActions.planWeek'),
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
      action: () => navigate('/dashboard')
    }
  ];

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg h-fit">
      <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-8 h-8 bg-fitness-gradient rounded-xl flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-gray-800">
          {t('quickActions.title')}
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br ${action.bgGradient} border border-gray-100 rounded-xl ${isRTL ? 'text-center' : 'text-center'}`}
            onClick={action.action}
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
              <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold text-gray-800 text-xs sm:text-sm">{action.title}</p>
              <p className="text-xs text-gray-600 hidden sm:block leading-relaxed">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActionsGrid;
