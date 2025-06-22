import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { 
  TrendingUp, 
  Target, 
  Scale, 
  Ruler, 
  Activity, 
  Calendar,
  Award,
  Plus,
  Camera,
  BarChart3,
  LineChart,
  PieChart
} from 'lucide-react';

// Design System Components
import { 
  FeatureLayout, 
  GradientStatsCard, 
  StatsGrid,
  ActionButton,
  UniversalLoadingState
} from '@/shared/components/design-system';
import { useTheme } from '@/shared/hooks';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Feature Components
import { useI18n } from '@/shared/hooks/useI18n';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Types
interface ProgressTrackerProps {
  refreshKey?: number;
}

interface ProgressData {
  weight: number[];
  bodyFat: number[];
  muscle: number[];
  measurements: {
    chest: number[];
    waist: number[];
    hips: number[];
    arms: number[];
  };
  dates: string[];
}

const ModernProgressTracker: React.FC<ProgressTrackerProps> = ({ refreshKey }) => {
  const { profile, isLoading: profileLoading } = useProfile();
  const { user, isLoading: userLoading } = useAuth();
  const { t } = useI18n();
  const { classes } = useTheme();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  
  const isLoading = profileLoading || userLoading;

  // Mock progress data - replace with real API calls
  useEffect(() => {
    const mockData: ProgressData = {
      weight: [75, 74.5, 74.2, 73.8, 73.5, 73.0, 72.8],
      bodyFat: [18, 17.8, 17.5, 17.2, 17.0, 16.8, 16.5],
      muscle: [42, 42.2, 42.3, 42.5, 42.7, 42.8, 43.0],
      measurements: {
        chest: [95, 95.2, 95.5, 95.8, 96.0, 96.2, 96.5],
        waist: [82, 81.5, 81.0, 80.5, 80.0, 79.5, 79.0],
        hips: [88, 87.8, 87.5, 87.2, 87.0, 86.8, 86.5],
        arms: [32, 32.2, 32.3, 32.5, 32.7, 32.8, 33.0]
      },
      dates: Array.from({ length: 7 }, (_, i) => 
        format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
      )
    };
    setProgressData(mockData);
  }, [refreshKey]);

  const userName = profile?.first_name || user?.email?.split('@')[0] || 'there';

  // Current stats (latest values)
  const currentStats = progressData ? {
    weight: progressData.weight[progressData.weight.length - 1],
    bodyFat: progressData.bodyFat[progressData.bodyFat.length - 1],
    muscle: progressData.muscle[progressData.muscle.length - 1],
    waist: progressData.measurements.waist[progressData.measurements.waist.length - 1]
  } : null;

  // Progress calculations
  const progressCalculations = progressData ? {
    weightChange: progressData.weight[progressData.weight.length - 1] - progressData.weight[0],
    bodyFatChange: progressData.bodyFat[progressData.bodyFat.length - 1] - progressData.bodyFat[0],
    muscleChange: progressData.muscle[progressData.muscle.length - 1] - progressData.muscle[0],
    waistChange: progressData.measurements.waist[progressData.measurements.waist.length - 1] - progressData.measurements.waist[0]
  } : null;

  // Tab configuration
  const tabs = [
    { id: 'overview', label: t('Overview'), icon: BarChart3 },
    { id: 'weight', label: t('Weight'), icon: Scale },
    { id: 'measurements', label: t('Measurements'), icon: Ruler },
    { id: 'photos', label: t('Photos'), icon: Camera },
  ];

  // Header actions
  const headerActions = (
    <div className="flex gap-3">
      <ActionButton
        variant="outline"
        size="sm"
        icon={Camera}
        onClick={() => {}}
      >
        {t('Add Photo')}
      </ActionButton>
      
      <ActionButton
        variant="primary"
        size="sm"
        icon={Plus}
        onClick={() => {}}
      >
        {t('Log Progress')}
      </ActionButton>
    </div>
  );

  if (isLoading) {
    return <UniversalLoadingState feature="progress" />;
  }

  return (
    <FeatureLayout
      title={t('Progress Tracker')}
      subtitle={`${t('Hey')} ${userName}! ${t('Track your fitness journey and celebrate your wins')}`}
      icon={TrendingUp}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerActions={headerActions}
      isLoading={isLoading}
    >
      {/* Stats Grid */}
      <StatsGrid>
        <GradientStatsCard
          title={t('Weight')}
          value={currentStats ? `${currentStats.weight}kg` : '0kg'}
          subtitle={progressCalculations ? `${progressCalculations.weightChange > 0 ? '+' : ''}${progressCalculations.weightChange.toFixed(1)}kg this week` : 'No data'}
          icon={Scale}
          trend={progressCalculations?.weightChange ? (progressCalculations.weightChange < 0 ? 'up' : 'down') : 'neutral'}
          variant="weight"
        />
        
        <GradientStatsCard
          title={t('Body Fat')}
          value={currentStats ? `${currentStats.bodyFat}%` : '0%'}
          subtitle={progressCalculations ? `${progressCalculations.bodyFatChange > 0 ? '+' : ''}${progressCalculations.bodyFatChange.toFixed(1)}% this week` : 'No data'}
          icon={PieChart}
          trend={progressCalculations?.bodyFatChange ? (progressCalculations.bodyFatChange < 0 ? 'up' : 'down') : 'neutral'}
          variant="calories"
        />
        
        <GradientStatsCard
          title={t('Muscle Mass')}
          value={currentStats ? `${currentStats.muscle}kg` : '0kg'}
          subtitle={progressCalculations ? `${progressCalculations.muscleChange > 0 ? '+' : ''}${progressCalculations.muscleChange.toFixed(1)}kg this week` : 'No data'}
          icon={Activity}
          trend={progressCalculations?.muscleChange ? (progressCalculations.muscleChange > 0 ? 'up' : 'down') : 'neutral'}
          variant="workout"
        />
        
        <GradientStatsCard
          title={t('Waist')}
          value={currentStats ? `${currentStats.waist}cm` : '0cm'}
          subtitle={progressCalculations ? `${progressCalculations.waistChange > 0 ? '+' : ''}${progressCalculations.waistChange.toFixed(1)}cm this week` : 'No data'}
          icon={Ruler}
          trend={progressCalculations?.waistChange ? (progressCalculations.waistChange < 0 ? 'up' : 'down') : 'neutral'}
          variant="goal"
        />
      </StatsGrid>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Summary */}
          <Card className={`border-0 ${classes.cardBg}`}>
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {t('Weekly Summary')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Scale className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">{t('Weight Loss')}</span>
                  </div>
                  <span className="text-green-600 font-bold">
                    {progressCalculations ? `${Math.abs(progressCalculations.weightChange).toFixed(1)}kg` : '0kg'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">{t('Muscle Gain')}</span>
                  </div>
                  <span className="text-blue-600 font-bold">
                    {progressCalculations ? `${progressCalculations.muscleChange.toFixed(1)}kg` : '0kg'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <PieChart className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-800">{t('Body Fat Reduction')}</span>
                  </div>
                  <span className="text-orange-600 font-bold">
                    {progressCalculations ? `${Math.abs(progressCalculations.bodyFatChange).toFixed(1)}%` : '0%'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Ruler className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-800">{t('Waist Reduction')}</span>
                  </div>
                  <span className="text-purple-600 font-bold">
                    {progressCalculations ? `${Math.abs(progressCalculations.waistChange).toFixed(1)}cm` : '0cm'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className={`border-0 ${classes.cardBg}`}>
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Award className="w-5 h-5" />
                {t('Recent Achievements')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progressCalculations?.weightChange && progressCalculations.weightChange < -1 && (
                  <Badge variant="outline" className="w-full justify-start bg-green-50 text-green-700 border-green-200 p-3">
                    🎯 Lost over 1kg this week!
                  </Badge>
                )}
                
                {progressCalculations?.muscleChange && progressCalculations.muscleChange > 0.3 && (
                  <Badge variant="outline" className="w-full justify-start bg-blue-50 text-blue-700 border-blue-200 p-3">
                    💪 Gained muscle mass!
                  </Badge>
                )}
                
                {progressCalculations?.bodyFatChange && progressCalculations.bodyFatChange < -0.5 && (
                  <Badge variant="outline" className="w-full justify-start bg-orange-50 text-orange-700 border-orange-200 p-3">
                    🔥 Reduced body fat percentage!
                  </Badge>
                )}
                
                {progressCalculations?.waistChange && progressCalculations.waistChange < -1 && (
                  <Badge variant="outline" className="w-full justify-start bg-purple-50 text-purple-700 border-purple-200 p-3">
                    📏 Waist measurement improved!
                  </Badge>
                )}

                {(!progressCalculations || (
                  Math.abs(progressCalculations.weightChange) < 1 &&
                  progressCalculations.muscleChange < 0.3 &&
                  Math.abs(progressCalculations.bodyFatChange) < 0.5 &&
                  Math.abs(progressCalculations.waistChange) < 1
                )) && (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">{t('Keep tracking to unlock achievements!')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'weight' && (
        <Card className={`border-0 ${classes.cardBg}`}>
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Scale className="w-5 h-5" />
              {t('Weight Progress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <LineChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">{t('Weight Chart Coming Soon')}</p>
              <p className="text-sm">{t('Visualize your weight loss journey')}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'measurements' && (
        <Card className={`border-0 ${classes.cardBg}`}>
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              {t('Body Measurements')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Ruler className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">{t('Measurements Tracking Coming Soon')}</p>
              <p className="text-sm">{t('Track chest, waist, hips, and more')}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'photos' && (
        <Card className={`border-0 ${classes.cardBg}`}>
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              {t('Progress Photos')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">{t('Photo Gallery Coming Soon')}</p>
              <p className="text-sm">{t('Visual progress tracking with before/after photos')}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </FeatureLayout>
  );
};

export default ModernProgressTracker; 