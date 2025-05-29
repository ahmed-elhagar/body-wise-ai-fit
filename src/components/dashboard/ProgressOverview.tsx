
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, Target, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ProgressOverview = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const progressData = {
    weeklyGoals: {
      completed: 4,
      total: 7,
      percentage: Math.round((4 / 7) * 100)
    },
    streaks: {
      current: 12,
      best: 25
    },
    achievements: [
      { title: "First Week Complete", icon: "🏆", date: "2 days ago" },
      { title: "Weight Goal Reached", icon: "🎯", date: "1 week ago" },
      { title: "Consistency Master", icon: "⭐", date: "2 weeks ago" }
    ]
  };

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
      <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 bg-fitness-gradient rounded-xl flex items-center justify-center">
            <Award className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800">
            Progress Overview
          </h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/profile')}
          className={`text-fitness-primary hover:bg-fitness-primary/10 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <span className="text-sm">View All</span>
          <ChevronRight className={`w-4 h-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Weekly Goals */}
        <div className="space-y-3">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h4 className="font-semibold text-gray-800 text-sm">Weekly Goals</h4>
            <Badge className="bg-fitness-primary/10 text-fitness-primary border-0 text-xs">
              {progressData.weeklyGoals.percentage}%
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Completed</span>
              <span className="font-medium">{progressData.weeklyGoals.completed}/{progressData.weeklyGoals.total}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-fitness-gradient rounded-full transition-all duration-500"
                style={{ width: `${progressData.weeklyGoals.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-xs text-green-600 font-medium">Current Streak</p>
                <p className="text-base font-bold text-green-700">{progressData.streaks.current} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="space-y-3">
          <h4 className={`font-semibold text-gray-800 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>Recent Achievements</h4>
          
          <div className="space-y-2">
            {progressData.achievements.slice(0, 3).map((achievement, index) => (
              <div key={index} className={`flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-sm">
                  {achievement.icon}
                </div>
                <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <p className="font-medium text-gray-800 text-xs">{achievement.title}</p>
                  <p className="text-xs text-gray-500">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressOverview;
