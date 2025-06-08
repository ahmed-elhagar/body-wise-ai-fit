
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Trophy, Target, TrendingUp } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useMealPlanState } from "@/hooks/useMealPlanState";
import { useOptimizedExerciseProgramPage } from "@/features/exercise/hooks/useOptimizedExerciseProgramPage";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProgressAnalytics } from "@/components/progress/ProgressAnalytics";
import TrendAnalysis from "@/components/progress/TrendAnalysis";
import AchievementBadges from "@/components/progress/AchievementBadges";

const ProgressPage = () => {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const { currentWeekPlan } = useMealPlanState();
  const { currentProgram, todaysExercises } = useOptimizedExerciseProgramPage();

  const getProfileCompletion = () => {
    if (!profile) return 0;
    const fields = [
      profile.first_name,
      profile.age,
      profile.weight,
      profile.height,
      profile.fitness_goal,
      profile.activity_level,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const getMealPlanProgress = () => {
    if (!currentWeekPlan?.dailyMeals) return 0;
    const totalMeals = currentWeekPlan.dailyMeals.length;
    return totalMeals > 0 ? 100 : 0;
  };

  const getExerciseProgress = () => {
    if (!currentProgram?.daily_workouts) return 0;
    const totalWorkouts = currentProgram.daily_workouts.length;
    const completedWorkouts = currentProgram.daily_workouts.filter(w => w.completed).length;
    return totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('Progress Overview')}</h1>
              <p className="text-gray-600">{t('Track your fitness journey and achievements')}</p>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {t('Overview')}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {t('Analytics')}
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                {t('Achievements')}
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                {t('Trends')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-500" />
                      {t('Profile Completion')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Progress value={getProfileCompletion()} />
                      <p className="text-sm text-gray-600">
                        {getProfileCompletion()}% {t('complete')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-500" />
                      {t('Meal Planning')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Progress value={getMealPlanProgress()} />
                      <Badge variant={currentWeekPlan ? "default" : "secondary"}>
                        {currentWeekPlan ? t('Active Plan') : t('No Plan')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-purple-500" />
                      {t('Exercise Progress')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Progress value={getExerciseProgress()} />
                      <p className="text-sm text-gray-600">
                        {getExerciseProgress()}% {t('completed')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <ProgressAnalytics exercises={todaysExercises || []} />
            </TabsContent>

            <TabsContent value="achievements">
              <AchievementBadges />
            </TabsContent>

            <TabsContent value="trends">
              <TrendAnalysis />
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ProgressPage;
