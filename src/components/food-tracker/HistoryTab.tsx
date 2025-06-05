
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, ChevronLeft, ChevronRight, AlertCircle, TrendingUp, Activity } from "lucide-react";
import { useFoodConsumption } from "@/hooks/useFoodConsumption";
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isValid } from "date-fns";
import NutritionHeatMap from "./components/NutritionHeatMap";

const HistoryTab = () => {
  const { t, isRTL } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const { useHistoryData } = useFoodConsumption();
  const { data: historyData = [], isLoading, error } = useHistoryData(monthStart, monthEnd);

  const monthlyStats = useMemo(() => {
    if (!historyData || historyData.length === 0) {
      return {
        totalCalories: 0,
        avgCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        daysLogged: 0,
        totalEntries: 0,
        validEntries: 0
      };
    }

    // Filter out invalid entries
    const validEntries = historyData.filter(entry => 
      entry && 
      entry.consumed_at && 
      isValid(new Date(entry.consumed_at)) &&
      typeof entry.calories_consumed === 'number' &&
      !isNaN(entry.calories_consumed)
    );

    const totalCalories = validEntries.reduce((sum, entry) => sum + (entry.calories_consumed || 0), 0);
    const totalProtein = validEntries.reduce((sum, entry) => sum + (entry.protein_consumed || 0), 0);
    const totalCarbs = validEntries.reduce((sum, entry) => sum + (entry.carbs_consumed || 0), 0);
    const totalFat = validEntries.reduce((sum, entry) => sum + (entry.fat_consumed || 0), 0);
    
    const uniqueDays = new Set(validEntries.map(entry => {
      try {
        return format(new Date(entry.consumed_at), 'yyyy-MM-dd');
      } catch {
        return null;
      }
    }).filter(Boolean)).size;

    return {
      totalCalories: Math.round(totalCalories),
      avgCalories: uniqueDays > 0 ? Math.round(totalCalories / uniqueDays) : 0,
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFat: Math.round(totalFat),
      daysLogged: uniqueDays,
      totalEntries: validEntries.length,
      validEntries: validEntries.length
    };
  }, [historyData]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load food history data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </Card>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="space-y-2">
                <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <div className="w-full h-64 bg-gray-200 rounded animate-pulse"></div>
        </Card>
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
            disabled={currentMonth >= new Date()}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Monthly Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <Activity className="w-5 h-5 text-green-600 mr-2" />
            <div className="text-2xl font-bold text-green-600">{monthlyStats.daysLogged}</div>
          </div>
          <div className="text-sm text-gray-600">{t('days with logged food this month')}</div>
        </Card>
        
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
            <div className="text-2xl font-bold text-blue-600">{monthlyStats.avgCalories}</div>
          </div>
          <div className="text-sm text-gray-600">Avg {t('Calories')}</div>
        </Card>
        
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-purple-600">{monthlyStats.totalProtein}g</div>
          <div className="text-sm text-gray-600">Total {t('Protein')}</div>
        </Card>
        
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-orange-600">{monthlyStats.totalEntries}</div>
          <div className="text-sm text-gray-600">Total {t('Meals')}</div>
        </Card>
      </div>

      {/* Data Quality Alert */}
      {historyData.length > 0 && monthlyStats.validEntries < historyData.length && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Some entries have incomplete data and were excluded from calculations. 
            ({monthlyStats.validEntries} of {historyData.length} entries processed)
          </AlertDescription>
        </Alert>
      )}

      {/* Nutrition Calendar Heat Map */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-600" />
          {t('Nutrition Calendar')}
        </h3>
        <NutritionHeatMap data={historyData} currentMonth={currentMonth} />
      </Card>

      {/* Summary */}
      {monthlyStats.daysLogged > 0 ? (
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {monthlyStats.daysLogged} {t('days with logged food this month')}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {monthlyStats.totalCalories.toLocaleString()} total calories
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              {monthlyStats.totalProtein}g protein
            </Badge>
            <Badge variant="outline" className="bg-amber-50 text-amber-700">
              {monthlyStats.totalCarbs}g carbs
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700">
              {monthlyStats.totalFat}g fat
            </Badge>
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <div className="text-gray-500 space-y-2">
            <Calendar className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="text-lg font-medium">No food logged this month</h3>
            <p className="text-sm">Start logging your meals to see your nutrition history here.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HistoryTab;
