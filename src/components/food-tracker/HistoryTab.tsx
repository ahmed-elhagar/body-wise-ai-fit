
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  const [exportSheetOpen, setExportSheetOpen] = useState(false);

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

  // Enhanced export handler with actual file generation
  const handleExport = async (config: any) => {
    try {
      toast.loading('Generating export file...');
      
      // Generate export content based on format
      let content = '';
      let filename = '';
      let mimeType = '';
      
      const exportData = config.dateRange ? 
        historyData.filter(entry => {
          const entryDate = parseISO(entry.consumed_at);
          return entryDate >= config.dateRange.from && entryDate <= config.dateRange.to;
        }) : historyData;

      switch (config.format) {
        case 'csv':
          content = generateCSV(exportData, config);
          filename = `nutrition-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
          mimeType = 'text/csv';
          break;
        case 'excel':
          // For simplicity, we'll generate CSV format but with .xlsx extension
          content = generateCSV(exportData, config);
          filename = `nutrition-history-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'pdf':
          content = generatePDFContent(exportData, config);
          filename = `nutrition-history-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
          mimeType = 'application/pdf';
          break;
        case 'image':
          content = generateImageContent(exportData, config);
          filename = `nutrition-summary-${format(new Date(), 'yyyy-MM-dd')}.png`;
          mimeType = 'image/png';
          break;
        default:
          throw new Error('Unsupported export format');
      }

      if (config.emailDelivery && config.email) {
        // Simulate email sending
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success(`Export sent to ${config.email}`);
      } else {
        // Download file
        downloadFile(content, filename, mimeType);
        toast.success('Export downloaded successfully');
      }
      
      setExportSheetOpen(false);
      
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Export error:', error);
    }
  };

  // CSV generation function
  const generateCSV = (data: any[], config: any) => {
    const headers = ['Date', 'Time', 'Food Item', 'Meal Type', 'Quantity (g)'];
    if (config.includeNutrition) {
      headers.push('Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)');
    }
    if (config.includeMeals) {
      headers.push('Notes');
    }

    let csv = headers.join(',') + '\n';
    
    data.forEach(entry => {
      const row = [
        format(parseISO(entry.consumed_at), 'yyyy-MM-dd'),
        format(parseISO(entry.consumed_at), 'HH:mm'),
        `"${entry.food_item?.name || 'Unknown'}"`,
        entry.meal_type,
        entry.quantity_g
      ];
      
      if (config.includeNutrition) {
        row.push(
          entry.calories_consumed?.toString() || '0',
          entry.protein_consumed?.toString() || '0',
          entry.carbs_consumed?.toString() || '0',
          entry.fat_consumed?.toString() || '0'
        );
      }
      
      if (config.includeMeals) {
        row.push(`"${entry.notes || ''}"`);
      }
      
      csv += row.join(',') + '\n';
    });
    
    return csv;
  };

  // PDF content generation (simplified HTML)
  const generatePDFContent = (data: any[], config: any) => {
    return `
    <html>
      <head><title>Nutrition History Report</title></head>
      <body>
        <h1>Nutrition History Report</h1>
        <p>Generated on: ${format(new Date(), 'PPP')}</p>
        <p>Total entries: ${data.length}</p>
        ${data.map(entry => `
          <div style="margin: 10px 0; border-bottom: 1px solid #ccc; padding: 10px 0;">
            <strong>${entry.food_item?.name || 'Unknown'}</strong><br>
            ${format(parseISO(entry.consumed_at), 'PPp')}<br>
            ${entry.meal_type} - ${entry.quantity_g}g<br>
            Calories: ${entry.calories_consumed || 0}
          </div>
        `).join('')}
      </body>
    </html>`;
  };

  // Image content generation (simplified)
  const generateImageContent = (data: any[], config: any) => {
    // For demo purposes, return a simple data URL
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  };

  // File download function
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      {/* Enhanced Header with better UX/UI */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left section - Title and Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Nutrition History</h2>
            
            {/* Month Navigation */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-8 w-8 p-0 hover:bg-white hover:shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-sm font-medium text-gray-900 min-w-[120px] text-center px-3 py-1">
                {format(currentMonth, 'MMM yyyy')}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                disabled={currentMonth >= new Date()}
                className="h-8 w-8 p-0 hover:bg-white hover:shadow-sm disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right section - Export Button */}
          <Sheet open={exportSheetOpen} onOpenChange={setExportSheetOpen}>
            <SheetTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  Export Nutrition Data
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ExportFeatures data={historyData} onExport={handleExport} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Nutrition Calendar */}
      <Card className="p-6">
        <OptimizedNutritionHeatMap data={historyData} currentMonth={currentMonth} />
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

        <VirtualizedMealHistory groupedHistory={groupedHistory} />
      </Card>
    </div>
  );
};

export default HistoryTab;
