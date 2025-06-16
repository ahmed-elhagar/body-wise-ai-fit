
import { TFunction } from 'i18next';

export interface ErrorContext {
  operation?: string;
  component?: string;
  userId?: string;
  weekOffset?: number;
  retryable?: boolean;
}

export class EnhancedError extends Error {
  public code: string;
  public context: ErrorContext;
  public userMessage: string;
  public retryable: boolean;

  constructor(
    message: string, 
    code: string, 
    userMessage: string, 
    context: ErrorContext = {},
    retryable = false
  ) {
    super(message);
    this.name = 'EnhancedError';
    this.code = code;
    this.userMessage = userMessage;
    this.context = context;
    this.retryable = retryable;
  }
}

export const createErrorMessage = (
  error: any, 
  t: TFunction,
  context: ErrorContext = {}
): { message: string; retryable: boolean } => {
  // Handle EnhancedError instances
  if (error instanceof EnhancedError) {
    return {
      message: error.userMessage,
      retryable: error.retryable
    };
  }

  // Handle common error patterns
  if (error?.message?.includes('JWT') || error?.message?.includes('auth')) {
    return {
      message: t('errors.authenticationRequired'),
      retryable: false
    };
  }

  if (error?.message?.includes('Network') || error?.code === 'NETWORK_ERROR') {
    return {
      message: t('errors.networkError'),
      retryable: true
    };
  }

  if (error?.message?.includes('timeout') || error?.code === 'TIMEOUT') {
    return {
      message: t('errors.requestTimeout'),
      retryable: true
    };
  }

  if (error?.message?.includes('Rate limit')) {
    return {
      message: t('errors.rateLimitExceeded'),
      retryable: false
    };
  }

  // Default error message based on context
  const contextMessages = {
    'Meal Plan Generation': t('errors.mealPlanGeneration'),
    'Exercise Program': t('errors.exerciseProgram'),
    'Food Analysis': t('errors.foodAnalysis'),
    'Profile Update': t('errors.profileUpdate'),
    'Data Fetch': t('errors.dataFetch')
  };

  const contextMessage = context.operation ? contextMessages[context.operation] : null;

  return {
    message: contextMessage || t('errors.general'),
    retryable: true
  };
};

// Error logging utility
export const logError = (error: any, context: ErrorContext = {}) => {
  const errorData = {
    message: error.message,
    code: error.code || 'UNKNOWN',
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent
  };

  console.error('Enhanced Error Log:', errorData);

  // In production, you might want to send this to an error tracking service
  if (import.meta.env.PROD) {
    // Example: Send to error tracking service
    // errorTrackingService.logError(errorData);
  }
};
