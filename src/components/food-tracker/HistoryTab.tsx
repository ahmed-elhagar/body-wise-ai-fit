
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, ChevronLeft, ChevronRight, AlertCircle, Search, Filter, Download } from "lucide-react";
import { useFoodConsumption } from "@/hooks/useFoodConsumption";
import { format, startOfMonth, endOfMonth, addMonths, subMonths, parseISO, isSameDay } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OptimizedNutritionHeatMap from "./components/OptimizedNutritionHeatMap";
import VirtualizedMealHistory from "./components/VirtualizedMealHistory";
import ExportFeatures from "./components/ExportFeatures";
import { toast } from "sonner";

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

  const handleExport = async (config: any) => {
    try {
      toast.success(`Preparing ${config.format.toUpperCase()} export...`);
      
      // Here you would integrate with your export service
      console.log('Export configuration:', config);
      
      // Simulate export process
      setTimeout(() => {
        if (config.emailDelivery) {
          toast.success(`Export sent to ${config.email}`);
        } else {
          toast.success('Export downloaded successfully');
        }
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Export error:', error);
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
      {/* Enhanced Tabs with Export */}
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger 
            value="calendar" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
          >
            History
          </TabsTrigger>
          <TabsTrigger 
            value="export" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          {/* Nutrition Calendar with Inline Month Navigation */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="w-6 h-6 text-green-600" />
                Nutrition Calendar
              </h3>
              
              {/* Month Navigation */}
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className={`h-9 w-9 p-0 hover:bg-gray-50 ${isRTL ? 'rotate-180' : ''}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="text-lg font-medium text-gray-900 min-w-[140px] text-center">
                  {format(currentMonth, 'MMMM yyyy')}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className={`h-9 w-9 p-0 hover:bg-gray-50 ${isRTL ? 'rotate-180' : ''}`}
                  disabled={currentMonth >= new Date()}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <OptimizedNutritionHeatMap data={historyData} currentMonth={currentMonth} />
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-6">
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

            <VirtualizedMealHistory groupedHistory={groupedHistory} />
          </Card>
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <ExportFeatures data={historyData} onExport={handleExport} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HistoryTab;
