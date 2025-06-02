
import { toast } from 'sonner';

export interface ErrorContext {
  operation: string;
  component?: string;
  userId?: string;
  retryable: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

export interface ErrorLog {
  id: string;
  timestamp: Date;
  context: ErrorContext;
  error: any;
  resolved: boolean;
  retryCount: number;
}

class EnhancedErrorHandler {
  private static instance: EnhancedErrorHandler;
  private errorLogs: ErrorLog[] = [];
  private maxLogs = 50;

  static getInstance(): EnhancedErrorHandler {
    if (!EnhancedErrorHandler.instance) {
      EnhancedErrorHandler.instance = new EnhancedErrorHandler();
    }
    return EnhancedErrorHandler.instance;
  }

  handleError(error: any, context: ErrorContext): { errorId: string; userMessage: string } {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log error with enhanced details
    console.error(`🚨 Enhanced Error Handler [${context.operation}]:`, {
      errorId,
      error: error.message || error,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Add to error logs
    const errorLog: ErrorLog = {
      id: errorId,
      timestamp: new Date(),
      context,
      error,
      resolved: false,
      retryCount: 0
    };
    
    this.addErrorLog(errorLog);

    // Categorize and handle error
    const errorType = this.categorizeError(error, context);
    const userMessage = this.getUserFriendlyMessage(errorType, context);

    // Show appropriate notification
    this.showErrorNotification(userMessage, context, errorId);

    return { errorId, userMessage };
  }

  private categorizeError(error: any, context: ErrorContext): string {
    const message = error.message || error.toString();
    
    // Network related errors
    if (message.includes('timeout') || message.includes('TIMEOUT')) return 'TIMEOUT';
    if (message.includes('429') || message.includes('rate limit')) return 'RATE_LIMIT';
    if (message.includes('401') || message.includes('unauthorized')) return 'AUTH_ERROR';
    if (message.includes('403') || message.includes('forbidden')) return 'PERMISSION_ERROR';
    if (message.includes('network') || message.includes('fetch') || message.includes('NetworkError')) return 'NETWORK_ERROR';
    
    // Application specific errors
    if (message.includes('validation') || message.includes('invalid')) return 'VALIDATION_ERROR';
    if (message.includes('database') || message.includes('constraint')) return 'DATABASE_ERROR';
    if (message.includes('generation limit') || message.includes('credit')) return 'CREDIT_LIMIT_ERROR';
    if (context.operation.includes('meal_plan')) return 'MEAL_PLAN_ERROR';
    if (context.operation.includes('ai_generation')) return 'AI_GENERATION_ERROR';
    if (context.operation.includes('exercise')) return 'EXERCISE_ERROR';
    
    // React/Component errors
    if (message.includes('React') || message.includes('component')) return 'COMPONENT_ERROR';
    if (message.includes('render') || message.includes('hook')) return 'RENDER_ERROR';
    
    return 'UNKNOWN_ERROR';
  }

  private getUserFriendlyMessage(errorType: string, context: ErrorContext): string {
    const messages: Record<string, string> = {
      TIMEOUT: `${context.operation} is taking longer than expected. Please check your internet connection and try again.`,
      RATE_LIMIT: 'Too many requests. Please wait a moment before trying again.',
      AUTH_ERROR: 'Authentication failed. Please sign in again to continue.',
      PERMISSION_ERROR: 'You don\'t have permission to perform this action.',
      NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
      VALIDATION_ERROR: 'Invalid data provided. Please check your input and try again.',
      DATABASE_ERROR: 'Database error occurred. Please try again later.',
      CREDIT_LIMIT_ERROR: 'AI generation limit reached. Please upgrade your plan or wait for credits to reset.',
      MEAL_PLAN_ERROR: 'Failed to process meal plan. Please try again with different preferences.',
      AI_GENERATION_ERROR: 'AI service is temporarily unavailable. Please try again in a few minutes.',
      EXERCISE_ERROR: 'Failed to process exercise data. Please try again.',
      COMPONENT_ERROR: 'A component error occurred. The page will automatically retry.',
      RENDER_ERROR: 'Display error occurred. Refreshing the component...',
      UNKNOWN_ERROR: `An unexpected error occurred during ${context.operation}. Please try again.`
    };
    
    return messages[errorType] || messages.UNKNOWN_ERROR;
  }

  private showErrorNotification(message: string, context: ErrorContext, errorId: string) {
    const duration = context.severity === 'critical' ? 10000 : 
                    context.severity === 'high' ? 7000 : 
                    context.severity === 'medium' ? 5000 : 3000;

    if (context.severity === 'low') {
      console.warn('Low severity error:', message);
      return;
    }

    const toastConfig: any = {
      description: message,
      duration
    };

    if (context.retryable) {
      toastConfig.action = {
        label: 'Retry',
        onClick: () => this.handleRetry(errorId)
      };
    }

    if (context.severity === 'critical') {
      toast.error('Critical Error', toastConfig);
    } else if (context.severity === 'high') {
      toast.error('Error', toastConfig);
    } else {
      toast.warning('Warning', toastConfig);
    }
  }

  private handleRetry(errorId: string) {
    const errorLog = this.errorLogs.find(log => log.id === errorId);
    if (errorLog) {
      errorLog.retryCount++;
      console.log(`🔄 Retrying operation: ${errorLog.context.operation} (attempt ${errorLog.retryCount})`);
      toast.info('Retrying...', { duration: 2000 });
    }
  }

  private addErrorLog(errorLog: ErrorLog) {
    this.errorLogs.unshift(errorLog);
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs = this.errorLogs.slice(0, this.maxLogs);
    }
  }

  getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs];
  }

  clearErrorLogs(): void {
    this.errorLogs = [];
    console.log('🧹 Error logs cleared');
  }

  markErrorResolved(errorId: string): void {
    const errorLog = this.errorLogs.find(log => log.id === errorId);
    if (errorLog) {
      errorLog.resolved = true;
      console.log(`✅ Error resolved: ${errorId}`);
    }
  }
}

export const errorHandler = EnhancedErrorHandler.getInstance();

// Utility function for wrapping async operations with error handling
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: ErrorContext
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      errorHandler.handleError(error, context);
      return null;
    }
  };
};

// Utility function for handling errors with timeout
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = 30000,
  operation: string = 'Operation'
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs}ms`)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
};
