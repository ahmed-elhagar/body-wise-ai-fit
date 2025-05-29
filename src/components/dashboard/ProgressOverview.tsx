
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
    <Card className="p-4 bg-white border border-gray-100 shadow-sm">
      <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
            <Award className="w-3 h-3 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">
            Progress Overview
          </h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/profile')}
          className={`text-blue-600 hover:bg-blue-50 text-xs p-1 h-auto ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <span>View All</span>
          <ChevronRight className={`w-3 h-3 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Weekly Goals */}
        <div className="space-y-2">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h4 className="font-medium text-gray-800 text-xs">Weekly Goals</h4>
            <Badge className="bg-blue-50 text-blue-600 border-0 text-xs px-1.5 py-0.5">
              {progressData.weeklyGoals.percentage}%
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Completed</span>
              <span className="font-medium">{progressData.weeklyGoals.completed}/{progressData.weeklyGoals.total}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressData.weeklyGoals.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-green-50 rounded-lg p-2 border border-green-100">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-4 h-4 bg-green-500 rounded-md flex items-center justify-center">
                <TrendingUp className="w-2 h-2 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-xs text-green-600 font-medium">Current Streak</p>
                <p className="text-sm font-semibold text-green-700">{progressData.streaks.current} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="space-y-2">
          <h4 className={`font-medium text-gray-800 text-xs ${isRTL ? 'text-right' : 'text-left'}`}>Recent Achievements</h4>
          
          <div className="space-y-1.5">
            {progressData.achievements.slice(0, 3).map((achievement, index) => (
              <div key={index} className={`flex items-center gap-2 p-1.5 bg-yellow-50 rounded-lg border border-yellow-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-5 h-5 bg-yellow-400 rounded-md flex items-center justify-center text-xs">
                  {achievement.icon}
                </div>
                <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <p className="font-medium text-gray-800 text-xs leading-tight">{achievement.title}</p>
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
