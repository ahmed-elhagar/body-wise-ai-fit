
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeekDay {
  dayNumber: number;
  dayName: string;
  workout: any;
  isRestDay: boolean;
  isCompleted: boolean;
  isToday: boolean;
}

interface OptimizedExerciseWeekViewProps {
  weekStructure: WeekDay[];
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

export const OptimizedExerciseWeekView = ({ 
  weekStructure, 
  selectedDay, 
  onDaySelect 
}: OptimizedExerciseWeekViewProps) => {
  const { t } = useLanguage();

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold">{t('Week Overview')}</h3>
      </div>
      
      <div className="space-y-2">
        {weekStructure.map((day) => (
          <Button
            key={day.dayNumber}
            variant={selectedDay === day.dayNumber ? "default" : "outline"}
            className={`w-full justify-start p-3 h-auto ${
              day.isToday ? 'ring-2 ring-blue-200' : ''
            }`}
            onClick={() => onDaySelect(day.dayNumber)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="text-left">
                <div className="font-medium">{day.dayName}</div>
                <div className="text-xs text-gray-500">
                  {day.isRestDay ? 'Rest Day' : `${day.workout?.exercises?.length || 0} exercises`}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {day.isToday && (
                  <Badge variant="secondary" className="text-xs">Today</Badge>
                )}
                
                {day.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : day.isRestDay ? (
                  <Clock className="w-4 h-4 text-gray-400" />
                ) : (
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                )}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default OptimizedExerciseWeekView;
