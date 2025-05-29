
import { toast } from 'sonner';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'low' | 'medium' | 'high' = 'medium'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown, context?: string) => {
  console.error('Error in', context || 'unknown context', ':', error);
  
  if (error instanceof AppError) {
    switch (error.severity) {
      case 'high':
        toast.error(`Critical Error: ${error.message}`);
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
