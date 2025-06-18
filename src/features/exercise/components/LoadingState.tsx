
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <Card className="p-8 text-center">
      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-fitness-primary-500" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Exercise Program</h3>
      <p className="text-gray-600">Please wait while we fetch your workout data...</p>
    </Card>
  );
};

export default LoadingState;
