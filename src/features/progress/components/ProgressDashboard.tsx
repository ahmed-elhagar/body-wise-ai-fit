import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Target, 
  Activity, 
  Scale, 
  Award,
  BarChart3,
  Plus,
  Settings
} from "lucide-react";

// Design System Components
import { 
  FeatureLayout, 
  GradientStatsCard, 
  StatsGrid,
  ActionButton
} from '@/shared/components/design-system';
import { useTheme } from '@/shared/hooks';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Feature Components
import { useI18n } from '@/shared/hooks/useI18n';
import { ProgressOverview } from "./ProgressOverview";
import { WeightProgressSection } from "./WeightProgressSection";
import { FitnessProgressSection } from "./FitnessProgressSection";
import NutritionProgressSection from "./NutritionProgressSection";
import { GoalsProgressSection } from "./GoalsProgressSection";
import { AchievementsSection } from "./AchievementsSection";

const ProgressDashboard = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { classes } = useTheme();
  const [activeTab, setActiveTab] = useState('fitness');

  // Mock progress data - replace with real API calls
  const progressStats = {
    totalWorkouts: 24,
    currentWeight: 72.5,
    weightLoss: 2.5,
    muscleGain: 1.2,
    caloriesBurned: 8450,
    avgHeartRate: 145
  };

  // Tab configuration
  const tabs = [
    { id: 'fitness', label: t('Fitness'), icon: Activity },
    { id: 'weight', label: t('Weight'), icon: Scale },
    { id: 'nutrition', label: t('Nutrition'), icon: Target },
    { id: 'goals', label: t('Goals'), icon: TrendingUp },
    { id: 'achievements', label: t('Achievements'), icon: Award },
  ];

  // Header actions
  const headerActions = (
    <div className="flex gap-3">
      <ActionButton
        variant="outline"
        size="sm"
        icon={Settings}
        onClick={() => navigate('/goals')}
      >
        {t('Manage Goals')}
      </ActionButton>
      
      <ActionButton
        variant="primary"
        size="sm"
        icon={Plus}
        onClick={() => navigate('/achievements')}
      >
        {t('Log Progress')}
      </ActionButton>
    </div>
  );

  // Stats cards
  const statsCards = (
    <StatsGrid
      cards={[
        <GradientStatsCard
          key="workouts"
          title={t('Total Workouts')}
          value={progressStats.totalWorkouts}
          icon={Activity}
          trend={{ direction: 'up', value: 15, label: '+15% from last month' }}
          gradient="blue"
        />,
        
        <GradientStatsCard
          key="weight"
          title={t('Current Weight')}
          value={`${progressStats.currentWeight}kg`}
          icon={Scale}
          trend={{ direction: 'up', value: 3.4, label: 'Great progress!' }}
          gradient="green"
        />,
        
        <GradientStatsCard
          key="calories"
          title={t('Calories Burned')}
          value={progressStats.caloriesBurned.toLocaleString()}
          icon={Target}
          trend={{ direction: 'up', value: 12, label: '+12% increase' }}
          gradient="orange"
        />,
        
        <GradientStatsCard
          key="muscle"
          title={t('Muscle Gain')}
          value={`+${progressStats.muscleGain}kg`}
          icon={TrendingUp}
          trend={{ direction: 'up', value: 8, label: 'Excellent gains!' }}
          gradient="purple"
        />
      ]}
    />
  );

  return (
    <FeatureLayout
      title={t('Progress Dashboard')}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerActions={headerActions}
      isLoading={false}
      showStatsCards={true}
      statsCards={statsCards}
    >
      {/* Progress Overview */}
      <ProgressOverview />

      {/* Tab Content */}
      {activeTab === 'fitness' && (
        <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg`}>
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {t('Fitness Progress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FitnessProgressSection />
          </CardContent>
        </Card>
      )}

      {activeTab === 'weight' && (
        <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg`}>
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Scale className="w-5 h-5" />
              {t('Weight Progress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeightProgressSection />
          </CardContent>
        </Card>
      )}

      {activeTab === 'nutrition' && (
        <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg`}>
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5" />
              {t('Nutrition Progress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NutritionProgressSection />
          </CardContent>
        </Card>
      )}

      {activeTab === 'goals' && (
        <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg`}>
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t('Goals Progress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GoalsProgressSection />
          </CardContent>
        </Card>
      )}

      {activeTab === 'achievements' && (
        <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg`}>
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Award className="w-5 h-5" />
              {t('Achievements')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AchievementsSection />
          </CardContent>
        </Card>
      )}
    </FeatureLayout>
  );
};

export default ProgressDashboard;
