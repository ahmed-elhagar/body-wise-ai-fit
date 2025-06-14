
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useGlobalErrorHandler } from './useGlobalErrorHandler';

interface AIErrorContext {
  operation: string;
  model?: string;
  credits?: number;
  retryCount?: number;
}

export const useAIErrorHandler = () => {
  const { logError } = useGlobalErrorHandler();

  const handleAIError = useCallback((
    error: Error, 
    context: AIErrorContext,
    showUserMessage = true
  ) => {
    // Log the error with AI-specific context
    logError(error, `AI Operation: ${context.operation}`, 'AI');

    // Enhanced logging for AI operations
    console.error('AI Operation Error:', {
      error: error.message,
      operation: context.operation,
      model: context.model,
      credits: context.credits,
      retryCount: context.retryCount,
      timestamp: new Date().toISOString(),
    });

    if (showUserMessage) {
      // Provide user-friendly error messages based on error type
      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        toast.error('AI service is temporarily busy. Please try again in a moment.');
      } else if (error.message.includes('credit') || error.message.includes('balance')) {
        toast.error('Insufficient credits for this AI operation.');
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(`AI ${context.operation} failed. Please try again.`);
      }
    }
  }, [logError]);

  const wrapAIOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    context: AIErrorContext
  ): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      handleAIError(err, context);
      throw err;
    }
  }, [handleAIError]);

  return {
    handleAIError,
    wrapAIOperation,
  };
};
