
import { useCallback } from 'react';
import { useLanguage } from './useLanguage';
import { useToast } from './use-toast';
import { createErrorMessage, logError, ErrorContext, EnhancedError } from '@/utils/errorMessages';

export const useEnhancedErrorHandling = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleError = useCallback((
    error: any,
    context: ErrorContext = {},
    showToast: boolean = true
  ) => {
    // Log the error
    logError(error, context);

    // Create user-friendly message
    const { message, retryable } = createErrorMessage(error, t, context);

    // Show toast notification if requested
    if (showToast) {
      toast({
        title: t('common.error'),
        description: message,
        variant: 'destructive',
      });
    }

    return { message, retryable };
  }, [t, toast]);

  const handleAPITimeout = useCallback(async <T>(
    apiCall: () => Promise<T>,
    timeoutMs: number = 10000,
    retries: number = 1
  ): Promise<T> => {
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new EnhancedError(
              'Request timeout',
              'TIMEOUT',
              t('errors.requestTimeout'),
              {},
              true
            ));
          }, timeoutMs);
        });

        return await Promise.race([apiCall(), timeoutPromise]);
      } catch (error) {
        lastError = error;
        
        if (attempt < retries && error instanceof EnhancedError && error.retryable) {
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }
        
        throw error;
      }
    }

    throw lastError;
  }, [t]);

  const createRetryHandler = useCallback((
    operation: () => Promise<any>,
    context: ErrorContext = {}
  ) => {
    return async () => {
      try {
        return await operation();
      } catch (error) {
        handleError(error, { ...context, retryable: true });
        throw error;
      }
    };
  }, [handleError]);

  return {
    handleError,
    handleAPITimeout,
    createRetryHandler
  };
};
