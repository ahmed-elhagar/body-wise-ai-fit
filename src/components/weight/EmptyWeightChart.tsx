
import { Scale, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyWeightChart = () => {
  return (
    <div className="text-center py-12 content-spacing">
      <div className="w-16 h-16 bg-gradient-to-br from-fitness-neutral-200 to-fitness-neutral-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Scale className="w-8 h-8 text-fitness-neutral-500" />
      </div>
      
      <h3 className="text-h4 text-fitness-neutral-600 mb-2">No Weight Data Yet</h3>
      <p className="text-fitness-neutral-500 mb-6 max-w-sm mx-auto">
        Start logging your weight to see your progress chart and track your fitness journey
      </p>
      
      <Button variant="default" size="lg" className="gap-2">
        <Plus className="w-4 h-4" />
        Add First Entry
      </Button>
    </div>
  );
};

export default EmptyWeightChart;
