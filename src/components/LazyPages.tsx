
import { lazy, Suspense } from 'react';
import { Card } from '@/components/ui/card';

// Loading component for lazy pages
const PageSkeleton = () => (
  <div className="p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="h-8 bg-gray-200 rounded animate-pulse" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Lazy load heavy pages
export const LazyMealPlan = lazy(() => import('@/pages/MealPlan'));
export const LazyExercise = lazy(() => import('@/pages/Exercise'));
export const LazyAdmin = lazy(() => import('@/pages/Admin'));
export const LazyProgress = lazy(() => import('@/pages/Progress'));
export const LazyProfile = lazy(() => import('@/pages/Profile'));
export const LazyCalorieChecker = lazy(() => import('@/pages/CalorieChecker'));
export const LazyAIChatPage = lazy(() => import('@/pages/AIChatPage'));

// HOC for wrapping lazy components with suspense
export const withSuspense = (Component: React.ComponentType) => {
  return (props: any) => (
    <Suspense fallback={<PageSkeleton />}>
      <Component {...props} />
    </Suspense>
  );
};
