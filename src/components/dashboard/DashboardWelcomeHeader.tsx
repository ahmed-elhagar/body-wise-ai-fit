
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Sparkles, Trophy, Star, Target } from "lucide-react";
import { useAchievements } from "@/hooks/useAchievements";
import { useEffect } from "react";

interface DashboardWelcomeHeaderProps {
  userName: string;
  onViewMealPlan: () => void;
  onViewExercise: () => void;
}

export const DashboardWelcomeHeader = ({ userName }: DashboardWelcomeHeaderProps) => {
  const { t, isRTL } = useLanguage();
  const { earnedAchievements, checkAchievements } = useAchievements();

  // Check for new achievements when component mounts
  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('Good morning');
    if (hour < 17) return t('Good afternoon');
    return t('Good evening');
  };

  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return Trophy;
      case 'star': return Star;
      case 'target': return Target;
      default: return Star;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      case 'common': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {getCurrentTimeGreeting()}, {userName}! 👋
        </h1>
      </div>
      
      <p className="text-white/90 text-base md:text-lg font-medium mb-4">
        {t('Welcome back to your fitness journey')}
      </p>
      
      <div className={`flex items-center gap-2 text-white/80 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-medium">{currentDate}</span>
      </div>
      
      {/* Achievement Badges */}
      <div className="flex gap-2 flex-wrap">
        {earnedAchievements.slice(0, 4).map((achievement) => {
          const IconComponent = getIconComponent(achievement.icon);
          return (
            <div
              key={achievement.id}
              className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-xl text-white shadow-lg backdrop-blur-sm border border-white/20`}
              title={achievement.description}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-xs font-semibold">{achievement.title}</span>
            </div>
          );
        })}
        
        {earnedAchievements.length === 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
            <Target className="w-4 h-4 text-white" />
            <span className="text-xs font-medium text-white/80">{t('Start your journey')}</span>
          </div>
        )}
        
        {earnedAchievements.length > 4 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
            <Trophy className="w-4 h-4 text-white" />
            <span className="text-xs font-medium text-white/80">+{earnedAchievements.length - 4} more</span>
          </div>
        )}
      </div>
    </div>
  );
};
