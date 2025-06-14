
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  BarChart3, 
  Trophy, 
  Brain, 
  Award,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExerciseAnalyticsDashboard } from '@/components/exercise/ExerciseAnalyticsDashboard';
import { PersonalRecordsTracker } from '@/components/exercise/PersonalRecordsTracker';
import { PerformanceInsights } from '@/components/exercise/PerformanceInsights';
import { ExerciseAchievements } from '@/components/exercise/ExerciseAchievements';
import { Exercise } from '@/types/exercise';

interface ExerciseAnalyticsContainerProps {
  exercises: Exercise[];
  onClose: () => void;
}

export const ExerciseAnalyticsContainer = ({ exercises, onClose }: ExerciseAnalyticsContainerProps) => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const handleViewRecordDetails = (recordId: string) => {
    console.log('View record details:', recordId);
    // TODO: Implement record details view
  };

  const handleApplyRecommendation = (insightId: string) => {
    console.log('Apply recommendation:', insightId);
    // TODO: Implement recommendation application
  };

  const handleViewAchievement = (achievementId: string) => {
    console.log('View achievement:', achievementId);
    // TODO: Implement achievement details view
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('Back to Exercises')}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('Exercise Analytics')}</h1>
              <p className="text-gray-600">{t('Track your progress, records, and insights')}</p>
            </div>
          </div>
        </div>

        {/* Analytics Tabs */}
        <Card className="p-6">
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {t('Analytics')}
              </TabsTrigger>
              <TabsTrigger value="records" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                {t('Records')}
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                {t('Insights')}
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                {t('Achievements')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <ExerciseAnalyticsDashboard
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />
            </TabsContent>

            <TabsContent value="records">
              <PersonalRecordsTracker
                exercises={exercises}
                onViewDetails={handleViewRecordDetails}
              />
            </TabsContent>

            <TabsContent value="insights">
              <PerformanceInsights
                onApplyRecommendation={handleApplyRecommendation}
              />
            </TabsContent>

            <TabsContent value="achievements">
              <ExerciseAchievements
                onViewAchievement={handleViewAchievement}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};
