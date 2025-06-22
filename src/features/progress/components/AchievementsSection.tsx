
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Star } from "lucide-react";

const AchievementsSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Achievements</span>
            <span className="font-semibold">0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Recent Badges</span>
            <span className="font-semibold">0</span>
          </div>
          <div className="flex items-center gap-2 text-purple-600">
            <Award className="h-4 w-4" />
            <span className="text-sm">Complete your first workout to earn achievements</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsSection;
