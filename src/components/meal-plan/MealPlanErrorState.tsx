
import MealPlanLayout from "@/components/MealPlanLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MealPlanErrorStateProps {
  onRetry: () => void;
}

const MealPlanErrorState = ({ onRetry }: MealPlanErrorStateProps) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <MealPlanLayout>
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="space-y-4">
            <div>
              <p className="font-medium">Unable to load meal plan data</p>
              <p className="text-sm text-gray-600 mt-1">
                This could be due to a temporary connection issue or authentication problem.
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={onRetry} 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                onClick={handleGoHome} 
                variant="ghost" 
                size="sm"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
            
            <p className="text-xs text-gray-500">
              If this issue persists, try refreshing the page or check your internet connection.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </MealPlanLayout>
  );
};

export default MealPlanErrorState;
