import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/useI18n";
import { TrendingUp, Target, Award, ChevronRight, Star, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ProgressOverview = () => {
  const { t, isRTL } = useI18n();
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
      { title: "First Week Complete", icon: "🏆", date: "2 days ago", type: "gold" },
      { title: "Weight Goal Reached", icon: "🎯", date: "1 week ago", type: "silver" }
    ]
  };

  const getAchievementStyle = (type: string) => {
    switch (type) {
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-400 border-gray-300';
      default: return 'bg-gradient-to-r from-blue-400 to-purple-500 border-blue-300';
    }
  };

  return (
    <Card className="relative overflow-hidden bg-white border-0 shadow-lg rounded-xl">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 text-white">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
              <Award className="w-3 h-3 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Progress Overview
              </h3>
              <p className="text-white/80 text-xs">
                Your fitness journey highlights
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/profile')}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm rounded-lg transition-all duration-300 text-xs px-2 py-1 h-6"
          >
            <span className="text-xs font-medium">View All</span>
            <ChevronRight className={`w-3 h-3 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Weekly Goals Section */}
          <div className="space-y-2">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
              <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1">
                  <Target className="w-3 h-3 text-blue-600" />
                  Weekly Goals
                </h4>
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 text-xs px-2 py-0.5 rounded-lg">
                  {progressData.weeklyGoals.percentage}%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">Completed</span>
                  <span className="font-bold text-gray-800">{progressData.weeklyGoals.completed}/{progressData.weeklyGoals.total}</span>
                </div>
                
                <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressData.weeklyGoals.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Streak */}
              <div className="mt-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg p-2 text-white">
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-5 h-5 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-sm">
                    <TrendingUp className="w-2.5 h-2.5 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-xs font-medium opacity-90">Current Streak</p>
                    <p className="text-base font-bold">{progressData.streaks.current} days</p>
                  </div>
                  <div className="ml-auto">
                    <Zap className="w-3 h-3 text-yellow-300 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="space-y-2">
            <h4 className={`font-bold text-gray-800 text-sm flex items-center gap-1 ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
              <Trophy className="w-3 h-3 text-yellow-600" />
              Recent Achievements
            </h4>
            
            <div className="space-y-2">
              {progressData.achievements.map((achievement, index) => (
                <div key={index} className={`group relative bg-white rounded-lg p-2 border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 ${getAchievementStyle(achievement.type)} rounded-lg flex items-center justify-center text-xs border shadow-sm`}>
                      {achievement.icon}
                    </div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className="font-semibold text-gray-800 text-xs leading-tight">
                        {achievement.title}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {achievement.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievement Summary */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-2 border border-yellow-200">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Star className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs font-bold text-yellow-800">Total Achievements</span>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs px-2 py-0.5 rounded-md">
                  15
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressOverview;
