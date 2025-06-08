
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ExerciseErrorHandlerProps {
  error: Error | null;
  onRetry: () => void;
  context?: string;
}

export const ExerciseErrorHandler = ({
  error,
  onRetry,
  context = 'exercise'
}: ExerciseErrorHandlerProps) => {
  const { language } = useI18n();
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (error) {
      console.error(`❌ ${context} error:`, error);
    }
  }, [error, context]);

  if (!error) return null;

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorMessage = () => {
    if (error.message?.includes('timeout') || error.message?.includes('TIMEOUT')) {
      return language === 'ar' 
        ? 'انتهت مهلة الطلب. يرجى التحقق من الاتصال والمحاولة مرة أخرى.'
        : 'Request timed out. Please check your connection and try again.';
    }
    
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return language === 'ar'
        ? 'خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت.'
        : 'Network error. Please check your internet connection.';
    }

    return language === 'ar'
      ? 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
      : 'An unexpected error occurred. Please try again.';
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{getErrorMessage()}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRetry}
          disabled={isRetrying}
          className="ml-4"
        >
          {isRetrying ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
        </Button>
      </AlertDescription>
    </Alert>
  );
};
