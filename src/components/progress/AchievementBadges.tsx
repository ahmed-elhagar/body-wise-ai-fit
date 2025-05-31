
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trophy, Star, Zap, Target, Calendar, Award, Crown, Shield } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'gold' | 'silver' | 'bronze' | 'special';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

interface AchievementBadgesProps {
  className?: string;
}

const AchievementBadges = ({ className = "" }: AchievementBadgesProps) => {
  const { t } = useLanguage();

  const achievements: Achievement[] = [
    {
      id: 'first_week',
      title: t('First Week Warrior'),
      description: t('Complete your first week of meal planning'),
      icon: '🌟',
      type: 'bronze',
      unlocked: true,
      unlockedAt: '2025-01-15'
    },
    {
      id: 'consistent_logger',
      title: t('Consistent Logger'),
      description: t('Log meals for 7 consecutive days'),
      icon: '📊',
      type: 'silver',
      unlocked: true,
      unlockedAt: '2025-01-20'
    },
    {
      id: 'macro_master',
      title: t('Macro Master'),
      description: t('Hit all macro targets for 3 consecutive days'),
      icon: '🎯',
      type: 'gold',
      unlocked: false,
      progress: 2,
      target: 3
    },
    {
      id: 'weight_goal',
      title: t('Weight Goal Achiever'),
      description: t('Reach your target weight'),
      icon: '⚖️',
      type: 'special',
      unlocked: false,
      progress: 75,
      target: 100
    },
    {
      id: 'workout_streak',
      title: t('Workout Warrior'),
      description: t('Complete 10 workouts in a month'),
      icon: '💪',
      type: 'gold',
      unlocked: false,
      progress: 7,
      target: 10
    },
    {
      id: 'photo_analyzer',
      title: t('Photo Analysis Pro'),
      description: t('Use AI photo analysis 20 times'),
      icon: '📸',
      type: 'silver',
      unlocked: false,
      progress: 12,
      target: 20
    }
  ];

  const getAchievementStyle = (type: string, unlocked: boolean) => {
    if (!unlocked) {
      return 'bg-gray-100 border-gray-200 text-gray-400';
    }
    
    switch (type) {
      case 'gold': return 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 text-white';
      case 'silver': return 'bg-gradient-to-br from-gray-300 to-gray-400 border-gray-300 text-gray-800';
      case 'bronze': return 'bg-gradient-to-br from-orange-400 to-amber-600 border-orange-300 text-white';
      case 'special': return 'bg-gradient-to-br from-purple-500 to-pink-600 border-purple-300 text-white';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'gold': return <Crown className="w-4 h-4" />;
      case 'silver': return <Award className="w-4 h-4" />;
      case 'bronze': return <Shield className="w-4 h-4" />;
      case 'special': return <Star className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const progressAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Unlocked Achievements */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Trophy className="w-5 h-5" />
            {t('Unlocked Achievements')} ({unlockedAchievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${getAchievementStyle(achievement.type, achievement.unlocked)}`}
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex items-center justify-center gap-1">
                    {getTypeIcon(achievement.type)}
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {achievement.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm">{achievement.title}</h4>
                  <p className="text-xs opacity-90">{achievement.description}</p>
                  {achievement.unlockedAt && (
                    <Badge variant="outline" className="text-xs bg-white/20 border-white/30">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Achievements */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            {t('In Progress')} ({progressAchievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {progressAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl opacity-60">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    {getTypeIcon(achievement.type)}
                  </div>
                  
                  {achievement.progress !== undefined && achievement.target && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{t('Progress')}</span>
                        <span className="font-medium text-gray-800">
                          {achievement.progress}/{achievement.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Stats */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-800">{unlockedAchievements.length}</div>
              <div className="text-sm text-purple-600">{t('Unlocked')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-800">{achievements.length}</div>
              <div className="text-sm text-purple-600">{t('Total Available')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-800">
                {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
              </div>
              <div className="text-sm text-purple-600">{t('Completion Rate')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementBadges;
