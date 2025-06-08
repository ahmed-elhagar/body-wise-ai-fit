
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseErrorStateProps {
  onRetry?: () => void;
  error?: Error | null;
}

export const ExerciseErrorState = ({ onRetry, error }: ExerciseErrorStateProps) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center bg-white shadow-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {t('exercise.errorTitle') || 'Something went wrong'}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {error?.message || t('exercise.errorMessage') || 'We encountered an error while loading your exercise program. Please try again.'}
        </p>
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('exercise.tryAgain') || 'Try Again'}
          </Button>
        )}
      </Card>
    </div>
  );
};
