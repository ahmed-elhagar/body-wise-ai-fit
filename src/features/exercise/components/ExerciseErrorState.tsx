
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ExerciseErrorStateProps {
  onRetry: () => void;
}

export const ExerciseErrorState = ({ onRetry }: ExerciseErrorStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Card className="p-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center max-w-md">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">
          We couldn't load your exercise program. Please try again.
        </p>
        <Button 
          onClick={onRetry}
          className="bg-fitness-primary hover:bg-fitness-primary/90 text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </Card>
    </div>
  );
};
