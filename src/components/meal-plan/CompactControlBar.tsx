
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
    <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200 shadow-lg">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-xl p-1 border border-fitness-primary-200 shadow-inner">
            <button
              onClick={() => onViewModeChange('daily')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                viewMode === 'daily'
                  ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-md'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {mealPlanT('dailyView')}
            </button>
            <button
              onClick={() => onViewModeChange('weekly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                viewMode === 'weekly'
                  ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-md'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-50'
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
              className="bg-gradient-to-r from-fitness-accent-500 to-fitness-accent-600 text-white hover:from-fitness-accent-600 hover:to-fitness-accent-700 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {mealPlanT('addSnack')}
            </Button>
            
            <Button
              onClick={onShowShoppingList}
              size="sm"
              variant="outline"
              className="border-fitness-primary-300 bg-white text-fitness-primary-600 hover:bg-fitness-primary-50 hover:text-fitness-primary-700"
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
