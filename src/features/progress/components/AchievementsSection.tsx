
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Trophy, 
  Star,
  Crown,
  Medal,
  ArrowRight,
  Calendar,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAchievements } from "@/hooks/useAchievements";

export const AchievementsSection = () => {
  const navigate = useNavigate();
  const { 
    achievements, 
    earnedAchievements, 
    availableAchievements,
    completedAchievementsCount 
  } = useAchievements();

  const getAchievementIcon = (category: string, rarity: string) => {
    if (rarity === 'rare') return <Crown className="w-5 h-5 text-purple-600" />;
    if (rarity === 'epic') return <Trophy className="w-5 h-5 text-yellow-600" />;
    if (category === 'consistency') return <Calendar className="w-5 h-5 text-blue-600" />;
    if (category === 'nutrition') return <Target className="w-5 h-5 text-green-600" />;
    return <Medal className="w-5 h-5 text-orange-600" />;
  };

  const getAchievementColor = (rarity: string, completed: boolean) => {
    if (!completed) return "bg-gray-50 border-gray-200 text-gray-600";
    
    switch (rarity) {
      case 'rare':
        return "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-900";
      case 'epic':
        return "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-900";
      default:
        return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-900";
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'rare':
        return <Badge className="bg-purple-600 text-white">Rare</Badge>;
      case 'epic':
        return <Badge className="bg-yellow-600 text-white">Epic</Badge>;
      default:
        return <Badge variant="outline">Common</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Achievements Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-yellow-900 mb-1">{completedAchievementsCount}</div>
            <div className="text-sm text-yellow-600">Earned Achievements</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-900 mb-1">{availableAchievements.length}</div>
            <div className="text-sm text-blue-600">Available to Earn</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-purple-900 mb-1">
              {Math.round((completedAchievementsCount / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-purple-600">Completion Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      {earnedAchievements.length > 0 && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Award className="w-5 h-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {earnedAchievements.slice(0, 3).map((achievement, index) => (
              <div key={achievement.id} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-green-200">
                <div className="flex-shrink-0">
                  {getAchievementIcon(achievement.category, achievement.rarity)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900">{achievement.title}</h4>
                  <p className="text-sm text-green-600">{achievement.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getRarityBadge(achievement.rarity)}
                  {achievement.earned_at && (
                    <div className="text-xs text-green-500">
                      {new Date(achievement.earned_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Achievements Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              All Achievements
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/achievements')}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            >
              View All
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.slice(0, 6).map((achievement, index) => (
              <Card 
                key={achievement.id} 
                className={`${getAchievementColor(achievement.rarity, achievement.completed)} transition-all duration-300 hover:shadow-md`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 ${achievement.completed ? '' : 'opacity-50'}`}>
                      {getAchievementIcon(achievement.category, achievement.rarity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`font-semibold ${achievement.completed ? '' : 'text-gray-500'}`}>
                          {achievement.title}
                        </h4>
                        {getRarityBadge(achievement.rarity)}
                      </div>
                      <p className={`text-sm mb-3 ${achievement.completed ? '' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>
                      
                      {!achievement.completed && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.requirement_value}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.min((achievement.progress / achievement.requirement_value) * 100, 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* No Achievements State */}
      {achievements.length === 0 && (
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-12 text-center">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start Your Achievement Journey</h3>
            <p className="text-gray-600 mb-6">
              Complete activities to unlock achievements and track your progress
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
