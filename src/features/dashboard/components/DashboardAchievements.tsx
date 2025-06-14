
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Target, Utensils, Dumbbell } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DashboardAchievementsProps {
  profile: any;
  mealPlans: any[] | null;
  programs: any[] | null;
}

const AchievementItem = ({ icon, title, value, detail, progress }: { icon: React.ReactNode, title: string, value: string | number, detail: string, progress?: number }) => (
  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm text-gray-800">{title}</p>
        <p className="font-bold text-sm text-indigo-600">{value}</p>
      </div>
      <p className="text-xs text-gray-500">{detail}</p>
      {progress !== undefined && <Progress value={progress} className="h-1 mt-1" />}
    </div>
  </div>
);

export const DashboardAchievements = ({ profile, mealPlans, programs }: DashboardAchievementsProps) => {
  const profileCompletion = profile?.completion_percentage || 60;
  const mealPlansCount = mealPlans?.length || 0;
  const programsCount = programs?.length || 0;

  const achievements = [
    {
      icon: <Target className="h-5 w-5" />,
      title: "Profile Completion",
      value: `${profileCompletion}%`,
      detail: profileCompletion < 100 ? "Keep filling it out!" : "Well done!",
      progress: profileCompletion,
    },
    {
      icon: <Utensils className="h-5 w-5" />,
      title: "Meal Plans Generated",
      value: mealPlansCount,
      detail: "Weekly nutrition plans",
      progress: mealPlansCount > 0 ? 100 : 0
    },
    {
      icon: <Dumbbell className="h-5 w-5" />,
      title: "Workouts Created",
      value: programsCount,
      detail: "Personalized exercise programs",
      progress: programsCount > 0 ? 100 : 0
    },
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="h-5 w-5 text-yellow-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {achievements.map((ach, index) => (
            <AchievementItem key={index} {...ach} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
