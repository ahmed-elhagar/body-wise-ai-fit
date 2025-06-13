
import { lazy, ComponentType } from 'react';
import { performanceUtils } from './performanceUtils';

// Enhanced lazy loading with preloading capabilities
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string
) => {
  const LazyComponent = lazy(() => {
    return performanceUtils.measurePerformance(`lazy-load-${componentName}`, () => {
      return importFn();
    });
  });

  // Add preload method
  (LazyComponent as any).preload = importFn;
  
  return LazyComponent;
};

// Preload critical components
export const preloadCriticalComponents = () => {
  const criticalComponents = [
    () => import('@/pages/Dashboard'),
    () => import('@/features/meal-plan/components/MealPlanContainer'),
    () => import('@/features/exercise/components/OptimizedExerciseContainer')
  ];

  // Preload when browser is idle
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      criticalComponents.forEach(componentLoader => {
        componentLoader().catch(() => {
          // Silently fail preloading
        });
      });
    });
  }
};

// Component-specific lazy loaders with better chunking
export const LazyComponents = {
  // Auth components
  Auth: createLazyComponent(
    () => import('@/pages/Auth'),
    'auth'
  ),
  
  // Dashboard components  
  Dashboard: createLazyComponent(
    () => import('@/pages/Dashboard'),
    'dashboard'
  ),
  
  // Feature components with better chunking
  MealPlan: createLazyComponent(
    () => import('@/pages/MealPlan'),
    'meal-plan'
  ),
  
  Exercise: createLazyComponent(
    () => import('@/pages/Exercise'),
    'exercise'
  ),
  
  // Admin components (separate chunk)
  Admin: createLazyComponent(
    () => import('@/pages/Admin'),
    'admin'
  ),
  
  // Profile components
  Profile: createLazyComponent(
    () => import('@/pages/Profile'),
    'profile'
  )
};
