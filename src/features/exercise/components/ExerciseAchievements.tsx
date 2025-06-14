
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Star, Target, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseAchievementsProps {
  onViewAchievement: (achievementId: string) => void;
}

export const ExerciseAchievements = ({ onViewAchievement }: ExerciseAchievementsProps) => {
  const { t } = useLanguage();

  const mockAchievements = [
    {
      id: '1',
      title: 'First Week Complete',
      description: 'Completed your first week of training!',
      icon: '🎯',
      unlocked: true,
      date: '2024-01-07',
      points: 100
    },
    {
      id: '2',
      title: 'Personal Best',
      description: 'Set a new personal record in bench press',
      icon: '💪',
      unlocked: true,
      date: '2024-01-15',
      points: 250
    },
    {
      id: '3',
      title: 'Consistency Master',
      description: 'Train for 30 consecutive days',
      icon: '🔥',
      unlocked: false,
      progress: 15,
      total: 30,
      points: 500
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-yellow-600" />
        <h3 className="text-lg font-semibold">{t('Achievements')}</h3>
      </div>

      <div className="grid gap-4">
        {mockAchievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`p-4 ${achievement.unlocked ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{achievement.icon}</div>
                
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    {achievement.title}
                    {achievement.unlocked && <Star className="w-4 h-4 text-yellow-500" />}
                  </h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  
                  {achievement.unlocked ? (
                    <p className="text-xs text-green-600 font-medium">
                      Unlocked on {achievement.date}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(achievement.progress! / achievement.total!) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {achievement.progress}/{achievement.total}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800">
                  <Zap className="w-3 h-3 mr-1" />
                  {achievement.points} pts
                </Badge>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewAchievement(achievement.id)}
                >
                  <Target className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
