
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, Image, Mail, Calendar } from "lucide-react";
import { format, subDays, subWeeks, subMonths } from "date-fns";
import { DateRange } from "react-day-picker";

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
    format: 'pdf',
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

  const handleExport = () => {
    onExport(exportConfig);
  };

  const getExportIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'csv': return <FileText className="w-4 h-4" />;
      case 'excel': return <FileText className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      default: return <Download className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-600" />
          Export Nutrition Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Format */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Export Format</label>
          <Select
            value={exportConfig.format}
            onValueChange={(value: any) => setExportConfig(prev => ({ ...prev, format: value }))}
          >
            <SelectTrigger>
              <div className="flex items-center gap-2">
                {getExportIcon(exportConfig.format)}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  PDF Report
                </div>
              </SelectItem>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  CSV Data
                </div>
              </SelectItem>
              <SelectItem value="excel">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Excel Spreadsheet
                </div>
              </SelectItem>
              <SelectItem value="image">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Image Summary
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Date Range</label>
          
          {/* Quick Select */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickDateRanges.map((range) => (
              <Button
                key={range.value}
                variant="outline"
                size="sm"
                onClick={() => handleQuickDateSelect(range.value)}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>

          {/* Custom Date Range */}
          <DatePickerWithRange
            date={exportConfig.dateRange}
            onDateChange={(range) => setExportConfig(prev => ({ ...prev, dateRange: range }))}
          />
        </div>

        {/* Include Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Include in Export</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="nutrition"
                checked={exportConfig.includeNutrition}
                onCheckedChange={(checked) => 
                  setExportConfig(prev => ({ ...prev, includeNutrition: checked as boolean }))
                }
              />
              <label htmlFor="nutrition" className="text-sm">Nutrition Data</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="meals"
                checked={exportConfig.includeMeals}
                onCheckedChange={(checked) => 
                  setExportConfig(prev => ({ ...prev, includeMeals: checked as boolean }))
                }
              />
              <label htmlFor="meals" className="text-sm">Meal History</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="stats"
                checked={exportConfig.includeStats}
                onCheckedChange={(checked) => 
                  setExportConfig(prev => ({ ...prev, includeStats: checked as boolean }))
                }
              />
              <label htmlFor="stats" className="text-sm">Statistics</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="charts"
                checked={exportConfig.includeCharts}
                onCheckedChange={(checked) => 
                  setExportConfig(prev => ({ ...prev, includeCharts: checked as boolean }))
                }
              />
              <label htmlFor="charts" className="text-sm">Charts</label>
            </div>
          </div>
        </div>

        {/* Email Delivery */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="email"
              checked={exportConfig.emailDelivery}
              onCheckedChange={(checked) => 
                setExportConfig(prev => ({ ...prev, emailDelivery: checked as boolean }))
              }
            />
            <label htmlFor="email" className="text-sm font-medium">Email delivery</label>
          </div>
          
          {exportConfig.emailDelivery && (
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={exportConfig.email || ''}
              onChange={(e) => setExportConfig(prev => ({ ...prev, email: e.target.value }))}
            />
          )}
        </div>

        {/* Export Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Export Summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Format: {exportConfig.format.toUpperCase()}</p>
            <p>
              Period: {exportConfig.dateRange?.from ? format(exportConfig.dateRange.from, 'MMM dd, yyyy') : 'Not selected'} 
              {exportConfig.dateRange?.to && ` - ${format(exportConfig.dateRange.to, 'MMM dd, yyyy')}`}
            </p>
            <p>Data entries: {data.length} records</p>
          </div>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!exportConfig.dateRange?.from}
        >
          <Download className="w-4 h-4 mr-2" />
          {exportConfig.emailDelivery ? 'Send Export via Email' : 'Download Export'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportFeatures;
