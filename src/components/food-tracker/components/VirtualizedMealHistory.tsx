
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface VirtualizedMealHistoryProps {
  groupedHistory?: any[];
}

const VirtualizedMealHistory = ({ groupedHistory }: VirtualizedMealHistoryProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Meal History</h3>
      </div>
      <p className="text-gray-600">Meal history view coming soon!</p>
    </Card>
  );
};

export default VirtualizedMealHistory;
