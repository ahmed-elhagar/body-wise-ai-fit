
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export const ExerciseErrorState = ({ error, onRetry }: ExerciseErrorStateProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full">
        <CardContent className="text-center p-8">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('exercise.errorTitle', 'Exercise Error')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('exercise.errorDescription', 'We encountered an issue loading your exercise program.')}
          </p>
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded mb-4">
            {error.message}
          </div>
          <Button 
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('exercise.retry', 'Try Again')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
