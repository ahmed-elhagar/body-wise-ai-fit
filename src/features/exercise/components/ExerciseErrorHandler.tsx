
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExerciseErrorHandlerProps {
  onRetry: () => void;
  error?: Error | string;
}

export const ExerciseErrorHandler = ({ onRetry, error }: ExerciseErrorHandlerProps) => {
  const { t } = useLanguage();

  return (
    <Card className="p-8 text-center max-w-md mx-auto">
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('exercise.errorOccurred', 'Something went wrong')}
          </h3>
          <p className="text-gray-600 mb-4">
            {error ? 
              (typeof error === 'string' ? error : error.message) :
              t('exercise.errorDescription', 'We couldn\'t load your exercise data. Please try again.')
            }
          </p>
        </div>

        <Button onClick={onRetry} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          {t('exercise.tryAgain', 'Try Again')}
        </Button>
      </div>
    </Card>
  );
};
