
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
    <div className={`flex bg-fitness-neutral-100/90 backdrop-blur-sm rounded-xl p-1.5 shadow-sm border border-fitness-neutral-200/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button
        onClick={() => onViewModeChange('daily')}
        variant="ghost"
        size="sm"
        className={`${
          viewMode === 'daily'
            ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg hover:from-fitness-primary-600 hover:to-fitness-primary-700'
            : 'text-fitness-neutral-600 hover:text-fitness-neutral-900 hover:bg-white/80'
        } transition-all duration-300 rounded-lg px-4 py-2.5 font-semibold touch-target`}
      >
        <Calendar className="w-4 h-4 mr-2" />
        {t('mealPlan.dailyView')}
      </Button>
      <Button
        onClick={() => onViewModeChange('weekly')}
        variant="ghost"
        size="sm"
        className={`${
          viewMode === 'weekly'
            ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg hover:from-fitness-primary-600 hover:to-fitness-primary-700'
            : 'text-fitness-neutral-600 hover:text-fitness-neutral-900 hover:bg-white/80'
        } transition-all duration-300 rounded-lg px-4 py-2.5 font-semibold touch-target`}
      >
        <Grid className="w-4 h-4 mr-2" />
        {t('mealPlan.weeklyView')}
      </Button>
    </div>
  );
};

export default ViewModeToggle;
