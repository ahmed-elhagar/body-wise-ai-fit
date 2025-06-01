
import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorContext {
  operation: string;
  userId?: string;
  retryable?: boolean;
  [key: string]: any;
}

export const useEnhancedErrorHandling = () => {
  const handleError = useCallback((error: any, context: ErrorContext) => {
    console.error(`❌ Error in ${context.operation}:`, error, context);
    
    // Determine error type and show appropriate message
    let errorMessage = 'An unexpected error occurred';
    
    if (error?.message?.includes('JWT') || error?.message?.includes('auth')) {
      errorMessage = 'Authentication error. Please sign in again.';
    } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      errorMessage = 'Network error. Please check your connection.';
    } else if (error?.message?.includes('timeout')) {
      errorMessage = 'Request timed out. Please try again.';
    } else if (error?.message) {
      errorMessage = error.message;
    }

    toast.error(errorMessage);
    
    return {
      error,
      context,
      errorMessage,
      retryable: context.retryable ?? true
    };
  }, []);

  const handleAPITimeout = useCallback(async <T>(
    operation: () => Promise<T>,
    timeoutMs: number = 10000,
    retries: number = 1
  ): Promise<T> => {
    let lastError: any;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
        });
        
        const result = await Promise.race([operation(), timeoutPromise]) as T;
        return result;
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          console.log(`⏳ Retrying operation (attempt ${attempt + 2}/${retries + 1})...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
    
    throw lastError;
  }, []);

  return {
    handleError,
    handleAPITimeout
  };
};
