
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Grid, Eye } from "lucide-react";
import { format, addDays } from "date-fns";

interface UnifiedNavigationProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  weekStartDate: Date;
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  selectedDayNumber: number;
  onDayChange: (dayNumber: number) => void;
  showDaySelector: boolean;
}

const UnifiedNavigation = ({
  viewMode,
  onViewModeChange,
  weekStartDate,
  currentWeekOffset,
  onWeekChange,
  selectedDayNumber,
  onDayChange,
  showDaySelector
}: UnifiedNavigationProps) => {
  
  const getDayName = (dayNumber: number) => {
    const days = ['', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    return days[dayNumber] || 'Day';
  };

  const getDateForDay = (dayNumber: number) => {
    const dayOffset = dayNumber === 6 ? 0 : dayNumber === 7 ? 1 : dayNumber + 1;
    return addDays(weekStartDate, dayOffset);
  };

  const weekEndDate = addDays(weekStartDate, 6);

  return (
    <Card className="bg-white border-fitness-primary-200">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'daily' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewModeChange('daily')}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Daily View
              </Button>
              <Button
                variant={viewMode === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewModeChange('weekly')}
                className="flex items-center gap-2"
              >
                <Grid className="w-4 h-4" />
                Weekly View
              </Button>
            </div>
            
            {/* Week Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onWeekChange(currentWeekOffset - 1)}
                className="p-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center px-3">
                <div className="font-semibold text-sm">
                  {format(weekStartDate, 'MMM d')} - {format(weekEndDate, 'MMM d, yyyy')}
                </div>
                <div className="text-xs text-gray-500">
                  {currentWeekOffset === 0 ? 'This Week' : 
                   currentWeekOffset > 0 ? `${currentWeekOffset} week${currentWeekOffset > 1 ? 's' : ''} ahead` :
                   `${Math.abs(currentWeekOffset)} week${Math.abs(currentWeekOffset) > 1 ? 's' : ''} ago`}
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onWeekChange(currentWeekOffset + 1)}
                className="p-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Day Selector for Daily View */}
          {showDaySelector && (
            <div className="flex gap-2 justify-center overflow-x-auto">
              {[1, 2, 3, 4, 5, 6, 7].map((dayNumber) => {
                const dayDate = getDateForDay(dayNumber);
                const isSelected = selectedDayNumber === dayNumber;
                const isToday = format(new Date(), 'yyyy-MM-dd') === format(dayDate, 'yyyy-MM-dd');
                
                return (
                  <Button
                    key={dayNumber}
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onDayChange(dayNumber)}
                    className={`flex flex-col items-center min-w-[70px] h-14 relative ${
                      isSelected ? 'bg-fitness-primary-600 text-white' : 'hover:bg-fitness-primary-50'
                    }`}
                  >
                    <span className="text-xs font-medium">{getDayName(dayNumber)}</span>
                    <span className="text-xs">{format(dayDate, 'd')}</span>
                    {isToday && (
                      <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1 py-0 min-w-0 h-4">
                        •
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedNavigation;
