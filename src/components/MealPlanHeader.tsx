import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, List } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface MealPlanHeaderProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  selectedDay?: number;
}

const MealPlanHeader = ({ viewMode, onViewModeChange, selectedDay }: MealPlanHeaderProps) => {
  const { t, isRTL } = useI18n();

  return (
    <Card className="p-4">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h2 className="text-lg font-semibold">{t('mealPlan.title')}</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => onViewModeChange('daily')}>
            <Calendar className="w-4 h-4 mr-2" />
            {t('mealPlan.dailyView')}
          </Button>
          <Button variant="outline" onClick={() => onViewModeChange('weekly')}>
            <List className="w-4 h-4 mr-2" />
            {t('mealPlan.weeklyView')}
          </Button>
        </div>
      </div>
      {selectedDay && (
        <p className="text-sm text-gray-500 mt-2">
          {t('mealPlan.selectedDay')}: {selectedDay}
        </p>
      )}
    </Card>
  );
};

export default MealPlanHeader;
