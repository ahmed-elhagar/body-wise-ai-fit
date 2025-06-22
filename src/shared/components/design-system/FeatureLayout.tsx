/**
 * Universal Feature Layout Component
 * 
 * Standardized layout pattern used across all features for consistency.
 * Based on the successful Meal Plan and Exercise implementations.
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/shared/hooks/useTheme';
import { TabButton } from './TabButton';
import { FeatureHeader } from './FeatureHeader';
import { UniversalLoadingState } from './UniversalLoadingState';

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  badge?: string | number;
}

export interface FeatureLayoutProps {
  title: string;
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  headerActions?: React.ReactNode;
  isLoading?: boolean;
  loadingIcon?: React.ComponentType<{ className?: string }>;
  loadingMessage?: string;
  children: React.ReactNode;
  className?: string;
  showStatsCards?: boolean;
  statsCards?: React.ReactNode;
}

export const FeatureLayout: React.FC<FeatureLayoutProps> = ({
  title,
  tabs,
  activeTab,
  onTabChange,
  headerActions,
  isLoading = false,
  loadingIcon,
  loadingMessage,
  children,
  className = '',
  showStatsCards = false,
  statsCards,
}) => {
  const { classes } = useTheme();

  if (isLoading && loadingIcon) {
    return (
      <div className={`p-6 ${className}`}>
        <UniversalLoadingState
          icon={loadingIcon}
          message={loadingMessage || `Loading ${title.toLowerCase()}...`}
        />
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Universal Tab Navigation */}
      {tabs.length > 1 && (
        <Card className={`p-4 mb-6 ${classes.primaryBg} border-brand-neutral-200 shadow-brand`}>
          <div className="flex items-center space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
                disabled={isLoading}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Universal Header */}
      <FeatureHeader
        title={title}
        actions={headerActions}
        isLoading={isLoading}
      />

      {/* Stats Cards (if provided) */}
      {showStatsCards && statsCards && (
        <div className="mb-6">
          {statsCards}
        </div>
      )}

      {/* Content Area */}
      <div className="space-y-6">
        {isLoading ? (
          loadingIcon ? (
            <UniversalLoadingState
              icon={loadingIcon}
              message={loadingMessage || `Loading ${title.toLowerCase()}...`}
            />
          ) : (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-brand-neutral-200 rounded w-3/4"></div>
              <div className="h-4 bg-brand-neutral-200 rounded w-1/2"></div>
              <div className="h-32 bg-brand-neutral-200 rounded"></div>
            </div>
          )
        ) : (
          children
        )}
      </div>
    </div>
  );
};

// Layout hook for managing common layout state
export const useFeatureLayout = (initialTab: string) => {
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTabChange = React.useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const setLoading = React.useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    activeTab,
    setActiveTab,
    handleTabChange,
    isLoading,
    setLoading,
  };
};
