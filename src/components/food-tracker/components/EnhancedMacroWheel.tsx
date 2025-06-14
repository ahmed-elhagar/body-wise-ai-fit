
import { Card } from "@/components/ui/card";
import { PieChart } from "lucide-react";

interface EnhancedMacroWheelProps {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  goalCalories?: number;
  foodLogs?: any[];
  onRefetch?: () => Promise<any>;
}

const EnhancedMacroWheel = ({ 
  calories, 
  protein, 
  carbs, 
  fat, 
  goalCalories,
  foodLogs,
  onRefetch 
}: EnhancedMacroWheelProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Macro Distribution</h3>
      </div>
      <p className="text-gray-600">Macro breakdown chart coming soon!</p>
    </Card>
  );
};

export default EnhancedMacroWheel;
