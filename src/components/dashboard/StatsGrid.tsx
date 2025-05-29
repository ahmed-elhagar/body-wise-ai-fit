
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Scale, 
  Utensils, 
  Dumbbell, 
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Flame,
  Zap
} from "lucide-react";

const StatsGrid = () => {
  const { t, isRTL } = useLanguage();

  const stats = [
    {
      title: t('dashboard.currentWeight'),
      value: "72.5",
      unit: "kg",
      change: -2.3,
      changeType: "decrease",
      icon: Scale,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200"
    },
    {
      title: t('dashboard.todayCalories'),
      value: "1,847",
      unit: "kcal",
      change: 12.5,
      changeType: "increase",
      icon: Flame,
      gradient: "from-orange-500 to-red-500", 
      bgGradient: "from-orange-50 to-red-50",
      borderColor: "border-orange-200"
    },
    {
      title: t('dashboard.workoutsWeek'),
      value: "4",
      unit: "sessions",
      change: 0,
      changeType: "neutral",
      icon: Dumbbell,
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50", 
      borderColor: "border-purple-200"
    },
    {
      title: t('dashboard.goalProgress'),
      value: "87",
      unit: "%",
      change: 15.2,
      changeType: "increase",
      icon: Target,
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200"
    }
  ];

  const getTrendIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return TrendingUp;
      case 'decrease': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'decrease': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
      {stats.map((stat, index) => {
        const TrendIcon = getTrendIcon(stat.changeType);
        const IconComponent = stat.icon;

        return (
          <Card key={index} className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} border-2 ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl`}>
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
              <div className={`w-full h-full bg-gradient-to-br ${stat.gradient} rounded-full transform translate-x-4 -translate-y-4`}></div>
            </div>

            <div className="relative p-3 sm:p-4">
              {/* Header */}
              <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300`}>
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                  <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                    {stat.title}
                  </div>
                </div>
              </div>

              {/* Main Value */}
              <div className={`mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-bold text-gray-800">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    {stat.unit}
                  </span>
                </div>
              </div>

              {/* Trend Indicator */}
              <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Badge className={`${getTrendColor(stat.changeType)} border px-1.5 py-0.5 text-xs font-semibold rounded-md`}>
                  <TrendIcon className="w-2.5 h-2.5 mr-0.5" />
                  {stat.change !== 0 ? `${Math.abs(stat.change)}%` : 'No change'}
                </Badge>
                <span className="text-xs text-gray-500 font-medium">
                  vs last week
                </span>
              </div>

              {/* Energy indicator */}
              <div className="absolute bottom-2 right-2">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsGrid;
