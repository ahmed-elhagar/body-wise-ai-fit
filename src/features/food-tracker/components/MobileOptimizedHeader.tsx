
import { Button } from "@/components/ui/button";

interface MobileOptimizedHeaderProps {
  todayStats: {
    calories: number;
    protein: number;
    remainingCalories: number;
    mealsLogged: number;
  };
  onAddFood: () => void;
}

const MobileOptimizedHeader = ({ todayStats, onAddFood }: MobileOptimizedHeaderProps) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
      <div>
        <h3 className="font-bold">{Math.round(todayStats.calories)} Calories</h3>
        <p className="text-sm text-gray-600">
          {todayStats.mealsLogged} meals logged
        </p>
      </div>
      <Button onClick={onAddFood}>Add Food</Button>
    </div>
  );
};

export default MobileOptimizedHeader;
