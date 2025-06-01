
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";
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
  const { t, isRTL } = useI18n();

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
    }
  ];

  return (
    <Card className="relative overflow-hidden bg-white border-0 shadow-lg rounded-xl">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 text-white">
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold">
              {t('quickActions.title')}
            </h3>
            <p className="text-white/80 text-xs">
              Take action on your fitness goals
            </p>
          </div>
        </div>
      </div>
      
      {/* Actions Grid */}
      <div className="p-3">
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`group relative h-auto p-2 flex flex-col items-center space-y-1 bg-gradient-to-br ${action.bgGradient} hover:shadow-lg border ${action.borderColor} hover:border-opacity-50 transition-all duration-300 transform hover:scale-105 rounded-lg overflow-hidden ${isRTL ? 'text-center' : 'text-center'}`}
              onClick={action.action}
            >
              {/* Icon */}
              <div className={`relative w-6 h-6 bg-gradient-to-br ${action.gradient} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transform group-hover:rotate-6 transition-all duration-300`}>
                <action.icon className="w-3 h-3 text-white" />
              </div>

              {/* Content */}
              <div className="relative text-center space-y-0.5">
                <p className="font-semibold text-gray-800 text-xs leading-tight group-hover:text-gray-900 transition-colors">
                  {action.title}
                </p>
              </div>

              {/* Hover Arrow */}
              <div className="absolute bottom-1 right-1 w-3 h-3 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight className="w-1.5 h-1.5 text-gray-600" />
              </div>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default QuickActionsGrid;
