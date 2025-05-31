
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { chartConfig } from "./interactive-chart/ChartConfig";
import ChartTypeSelector from "./interactive-chart/ChartTypeSelector";
import ChartRenderer from "./interactive-chart/ChartRenderer";
import ChartLegend from "./interactive-chart/ChartLegend";

const InteractiveProgressChart = () => {
  const [activeChart, setActiveChart] = useState<'weight' | 'calories' | 'workouts'>('weight');

  const currentConfig = chartConfig[activeChart];

  return (
    <Card className="p-3 sm:p-6 bg-white/95 backdrop-blur-sm border-0 shadow-lg h-full">
      <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <currentConfig.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">{currentConfig.title}</h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            Last 7 days
          </Badge>
        </div>

        <ChartTypeSelector 
          activeChart={activeChart} 
          onChartChange={setActiveChart} 
        />
      </div>

      <ChartRenderer 
        activeChart={activeChart}
        data={currentConfig.data}
        color={currentConfig.color}
      />

      <ChartLegend activeChart={activeChart} />
    </Card>
  );
};

export default InteractiveProgressChart;
