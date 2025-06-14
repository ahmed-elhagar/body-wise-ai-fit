
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Zap } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'milestone' | 'streak' | 'goal' | 'special';
  unlockedAt: string;
  icon: 'trophy' | 'star' | 'target' | 'zap';
}

const achievementIcons = {
  trophy: Trophy,
  star: Star,
  target: Target,
  zap: Zap
};

const achievementColors = {
  milestone: "bg-yellow-100 text-yellow-800 border-yellow-200",
  streak: "bg-blue-100 text-blue-800 border-blue-200",
  goal: "bg-green-100 text-green-800 border-green-200",
  special: "bg-purple-100 text-purple-800 border-purple-200"
};

export const DashboardAchievements = () => {
  const recentAchievements: Achievement[] = [
    {
      id: '1',
      title: 'Week Warrior',
      description: 'Completed 7 days of meal planning',
      type: 'streak',
      unlockedAt: '2 days ago',
      icon: 'star'
    },
    {
      id: '2',
      title: 'Protein Champion',
      description: 'Hit your protein goals 5 days in a row',
      type: 'goal',
      unlockedAt: '1 week ago',
      icon: 'target'
    },
    {
      id: '3',
      title: 'First Steps',
      description: 'Completed your first workout',
      type: 'milestone',
      unlockedAt: '2 weeks ago',
      icon: 'trophy'
    }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentAchievements.length > 0 ? (
          <div className="space-y-3">
            {recentAchievements.map((achievement) => {
              const IconComponent = achievementIcons[achievement.icon];
              return (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={achievementColors[achievement.type]}>
                        {achievement.type}
                      </Badge>
                      <span className="text-xs text-gray-500">{achievement.unlockedAt}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No achievements yet</p>
            <p className="text-sm text-gray-500">Keep working towards your goals!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
