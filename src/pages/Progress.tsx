
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Scale, Trophy, Brain } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import WeightStatsCards from "@/components/weight/WeightStatsCards";
import WeightProgressChart from "@/components/weight/WeightProgressChart";
import WeightEntryForm from "@/components/weight/WeightEntryForm";
import ProgressBadges from "@/components/goals/ProgressBadges";
import ProgressAnalytics from "@/components/progress/ProgressAnalytics";
import AchievementBadges from "@/components/progress/AchievementBadges";
import TrendAnalysis from "@/components/progress/TrendAnalysis";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useGoals } from "@/hooks/useGoals";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/contexts/LanguageContext";

const Progress = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { weightEntries, isLoading: weightLoading } = useWeightTracking();
  const { getMacroGoals } = useGoals();
  const { profile } = useProfile();

  const activeTab = tab || 'analytics';

  useEffect(() => {
    if (!tab) {
      navigate('/progress/analytics', { replace: true });
    }
  }, [tab, navigate]);

  const macroGoals = getMacroGoals();
  const latestWeight = weightEntries[0];

  // Calculate BMI
  const bmi = latestWeight && profile?.height 
    ? latestWeight.weight / Math.pow(profile.height / 100, 2)
    : null;

  if (weightLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="space-y-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <PageHeader
          title={t('Progress & Analytics')}
          description={t('Track your fitness journey with AI-powered insights and comprehensive analytics')}
          icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
        >
          <ProgressBadges />
        </PageHeader>

        <Tabs value={activeTab} onValueChange={(value) => navigate(`/progress/${value}`)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">{t('Analytics')}</span>
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">{t('Weight')}</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">{t('Badges')}</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">{t('AI Trends')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <ProgressAnalytics weightEntries={weightEntries} macroGoals={macroGoals} />
          </TabsContent>

          <TabsContent value="weight" className="space-y-6 mt-6">
            <WeightStatsCards weightEntries={weightEntries} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <WeightProgressChart weightEntries={weightEntries} />
              </div>
              <div className="xl:col-span-1">
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg h-fit">
                  <h3 className="text-lg font-semibold mb-4">{t('Add Weight Entry')}</h3>
                  <WeightEntryForm />
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6 mt-6">
            <AchievementBadges />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6 mt-6">
            <TrendAnalysis />
          </TabsContent>
        </Tabs>
      </Layout>
    </ProtectedRoute>
  );
};

export default Progress;
