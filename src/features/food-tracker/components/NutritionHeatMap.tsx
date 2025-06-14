
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodConsumptionLog } from "../hooks";

interface NutritionHeatMapProps {
  data: FoodConsumptionLog[];
  currentMonth: Date;
}

const NutritionHeatMap = ({ data, currentMonth }: NutritionHeatMapProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Heat Map (Placeholder)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-40 flex items-center justify-center bg-gray-100 rounded-md">
          <p>Heatmap for {currentMonth.toLocaleString('default', { month: 'long' })}</p>
        </div>
        <p className="text-sm text-gray-500 mt-2">Showing data for {data.length} entries.</p>
      </CardContent>
    </Card>
  );
};

export default NutritionHeatMap;
