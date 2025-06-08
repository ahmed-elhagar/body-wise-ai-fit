
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n } from "@/hooks/useI18n";
import { Trophy, Star, Target, Flame, Calendar, Award } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
  progress?: number;
  maxProgress?: number;
  category: 'streak' | 'milestone' | 'consistency' | 'special';
}

interface AchievementBadgesProps {
  achievements?: Achievement[];
}

const AchievementBadges = ({ achievements = [] }: AchievementBadgesProps) => {
  const { t } = useI18n();

  // Default achievements if none provided
  const defaultAchievements: Achievement[] = [
    {
      id: '1',
      title: t('First Week'),
      description: t('Complete your first week of meal planning'),
      icon: '🎯',
      earned: true,
      earnedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      category: 'milestone'
    },
    {
      id: '2',
      title: t('Consistency Champion'),
      description: t('Log meals for 30 consecutive days'),
      icon: '🔥',
      earned: false,
      progress: 15,
      maxProgress: 30,
      category: 'streak'
    },
    {
      id: '3',
      title: t('Protein Master'),
      description: t('Hit your protein goal 10 times'),
      icon: '💪',
      earned: true,
      earnedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      category: 'milestone'
    },
    {
      id: '4',
      title: t('Weekly Warrior'),
      description: t('Complete 4 weeks of workout plans'),
      icon: '⚡',
      earned: false,
      progress: 2,
      maxProgress: 4,
      category: 'consistency'
    },
    {
      id: '5',
      title: t('Goal Getter'),
      description: t('Achieve your weight goal'),
      icon: '🎉',
      earned: false,
      category: 'special'
    },
    {
      id: '6',
      title: t('Early Bird'),
      description: t('Log breakfast for 7 consecutive days'),
      icon: '🌅',
      earned: true,
      earnedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      category: 'streak'
    }
  ];

  const displayAchievements = achievements.length > 0 ? achievements : defaultAchievements;
  const earnedCount = displayAchievements.filter(a => a.earned).length;
  const totalCount = displayAchievements.length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'streak': return <Flame className="w-4 h-4" />;
      case 'milestone': return <Trophy className="w-4 h-4" />;
      case 'consistency': return <Calendar className="w-4 h-4" />;
      case 'special': return <Star className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'streak': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'milestone': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'consistency': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'special': return 'text-purple-600 bg-purple-100 border-purple-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-yellow-600" />
            {t('Achievements')}
          </CardTitle>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            {earnedCount}/{totalCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayAchievements.map(achievement => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.earned
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-md'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-2xl ${achievement.earned ? 'grayscale-0' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold text-sm ${
                      achievement.earned ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getCategoryColor(achievement.category)}`}
                    >
                      {getCategoryIcon(achievement.category)}
                    </Badge>
                  </div>
                  <p className={`text-xs mb-2 ${
                    achievement.earned ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  {achievement.earned && achievement.earnedDate && (
                    <p className="text-xs text-green-600 font-medium">
                      {t('Earned')} {achievement.earnedDate.toLocaleDateString()}
                    </p>
                  )}
                  
                  {!achievement.earned && achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{t('Progress')}</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadges;
