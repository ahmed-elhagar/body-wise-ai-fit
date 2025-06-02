
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Sparkles, RefreshCw, Calendar } from "lucide-react";
import { format } from "date-fns";

interface UnifiedNavigationProps {
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  weekStartDate: Date;
  onGenerateAI: () => void;
  onRefresh: () => void;
  hasWeeklyPlan: boolean;
  credits: { remaining: number };
}

export const UnifiedNavigation = ({
  currentWeekOffset,
  setCurrentWeekOffset,
  selectedDayNumber,
  setSelectedDayNumber,
  weekStartDate,
  onGenerateAI,
  onRefresh,
  hasWeeklyPlan,
  credits
}: UnifiedNavigationProps) => {
  
  const getDayName = (dayNumber: number) => {
    const days = ['', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    return days[dayNumber] || 'Day';
  };

  const getDateForDay = (dayNumber: number) => {
    const dayOffset = dayNumber === 1 ? 0 : dayNumber - 1;
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + dayOffset);
    return date;
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-fitness-primary-600" />
                <h2 className="text-lg font-semibold">
                  Week of {format(weekStartDate, 'MMM d, yyyy')}
                </h2>
              </div>
              <Badge variant="outline" className="text-xs">
                Credits: {credits.remaining}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-sm text-gray-600 px-2">
                {currentWeekOffset === 0 ? 'This Week' : 
                 currentWeekOffset > 0 ? `+${currentWeekOffset} week${currentWeekOffset > 1 ? 's' : ''}` :
                 `${currentWeekOffset} week${currentWeekOffset < -1 ? 's' : ''}`}
              </span>
              
              <Button
                onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                variant="outline"
                size="sm"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              {hasWeeklyPlan && (
                <Button
                  onClick={onRefresh}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
              
              <Button
                onClick={onGenerateAI}
                className="bg-gradient-to-r from-fitness-primary-500 to-fitness-accent-500 hover:from-fitness-primary-600 hover:to-fitness-accent-600"
                size="sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Generate
              </Button>
            </div>
          </div>

          {/* Day Selector */}
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5, 6, 7].map((dayNumber) => (
              <Button
                key={dayNumber}
                onClick={() => setSelectedDayNumber(dayNumber)}
                variant={selectedDayNumber === dayNumber ? "default" : "outline"}
                size="sm"
                className="flex flex-col h-auto py-2 px-3 min-w-[60px]"
              >
                <span className="text-xs font-medium">{getDayName(dayNumber)}</span>
                <span className="text-xs opacity-75">
                  {format(getDateForDay(dayNumber), 'd')}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
