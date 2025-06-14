
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ErrorStateProps {
  error: Error | string;
  onRetry: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  const { t } = useLanguage();
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          {t('Something went wrong')}
        </h3>
        <p className="text-red-600 mb-4">
          {errorMessage}
        </p>
        <Button onClick={onRetry} variant="outline" className="border-red-300 text-red-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('Try Again')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorState;
