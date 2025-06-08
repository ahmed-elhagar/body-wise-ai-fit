
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseErrorHandlerProps {
  error: Error;
  onRetry?: () => void;
  context?: string;
}

export const ExerciseErrorHandler = ({ error, onRetry, context }: ExerciseErrorHandlerProps) => {
  const { t } = useLanguage();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <h3 className="font-semibold text-red-900">
          {t('error.title', 'Something went wrong')}
        </h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        {error.message || t('error.generic', 'An error occurred while loading your exercises.')}
      </p>
      
      {context && (
        <p className="text-sm text-gray-500 mb-4">
          Context: {context}
        </p>
      )}
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          {t('error.retry', 'Try Again')}
        </Button>
      )}
    </Card>
  );
};
