
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Calendar as CalendarIcon, 
  History, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Utensils,
  Clock
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFoodConsumption, FoodConsumptionLog } from "@/features/food-tracker/hooks";
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isSameDay } from "date-fns";

const HistoryTab = () => {
  const { t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const { data: historyData, isLoading } = useFoodConsumption().useHistoryData(monthStart, monthEnd);

  // Filter data for selected date
  const selectedDateData = selectedDate 
    ? (historyData || []).filter(entry => 
        isSameDay(new Date(entry.consumed_at), selectedDate)
      )
    : [];

  // Group by meal type for selected date
  const groupedByMealType = selectedDateData.reduce((acc, entry) => {
    const mealType = entry.meal_type || 'snack';
    if (!acc[mealType]) {
      acc[mealType] = [];
    }
    acc[mealType].push(entry);
    return acc;
  }, {} as Record<string, FoodConsumptionLog[]>);

  // Calculate daily totals
  const dailyTotals = selectedDateData.reduce(
    (acc, entry) => ({
      calories: acc.calories + (entry.calories_consumed || 0),
      protein: acc.protein + (entry.protein_consumed || 0),
      carbs: acc.carbs + (entry.carbs_consumed || 0),
      fat: acc.fat + (entry.fat_consumed || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Get dates with entries for calendar highlighting
  const datesWithEntries = (historyData || []).map(entry => 
    new Date(entry.consumed_at)
  );

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const getMealColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'border-l-orange-500';
      case 'lunch': return 'border-l-yellow-500';
      case 'dinner': return 'border-l-blue-500';
      case 'snack': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <History className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Nutrition History</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Track your eating patterns over time
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                  <CardTitle className="text-base">
                    {format(currentMonth, 'MMMM yyyy')}
                  </CardTitle>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={handlePrevMonth} className="h-7 w-7 p-0">
                    <ChevronLeft className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNextMonth} className="h-7 w-7 p-0">
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="w-full"
                modifiers={{
                  hasEntry: datesWithEntries
                }}
                modifiersStyles={{
                  hasEntry: {
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}
              />
              
              <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-xs text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Days with food entries</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Food Log Details */}
        <div className="lg:col-span-2">
          {selectedDate ? (
            <div className="space-y-4">
              {/* Daily Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Utensils className="w-4 h-4 text-green-600" />
                    {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {selectedDateData.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="text-4xl mb-2">📝</div>
                      <h3 className="font-medium text-gray-800 mb-1">
                        No meals logged
                      </h3>
                      <p className="text-sm text-gray-600">
                        No food entries found for this date
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Daily Nutrition Summary */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="bg-red-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-red-600 font-medium mb-1">Calories</p>
                          <p className="text-lg font-bold text-red-700">{Math.round(dailyTotals.calories)}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-blue-600 font-medium mb-1">Protein</p>
                          <p className="text-lg font-bold text-blue-700">{Math.round(dailyTotals.protein)}g</p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-yellow-600 font-medium mb-1">Carbs</p>
                          <p className="text-lg font-bold text-yellow-700">{Math.round(dailyTotals.carbs)}g</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-green-600 font-medium mb-1">Fat</p>
                          <p className="text-lg font-bold text-green-700">{Math.round(dailyTotals.fat)}g</p>
                        </div>
                      </div>

                      {/* Meals by Type */}
                      <div className="space-y-3">
                        {Object.entries(groupedByMealType).map(([mealType, entries]) => (
                          <Collapsible key={mealType} defaultOpen>
                            <CollapsibleTrigger asChild>
                              <Card className={`cursor-pointer hover:shadow-sm transition-shadow border-l-4 ${getMealColor(mealType)}`}>
                                <CardContent className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">{getMealIcon(mealType)}</span>
                                      <div>
                                        <h3 className="font-medium text-gray-800 capitalize text-sm">
                                          {mealType} ({entries.length} items)
                                        </h3>
                                        <p className="text-xs text-gray-600">
                                          {Math.round(entries.reduce((sum, entry) => sum + (entry.calories_consumed || 0), 0))} calories
                                        </p>
                                      </div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                  </div>
                                </CardContent>
                              </Card>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent className="space-y-2 mt-2 ml-3">
                              {entries.map((entry) => (
                                <Collapsible key={entry.id}>
                                  <CollapsibleTrigger asChild>
                                    <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                                      <CardContent className="p-3">
                                        <div className="flex items-center justify-between">
                                          <div className="flex-1">
                                            <h4 className="font-medium text-gray-800 text-sm">
                                              {entry.food_item?.name || 'Unknown Food'}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                                              <span>{Math.round(entry.calories_consumed || 0)} cal</span>
                                              <span>{entry.quantity_g}g</span>
                                              <span>{format(new Date(entry.consumed_at), 'HH:mm')}</span>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            {entry.source === 'ai_analysis' && (
                                              <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-xs">
                                                AI
                                              </Badge>
                                            )}
                                            <ChevronDown className="w-3 h-3 text-gray-500" />
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </CollapsibleTrigger>
                                  
                                  <CollapsibleContent className="ml-3 mt-2">
                                    <Card className="bg-gray-50">
                                      <CardContent className="p-3">
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                          <div>
                                            <span className="text-gray-500">Protein:</span>
                                            <span className="font-medium ml-1">{Math.round(entry.protein_consumed || 0)}g</span>
                                          </div>
                                          <div>
                                            <span className="text-gray-500">Carbs:</span>
                                            <span className="font-medium ml-1">{Math.round(entry.carbs_consumed || 0)}g</span>
                                          </div>
                                          <div>
                                            <span className="text-gray-500">Fat:</span>
                                            <span className="font-medium ml-1">{Math.round(entry.fat_consumed || 0)}g</span>
                                          </div>
                                        </div>
                                        {entry.notes && (
                                          <div className="mt-2 p-2 bg-white rounded text-xs">
                                            <span className="text-gray-500">Notes:</span>
                                            <p className="text-gray-700 italic mt-1">{entry.notes}</p>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </CollapsibleContent>
                                </Collapsible>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-gray-800 mb-2">
                  Select a Date
                </h3>
                <p className="text-sm text-gray-600">
                  Choose a date from the calendar to view your food entries
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryTab;
