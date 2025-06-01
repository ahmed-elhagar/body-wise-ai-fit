import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/useI18n";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useFoodConsumption } from "@/hooks/useFoodConsumption";
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import NutritionHeatMap from "./components/NutritionHeatMap";

const HistoryTab = () => {
  const { t, isRTL } = useI18n();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const { useHistoryData } = useFoodConsumption();
  const { data: historyData = [], isLoading } = useHistoryData(monthStart, monthEnd);

  const monthlyStats = useMemo(() => {
    const totalCalories = historyData.reduce((sum, entry) => sum + (entry.calories_consumed || 0), 0);
    const totalProtein = historyData.reduce((sum, entry) => sum + (entry.protein_consumed || 0), 0);
    const totalCarbs = historyData.reduce((sum, entry) => sum + (entry.carbs_consumed || 0), 0);
    const totalFat = historyData.reduce((sum, entry) => sum + (entry.fat_consumed || 0), 0);
    
    const uniqueDays = new Set(historyData.map(entry => 
      format(new Date(entry.consumed_at), 'yyyy-MM-dd')
    )).size;

    return {
      totalCalories: Math.round(totalCalories),
      avgCalories: uniqueDays > 0 ? Math.round(totalCalories / uniqueDays) : 0,
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFat: Math.round(totalFat),
      daysLogged: uniqueDays,
      totalEntries: historyData.length
    };
  }, [historyData]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <Card className="p-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className={isRTL ? 'rotate-180' : ''}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className={isRTL ? 'rotate-180' : ''}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Monthly Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{monthlyStats.daysLogged}</div>
          <div className="text-sm text-gray-600">{t('days with logged food this month')}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{monthlyStats.avgCalories}</div>
          <div className="text-sm text-gray-600">Avg {t('Calories')}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{monthlyStats.totalProtein}g</div>
          <div className="text-sm text-gray-600">Total {t('Protein')}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{monthlyStats.totalEntries}</div>
          <div className="text-sm text-gray-600">Total {t('Meals')}</div>
        </Card>
      </div>

      {/* Nutrition Calendar Heat Map */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-600" />
          {t('Nutrition Calendar')}
        </h3>
        <NutritionHeatMap data={historyData} currentMonth={currentMonth} />
      </Card>

      {/* Summary */}
      {monthlyStats.daysLogged > 0 && (
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {monthlyStats.daysLogged} {t('days with logged food this month')}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {monthlyStats.totalCalories} total calories
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              {monthlyStats.totalProtein}g protein
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HistoryTab;
