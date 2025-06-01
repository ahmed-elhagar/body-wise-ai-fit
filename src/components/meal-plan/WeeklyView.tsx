import { format, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Activity } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface WeeklyViewProps {
  weekStartDate: Date;
  currentWeekPlan: any;
  onSelectDay: (dayNumber: number) => void;
  onSwitchToDaily: () => void;
}

const WeeklyView = ({
  weekStartDate,
  currentWeekPlan,
  onSelectDay,
  onSwitchToDaily
}: WeeklyViewProps) => {
  const { t, isRTL } = useI18n();

  const weekDays = [
    { number: 1, name: t('mealPlan.saturday'), date: weekStartDate },
    { number: 2, name: t('mealPlan.sunday'), date: addDays(weekStartDate, 1) },
    { number: 3, name: t('mealPlan.monday'), date: addDays(weekStartDate, 2) },
    { number: 4, name: t('mealPlan.tuesday'), date: addDays(weekStartDate, 3) },
    { number: 5, name: t('mealPlan.wednesday'), date: addDays(weekStartDate, 4) },
    { number: 6, name: t('mealPlan.thursday'), date: addDays(weekStartDate, 5) },
    { number: 7, name: t('mealPlan.friday'), date: addDays(weekStartDate, 6) }
  ];

  const calculateDayStats = (dayMeals: any[]) => {
    return dayMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <Eye className="w-6 h-6 text-blue-600" />
          {t('mealPlan.weeklyView')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {weekDays.map((day) => {
            const dayMeals = currentWeekPlan?.dailyMeals?.filter(
              (meal: any) => meal.day_number === day.number
            ) || [];
            const dayStats = calculateDayStats(dayMeals);

            return (
              <Card 
                key={day.number} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white rounded-lg group"
                onClick={() => {
                  onSelectDay(day.number);
                  onSwitchToDaily();
                }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">{day.name}</CardTitle>
                  <p className="text-sm text-gray-500">{format(day.date, 'MMM d')}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-gray-600">{t('mealPlan.meals')}:</span>
                      <span className="font-semibold text-purple-600">{dayMeals.length}</span>
                    </div>
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-gray-600">{t('mealPlan.cal')}:</span>
                      <span className="font-semibold text-red-600">{dayStats.calories}</span>
                    </div>
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-gray-600">{t('mealPlan.protein')}:</span>
                      <span className="font-semibold text-blue-600">{dayStats.protein.toFixed(1)}g</span>
                    </div>
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-gray-600">{t('mealPlan.carbs')}:</span>
                      <span className="font-semibold text-green-600">{dayStats.carbs.toFixed(1)}g</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-blue-600 hover:bg-blue-50 group-hover:bg-blue-100"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      {t('mealPlan.selectDay')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyView;
