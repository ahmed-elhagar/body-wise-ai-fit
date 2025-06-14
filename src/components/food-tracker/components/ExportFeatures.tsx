
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Download, FileText, Image, Mail, Calendar, Database, BarChart3 } from "lucide-react";
import { format, subDays, subMonths } from "date-fns";
import { DateRange } from "react-day-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface ExportFeaturesProps {
  data: any[];
  onExport: (config: ExportConfig) => void;
}

interface ExportConfig {
  format: 'pdf' | 'csv' | 'excel' | 'image';
  dateRange: DateRange | undefined;
  includeNutrition: boolean;
  includeMeals: boolean;
  includeStats: boolean;
  includeCharts: boolean;
  emailDelivery: boolean;
  email?: string;
}

const ExportFeatures = ({ data, onExport }: ExportFeaturesProps) => {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'csv',
    dateRange: {
      from: subDays(new Date(), 30),
      to: new Date()
    },
    includeNutrition: true,
    includeMeals: true,
    includeStats: true,
    includeCharts: false,
    emailDelivery: false
  });

  const [isExporting, setIsExporting] = useState(false);

  const quickDateRanges = [
    { label: 'Last 7 days', value: 'week', range: { from: subDays(new Date(), 7), to: new Date() } },
    { label: 'Last 30 days', value: 'month', range: { from: subDays(new Date(), 30), to: new Date() } },
    { label: 'Last 3 months', value: '3months', range: { from: subMonths(new Date(), 3), to: new Date() } },
    { label: 'This year', value: 'year', range: { from: new Date(new Date().getFullYear(), 0, 1), to: new Date() } }
  ];

  const handleQuickDateSelect = (value: string) => {
    const range = quickDateRanges.find(r => r.value === value)?.range;
    if (range) {
      setExportConfig(prev => ({ ...prev, dateRange: range }));
    }
  };

  const handleExport = async () => {
    if (!exportConfig.dateRange?.from) {
      return;
    }

    setIsExporting(true);
    try {
      await onExport(exportConfig);
    } finally {
      setIsExporting(false);
    }
  };

  const getExportIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'csv': return <Database className="w-4 h-4" />;
      case 'excel': return <BarChart3 className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      default: return <Download className="w-4 h-4" />;
    }
  };

  const getFormatDescription = (format: string) => {
    switch (format) {
      case 'pdf': return 'Formatted report with charts and summaries';
      case 'csv': return 'Raw data for spreadsheet analysis';
      case 'excel': return 'Excel workbook with multiple sheets';
      case 'image': return 'Visual summary infographic';
      default: return '';
    }
  };

  const filteredDataCount = data.filter(entry => {
    if (!exportConfig.dateRange?.from || !exportConfig.dateRange?.to) return true;
    const entryDate = new Date(entry.consumed_at);
    return entryDate >= exportConfig.dateRange.from && entryDate <= exportConfig.dateRange.to;
  }).length;

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Export Your Nutrition Data</h3>
        <p className="text-sm text-gray-600">Choose your export format and customize what data to include</p>
      </div>

      {/* Export Format Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Export Format
        </label>
        <Select
          value={exportConfig.format}
          onValueChange={(value: any) => setExportConfig(prev => ({ ...prev, format: value }))}
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              {getExportIcon(exportConfig.format)}
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <div>
                  <div className="font-medium">CSV Data</div>
                  <div className="text-xs text-gray-500">Raw data for analysis</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="pdf">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <div>
                  <div className="font-medium">PDF Report</div>
                  <div className="text-xs text-gray-500">Formatted document</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="excel">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <div>
                  <div className="font-medium">Excel Workbook</div>
                  <div className="text-xs text-gray-500">Multi-sheet analysis</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="image">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                <div>
                  <div className="font-medium">Visual Summary</div>
                  <div className="text-xs text-gray-500">Infographic image</div>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        
        {/* Format Description */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">{getFormatDescription(exportConfig.format)}</p>
        </div>
      </div>

      {/* Date Range Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Date Range
        </label>
        
        {/* Quick Date Range Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {quickDateRanges.map((range) => (
            <Button
              key={range.value}
              variant="outline"
              size="sm"
              onClick={() => handleQuickDateSelect(range.value)}
              className="text-xs justify-start"
            >
              {range.label}
            </Button>
          ))}
        </div>

        {/* Custom Date Range Picker */}
        <DatePickerWithRange
          date={exportConfig.dateRange}
          onDateChange={(range) => setExportConfig(prev => ({ ...prev, dateRange: range }))}
        />

        {/* Data Count Preview */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {filteredDataCount} entries in selected range
          </Badge>
        </div>
      </div>

      {/* Data Inclusion Options */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700">What to Include</label>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox
              id="nutrition"
              checked={exportConfig.includeNutrition}
              onCheckedChange={(checked) => 
                setExportConfig(prev => ({ ...prev, includeNutrition: checked as boolean }))
              }
            />
            <div className="flex-1">
              <label htmlFor="nutrition" className="text-sm font-medium cursor-pointer">
                Nutrition Details
              </label>
              <p className="text-xs text-gray-500">Calories, protein, carbs, fat breakdown</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox
              id="meals"
              checked={exportConfig.includeMeals}
              onCheckedChange={(checked) => 
                setExportConfig(prev => ({ ...prev, includeMeals: checked as boolean }))
              }
            />
            <div className="flex-1">
              <label htmlFor="meals" className="text-sm font-medium cursor-pointer">
                Meal Details
              </label>
              <p className="text-xs text-gray-500">Food names, meal types, quantities, notes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox
              id="stats"
              checked={exportConfig.includeStats}
              onCheckedChange={(checked) => 
                setExportConfig(prev => ({ ...prev, includeStats: checked as boolean }))
              }
            />
            <div className="flex-1">
              <label htmlFor="stats" className="text-sm font-medium cursor-pointer">
                Summary Statistics
              </label>
              <p className="text-xs text-gray-500">Daily averages, trends, goals progress</p>
            </div>
          </div>
          
          {(exportConfig.format === 'pdf' || exportConfig.format === 'excel') && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox
                id="charts"
                checked={exportConfig.includeCharts}
                onCheckedChange={(checked) => 
                  setExportConfig(prev => ({ ...prev, includeCharts: checked as boolean }))
                }
              />
              <div className="flex-1">
                <label htmlFor="charts" className="text-sm font-medium cursor-pointer">
                  Charts & Graphs
                </label>
                <p className="text-xs text-gray-500">Visual representations of your data</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Delivery Option */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Checkbox
            id="email"
            checked={exportConfig.emailDelivery}
            onCheckedChange={(checked) => 
              setExportConfig(prev => ({ ...prev, emailDelivery: checked as boolean }))
            }
          />
          <div className="flex-1">
            <label htmlFor="email" className="text-sm font-medium cursor-pointer flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Delivery
            </label>
            <p className="text-xs text-gray-500">Send the export directly to your email</p>
          </div>
        </div>
        
        {exportConfig.emailDelivery && (
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={exportConfig.email || ''}
            onChange={(e) => setExportConfig(prev => ({ ...prev, email: e.target.value }))}
            className="w-full"
          />
        )}
      </div>

      {/* Export Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Export Summary
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Format:</span>
            <Badge variant="outline" className="bg-white">
              {exportConfig.format.toUpperCase()}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Period:</span>
            <span className="text-blue-900 font-medium">
              {exportConfig.dateRange?.from ? format(exportConfig.dateRange.from, 'MMM dd') : 'Not selected'} 
              {exportConfig.dateRange?.to && ` - ${format(exportConfig.dateRange.to, 'MMM dd, yyyy')}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Data entries:</span>
            <span className="text-blue-900 font-medium">{filteredDataCount} records</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Delivery:</span>
            <span className="text-blue-900 font-medium">
              {exportConfig.emailDelivery ? 'Email' : 'Download'}
            </span>
          </div>
        </div>
      </div>

      {/* Validation Warning */}
      {(!exportConfig.dateRange?.from || filteredDataCount === 0) && (
        <Alert>
          <AlertDescription>
            {!exportConfig.dateRange?.from 
              ? "Please select a date range to continue."
              : "No data found in the selected date range."}
          </AlertDescription>
        </Alert>
      )}

      {/* Export Button */}
      <Button
        onClick={handleExport}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
        disabled={!exportConfig.dateRange?.from || filteredDataCount === 0 || isExporting}
        size="lg"
      >
        {isExporting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Generating Export...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {exportConfig.emailDelivery ? (
              <>
                <Mail className="w-4 h-4" />
                Send Export via Email
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Export
              </>
            )}
          </div>
        )}
      </Button>
    </div>
  );
};

export default ExportFeatures;
