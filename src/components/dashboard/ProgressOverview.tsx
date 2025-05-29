
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, Target, Award, ChevronRight, Star, Trophy, Zap } from "lucide-react";
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
      { title: "First Week Complete", icon: "🏆", date: "2 days ago", type: "gold" },
      { title: "Weight Goal Reached", icon: "🎯", date: "1 week ago", type: "silver" },
      { title: "Consistency Master", icon: "⭐", date: "2 weeks ago", type: "bronze" }
    ]
  };

  const getAchievementStyle = (type: string) => {
    switch (type) {
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-400 border-gray-300';
      case 'bronze': return 'bg-gradient-to-r from-orange-400 to-yellow-600 border-orange-300';
      default: return 'bg-gradient-to-r from-blue-400 to-purple-500 border-blue-300';
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50 to-pink-50 border-0 shadow-xl rounded-3xl">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23a855f7" fill-opacity="0.05"%3E%3Cpath d="M20 20c0-8.837-7.163-16-16-16s-16 7.163-16 16 7.163 16 16 16 16-7.163 16-16zm-16-8c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8z"/%3E%3C/g%3E%3C/svg%3E')] animate-pulse-soft"></div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                Progress Overview
              </h3>
              <p className="text-white/80 text-sm">
                Your fitness journey highlights
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/profile')}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="text-sm font-medium">View All</span>
            <ChevronRight className={`w-4 h-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Goals Section */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-100">
              <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Weekly Goals
                </h4>
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 text-sm px-3 py-1 rounded-xl shadow-lg">
                  {progressData.weeklyGoals.percentage}%
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">Completed</span>
                  <span className="font-bold text-gray-800">{progressData.weeklyGoals.completed}/{progressData.weeklyGoals.total}</span>
                </div>
                
                <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${progressData.weeklyGoals.percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Current Streak */}
              <div className="mt-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl p-4 text-white">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-sm font-medium opacity-90">Current Streak</p>
                    <p className="text-2xl font-bold">{progressData.streaks.current} days</p>
                  </div>
                  <div className="ml-auto">
                    <Zap className="w-6 h-6 text-yellow-300 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="space-y-4">
            <h4 className={`font-bold text-gray-800 text-lg flex items-center gap-2 ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
              <Trophy className="w-5 h-5 text-yellow-600" />
              Recent Achievements
            </h4>
            
            <div className="space-y-3">
              {progressData.achievements.map((achievement, index) => (
                <div key={index} className={`group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 transform hover:scale-102 hover:shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {/* Achievement Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className={`relative flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-12 h-12 ${getAchievementStyle(achievement.type)} rounded-xl flex items-center justify-center text-lg border-2 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                      {achievement.icon}
                    </div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className="font-bold text-gray-800 text-sm leading-tight group-hover:text-purple-700 transition-colors">
                        {achievement.title}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        {achievement.date}
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievement Summary */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-bold text-yellow-800">Total Achievements</span>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-sm px-3 py-1 rounded-lg shadow-lg">
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
