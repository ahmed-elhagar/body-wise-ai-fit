
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Loading Meal Plan
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch your personalized meal plan...
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
