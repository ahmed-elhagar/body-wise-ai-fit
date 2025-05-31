
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
    <div className={`flex bg-slate-100/80 backdrop-blur-sm rounded-xl p-1.5 shadow-inner border border-slate-200/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button
        onClick={() => onViewModeChange('daily')}
        variant="ghost"
        size="sm"
        className={`${
          viewMode === 'daily'
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
        } transition-all duration-300 rounded-lg px-4 py-2.5 font-medium`}
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
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
        } transition-all duration-300 rounded-lg px-4 py-2.5 font-medium`}
      >
        <Grid className="w-4 h-4 mr-2" />
        {t('mealPlan.weeklyView')}
      </Button>
    </div>
  );
};

export default ViewModeToggle;
