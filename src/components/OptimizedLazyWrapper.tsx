
import { Suspense, memo } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import SimpleLoadingIndicator from '@/components/ui/simple-loading-indicator';

interface OptimizedLazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  loadingMessage?: string;
  loadingDescription?: string;
}

const DefaultFallback = memo(({ message, description }: { message?: string; description?: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <SimpleLoadingIndicator
      message={message || "Loading"}
      description={description || "Please wait..."}
      size="lg"
    />
  </div>
));

const DefaultErrorFallback = memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600">
        Please refresh the page to try again
      </p>
    </div>
  </div>
));

export const OptimizedLazyWrapper = memo<OptimizedLazyWrapperProps>(({
  children,
  fallback,
  errorFallback,
  loadingMessage,
  loadingDescription
}) => {
  return (
    <ErrorBoundary fallback={errorFallback || <DefaultErrorFallback />}>
      <Suspense 
        fallback={
          fallback || 
          <DefaultFallback 
            message={loadingMessage} 
            description={loadingDescription} 
          />
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
});

OptimizedLazyWrapper.displayName = 'OptimizedLazyWrapper';
