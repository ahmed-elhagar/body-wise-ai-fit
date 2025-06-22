/**
 * Feature Layout Management Hook
 * 
 * Provides common layout state management for features using the FeatureLayout component
 */

import { useState, useCallback, useEffect } from 'react';
import type { TabItem } from '../components/design-system/FeatureLayout';

export interface UseFeatureLayoutOptions {
  initialTab?: string;
  tabs: TabItem[];
  persistTab?: boolean;
  storageKey?: string;
}

export const useFeatureLayout = ({
  initialTab,
  tabs,
  persistTab = false,
  storageKey,
}: UseFeatureLayoutOptions) => {
  // Get initial tab from storage or fallback to provided initial tab
  const getInitialTab = useCallback(() => {
    if (persistTab && storageKey && typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved && tabs.some(tab => tab.id === saved)) {
        return saved;
      }
    }
    return initialTab || tabs[0]?.id || '';
  }, [initialTab, tabs, persistTab, storageKey]);

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Handle tab change with persistence
  const handleTabChange = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab || tab.disabled) return;

    setActiveTab(tabId);

    // Persist tab selection if enabled
    if (persistTab && storageKey && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, tabId);
    }
  }, [tabs, persistTab, storageKey]);

  // Set loading state for the entire feature
  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  // Set loading state for specific tab
  const setTabLoading = useCallback((tabId: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [tabId]: loading
    }));
  }, []);

  // Check if specific tab is loading
  const isTabLoading = useCallback((tabId: string) => {
    return loadingStates[tabId] || false;
  }, [loadingStates]);

  // Get active tab object
  const activeTabObject = tabs.find(tab => tab.id === activeTab);

  // Get next/previous tab for navigation
  const getNextTab = useCallback(() => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    return tabs[nextIndex];
  }, [tabs, activeTab]);

  const getPreviousTab = useCallback(() => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    return tabs[prevIndex];
  }, [tabs, activeTab]);

  // Navigate to next/previous tab
  const goToNextTab = useCallback(() => {
    const nextTab = getNextTab();
    if (nextTab && !nextTab.disabled) {
      handleTabChange(nextTab.id);
    }
  }, [getNextTab, handleTabChange]);

  const goToPreviousTab = useCallback(() => {
    const prevTab = getPreviousTab();
    if (prevTab && !prevTab.disabled) {
      handleTabChange(prevTab.id);
    }
  }, [getPreviousTab, handleTabChange]);

  // Update tab badge
  const updateTabBadge = useCallback((tabId: string, badge: string | number | undefined) => {
    // This would typically update the tab configuration
    // Implementation depends on how tabs are managed in the parent component
  }, []);

  // Disable/enable tab
  const setTabDisabled = useCallback((tabId: string, disabled: boolean) => {
    // This would typically update the tab configuration
    // Implementation depends on how tabs are managed in the parent component
  }, []);

  return {
    // Current state
    activeTab,
    activeTabObject,
    isLoading,
    loadingStates,

    // Tab management
    setActiveTab,
    handleTabChange,
    
    // Loading management
    setLoading,
    setTabLoading,
    isTabLoading,
    
    // Navigation
    goToNextTab,
    goToPreviousTab,
    getNextTab,
    getPreviousTab,
    
    // Utilities
    updateTabBadge,
    setTabDisabled,
    
    // Computed values
    canGoNext: !!getNextTab() && !getNextTab()?.disabled,
    canGoPrevious: !!getPreviousTab() && !getPreviousTab()?.disabled,
    currentTabIndex: tabs.findIndex(tab => tab.id === activeTab),
    totalTabs: tabs.length,
  };
};

// Specialized hook for week-based navigation (meal plans, exercise programs)
export interface UseWeekNavigationOptions {
  initialWeek?: number;
  totalWeeks: number;
  persistWeek?: boolean;
  storageKey?: string;
}

export const useWeekNavigation = ({
  initialWeek = 1,
  totalWeeks,
  persistWeek = false,
  storageKey,
}: UseWeekNavigationOptions) => {
  // Get initial week from storage or fallback
  const getInitialWeek = useCallback(() => {
    if (persistWeek && storageKey && typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const week = parseInt(saved, 10);
        if (week >= 1 && week <= totalWeeks) {
          return week;
        }
      }
    }
    return Math.max(1, Math.min(initialWeek, totalWeeks));
  }, [initialWeek, totalWeeks, persistWeek, storageKey]);

  const [currentWeek, setCurrentWeek] = useState<number>(getInitialWeek);

  // Handle week change with persistence and validation
  const handleWeekChange = useCallback((week: number) => {
    const validWeek = Math.max(1, Math.min(week, totalWeeks));
    setCurrentWeek(validWeek);

    // Persist week selection if enabled
    if (persistWeek && storageKey && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, validWeek.toString());
    }
  }, [totalWeeks, persistWeek, storageKey]);

  // Navigation helpers
  const goToNextWeek = useCallback(() => {
    handleWeekChange(currentWeek + 1);
  }, [currentWeek, handleWeekChange]);

  const goToPreviousWeek = useCallback(() => {
    handleWeekChange(currentWeek - 1);
  }, [currentWeek, handleWeekChange]);

  const goToFirstWeek = useCallback(() => {
    handleWeekChange(1);
  }, [handleWeekChange]);

  const goToLastWeek = useCallback(() => {
    handleWeekChange(totalWeeks);
  }, [totalWeeks, handleWeekChange]);

  return {
    // Current state
    currentWeek,
    totalWeeks,
    
    // Week management
    setCurrentWeek,
    handleWeekChange,
    
    // Navigation
    goToNextWeek,
    goToPreviousWeek,
    goToFirstWeek,
    goToLastWeek,
    
    // Computed values
    canGoNext: currentWeek < totalWeeks,
    canGoPrevious: currentWeek > 1,
    isFirstWeek: currentWeek === 1,
    isLastWeek: currentWeek === totalWeeks,
    progress: (currentWeek / totalWeeks) * 100,
  };
};
