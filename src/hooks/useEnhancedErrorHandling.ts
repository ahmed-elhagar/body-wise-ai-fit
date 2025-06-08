
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/hooks/useI18n';

interface ErrorContext {
  operation: string;
  userId?: string;
  weekOffset?: number;
  retryable: boolean;
}

export const useEnhancedErrorHandling = () => {
  const { language } = useI18n();

  const handleError = useCallback((error: any, context: ErrorContext) => {
    console.error(`🚨 Enhanced Error Handler [${context.operation}]:`, {
      error: error.message || error,
      context,
      timestamp: new Date().toISOString()
    });

    const userMessage = getUserFriendlyMessage(error, context, language);
    
    if (context.retryable) {
      toast.error(userMessage, {
        duration: 5000,
        action: {
          label: language === 'ar' ? 'إعادة المحاولة' : 'Retry',
          onClick: () => {
            console.log('🔄 User requested retry for:', context.operation);
          }
        }
      });
    } else {
      toast.error(userMessage, { duration: 5000 });
    }
  }, [language]);

  const handleAPITimeout = useCallback(async <T>(
    operation: () => Promise<T>,
    timeoutMs: number = 15000,
    retries: number = 1
  ): Promise<T> => {
    const executeWithTimeout = async (attempt: number): Promise<T> => {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
      });

      try {
        return await Promise.race([operation(), timeoutPromise]);
      } catch (error: any) {
        if (attempt < retries && error.message === 'Request timeout') {
          console.log(`⏱️ Timeout on attempt ${attempt + 1}, retrying...`);
          return executeWithTimeout(attempt + 1);
        }
        throw error;
      }
    };

    return executeWithTimeout(0);
  }, []);

  return {
    handleError,
    handleAPITimeout
  };
};

const getUserFriendlyMessage = (error: any, context: ErrorContext, language: string): string => {
  const message = error.message || error.toString();
  const isArabic = language === 'ar';
  
  if (message.includes('timeout') || message.includes('TIMEOUT')) {
    return isArabic 
      ? `${context.operation} يستغرق وقتاً أطول من المتوقع. يرجى المحاولة مرة أخرى.`
      : `${context.operation} is taking longer than expected. Please try again.`;
  }
  
  if (message.includes('429') || message.includes('rate limit')) {
    return isArabic
      ? 'طلبات كثيرة جداً. يرجى الانتظار لحظة قبل المحاولة مرة أخرى.'
      : 'Too many requests. Please wait a moment before trying again.';
  }
  
  if (message.includes('401') || message.includes('unauthorized')) {
    return isArabic
      ? 'فشل في المصادقة. يرجى تسجيل الدخول مرة أخرى.'
      : 'Authentication failed. Please sign in again.';
  }
  
  if (message.includes('network') || message.includes('fetch')) {
    return isArabic
      ? 'فشل الاتصال بالشبكة. يرجى التحقق من الإنترنت.'
      : 'Network connection failed. Please check your internet.';
  }
  
  return isArabic
    ? `حدث خطأ غير متوقع أثناء ${context.operation}.`
    : `An unexpected error occurred during ${context.operation}.`;
};
