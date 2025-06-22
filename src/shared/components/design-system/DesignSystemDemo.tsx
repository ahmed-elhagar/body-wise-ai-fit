/**
 * Design System Demo Component
 * 
 * Showcases all the new design system components and theme switching.
 * Can be used for testing and demonstration purposes.
 */

import React from 'react';
import { 
  FeatureLayout,
  TabButton,
  TabGroup,
  UniversalLoadingState,
  GradientStatsCard,
  StatsGrid,
  ActionButton,
  GenerateButton,
  SaveButton,
  AddButton,
  ThemeSelector,
  useFeatureLayout
} from './index';
import { 
  Palette, 
  Sparkles, 
  Flame, 
  Scale, 
  Dumbbell, 
  Target,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export const DesignSystemDemo: React.FC = () => {
  const tabs = [
    { id: 'components', label: 'Components', icon: Sparkles },
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'layouts', label: 'Layouts', icon: BarChart3 },
  ];

  const {
    activeTab,
    handleTabChange,
    isLoading,
    setLoading
  } = useFeatureLayout({
    initialTab: 'components',
    tabs,
    persistTab: true,
    storageKey: 'design-system-demo-tab'
  });

  const statsCards = [
    <GradientStatsCard
      key="calories"
      title="Calories Burned"
      value={2150}
      icon={Flame}
      gradient="orange"
      trend={{ value: 12, direction: 'up', label: 'vs yesterday' }}
      suffix=" kcal"
    />,
    <GradientStatsCard
      key="weight"
      title="Current Weight"
      value={75.2}
      icon={Scale}
      gradient="blue"
      trend={{ value: -2.1, direction: 'down', label: 'this week' }}
      suffix=" kg"
    />,
    <GradientStatsCard
      key="workouts"
      title="Workouts"
      value={4}
      icon={Dumbbell}
      gradient="green"
      trend={{ value: 25, direction: 'up', label: 'this week' }}
      suffix="/5"
    />,
    <GradientStatsCard
      key="goals"
      title="Goals Achieved"
      value={12}
      icon={Target}
      gradient="purple"
      trend={{ value: 8, direction: 'up', label: 'this month' }}
      suffix="/15"
    />
  ];

  const headerActions = (
    <div className="flex items-center space-x-3">
      <ActionButton
        variant="outline"
        size="md"
        onClick={() => setLoading(!isLoading)}
      >
        Toggle Loading
      </ActionButton>
      <GenerateButton size="md">
        Generate Demo
      </GenerateButton>
    </div>
  );

  const renderComponentsTab = () => (
    <div className="space-y-8">
      {/* Stats Cards Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-brand-neutral-800">
          Gradient Stats Cards
        </h3>
        <StatsGrid cards={statsCards} columns={4} />
      </div>

      {/* Action Buttons Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-brand-neutral-800">
          Action Buttons
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GenerateButton>Generate</GenerateButton>
          <SaveButton>Save</SaveButton>
          <AddButton>Add Item</AddButton>
          <ActionButton variant="destructive">Delete</ActionButton>
        </div>
      </div>

      {/* Tab Components Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-brand-neutral-800">
          Tab Variants
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-brand-neutral-600 mb-2">Default Tabs</p>
            <TabGroup
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              variant="default"
            />
          </div>
          <div>
            <p className="text-sm text-brand-neutral-600 mb-2">Pills Tabs</p>
            <TabGroup
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              variant="pills"
            />
          </div>
          <div>
            <p className="text-sm text-brand-neutral-600 mb-2">Underline Tabs</p>
            <TabGroup
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              variant="underline"
            />
          </div>
        </div>
      </div>

      {/* Loading States Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-brand-neutral-800">
          Loading States
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UniversalLoadingState
            icon={Flame}
            message="Loading calories..."
            size="sm"
          />
          <UniversalLoadingState
            icon={TrendingUp}
            message="Analyzing progress..."
            subMessage="This may take a moment"
            size="md"
          />
        </div>
      </div>
    </div>
  );

  const renderThemesTab = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-brand-neutral-800">
          Theme Selector
        </h3>
        <ThemeSelector
          variant="grid"
          size="md"
          showPreview={true}
          showLabels={true}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 text-brand-neutral-800">
          Theme Preview with Stats
        </h3>
        <p className="text-brand-neutral-600 mb-4">
          Switch themes above to see how the stats cards adapt to different color schemes.
        </p>
        <StatsGrid cards={statsCards.slice(0, 2)} columns={2} />
      </div>
    </div>
  );

  const renderLayoutsTab = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-brand-neutral-800">
          Feature Layout Pattern
        </h3>
        <p className="text-brand-neutral-600 mb-4">
          This demo itself uses the FeatureLayout component. Here's the code:
        </p>
        <div className="bg-brand-neutral-50 p-4 rounded-lg border">
          <pre className="text-sm text-brand-neutral-700 overflow-x-auto">
{`<FeatureLayout
  title="Design System Demo"
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={handleTabChange}
  headerActions={headerActions}
  isLoading={isLoading}
  showStatsCards={true}
  statsCards={<StatsGrid cards={statsCards} />}
>
  <TabContent />
</FeatureLayout>`}
          </pre>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-brand-neutral-800">
          Layout Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">✅ Consistency</h4>
            <p className="text-green-700 text-sm">
              All features use the same layout pattern, creating a unified experience.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">⚡ Performance</h4>
            <p className="text-blue-700 text-sm">
              Optimized components with lazy loading and efficient re-renders.
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">🎨 Themeable</h4>
            <p className="text-purple-700 text-sm">
              Instant theme switching across all components and layouts.
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">📱 Responsive</h4>
            <p className="text-orange-700 text-sm">
              Mobile-first design that works perfectly on all device sizes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'themes':
        return renderThemesTab();
      case 'layouts':
        return renderLayoutsTab();
      default:
        return renderComponentsTab();
    }
  };

  return (
    <FeatureLayout
      title="Design System Demo"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      headerActions={headerActions}
      isLoading={isLoading}
      loadingIcon={Sparkles}
      loadingMessage="Loading design system demo..."
      showStatsCards={activeTab === 'components'}
      statsCards={<StatsGrid cards={statsCards} columns={4} />}
    >
      {renderTabContent()}
    </FeatureLayout>
  );
};

export default DesignSystemDemo;
