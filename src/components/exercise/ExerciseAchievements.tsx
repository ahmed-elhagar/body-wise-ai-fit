
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExerciseAchievementsProps {
  onViewAchievement: (achievementId: string) => void;
}

export const ExerciseAchievements = ({ onViewAchievement }: ExerciseAchievementsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Track your fitness milestones and achievements</p>
      </CardContent>
    </Card>
  );
};
