
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

const FoodLogTimeline = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-semibold">Food Timeline</h3>
      </div>
      <p className="text-gray-600">Daily food timeline coming soon!</p>
    </Card>
  );
};

export default FoodLogTimeline;
