import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useI18n } from "@/hooks/useI18n";

export interface AdvancedErrorContext {
  operation: string;
  userId?: string;
  weekOffset?: number;
  retryable?: boolean;
  component?: string;
}

export const useAdvancedErrorHandling = () => {
  const { language } = useI18n();

  const handleAdvancedError = useCallback((error: any, context: AdvancedErrorContext) => {
    console.error(`❌ Advanced Error in ${context.operation}:`, {
      error: error.message || error,
      context,
      timestamp: new Date().toISOString(),
      component: context.component
    });

    // Enhanced error categorization
    const errorType = categorizeAdvancedError(error);
    const userMessage = getAdvancedUserMessage(errorType, context.operation, language);

    // Show contextual error handling
    if (context.retryable && errorType !== 'AUTH_ERROR') {
      toast.error(userMessage, {
        action: {
          label: language === 'ar' ? 'إعادة المحاولة' : 'Retry',
          onClick: () => {
            toast.info(language === 'ar' ? 'جاري إعادة المحاولة...' : 'Retrying...');
          }
        },
        duration: 6000
      });
    } else {
      toast.error(userMessage, { duration: 5000 });
    }

    return errorType;
  }, [language]);

  const handleAdvancedAPITimeout = useCallback(async (
    apiCall: () => Promise<any>,
    timeoutMs: number = 30000,
    retries: number = 2,
    context: string = 'API call'
  ) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API_TIMEOUT')), timeoutMs)
        );

        const result = await Promise.race([apiCall(), timeoutPromise]);
        
        if (attempt > 0) {
          console.log(`✅ ${context} succeeded on retry attempt ${attempt}`);
        }
        
        return result;
      } catch (error: any) {
        if (error.message === 'API_TIMEOUT' && attempt < retries) {
          console.warn(`⏰ ${context} timeout on attempt ${attempt + 1}, retrying...`);
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }
        throw error;
      }
    }
  }, []);

  return {
    handleAdvancedError,
    handleAdvancedAPITimeout
  };
};

const categorizeAdvancedError = (error: any): string => {
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
  if (message.includes('403') || message.includes('forbidden')) {
    return 'PERMISSION_ERROR';
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
  if (message.includes('generation limit') || message.includes('credit')) {
    return 'CREDIT_LIMIT_ERROR';
  }
  
  return 'UNKNOWN_ERROR';
};

const getAdvancedUserMessage = (errorType: string, operation: string, language: string): string => {
  const isArabic = language === 'ar';
  
  const messages = {
    TIMEOUT: {
      en: `${operation} is taking longer than expected. Please check your internet connection and try again.`,
      ar: `${operation} يستغرق وقتاً أطول من المتوقع. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.`
    },
    RATE_LIMIT: {
      en: 'Too many requests. Please wait a moment before trying again.',
      ar: 'طلبات كثيرة جداً. يرجى الانتظار لحظة قبل المحاولة مرة أخرى.'
    },
    AUTH_ERROR: {
      en: 'Authentication failed. Please sign in again.',
      ar: 'فشل في المصادقة. يرجى تسجيل الدخول مرة أخرى.'
    },
    PERMISSION_ERROR: {
      en: 'You don\'t have permission to perform this action.',
      ar: 'ليس لديك صلاحية لتنفيذ هذا الإجراء.'
    },
    NETWORK_ERROR: {
      en: 'Network connection failed. Please check your internet connection.',
      ar: 'فشل الاتصال بالشبكة. يرجى التحقق من الإنترنت.'
    },
    VALIDATION_ERROR: {
      en: 'Invalid data provided. Please check your input and try again.',
      ar: 'بيانات غير صحيحة. يرجى التحقق من المدخلات والمحاولة مرة أخرى.'
    },
    DATABASE_ERROR: {
      en: 'Database error occurred. Please try again later.',
      ar: 'حدث خطأ في قاعدة البيانات. يرجى المحاولة لاحقاً.'
    },
    CREDIT_LIMIT_ERROR: {
      en: 'AI generation limit reached. Please upgrade your plan or wait for credits to reset.',
      ar: 'تم الوصول لحد توليد الذكاء الاصطناعي. يرجى ترقية الخطة أو انتظار إعادة تعيين الرصيد.'
    },
    UNKNOWN_ERROR: {
      en: `An unexpected error occurred during ${operation}. Please try again.`,
      ar: `حدث خطأ غير متوقع أثناء ${operation}. يرجى المحاولة مرة أخرى.`
    }
  };
  
  return messages[errorType as keyof typeof messages]?.[isArabic ? 'ar' : 'en'] || 
         messages.UNKNOWN_ERROR[isArabic ? 'ar' : 'en'];
};
