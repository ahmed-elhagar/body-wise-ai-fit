
import { AlertCircle, RefreshCw, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseErrorStateProps {
  onRetry: () => void;
  title?: string;
  description?: string;
}

export const ExerciseErrorState = ({ 
  onRetry, 
  title = "Unable to Load Exercise Program",
  description = "We encountered an issue while loading your exercise program. Please try again."
}: ExerciseErrorStateProps) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Dumbbell className="w-3 h-3 text-gray-600" />
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={onRetry} 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('common.tryAgain') || 'Try Again'}
          </Button>
          
          <p className="text-sm text-gray-500">
            If the problem persists, please contact support
          </p>
        </div>
      </Card>
    </div>
  );
};
