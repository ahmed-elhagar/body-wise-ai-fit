
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/hooks/useI18n';

export interface ErrorContext {
  operation: string;
  userId?: string;
  component?: string;
  retryable: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorLog {
  id: string;
  timestamp: Date;
  context: ErrorContext;
  error: any;
  resolved: boolean;
}

export const useEnhancedErrorSystem = () => {
  const { language } = useI18n();
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);

  const handleError = useCallback((error: any, context: ErrorContext) => {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log error for debugging
    console.error(`🚨 Enhanced Error Handler [${context.operation}]:`, {
      error: error.message || error,
      context,
      timestamp: new Date().toISOString(),
      errorId
    });

    // Add to error logs
    const errorLog: ErrorLog = {
      id: errorId,
      timestamp: new Date(),
      context,
      error,
      resolved: false
    };
    
    setErrorLogs(prev => [...prev.slice(-9), errorLog]);

    // Categorize and handle error
    const errorType = categorizeError(error, context);
    const userMessage = getUserFriendlyMessage(errorType, context, language);

    // Show appropriate notification
    if (context.severity === 'critical') {
      toast.error(userMessage, {
        duration: 10000,
        action: context.retryable ? {
          label: language === 'ar' ? 'إعادة المحاولة' : 'Retry',
          onClick: () => handleRetry(errorId)
        } : undefined
      });
    } else if (context.severity === 'high') {
      toast.error(userMessage, { duration: 5000 });
    } else if (context.severity === 'medium') {
      toast.warning(userMessage, { duration: 3000 });
    } else {
      console.warn('Low severity error:', userMessage);
    }

    return { errorId, errorType, userMessage };
  }, [language]);

  const handleRetry = useCallback((errorId: string) => {
    setErrorLogs(prev => 
      prev.map(log => 
        log.id === errorId ? { ...log, resolved: true } : log
      )
    );
    
    toast.info(language === 'ar' ? 'جاري إعادة المحاولة...' : 'Retrying...');
  }, [language]);

  const withErrorBoundary = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context: ErrorContext
  ) => {
    return async (...args: T): Promise<R | null> => {
      try {
        return await fn(...args);
      } catch (error) {
        handleError(error, context);
        return null;
      }
    };
  }, [handleError]);

  const clearErrorLogs = useCallback(() => {
    setErrorLogs([]);
  }, []);

  return {
    handleError,
    withErrorBoundary,
    errorLogs,
    clearErrorLogs,
    handleRetry
  };
};

const categorizeError = (error: any, context: ErrorContext): string => {
  const message = error.message || error.toString();
  
  if (message.includes('timeout') || message.includes('TIMEOUT')) return 'TIMEOUT';
  if (message.includes('429') || message.includes('rate limit')) return 'RATE_LIMIT';
  if (message.includes('401') || message.includes('unauthorized')) return 'AUTH_ERROR';
  if (message.includes('network') || message.includes('fetch')) return 'NETWORK_ERROR';
  if (message.includes('validation') || message.includes('invalid')) return 'VALIDATION_ERROR';
  if (message.includes('database') || message.includes('constraint')) return 'DATABASE_ERROR';
  if (context.operation.includes('meal_plan')) return 'MEAL_PLAN_ERROR';
  if (context.operation.includes('ai_generation')) return 'AI_GENERATION_ERROR';
  
  return 'UNKNOWN_ERROR';
};

const getUserFriendlyMessage = (errorType: string, context: ErrorContext, language: string): string => {
  const isArabic = language === 'ar';
  
  const messages = {
    TIMEOUT: {
      en: `${context.operation} is taking longer than expected. Please try again.`,
      ar: `${context.operation} يستغرق وقتاً أطول من المتوقع. يرجى المحاولة مرة أخرى.`
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
    MEAL_PLAN_ERROR: {
      en: 'Meal plan generation failed. Please try again.',
      ar: 'فشل في إنشاء خطة الوجبات. يرجى المحاولة مرة أخرى.'
    },
    AI_GENERATION_ERROR: {
      en: 'AI service is temporarily unavailable. Please try again.',
      ar: 'خدمة الذكاء الاصطناعي غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى.'
    },
    UNKNOWN_ERROR: {
      en: `An unexpected error occurred during ${context.operation}.`,
      ar: `حدث خطأ غير متوقع أثناء ${context.operation}.`
    }
  };
  
  return messages[errorType as keyof typeof messages]?.[isArabic ? 'ar' : 'en'] || 
         messages.UNKNOWN_ERROR[isArabic ? 'ar' : 'en'];
};
