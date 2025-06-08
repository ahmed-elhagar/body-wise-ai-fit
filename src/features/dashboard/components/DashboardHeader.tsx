
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Activity, 
  Target, 
  TrendingUp,
  ChevronRight,
  Sparkles,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  userName: string;
  onViewMealPlan: () => void;
  onViewExercise: () => void;
}

const DashboardHeader = ({ userName, onViewMealPlan, onViewExercise }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 border-0 shadow-xl rounded-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
      
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Welcome Section */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                  Welcome back, {userName}!
                </h1>
                <p className="text-white/80 text-lg">
                  Ready to continue your fitness journey?
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge className="bg-white/20 text-white border-white/30 px-3 py-1.5">
                <Heart className="w-4 h-4 mr-2" />
                Health Tracking Active
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-3 py-1.5">
                <Target className="w-4 h-4 mr-2" />
                Goals on Track
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onViewMealPlan}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300"
              variant="outline"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Today's Meals
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={onViewExercise}
              className="bg-white hover:bg-white/90 text-indigo-600 shadow-lg transition-all duration-300"
            >
              <Activity className="w-4 h-4 mr-2" />
              Start Workout
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
