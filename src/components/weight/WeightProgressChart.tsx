
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
}

interface WeightProgressChartProps {
  weightEntries: WeightEntry[];
}

const WeightProgressChart = ({ weightEntries }: WeightProgressChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Weight Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Weight progress chart coming soon!</p>
      </CardContent>
    </Card>
  );
};

export default WeightProgressChart;
