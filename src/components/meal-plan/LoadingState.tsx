
import { Card } from "@/components/ui/card";
import { Utensils } from "lucide-react";

const LoadingState = () => {
  return (
    <Card className="p-8 text-center bg-white/80 backdrop-blur-sm shadow-lg">
      <div className="w-16 h-16 mx-auto bg-fitness-primary-100 rounded-full flex items-center justify-center animate-pulse mb-4">
        <Utensils className="w-8 h-8 text-fitness-primary-500" />
      </div>
      <h3 className="text-lg font-semibold text-fitness-primary-700 mb-2">
        Loading your meal plan...
      </h3>
      <p className="text-fitness-primary-600">
        Please wait while we fetch your personalized nutrition plan
      </p>
    </Card>
  );
};

export default LoadingState;
