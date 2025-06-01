import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Flame, TrendingUp } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface ActionSectionProps {
  viewMode: 'daily' | 'weekly';
  totalCalories: number;
  totalProtein: number;
  onShowShoppingList: () => void;
  onAddSnack: () => void;
  showAddSnack: boolean;
  showShoppingList: boolean;
}

const ActionSection = ({
  viewMode,
  totalCalories,
  totalProtein,
}: ActionSectionProps) => {
  const { t, isRTL } = useI18n();
  
  // Target values (these could come from user profile)
  const targetCalories = 2000;
  const targetProtein = 150;
  
  const calorieProgress = Math.min((totalCalories / targetCalories) * 100, 100);
  const proteinProgress = Math.min((totalProtein / targetProtein) * 100, 100);

  // Only show summary in weekly view to reduce clutter in daily view
  if (viewMode === 'daily') {
    return null;
  }

  return (
    <Card className="p-3 bg-gradient-to-br from-white via-fitness-primary/5 to-pink-50 border-0 shadow-sm">
      <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-5 h-5 bg-fitness-gradient rounded-full flex items-center justify-center">
          <Target className="w-3 h-3 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">{t('weeklyOverview')}</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Calories */}
        <div className="space-y-1">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Flame className="w-3 h-3 text-red-500" />
              <span className="text-xs font-medium text-gray-700">{t('calories')}</span>
            </div>
            <span className="text-xs text-gray-600">
              {totalCalories} / {targetCalories}
            </span>
          </div>
          <Progress value={calorieProgress} className="h-1.5" />
        </div>

        {/* Protein */}
        <div className="space-y-1">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs font-medium text-gray-700">{t('protein')}</span>
            </div>
            <span className="text-xs text-gray-600">
              {totalProtein}g / {targetProtein}g
            </span>
          </div>
          <Progress value={proteinProgress} className="h-1.5" />
        </div>
      </div>
    </Card>
  );
};

export default ActionSection;
