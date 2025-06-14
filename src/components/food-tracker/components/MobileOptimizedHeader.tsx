
import { Card } from "@/components/ui/card";
import { Smartphone } from "lucide-react";

interface MobileOptimizedHeaderProps {
  todayStats?: {
    calories: number;
    protein: number;
    remainingCalories: number;
    mealsLogged: number;
  };
  onAddFood: () => void;
}

const MobileOptimizedHeader = ({ todayStats, onAddFood }: MobileOptimizedHeaderProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Smartphone className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Mobile Food Tracker</h3>
      </div>
      <p className="text-gray-600">Mobile optimized header coming soon!</p>
    </Card>
  );
};

export default MobileOptimizedHeader;
