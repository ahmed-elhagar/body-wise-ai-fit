
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, ChevronLeft, ChevronRight, AlertCircle, TrendingUp, Activity, Search, Filter } from "lucide-react";
import { useFoodConsumption } from "@/hooks/useFoodConsumption";
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isValid, parseISO, isSameDay } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NutritionHeatMap from "./components/NutritionHeatMap";

const HistoryTab = () => {
  const { t, isRTL } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [mealTypeFilter, setMealTypeFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const { useHistoryData } = useFoodConsumption();
  const { data: historyData = [], isLoading, error } = useHistoryData(monthStart, monthEnd);

  // Filter and search functionality with deduplication
  const filteredHistory = useMemo(() => {
    if (!historyData) return [];
    
    // Remove duplicates based on unique identifier
    const uniqueEntries = historyData.filter((entry, index, self) => 
      index === self.findIndex((e) => e.id === entry.id)
    );
    
    return uniqueEntries.filter(entry => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const foodName = entry.food_item?.name?.toLowerCase() || '';
        const notes = entry.notes?.toLowerCase() || '';
        if (!foodName.includes(searchLower) && !notes.includes(searchLower)) {
          return false;
        }
      }
      
      // Meal type filter
      if (mealTypeFilter !== "all" && entry.meal_type !== mealTypeFilter) {
        return false;
      }
      
      // Date filter
      if (selectedDate) {
        const entryDate = parseISO(entry.consumed_at);
        if (!isSameDay(entryDate, selectedDate)) {
          return false;
        }
      }
      
      return true;
    });
  }, [historyData, searchTerm, mealTypeFilter, selectedDate]);

  // Group filtered history by date
  const groupedHistory = useMemo(() => {
    const grouped: { [key: string]: typeof filteredHistory } = {};
    
    filteredHistory.forEach(entry => {
      const date = format(parseISO(entry.consumed_at), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(entry);
    });
    
    // Sort dates descending
    const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
    
    return sortedDates.map(date => ({
      date,
      entries: grouped[date].sort((a, b) => 
        new Date(b.consumed_at).getTime() - new Date(a.consumed_at).getTime()
      )
    }));
  }, [filteredHistory]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
    setSelectedDate(null);
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🍽️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍴';
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lunch': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'dinner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'snack': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="w-full h-64 bg-gray-200 rounded animate-pulse"></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Month Navigation */}
      <Card className="p-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className={`hover:bg-gray-50 ${isRTL ? 'rotate-180' : ''}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <p className="text-sm text-gray-500">Food History</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className={`hover:bg-gray-50 ${isRTL ? 'rotate-180' : ''}`}
            disabled={currentMonth >= new Date()}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Nutrition Calendar Heat Map - Remove duplicate stats */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-600" />
          Nutrition Calendar
        </h3>
        <NutritionHeatMap data={historyData} currentMonth={currentMonth} />
      </Card>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by food name or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={mealTypeFilter} onValueChange={setMealTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by meal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Meals</SelectItem>
              <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
              <SelectItem value="lunch">🍽️ Lunch</SelectItem>
              <SelectItem value="dinner">🌙 Dinner</SelectItem>
              <SelectItem value="snack">🍎 Snacks</SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || mealTypeFilter !== "all" || selectedDate) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setMealTypeFilter("all");
                setSelectedDate(null);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Meal History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Meal History {filteredHistory.length !== historyData.length && (
            <span className="text-sm font-normal text-gray-500">
              ({filteredHistory.length} of {historyData.length} entries)
            </span>
          )}
        </h3>

        {groupedHistory.length > 0 ? (
          <div className="space-y-6">
            {groupedHistory.map(({ date, entries }) => (
              <div key={date} className="border-l-4 border-green-200 pl-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                  <Badge variant="outline" className="text-xs">
                    {entries.length} meals
                  </Badge>
                </h4>
                
                <div className="grid gap-3">
                  {entries.map((entry) => (
                    <Card key={entry.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getMealTypeColor(entry.meal_type)}>
                              {getMealTypeIcon(entry.meal_type)} {entry.meal_type}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {format(parseISO(entry.consumed_at), 'h:mm a')}
                            </span>
                          </div>
                          
                          <h5 className="font-medium text-gray-900 mb-1">
                            {entry.food_item?.name || 'Unknown Food'}
                          </h5>
                          
                          {entry.food_item?.brand && (
                            <p className="text-sm text-gray-600 mb-2">
                              {entry.food_item.brand}
                            </p>
                          )}
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Calories:</span>
                              <span className="font-medium ml-1">{Math.round(entry.calories_consumed)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Protein:</span>
                              <span className="font-medium ml-1">{Math.round(entry.protein_consumed)}g</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Carbs:</span>
                              <span className="font-medium ml-1">{Math.round(entry.carbs_consumed)}g</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Fat:</span>
                              <span className="font-medium ml-1">{Math.round(entry.fat_consumed)}g</span>
                            </div>
                          </div>
                          
                          {entry.notes && (
                            <p className="text-sm text-gray-600 mt-2 italic">
                              "{entry.notes}"
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Quantity</div>
                          <div className="font-medium">{entry.quantity_g}g</div>
                          {entry.source && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {entry.source}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || mealTypeFilter !== "all" ? "No matching meals found" : "No meals logged"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || mealTypeFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "Start logging your meals to see your food history here"
              }
            </p>
            {(searchTerm || mealTypeFilter !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setMealTypeFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default HistoryTab;
