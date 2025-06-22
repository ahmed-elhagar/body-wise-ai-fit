
import React, { useState } from 'react';
import { Plus, Search, Camera, History, BarChart3, Utensils } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FeatureLayout } from '@/shared/components/design-system';
import { GradientStatsCard } from '@/shared/components/design-system';
import { ActionButton } from '@/shared/components/design-system';
import { UniversalLoadingState } from '@/shared/components/design-system';
import { useFoodConsumption } from '../hooks';
import TodayTab from './TodayTab';
import SearchTab from './SearchTab';
import HistoryTab from './HistoryTab';

interface FoodTrackerProps {
  refreshKey?: number;
  onAddFood?: () => void;
}

const FoodTracker: React.FC<FoodTrackerProps> = ({ 
  refreshKey = 0, 
  onAddFood 
}) => {
  const { t } = useTranslation(['foodTracker', 'common']);
  const [activeTab, setActiveTab] = useState('today');
  
  const { 
    consumedTotals, 
    targetCalories, 
    isLoading,
    error 
  } = useFoodConsumption();

  // Calculate progress percentages
  const calorieProgress = targetCalories > 0 ? (consumedTotals.calories / targetCalories) * 100 : 0;
  const proteinProgress = 150 > 0 ? (consumedTotals.protein / 150) * 100 : 0; // Assuming 150g protein target

  // Tab configuration following design system
  const tabs = [
    {
      id: 'today',
      label: t('today'),
      icon: Utensils,
    },
    {
      id: 'search',
      label: t('Search'),
      icon: Search,
    },
    {
      id: 'history',
      label: t('history'),
      icon: History,
    },
  ];

  // Stats cards following design system gradient patterns
  const statsCards = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <GradientStatsCard
        title={t('calories')}
        stats={[{
          label: t('consumed'),
          value: Math.round(consumedTotals.calories).toLocaleString(),
          color: 'orange' as const,
          change: {
            value: Math.round(calorieProgress),
            isPositive: calorieProgress <= 100
          }
        }]}
      />
      
      <GradientStatsCard
        title={t('protein')}
        stats={[{
          label: t('consumed'),
          value: `${Math.round(consumedTotals.protein)}g`,
          color: 'green' as const,
          change: {
            value: Math.round(proteinProgress),
            isPositive: proteinProgress >= 80
          }
        }]}
      />
      
      <GradientStatsCard
        title={t('water')}
        stats={[{
          label: t('daily_progress'),
          value: '6/8',
          color: 'blue' as const,
          change: {
            value: 75,
            isPositive: true
          }
        }]}
      />
      
      <GradientStatsCard
        title={t('meals')}
        stats={[{
          label: t('today'),
          value: '3/4',
          color: 'purple' as const,
          change: {
            value: 75,
            isPositive: true
          }
        }]}
      />
    </div>
  );

  // Header actions following design system
  const headerActions = (
    <div className="flex items-center gap-2">
      <ActionButton
        variant="primary"
        size="md"
        icon={Plus}
        onClick={onAddFood}
        disabled={isLoading}
      >
        {t('Add Food')}
      </ActionButton>
      
      <ActionButton
        variant="outline"
        size="md"
        icon={Camera}
        onClick={() => {/* Handle photo analysis */}}
        disabled={isLoading}
      >
        {t('analyze_photo')}
      </ActionButton>
    </div>
  );

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'today':
        return <TodayTab key={refreshKey} />;
      case 'search':
        return <SearchTab />;
      case 'history':
        return <HistoryTab />;
      default:
        return <TodayTab key={refreshKey} />;
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            {t('common:errors.loadingError')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <FeatureLayout
      title={t('food_tracker')}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerActions={headerActions}
      isLoading={isLoading}
      loadingIcon={Utensils}
      loadingMessage={t('common:loading.foodTracker')}
      showStatsCards={true}
      statsCards={statsCards}
    >
      {renderTabContent()}
    </FeatureLayout>
  );
};

export default FoodTracker;
