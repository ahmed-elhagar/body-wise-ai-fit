
import { Button } from "@/components/ui/button";
import { Calendar, Grid, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealPlanActionsProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  onAddSnack: () => void;
  showAddSnack: boolean;
}

const MealPlanActions = ({ 
  viewMode, 
  onViewModeChange, 
  onAddSnack, 
  showAddSnack 
}: MealPlanActionsProps) => {
  const { t } = useLanguage();

  return (
    <div className="mb-4 sm:mb-6 flex justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg w-full max-w-4xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex flex-1">
            <Button
              variant={viewMode === 'daily' ? 'default' : 'ghost'}
              className={`flex-1 text-sm transition-all duration-200 ${
                viewMode === 'daily' 
                  ? 'bg-fitness-gradient text-white shadow-md' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => onViewModeChange('daily')}
              size="sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {t('mealPlan.dailyView')}
            </Button>
            <Button
              variant={viewMode === 'weekly' ? 'default' : 'ghost'}
              className={`flex-1 text-sm transition-all duration-200 ${
                viewMode === 'weekly' 
                  ? 'bg-fitness-gradient text-white shadow-md' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => onViewModeChange('weekly')}
              size="sm"
            >
              <Grid className="w-4 h-4 mr-2" />
              {t('mealPlan.weeklyView')}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 lg:gap-3">
            {showAddSnack && (
              <Button
                variant="outline"
                className="flex-1 lg:flex-initial lg:min-w-[140px] text-sm border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 transition-all duration-200"
                onClick={onAddSnack}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('mealPlan.addSnack')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanActions;
