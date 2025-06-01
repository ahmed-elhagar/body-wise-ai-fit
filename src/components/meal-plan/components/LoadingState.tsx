
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-fitness-primary-500" />
        <div>
          <h3 className="text-lg font-semibold text-fitness-primary-700 mb-2">
            Loading Meal Plan
          </h3>
          <p className="text-fitness-primary-600">
            Please wait while we fetch your personalized meal plan...
          </p>
        </div>
      </div>
    </Card>
  );
};

export default LoadingState;
