
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, TrendingUp } from "lucide-react";
import { useWeightTracking } from "@/features/dashboard/hooks/useWeightTracking";
import WeightProgressChart from "./weight/WeightProgressChart";
import WeightStatsCards from "./weight/WeightStatsCards";

export const WeightProgressSection = () => {
  const { entries, isLoading, error } = useWeightTracking();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-red-600" />
            Weight Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading weight data: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <WeightStatsCards />
      <WeightProgressChart weightEntries={entries} />
    </div>
  );
};
