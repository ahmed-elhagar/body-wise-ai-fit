
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Grid3X3, Plus, ShoppingCart } from "lucide-react";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface CompactControlBarProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  onAddSnack: () => void;
  onShowShoppingList: () => void;
}

const CompactControlBar = ({
  viewMode,
  onViewModeChange,
  onAddSnack,
  onShowShoppingList
}: CompactControlBarProps) => {
  const { mealPlanT } = useMealPlanTranslation();

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => onViewModeChange('daily')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                viewMode === 'daily'
                  ? 'bg-white text-fitness-primary-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {mealPlanT('dailyView')}
            </button>
            <button
              onClick={() => onViewModeChange('weekly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                viewMode === 'weekly'
                  ? 'bg-white text-fitness-primary-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              {mealPlanT('weeklyView')}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onAddSnack}
              size="sm"
              className="bg-gradient-to-r from-fitness-orange-500 to-fitness-orange-600 text-white hover:from-fitness-orange-600 hover:to-fitness-orange-700 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {mealPlanT('addSnack')}
            </Button>
            
            <Button
              onClick={onShowShoppingList}
              size="sm"
              variant="outline"
              className="border-fitness-accent-300 text-fitness-accent-600 hover:bg-fitness-accent-50"
            >
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              {mealPlanT('shoppingList')}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CompactControlBar;
