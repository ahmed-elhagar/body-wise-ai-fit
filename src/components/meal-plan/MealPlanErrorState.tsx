
import MealPlanLayout from "@/components/MealPlanLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface MealPlanErrorStateProps {
  onRetry: () => void;
}

const MealPlanErrorState = ({ onRetry }: MealPlanErrorStateProps) => {
  return (
    <MealPlanLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="space-y-3">
            <p>Failed to load meal plan data. Please try again.</p>
            <Button 
              onClick={onRetry} 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </MealPlanLayout>
  );
};

export default MealPlanErrorState;
