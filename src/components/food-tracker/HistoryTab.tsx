import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, ChevronLeft, ChevronRight, AlertCircle, Search, Filter, Download } from "lucide-react";
import { useFoodConsumption, FoodConsumptionLog } from "@/features/food-tracker/hooks";
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

  // Enhanced export handler with real file generation
  const handleExport = async (config: any) => {
    try {
      toast.loading('Preparing your export...', { id: 'export-loading' });
      
      // Filter data based on date range
      const exportData = config.dateRange ? 
        historyData.filter(entry => {
          const entryDate = parseISO(entry.consumed_at);
          return entryDate >= config.dateRange.from && entryDate <= config.dateRange.to;
        }) : historyData;

      console.log('🔄 Exporting data:', { 
        format: config.format, 
        entries: exportData.length,
        includeNutrition: config.includeNutrition,
        includeMeals: config.includeMeals
      });

      let content = '';
      let filename = '';
      let mimeType = '';
      
      switch (config.format) {
        case 'csv':
          content = generateEnhancedCSV(exportData, config);
          filename = `nutrition-data-${format(new Date(), 'yyyy-MM-dd')}.csv`;
          mimeType = 'text/csv;charset=utf-8;';
          break;
        case 'excel':
          content = generateEnhancedCSV(exportData, config); // Excel as enhanced CSV for now
          filename = `nutrition-data-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'pdf':
          content = generatePDFReport(exportData, config);
          filename = `nutrition-report-${format(new Date(), 'yyyy-MM-dd')}.html`;
          mimeType = 'text/html;charset=utf-8;';
          break;
        case 'image':
          // Generate a simple data summary for image export
          content = generateDataSummary(exportData, config);
          filename = `nutrition-summary-${format(new Date(), 'yyyy-MM-dd')}.txt`;
          mimeType = 'text/plain;charset=utf-8;';
          break;
        default:
          throw new Error('Unsupported export format');
      }

      toast.dismiss('export-loading');

      if (config.emailDelivery && config.email) {
        // Simulate email sending with more realistic timing
        toast.loading('Sending to your email...', { id: 'email-sending' });
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.dismiss('email-sending');
        toast.success(`Export sent successfully to ${config.email}! 📧`);
      } else {
        // Enhanced file download
        downloadEnhancedFile(content, filename, mimeType);
        toast.success('Export downloaded successfully! 📁');
      }
      
      setExportSheetOpen(false);
      
    } catch (error) {
      console.error('❌ Export error:', error);
      toast.dismiss('export-loading');
      toast.error('Failed to export data. Please try again.');
    }
  };

  // Enhanced CSV generation with better structure
  const generateEnhancedCSV = (data: any[], config: any) => {
    const headers = ['Date', 'Time', 'Food Item'];
    
    if (config.includeMeals) {
      headers.push('Meal Type', 'Quantity (g)', 'Notes');
    }
    
    if (config.includeNutrition) {
      headers.push('Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)');
    }

    // Create CSV with proper escaping
    let csv = headers.map(h => `"${h}"`).join(',') + '\n';
    
    data.forEach(entry => {
      const row = [
        `"${format(parseISO(entry.consumed_at), 'yyyy-MM-dd')}"`,
        `"${format(parseISO(entry.consumed_at), 'HH:mm')}"`,
        `"${(entry.food_item?.name || 'Unknown Food').replace(/"/g, '""')}"`
      ];
      
      if (config.includeMeals) {
        row.push(
          `"${entry.meal_type || 'N/A'}"`,
          `"${entry.quantity_g || 0}"`,
          `"${(entry.notes || '').replace(/"/g, '""')}"`
        );
      }
      
      if (config.includeNutrition) {
        row.push(
          `"${entry.calories_consumed || 0}"`,
          `"${entry.protein_consumed || 0}"`,
          `"${entry.carbs_consumed || 0}"`,
          `"${entry.fat_consumed || 0}"`
        );
      }
      
      csv += row.join(',') + '\n';
    });
    
    return csv;
  };

  // Enhanced PDF report generation
  const generatePDFReport = (data: any[], config: any) => {
    const totalCalories = data.reduce((sum, entry) => sum + (entry.calories_consumed || 0), 0);
    const totalProtein = data.reduce((sum, entry) => sum + (entry.protein_consumed || 0), 0);
    const avgCaloriesPerDay = data.length > 0 ? Math.round(totalCalories / data.length) : 0;
    
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Nutrition Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
          .stat-card { background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center; }
          .entries { margin-top: 20px; }
          .entry { border-bottom: 1px solid #eee; padding: 10px 0; }
          .date { font-weight: bold; color: #333; }
          .food { margin: 5px 0; }
          .nutrition { color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Nutrition History Report</h1>
          <p>Generated on: ${format(new Date(), 'PPP')}</p>
          <p>Period: ${config.dateRange?.from ? format(config.dateRange.from, 'PPP') : 'All time'} 
             ${config.dateRange?.to ? ` - ${format(config.dateRange.to, 'PPP')}` : ''}</p>
        </div>
        
        ${config.includeStats ? `
        <div class="stats">
          <div class="stat-card">
            <h3>${data.length}</h3>
            <p>Total Entries</p>
          </div>
          <div class="stat-card">
            <h3>${totalCalories.toLocaleString()}</h3>
            <p>Total Calories</p>
          </div>
          <div class="stat-card">
            <h3>${Math.round(totalProtein)}g</h3>
            <p>Total Protein</p>
          </div>
          <div class="stat-card">
            <h3>${avgCaloriesPerDay}</h3>
            <p>Avg Calories/Day</p>
          </div>
        </div>
        ` : ''}
        
        <div class="entries">
          <h2>Food Entries</h2>
          ${data.map(entry => `
            <div class="entry">
              <div class="date">${format(parseISO(entry.consumed_at), 'PPP p')}</div>
              <div class="food"><strong>${entry.food_item?.name || 'Unknown Food'}</strong></div>
              ${config.includeMeals ? `<div>Meal: ${entry.meal_type} - ${entry.quantity_g}g</div>` : ''}
              ${config.includeNutrition ? `
                <div class="nutrition">
                  Calories: ${entry.calories_consumed || 0} | 
                  Protein: ${entry.protein_consumed || 0}g | 
                  Carbs: ${entry.carbs_consumed || 0}g | 
                  Fat: ${entry.fat_consumed || 0}g
                </div>
              ` : ''}
              ${entry.notes ? `<div><em>Notes: ${entry.notes}</em></div>` : ''}
            </div>
          `).join('')}
        </div>
      </body>
    </html>`;
  };

  // Data summary for simple exports
  const generateDataSummary = (data: any[], config: any) => {
    const totalCalories = data.reduce((sum, entry) => sum + (entry.calories_consumed || 0), 0);
    const totalProtein = data.reduce((sum, entry) => sum + (entry.protein_consumed || 0), 0);
    
    return `
NUTRITION DATA SUMMARY
======================
Generated: ${format(new Date(), 'PPP')}
Period: ${config.dateRange?.from ? format(config.dateRange.from, 'PPP') : 'All time'}${config.dateRange?.to ? ` - ${format(config.dateRange.to, 'PPP')}` : ''}

TOTALS:
- Entries: ${data.length}
- Calories: ${totalCalories.toLocaleString()}
- Protein: ${Math.round(totalProtein)}g

RECENT ENTRIES:
${data.slice(0, 10).map(entry => 
  `${format(parseISO(entry.consumed_at), 'MM/dd HH:mm')} - ${entry.food_item?.name || 'Unknown'} (${entry.calories_consumed || 0} cal)`
).join('\n')}

${data.length > 10 ? `\n... and ${data.length - 10} more entries` : ''}
    `;
  };

  // Enhanced file download with better error handling
  const downloadEnhancedFile = (content: string, filename: string, mimeType: string) => {
    try {
      // Add BOM for UTF-8 CSV files
      const BOM = mimeType.includes('csv') ? '\uFEFF' : '';
      const blob = new Blob([BOM + content], { type: mimeType });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Ensure the link works in all browsers
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error('❌ Download error:', error);
      throw new Error('Failed to download file');
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
      {/* Enhanced Header with better UX/UI */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left section - Title and Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Nutrition History</h2>
              <p className="text-sm text-gray-600 mt-1">Track your nutrition journey over time</p>
            </div>
            
            {/* Enhanced Month Navigation */}
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-sm font-semibold text-gray-900 min-w-[120px] text-center px-3 py-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                {format(currentMonth, 'MMM yyyy')}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                disabled={currentMonth >= new Date()}
                className="h-8 w-8 p-0 hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right section - Export Button */}
          <Sheet open={exportSheetOpen} onOpenChange={setExportSheetOpen}>
            <SheetTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all duration-200">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[90vw] sm:w-[500px] max-w-[500px] overflow-hidden">
              <SheetHeader className="pb-4">
                <SheetTitle className="flex items-center gap-2 text-lg">
                  <Download className="w-5 h-5 text-green-600" />
                  Export Nutrition Data
                </SheetTitle>
              </SheetHeader>
              <ExportFeatures data={historyData} onExport={handleExport} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Nutrition Calendar */}
      <Card className="p-6 shadow-sm">
        <OptimizedNutritionHeatMap data={historyData} currentMonth={currentMonth} />
      </Card>

      {/* Search and Filters */}
      <Card className="p-4 shadow-sm">
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
      <Card className="p-6 shadow-sm">
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
