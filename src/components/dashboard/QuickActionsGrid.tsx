
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
  Zap,
  ArrowRight
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
      borderColor: "border-blue-200",
      action: () => navigate('/weight-tracking')
    },
    {
      icon: Camera,
      title: t('quickActions.logFood'),
      description: t('quickActions.checkCalories'),
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      action: () => navigate('/calorie-checker')
    },
    {
      icon: Utensils,
      title: t('quickActions.mealPlan'),
      description: t('quickActions.viewWeeklyMeals'),
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      borderColor: "border-orange-200",
      action: () => navigate('/meal-plan')
    },
    {
      icon: Dumbbell,
      title: t('quickActions.workout'),
      description: t('quickActions.startExercising'),
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-200",
      action: () => navigate('/exercise')
    },
    {
      icon: Target,
      title: t('quickActions.updateGoals'),
      description: t('quickActions.modifyTargets'),
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
      borderColor: "border-pink-200",
      action: () => navigate('/profile')
    },
    {
      icon: Calendar,
      title: t('quickActions.schedule'),
      description: t('quickActions.planWeek'),
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-50 to-purple-50",
      borderColor: "border-violet-200",
      action: () => navigate('/dashboard')
    }
  ];

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl rounded-2xl">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {t('quickActions.title')}
            </h3>
            <p className="text-white/80 text-xs">
              Take action on your fitness goals
            </p>
          </div>
        </div>
      </div>
      
      {/* Actions Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`group relative h-auto p-3 flex flex-col items-center space-y-2 bg-gradient-to-br ${action.bgGradient} hover:shadow-xl border-2 ${action.borderColor} hover:border-opacity-50 transition-all duration-300 transform hover:scale-105 rounded-xl overflow-hidden ${isRTL ? 'text-center' : 'text-center'}`}
              onClick={action.action}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-12 h-12 opacity-10">
                <div className={`w-full h-full bg-gradient-to-br ${action.gradient} rounded-full transform translate-x-3 -translate-y-3`}></div>
              </div>

              {/* Icon */}
              <div className={`relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${action.gradient} rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:rotate-6 transition-all duration-300`}>
                <action.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>

              {/* Content */}
              <div className="relative text-center space-y-0.5">
                <p className="font-bold text-gray-800 text-xs leading-tight group-hover:text-gray-900 transition-colors">
                  {action.title}
                </p>
                <p className="text-xs text-gray-600 hidden sm:block leading-tight group-hover:text-gray-700 transition-colors">
                  {action.description}
                </p>
              </div>

              {/* Hover Arrow */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight className="w-2 h-2 text-gray-600" />
              </div>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default QuickActionsGrid;
