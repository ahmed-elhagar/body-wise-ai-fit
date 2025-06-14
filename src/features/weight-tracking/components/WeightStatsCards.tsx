
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Target, TrendingDown, TrendingUp } from "lucide-react";

interface WeightEntry {
  id: string;
  weight: number;
  recorded_at: string;
}

interface WeightStatsCardsProps {
  weightEntries: WeightEntry[];
}

const WeightStatsCards = ({ weightEntries }: WeightStatsCardsProps) => {
  const sortedEntries = [...weightEntries].sort((a, b) => 
    new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );

  const currentWeight = sortedEntries[sortedEntries.length - 1]?.weight;
  const previousWeight = sortedEntries[sortedEntries.length - 2]?.weight;
  const weightChange = currentWeight && previousWeight ? currentWeight - previousWeight : 0;

  const minWeight = sortedEntries.length > 0 ? Math.min(...sortedEntries.map(e => e.weight)) : 0;
  const maxWeight = sortedEntries.length > 0 ? Math.max(...sortedEntries.map(e => e.weight)) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <BarChart className="w-4 h-4" />
            Current Weight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currentWeight ? `${currentWeight} kg` : "No data"}
          </div>
          {weightChange !== 0 && (
            <div className={`flex items-center gap-1 text-sm ${weightChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {weightChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(weightChange).toFixed(1)} kg from last entry
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4" />
            Lowest Weight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {minWeight > 0 ? `${minWeight} kg` : "No data"}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            Highest Weight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {maxWeight > 0 ? `${maxWeight} kg` : "No data"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightStatsCards;
