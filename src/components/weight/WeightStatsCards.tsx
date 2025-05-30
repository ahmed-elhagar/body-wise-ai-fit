
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Scale, Calendar } from "lucide-react";
import { WeightEntry } from "@/hooks/useWeightTracking";
import { useProfile } from "@/hooks/useProfile";

interface WeightStatsCardsProps {
  weightEntries: WeightEntry[];
}

const WeightStatsCards = ({ weightEntries }: WeightStatsCardsProps) => {
  const { profile } = useProfile();

  if (weightEntries.length === 0) {
    return (
      <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
        <Scale className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Weight Data Yet</h3>
        <p className="text-gray-500">Add your first weight entry to see statistics</p>
      </Card>
    );
  }

  const latestEntry = weightEntries[0];
  const oldestEntry = weightEntries[weightEntries.length - 1];
  const totalChange = latestEntry.weight - oldestEntry.weight;

  // Calculate weekly change
  const weekAgoEntry = weightEntries.find(entry => {
    const entryDate = new Date(entry.recorded_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate <= weekAgo;
  });
  const weeklyChange = weekAgoEntry ? latestEntry.weight - weekAgoEntry.weight : 0;

  // Calculate BMI if height is available
  const bmi = profile?.height 
    ? latestEntry.weight / Math.pow(profile.height / 100, 2)
    : null;

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'bg-blue-100 text-blue-700' };
    if (bmi < 25) return { label: 'Normal', color: 'bg-green-100 text-green-700' };
    if (bmi < 30) return { label: 'Overweight', color: 'bg-orange-100 text-orange-700' };
    return { label: 'Obese', color: 'bg-red-100 text-red-700' };
  };

  const avgWeight = weightEntries.reduce((sum, entry) => sum + entry.weight, 0) / weightEntries.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Weight */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Weight</p>
            <p className="text-2xl font-bold text-gray-800">
              {parseFloat(latestEntry.weight.toString()).toFixed(1)} kg
            </p>
            <p className="text-xs text-gray-500">
              {new Date(latestEntry.recorded_at).toLocaleDateString()}
            </p>
          </div>
          <Scale className="w-8 h-8 text-blue-600" />
        </div>
      </Card>

      {/* Weekly Change */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">7-Day Change</p>
            <p className={`text-2xl font-bold ${weeklyChange > 0 ? 'text-orange-600' : weeklyChange < 0 ? 'text-green-600' : 'text-gray-600'}`}>
              {weeklyChange > 0 ? '+' : ''}{weeklyChange.toFixed(1)} kg
            </p>
            <p className="text-xs text-gray-500">Since last week</p>
          </div>
          {weeklyChange > 0 ? (
            <TrendingUp className="w-8 h-8 text-orange-600" />
          ) : weeklyChange < 0 ? (
            <TrendingDown className="w-8 h-8 text-green-600" />
          ) : (
            <Target className="w-8 h-8 text-gray-600" />
          )}
        </div>
      </Card>

      {/* BMI */}
      {bmi && (
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">BMI</p>
              <p className="text-2xl font-bold text-gray-800">
                {bmi.toFixed(1)}
              </p>
              <Badge className={`mt-1 text-xs ${getBMICategory(bmi).color}`}>
                {getBMICategory(bmi).label}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Total Progress */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Change</p>
            <p className={`text-2xl font-bold ${totalChange > 0 ? 'text-orange-600' : totalChange < 0 ? 'text-green-600' : 'text-gray-600'}`}>
              {totalChange > 0 ? '+' : ''}{totalChange.toFixed(1)} kg
            </p>
            <p className="text-xs text-gray-500">
              {weightEntries.length} entries
            </p>
          </div>
          <Calendar className="w-8 h-8 text-purple-600" />
        </div>
      </Card>
    </div>
  );
};

export default WeightStatsCards;
