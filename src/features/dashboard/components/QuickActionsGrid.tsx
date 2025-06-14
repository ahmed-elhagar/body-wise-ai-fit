
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
import { Grid } from "@/components/ui/layout";

interface QuickActionsGridProps {
  profile: any;
  mealPlans: any[] | null;
  programs: any[] | null;
}

const QuickActionsGrid = ({ profile, mealPlans, programs }: QuickActionsGridProps) => {
  const navigate = useNavigate();
  const { tFrom, isRTL } = useI18n();
  const tDashboard = tFrom('dashboard');

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
    <Grid cols={3} gap={6}>
      {quickActions.map((action, index) => {
        const IconComponent = action.icon;
        
        return (
          <Card 
            key={index}
            className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-[1.02] cursor-pointer overflow-hidden relative"
            onClick={action.action}
          >
            {/* Gradient border effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`}>
              <div className="absolute inset-[1px] bg-white rounded-xl" />
            </div>
            
            <CardContent className="relative p-6 z-10">
              <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs font-medium bg-gray-100 group-hover:bg-gray-50 transition-colors">
                  {action.badge}
                </Badge>
              </div>
              
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {action.description}
                </p>
                
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 text-xs font-medium text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <TrendingUp className="w-3 h-3" />
                    <span>{action.stats}</span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-500 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transform group-hover:translate-x-1"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </Grid>
  );
};

export default QuickActionsGrid;
