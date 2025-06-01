import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Menu } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface CompactNavigationProps {
  selectedDay: number;
  onDaySelect: (day: number) => void;
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
}

const CompactNavigation = ({ selectedDay, onDaySelect, viewMode, onViewModeChange }: CompactNavigationProps) => {
  const { t, isRTL } = useI18n();

  return (
    <Card className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="sm:hidden"
            onClick={() => {
              // Handle menu toggle for small screens
            }}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 ml-2">
            {t('mealPlan.dailyPlan')}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'daily' ? 'default' : 'outline'}
            className="text-xs sm:text-sm py-2 sm:py-3"
            onClick={() => onViewModeChange('daily')}
          >
            {t('mealPlan.daily')}
          </Button>
          <Button
            variant={viewMode === 'weekly' ? 'default' : 'outline'}
            className="text-xs sm:text-sm py-2 sm:py-3"
            onClick={() => onViewModeChange('weekly')}
          >
            {t('mealPlan.weekly')}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
          <Button
            key={day}
            variant={selectedDay === index + 1 ? "default" : "outline"}
            className={`text-xs sm:text-sm py-2 sm:py-3 ${
              selectedDay === index + 1 
                ? 'bg-fitness-gradient text-white shadow-lg' 
                : 'bg-white/80 hover:bg-gray-50'
            }`}
            onClick={() => onDaySelect(index + 1)}
          >
            <div className="flex flex-col items-center">
              <span className="font-medium">{day}</span>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default CompactNavigation;
