
import { toast } from 'sonner';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 'medium', { field });
  }
}

export class NetworkError extends AppError {
  constructor(message: string, status?: number) {
    super(message, 'NETWORK_ERROR', 'high', { status });
  }
}

export class AuthError extends AppError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR', 'high');
  }
}

export const handleError = (error: unknown, context?: string) => {
  console.error('Error in', context || 'unknown context', ':', error);
  
  if (error instanceof AppError) {
    switch (error.severity) {
      case 'critical':
        toast.error(`Critical Error: ${error.message}`, { duration: 10000 });
        break;
      case 'high':
        toast.error(error.message, { duration: 6000 });
        break;
      case 'medium':
        toast.error(error.message);
        break;
      case 'low':
        toast.warning(error.message);
        break;
    }
  } else if (error instanceof Error) {
    toast.error(`Something went wrong: ${error.message}`);
  } else {
    toast.error('An unexpected error occurred');
  }
};

export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      return null;
    }
  };
};

export const createErrorBoundary = (component: string) => {
  return (error: Error, errorInfo: any) => {
    console.error(`Error in ${component}:`, error, errorInfo);
    
    // Report to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // This would integrate with your error reporting service
      console.log('Error reported to monitoring service');
    }
  };
};
