
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Zap } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface ExerciseAchievementsProps {
  achievements: Achievement[];
}

const ExerciseAchievements = ({ achievements }: ExerciseAchievementsProps) => {
  const { t, isRTL } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Trophy className="w-5 h-5 text-yellow-500" />
          {t('exercise:achievements') || 'Achievements'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <achievement.icon className={`w-6 h-6 ${achievement.unlocked ? 'text-green-600' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <h4 className="font-semibold">{achievement.name}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {t('exercise:unlocked') || 'Unlocked'}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseAchievements;
