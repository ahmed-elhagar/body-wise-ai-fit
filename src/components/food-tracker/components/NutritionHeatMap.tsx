
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface NutritionHeatMapProps {
  data?: any[];
  currentMonth?: Date;
}

const NutritionHeatMap = ({ data, currentMonth }: NutritionHeatMapProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold">Nutrition Heat Map</h3>
      </div>
      <p className="text-gray-600">Nutrition analytics coming soon!</p>
    </Card>
  );
};

export default NutritionHeatMap;
