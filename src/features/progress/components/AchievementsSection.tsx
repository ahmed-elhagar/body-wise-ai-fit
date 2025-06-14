
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Target, Trophy, Star, Calendar, TrendingUp } from "lucide-react";
import { useAchievements } from "@/hooks/useAchievements";

const categoryColors = {
  fitness: "bg-blue-100 text-blue-800",
  consistency: "bg-green-100 text-green-800",
  goals: "bg-purple-100 text-purple-800",
  nutrition: "bg-orange-100 text-orange-800"
};

const rarityColors = {
  common: "bg-gray-100 text-gray-800",
  uncommon: "bg-green-100 text-green-800",
  rare: "bg-blue-100 text-blue-800",
  epic: "bg-purple-100 text-purple-800",
  legendary: "bg-yellow-100 text-yellow-800"
};

export const AchievementsSection = () => {
  const { 
    achievements, 
    earnedAchievements, 
    availableAchievements, 
    completedAchievementsCount,
    isLoading 
  } = useAchievements();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Total Achievements</p>
                <p className="text-2xl font-bold text-yellow-900">{completedAchievementsCount}</p>
                <p className="text-xs text-yellow-600 mt-1">
                  {completedAchievementsCount} of {achievements.length} unlocked
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Recent Achievement</p>
                <p className="text-lg font-bold text-purple-900">
                  {earnedAchievements.length > 0 ? earnedAchievements[earnedAchievements.length - 1].title : 'None yet'}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {earnedAchievements.length > 0 ? 
                    new Date(earnedAchievements[earnedAchievements.length - 1].earned_at!).toLocaleDateString() : 
                    'Complete your first goal'
                  }
                </p>
              </div>
              <Trophy className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Completion Rate</p>
                <p className="text-2xl font-bold text-green-900">
                  {Math.round((completedAchievementsCount / achievements.length) * 100)}%
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {availableAchievements.length} more to unlock
                </p>
              </div>
              <Star className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earned Achievements */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Earned Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {earnedAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {earnedAchievements.map((achievement) => {
                const getIconComponent = () => {
                  switch (achievement.icon) {
                    case 'target': return Target;
                    case 'trophy': return Trophy;
                    case 'star': return Star;
                    default: return Award;
                  }
                };
                const IconComponent = getIconComponent();
                
                return (
                  <div key={achievement.id} className="p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                          <Badge className={rarityColors[achievement.rarity as keyof typeof rarityColors]}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={categoryColors[achievement.category as keyof typeof categoryColors]}>
                            {achievement.category}
                          </Badge>
                          {achievement.earned_at && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>Earned {new Date(achievement.earned_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Achievements Yet</h3>
              <p className="text-gray-600">Complete your first workout or goal to earn your first achievement!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Achievements */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-gray-600" />
            Available Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableAchievements.map((achievement) => {
              const getIconComponent = () => {
                switch (achievement.icon) {
                  case 'target': return Target;
                  case 'trophy': return Trophy;
                  case 'star': return Star;
                  default: return Award;
                }
              };
              const IconComponent = getIconComponent();
              
              return (
                <div key={achievement.id} className="p-4 border rounded-lg bg-gray-50 border-gray-200 opacity-75">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-600">{achievement.title}</h4>
                        <Badge className={rarityColors[achievement.rarity as keyof typeof rarityColors]}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{achievement.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={categoryColors[achievement.category as keyof typeof categoryColors]}>
                          {achievement.category}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          Progress: {achievement.progress}/{achievement.requirement_value}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
