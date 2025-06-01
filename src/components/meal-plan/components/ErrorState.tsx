
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Error Loading Meal Plan
          </h3>
          <p className="text-red-600 mb-4">
            {error.message || 'Something went wrong while loading your meal plan.'}
          </p>
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ErrorState;
