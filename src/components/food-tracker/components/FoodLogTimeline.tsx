
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface FoodConsumptionLog {
  id: string;
  meal_type: string;
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fat_consumed: number;
  consumed_at: string;  // Changed from created_at to consumed_at to match useFoodConsumption
}

interface FoodLogTimelineProps {
  foodLogs: FoodConsumptionLog[];
  onRefetch: () => Promise<any>;
}

const FoodLogTimeline = ({ foodLogs, onRefetch }: FoodLogTimelineProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-semibold">Food Timeline</h3>
      </div>
      <p className="text-gray-600">Food timeline view coming soon!</p>
    </Card>
  );
};

export default FoodLogTimeline;
