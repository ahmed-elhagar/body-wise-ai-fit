
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface DailySummaryProps {
  totalCalories: number;
  totalProtein: number;
  onShowShoppingList: () => void;
}

const DailySummary = ({ totalCalories, totalProtein, onShowShoppingList }: DailySummaryProps) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Summary</h3>
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <p className="text-sm text-green-700 mb-1">Total Calories</p>
          <p className="text-2xl font-bold text-green-800">{totalCalories}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <p className="text-sm text-blue-700 mb-1">Total Protein</p>
          <p className="text-2xl font-bold text-blue-800">{totalProtein}g</p>
        </div>
        <Button 
          onClick={onShowShoppingList}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Shopping List
        </Button>
      </div>
    </Card>
  );
};

export default DailySummary;
