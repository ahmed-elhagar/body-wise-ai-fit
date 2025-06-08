
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Utensils, 
  Dumbbell, 
  Target, 
  Camera,
  Plus,
  TrendingUp,
  Clock,
  Award,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";
import { useProfile } from "@/hooks/useProfile";
import { useMealPlans } from "@/features/meal-plan/hooks";
import { useExercisePrograms } from "@/hooks/useExercisePrograms";

const QuickActionsGrid = () => {
  const navigate = useNavigate();
  const { tFrom, isRTL } = useI18n();
  const tDashboard = tFrom('dashboard');
  const { profile } = useProfile();
  const { mealPlans } = useMealPlans();
  const { programs } = useExercisePrograms();

  const quickActions = [
    {
      title: "Track Food",
      description: "Log your meals and track nutrition",
      icon: Utensils,
      color: "from-green-500 to-emerald-600",
      action: () => navigate('/food-tracker'),
      badge: "Quick Add",
      stats: mealPlans && mealPlans.length > 0 ? "Plan Active" : "No Plan"
    },
    {
      title: "Start Workout", 
      description: "Begin your exercise routine",
      icon: Dumbbell,
      color: "from-blue-500 to-indigo-600",
      action: () => navigate('/exercise'),
      badge: "Get Moving",
      stats: programs && programs.length > 0 ? "Program Ready" : "Create Program"
    },
    {
      title: "Scan Food",
      description: "Use AI to analyze your meals",
      icon: Camera,
      color: "from-purple-500 to-violet-600", 
      action: () => navigate('/calorie-checker'),
      badge: "AI Powered",
      stats: `${profile?.ai_generations_remaining || 0} credits`
    },
    {
      title: "Set Goals",
      description: "Define and track your objectives",
      icon: Target,
      color: "from-orange-500 to-red-600",
      action: () => navigate('/goals'),
      badge: "Focus",
      stats: "Personal Goals"
    },
    {
      title: "Meal Plan",
      description: "View and manage your meal plans", 
      icon: Calendar,
      color: "from-teal-500 to-cyan-600",
      action: () => navigate('/meal-plan'),
      badge: "Planning",
      stats: mealPlans && mealPlans.length > 0 ? "This Week" : "Create Plan"
    },
    {
      title: "Progress",
      description: "Track your fitness achievements",
      icon: Award,
      color: "from-pink-500 to-rose-600",
      action: () => navigate('/progress'),
      badge: "Achievements",
      stats: "View Stats"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 text-xs text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <TrendingUp className="w-3 h-3" />
                    <span>{action.stats}</span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-600 hover:text-gray-900"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickActionsGrid;
