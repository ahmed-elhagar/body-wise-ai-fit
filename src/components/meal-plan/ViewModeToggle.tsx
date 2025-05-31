
import { Button } from "@/components/ui/button";
import { Calendar, Grid } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ViewModeToggleProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
}

const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button
        onClick={() => onViewModeChange('daily')}
        variant={viewMode === 'daily' ? 'default' : 'ghost'}
        size="sm"
        className={`${
          viewMode === 'daily'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        } transition-all duration-200 rounded-lg px-4 py-2`}
      >
        <Calendar className="w-4 h-4 mr-2" />
        {t('mealPlan.dailyView')}
      </Button>
      <Button
        onClick={() => onViewModeChange('weekly')}
        variant={viewMode === 'weekly' ? 'default' : 'ghost'}
        size="sm"
        className={`${
          viewMode === 'weekly'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        } transition-all duration-200 rounded-lg px-4 py-2`}
      >
        <Grid className="w-4 h-4 mr-2" />
        {t('mealPlan.weeklyView')}
      </Button>
    </div>
  );
};

export default ViewModeToggle;
