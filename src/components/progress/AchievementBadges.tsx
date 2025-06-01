import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/hooks/useI18n";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, CheckCircle } from "lucide-react";

interface AchievementBadgesProps {
  achievements: any[];
}

export const AchievementBadges = ({ achievements }: AchievementBadgesProps) => {
  const { t } = useI18n();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t('achievements')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.length > 0 ? (
          achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{achievement.title}</h4>
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                </div>
              </div>
              <Badge variant="secondary">
                <CheckCircle className="w-3 h-3 mr-1" />
                {t('completed')}
              </Badge>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <Star className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">{t('noAchievementsYet')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

