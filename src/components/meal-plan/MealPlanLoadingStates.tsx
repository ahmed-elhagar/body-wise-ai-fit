
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface MealPlanLoadingStatesProps {
  type?: 'skeleton' | 'spinner' | 'backdrop';
  title?: string;
  description?: string;
}

const MealPlanLoadingStates = ({ 
  type = 'skeleton',
  title = "Loading Meal Plan",
  description = "Please wait while we load your meals..."
}: MealPlanLoadingStatesProps) => {
  
  if (type === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    );
  }

  if (type === 'backdrop') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="p-8 max-w-md w-full mx-4">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        </Card>
      </div>
    );
  }

  // Default skeleton loading
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="p-4">
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MealPlanLoadingStates;
