
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFoodConsumption } from "@/hooks/useFoodConsumption";
import { format, startOfMonth, endOfMonth } from "date-fns";
import NutritionHeatMap from "./components/NutritionHeatMap";

const HistoryTab = () => {
  const { t, isRTL } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const { getConsumptionHistory } = useFoodConsumption();
  
  // Get consumption data for the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const { data: monthlyData, isLoading } = getConsumptionHistory(monthStart, monthEnd);

  // Get consumption data for selected date
  const { data: dayData } = useFoodConsumption(selectedDate);

  // Calculate daily totals for heat map
  const dailyTotals = React.useMemo(() => {
    if (!monthlyData) return new Map();

    const totalsMap = new Map();
    
    monthlyData.forEach(log => {
      const date = format(new Date(log.consumed_at), 'yyyy-MM-dd');
      const existing = totalsMap.get(date) || { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 };
      
      totalsMap.set(date, {
        calories: existing.calories + (log.calories_consumed || 0),
        protein: existing.protein + (log.protein_consumed || 0),
        carbs: existing.carbs + (log.carbs_consumed || 0),
        fat: existing.fat + (log.fat_consumed || 0),
        count: existing.count + 1
      });
    });

    return totalsMap;
  }, [monthlyData]);

  const selectedDayTotals = dayData?.reduce(
    (acc, log) => ({
      calories: acc.calories + (log.calories_consumed || 0),
      protein: acc.protein + (log.protein_consumed || 0),
      carbs: acc.carbs + (log.carbs_consumed || 0),
      fat: acc.fat + (log.fat_consumed || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar and Heat Map */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900">
                {t('Nutrition Calendar')}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-[100px] text-center">
                  {format(currentMonth, 'MMM yyyy')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <NutritionHeatMap
              currentMonth={currentMonth}
              dailyTotals={dailyTotals}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Selected Day Details */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-green-700">
              {format(selectedDate, 'MMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    {Math.round(selectedDayTotals.calories)}
                  </div>
                  <div className="text-xs text-green-600">{t('Calories')}</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">
                    {dayData?.length || 0}
                  </div>
                  <div className="text-xs text-blue-600">{t('Meals')}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('Protein')}</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(selectedDayTotals.protein)}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('Carbs')}</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(selectedDayTotals.carbs)}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('Fat')}</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(selectedDayTotals.fat)}g
                  </span>
                </div>
              </div>

              {dayData && dayData.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">{t('Meals')}</h4>
                  <div className="space-y-2">
                    {dayData.map((log) => (
                      <div key={log.id} className="text-sm">
                        <div className="font-medium text-gray-900">
                          {log.food_item?.name}
                        </div>
                        <div className="text-gray-500">
                          {log.quantity_g}g • {Math.round(log.calories_consumed || 0)} cal
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoryTab;
