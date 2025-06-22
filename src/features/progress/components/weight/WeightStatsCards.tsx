
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Scale } from "lucide-react";
import { useWeightTracking } from "@/features/dashboard/hooks/useWeightTracking";

const WeightStatsCards = () => {
  const { entries, latestEntry, isLoading } = useWeightTracking();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const calculateWeightChange = () => {
    if (entries.length < 2) return null;
    const current = entries[0].weight;
    const previous = entries[1].weight;
    return current - previous;
  };

  const calculateAverageWeight = () => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, entry) => acc + entry.weight, 0);
    return sum / entries.length;
  };

  const weightChange = calculateWeightChange();
  const averageWeight = calculateAverageWeight();

  const getTrendIcon = () => {
    if (!weightChange) return <Minus className="w-4 h-4 text-gray-500" />;
    if (weightChange > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    return <TrendingDown className="w-4 h-4 text-green-500" />;
  };

  const getTrendColor = () => {
    if (!weightChange) return "text-gray-500";
    if (weightChange > 0) return "text-red-500";
    return "text-green-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
          <Scale className="w-4 h-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestEntry ? `${latestEntry.weight} kg` : 'No data'}
          </div>
          <p className="text-xs text-gray-500">
            {latestEntry ? new Date(latestEntry.recorded_at).toLocaleDateString() : ''}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weight Change</CardTitle>
          {getTrendIcon()}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getTrendColor()}`}>
            {weightChange ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg` : 'N/A'}
          </div>
          <p className="text-xs text-gray-500">Since last entry</p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Weight</CardTitle>
          <Scale className="w-4 h-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {averageWeight > 0 ? `${averageWeight.toFixed(1)} kg` : 'No data'}
          </div>
          <p className="text-xs text-gray-500">Last 30 entries</p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          <Scale className="w-4 h-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{entries.length}</div>
          <p className="text-xs text-gray-500">Recorded weights</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightStatsCards;
