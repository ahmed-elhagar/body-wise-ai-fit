
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trophy, Star, Target, Flame, Award, Calendar, Zap, TrendingDown } from "lucide-react";
import { useAchievements } from "@/hooks/useAchievements";
import { useEffect } from "react";

const AchievementBadges = () => {
  const { t } = useLanguage();
  const { 
    achievements,
    earnedAchievements, 
    availableAchievements, 
    isLoading,
    checkAchievements 
  } = useAchievements();

  // Check for new achievements when component mounts
  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'common': return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return Trophy;
      case 'star': return Star;
      case 'target': return Target;
      case 'flame': return Flame;
      case 'award': return Award;
      case 'calendar': return Calendar;
      case 'zap': return Zap;
      default: return Star;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return '💪';
      case 'nutrition': return '🍎';
      case 'consistency': return '📅';
      case 'goals': return '🎯';
      default: return '⭐';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 text-center">
                <div className="w-6 h-6 bg-gray-200 rounded mx-auto mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-800">{earnedAchievements.length}</div>
            <div className="text-sm text-orange-600">{t('Earned')}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-800">{availableAchievements.length}</div>
            <div className="text-sm text-blue-600">{t('Available')}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-800">
              {Math.round((earnedAchievements.length / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-purple-600">{t('Completion')}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <Flame className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-800">
              {earnedAchievements.filter(a => a.rarity === 'epic' || a.rarity === 'legendary').length}
            </div>
            <div className="text-sm text-green-600">{t('Rare Badges')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              {t('Earned Achievements')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnedAchievements.map(achievement => {
                const IconComponent = getIconComponent(achievement.icon);
                return (
                  <div
                    key={achievement.id}
                    className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-full ${getRarityStyle(achievement.rarity)}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-800 truncate">
                            {getCategoryIcon(achievement.category)} {achievement.title}
                          </h4>
                          <Badge className={getRarityStyle(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        {achievement.earned_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            {t('Earned:')} {new Date(achievement.earned_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Achievements */}
      {availableAchievements.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              {t('Available Achievements')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableAchievements.map(achievement => {
                const IconComponent = getIconComponent(achievement.icon);
                const progressPercentage = achievement.progress && achievement.requirement_value 
                  ? Math.min((achievement.progress / achievement.requirement_value) * 100, 100) 
                  : 0;

                return (
                  <div
                    key={achievement.id}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-75"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="p-2 rounded-full bg-gray-300 text-gray-600">
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-600 truncate">
                            {getCategoryIcon(achievement.category)} {achievement.title}
                          </h4>
                          <Badge variant="outline" className="text-gray-500">
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{achievement.description}</p>
                        {achievement.progress !== undefined && achievement.requirement_value && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>{achievement.progress} / {achievement.requirement_value}</span>
                              <span>{Math.round(progressPercentage)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AchievementBadges;
