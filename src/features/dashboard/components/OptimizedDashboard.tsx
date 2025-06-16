
import React, { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import ErrorBoundary from '@/components/ui/error-boundary';
import EnhancedSpinner from '@/components/ui/enhanced-spinner';
import { CardSkeleton } from '@/components/ui/skeleton-loader';

// Lazy load heavy components
const DashboardHeader = React.lazy(() => import('./DashboardHeader'));
const QuickActionsGrid = React.lazy(() => import('./QuickActionsGrid'));
const RecentActivityCard = React.lazy(() => import('./RecentActivityCard'));
const StatsGrid = React.lazy(() => import('../../../components/dashboard/StatsGrid'));

const OptimizedDashboard = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EnhancedSpinner size="lg" text={t('common.loading')} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-fitness-primary-50 to-fitness-secondary-50">
        <div className="container mx-auto px-4 py-6 space-y-6">
          
          {/* Header Section */}
          <Suspense fallback={<CardSkeleton className="h-24" />}>
            <DashboardHeader />
          </Suspense>

          {/* Stats Grid */}
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} className="h-32" />
              ))}
            </div>
          }>
            <StatsGrid />
          </Suspense>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick Actions - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <Suspense fallback={<CardSkeleton className="h-96" />}>
                <QuickActionsGrid />
              </Suspense>
            </div>

            {/* Recent Activity - Takes 1 column */}
            <div className="lg:col-span-1">
              <Suspense fallback={<CardSkeleton className="h-96" />}>
                <RecentActivityCard />
              </Suspense>
            </div>
          </div>

        </div>
      </div>
    </ErrorBoundary>
  );
};

export default OptimizedDashboard;
