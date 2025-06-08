
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Award, 
  Target, 
  Zap,
  Calendar,
  TrendingUp,
  Flame,
  Star,
  Medal
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'strength' | 'endurance' | 'consistency' | 'progression' | 'volume';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  icon: string;
  reward?: string;
}

interface ExerciseAchievementsProps {
  onViewAchievement: (achievementId: string) => void;
}

export const ExerciseAchievements = ({ onViewAchievement }: ExerciseAchievementsProps) => {
  const { t } = useLanguage();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock achievements data - in real app, fetch from Supabase
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: t('First Workout'),
        description: t('Complete your first workout'),
        category: 'consistency',
        rarity: 'common',
        isUnlocked: true,
        unlockedAt: new Date('2024-01-01'),
        progress: 1,
        maxProgress: 1,
        icon: '🎯',
        reward: 'Badge'
      },
      {
        id: '2',
        title: t('Week Warrior'),
        description: t('Complete 7 workouts in a row'),
        category: 'consistency',
        rarity: 'rare',
        isUnlocked: true,
        unlockedAt: new Date('2024-01-07'),
        progress: 7,
        maxProgress: 7,
        icon: '🔥',
        reward: 'Title + 50 XP'
      },
      {
        id: '3',
        title: t('Strength Beast'),
        description: t('Increase any exercise weight by 50%'),
        category: 'strength',
        rarity: 'epic',
        isUnlocked: false,
        progress: 35,
        maxProgress: 50,
        icon: '💪',
        reward: 'Legendary Badge'
      },
      {
        id: '4',
        title: t('Century Club'),
        description: t('Complete 100 total exercises'),
        category: 'volume',
        rarity: 'rare',
        isUnlocked: false,
        progress: 73,
        maxProgress: 100,
        icon: '💯',
        reward: 'Special Title'
      },
      {
        id: '5',
        title: t('Perfect Form'),
        description: t('Complete 20 exercises with 0 missed reps'),
        category: 'progression',
        rarity: 'epic',
        isUnlocked: false,
        progress: 12,
        maxProgress: 20,
        icon: '⭐',
        reward: 'Master Badge'
      },
      {
        id: '6',
        title: t('Endurance Master'),
        description: t('Complete a 90+ minute workout'),
        category: 'endurance',
        rarity: 'legendary',
        isUnlocked: false,
        progress: 0,
        maxProgress: 1,
        icon: '🏆',
        reward: 'Legendary Title + 200 XP'
      }
    ];

    setAchievements(mockAchievements);
    setIsLoading(false);
  }, [t]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'rare': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'epic': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'legendary': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Trophy className="w-4 h-4" />;
      case 'endurance': return <Zap className="w-4 h-4" />;
      case 'consistency': return <Flame className="w-4 h-4" />;
      case 'progression': return <TrendingUp className="w-4 h-4" />;
      case 'volume': return <Target className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const filteredAchievements = achievements.filter(achievement => 
    filterCategory === 'all' || achievement.category === filterCategory
  );

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalAchievements = achievements.length;

  const categories = ['all', 'strength', 'endurance', 'consistency', 'progression', 'volume'];

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <h3 className="text-xl font-bold text-gray-900">{t('Achievements')}</h3>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {unlockedCount}/{totalAchievements}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t('Progress')}</span>
            <span className="font-medium">{Math.round((unlockedCount / totalAchievements) * 100)}%</span>
          </div>
          <Progress value={(unlockedCount / totalAchievements) * 100} className="h-3" />
        </div>
      </Card>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilterCategory(category)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category !== 'all' && getCategoryIcon(category)}
            {t(category)}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement) => (
          <Card 
            key={achievement.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
              achievement.isUnlocked 
                ? 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onViewAchievement(achievement.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`text-2xl ${achievement.isUnlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div>
                  <h4 className={`font-medium ${achievement.isUnlocked ? 'text-gray-900' : 'text-gray-600'}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                  {achievement.rarity}
                </Badge>
                {achievement.isUnlocked && (
                  <Badge variant="default" className="bg-green-600 text-xs">
                    <Medal className="w-3 h-3 mr-1" />
                    {t('Unlocked')}
                  </Badge>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {!achievement.isUnlocked && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{t('Progress')}</span>
                  <span className="font-medium">
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
                <Progress 
                  value={(achievement.progress / achievement.maxProgress) * 100} 
                  className="h-2"
                />
              </div>
            )}

            {/* Unlocked Info */}
            {achievement.isUnlocked && achievement.unlockedAt && (
              <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {achievement.unlockedAt.toLocaleDateString()}
                </div>
                {achievement.reward && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {achievement.reward}
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h4 className="font-medium text-gray-900 mb-2">{t('No Achievements Found')}</h4>
          <p className="text-gray-600 text-sm">
            {t('Try a different category or continue working out to unlock achievements!')}
          </p>
        </div>
      )}
    </div>
  );
};
