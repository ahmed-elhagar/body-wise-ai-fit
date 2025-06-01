
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ErrorContext {
  operation: string;
  userId?: string;
  weekOffset?: number;
  retryable?: boolean;
}

export const useEnhancedErrorHandling = () => {
  const { language } = useLanguage();

  const handleError = useCallback((error: any, context: ErrorContext) => {
    console.error(`❌ Error in ${context.operation}:`, {
      error: error.message || error,
      context,
      timestamp: new Date().toISOString()
    });

    // Categorize error types
    const errorType = categorizeError(error);
    const userMessage = getUserFriendlyMessage(errorType, context.operation, language);

    // Show appropriate toast
    if (context.retryable) {
      toast.error(userMessage, {
        action: {
          label: language === 'ar' ? 'إعادة المحاولة' : 'Retry',
          onClick: () => {
            // Retry logic would be handled by the calling component
            toast.info(language === 'ar' ? 'جاري إعادة المحاولة...' : 'Retrying...');
          }
        }
      });
    } else {
      toast.error(userMessage);
    }

    return errorType;
  }, [language]);

  const handleAPITimeout = useCallback(async (
    apiCall: () => Promise<any>,
    timeoutMs: number = 30000,
    retries: number = 2
  ) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API_TIMEOUT')), timeoutMs)
        );

        const result = await Promise.race([apiCall(), timeoutPromise]);
        return result;
      } catch (error: any) {
        if (error.message === 'API_TIMEOUT' && attempt < retries) {
          console.warn(`⏰ API timeout on attempt ${attempt + 1}, retrying...`);
          continue;
        }
        throw error;
      }
    }
  }, []);

  return {
    handleError,
    handleAPITimeout
  };
};

const categorizeError = (error: any): string => {
  const message = error.message || error.toString();
  
  if (message.includes('API_TIMEOUT') || message.includes('timeout')) {
    return 'TIMEOUT';
  }
  if (message.includes('429') || message.includes('rate limit')) {
    return 'RATE_LIMIT';
  }
  if (message.includes('401') || message.includes('unauthorized')) {
    return 'AUTH_ERROR';
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'NETWORK_ERROR';
  }
  if (message.includes('validation') || message.includes('invalid')) {
    return 'VALIDATION_ERROR';
  }
  if (message.includes('database') || message.includes('constraint')) {
    return 'DATABASE_ERROR';
  }
  
  return 'UNKNOWN_ERROR';
};

const getUserFriendlyMessage = (errorType: string, operation: string, language: string): string => {
  const isArabic = language === 'ar';
  
  const messages = {
    TIMEOUT: {
      en: `${operation} is taking longer than expected. Please try again.`,
      ar: `${operation} يستغرق وقتاً أطول من المتوقع. يرجى المحاولة مرة أخرى.`
    },
    RATE_LIMIT: {
      en: 'Too many requests. Please wait a moment before trying again.',
      ar: 'طلبات كثيرة جداً. يرجى الانتظار لحظة قبل المحاولة مرة أخرى.'
    },
    AUTH_ERROR: {
      en: 'Authentication failed. Please sign in again.',
      ar: 'فشل في المصادقة. يرجى تسجيل الدخول مرة أخرى.'
    },
    NETWORK_ERROR: {
      en: 'Network connection failed. Please check your internet.',
      ar: 'فشل الاتصال بالشبكة. يرجى التحقق من الإنترنت.'
    },
    VALIDATION_ERROR: {
      en: 'Invalid data provided. Please check your input.',
      ar: 'بيانات غير صحيحة. يرجى التحقق من المدخلات.'
    },
    DATABASE_ERROR: {
      en: 'Database error occurred. Please try again later.',
      ar: 'حدث خطأ في قاعدة البيانات. يرجى المحاولة لاحقاً.'
    },
    UNKNOWN_ERROR: {
      en: `An unexpected error occurred during ${operation}.`,
      ar: `حدث خطأ غير متوقع أثناء ${operation}.`
    }
  };
  
  return messages[errorType as keyof typeof messages]?.[isArabic ? 'ar' : 'en'] || 
         messages.UNKNOWN_ERROR[isArabic ? 'ar' : 'en'];
};
