
import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorLogData {
  error: Error;
  context?: string;
  userId?: string;
  feature?: string;
  timestamp: string;
  userAgent: string;
  url: string;
}

export const useGlobalErrorHandler = () => {
  const logError = useCallback((error: Error, context?: string, feature?: string) => {
    const errorData: ErrorLogData = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } as Error,
      context,
      feature,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global Error:', errorData);
    }

    // In production, you would send this to your error tracking service
    // Example: Sentry, LogRocket, etc.
    console.error('Error logged:', errorData);
  }, []);

  const handleError = useCallback((error: Error, showToast = true, context?: string) => {
    logError(error, context);
    
    if (showToast) {
      toast.error('Something went wrong. Please try again.');
    }
  }, [logError]);

  const handleAsyncError = useCallback(async (
    asyncFn: () => Promise<any>,
    context?: string,
    onError?: (error: Error) => void
  ) => {
    try {
      return await asyncFn();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      handleError(err, true, context);
      onError?.(err);
      throw err;
    }
  }, [handleError]);

  return {
    logError,
    handleError,
    handleAsyncError,
  };
};
