
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";
import { Utensils, Dumbbell, Target, Camera, TrendingUp, Plus } from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();
  const { tFrom, isRTL } = useI18n();

  const quickActions = [
    {
      title: "Track Food",
      description: "Log your meals and track nutrition",
      icon: Utensils,
      color: "from-green-500 to-emerald-600",
      action: () => navigate('/food-tracker'),
      badge: "Quick Add"
    },
    {
      title: "Start Workout", 
      description: "Begin your exercise routine",
      icon: Dumbbell,
      color: "from-blue-500 to-indigo-600",
      action: () => navigate('/exercise'),
      badge: "Get Moving"
    },
    {
      title: "Scan Food",
      description: "Use AI to analyze your meals",
      icon: Camera,
      color: "from-purple-500 to-violet-600", 
      action: () => navigate('/calorie-checker'),
      badge: "AI Powered"
    },
    {
      title: "Set Goals",
      description: "Define and track your objectives",
      icon: Target,
      color: "from-orange-500 to-red-600",
      action: () => navigate('/goals'),
      badge: "Focus"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {quickActions.map((action, index) => {
        const IconComponent = action.icon;
        
        return (
          <Card 
            key={index}
            className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-[1.02] cursor-pointer"
            onClick={action.action}
          >
            <CardContent className="p-6">
              <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  {action.badge}
                </Badge>
              </div>
              
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {action.description}
                </p>
                
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-600 hover:text-gray-900"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickActions;
