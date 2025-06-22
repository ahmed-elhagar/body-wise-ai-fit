
import React, { useState, useMemo } from 'react';
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
    todayConsumption,
    todayMealPlan,
    isLoading,
    forceRefresh
  } = useFoodConsumption();

  // Calculate nutrition totals from today's consumption
  const consumedTotals = useMemo(() => {
    if (!todayConsumption) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    return todayConsumption.reduce((totals, item) => ({
      calories: totals.calories + (item.calories_consumed || 0),
      protein: totals.protein + (item.protein_consumed || 0),
      carbs: totals.carbs + (item.carbs_consumed || 0),
      fat: totals.fat + (item.fat_consumed || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [todayConsumption]);

  // Calculate target calories (simplified calculation)
  const targetCalories = 2000; // Default target
  const targetProtein = 150; // Default protein target

  // Calculate progress percentages
  const calorieProgress = targetCalories > 0 ? Math.min((consumedTotals.calories / targetCalories) * 100, 100) : 0;
  const proteinProgress = targetProtein > 0 ? Math.min((consumedTotals.protein / targetProtein) * 100, 100) : 0;

  // Tab configuration following design system
  const tabs = [
    {
      id: 'today',
      label: t('today'),
      icon: Utensils,
    },
    {
      id: 'search',
      label: t('search'),
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
          value: `${todayConsumption?.length || 0}/4`,
          color: 'purple' as const,
          change: {
            value: Math.round(((todayConsumption?.length || 0) / 4) * 100),
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
        {t('add_food')}
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

  // Render tab content with proper props
  const renderTabContent = () => {
    switch (activeTab) {
      case 'today':
        return (
          <TodayTab 
            key={refreshKey} 
            onAddFood={onAddFood || (() => {})}
          />
        );
      case 'search':
        return (
          <SearchTab 
            onFoodAdded={() => forceRefresh()}
            onClose={() => setActiveTab('today')}
          />
        );
      case 'history':
        return <HistoryTab />;
      default:
        return (
          <TodayTab 
            key={refreshKey} 
            onAddFood={onAddFood || (() => {})}
          />
        );
    }
  };

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
