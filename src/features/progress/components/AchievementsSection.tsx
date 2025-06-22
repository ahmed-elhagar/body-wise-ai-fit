
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Star } from "lucide-react";

const AchievementsSection = () => {
  // Mock achievements data - replace with actual hook when available
  const achievements = [
    { id: '1', name: 'First Meal Plan', description: 'Generated your first meal plan', earned: true },
    { id: '2', name: 'Week Warrior', description: 'Completed 7 days of meal tracking', earned: false },
    { id: '3', name: 'Fitness Starter', description: 'Started your fitness journey', earned: true }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                achievement.earned
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className={`p-2 rounded-full ${
                achievement.earned
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {achievement.earned ? <Star className="h-4 w-4" /> : <Target className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{achievement.name}</h4>
                <p className="text-xs text-gray-600">{achievement.description}</p>
              </div>
              {achievement.earned && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Earned
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsSection;
