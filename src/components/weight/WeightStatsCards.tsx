
import { Card } from "@/components/ui/card";
import { Scale, Target, TrendingDown, Calendar } from "lucide-react";
import { WeightEntry } from "@/hooks/useWeightTracking";
import { useProfile } from "@/hooks/useProfile";

interface WeightStatsCardsProps {
  weightEntries: WeightEntry[];
}

const WeightStatsCards = ({ weightEntries }: WeightStatsCardsProps) => {
  const { profile } = useProfile();

  const currentWeight = weightEntries.length > 0 ? parseFloat(weightEntries[0].weight.toString()) : 0;
  const startWeight = weightEntries.length > 0 ? parseFloat(weightEntries[weightEntries.length - 1].weight.toString()) : 0;
  const targetWeight = profile?.weight ? parseFloat(profile.weight.toString()) - 5 : 70; // Assuming 5kg loss goal
  
  const totalLoss = startWeight - currentWeight;
  const weightToGo = Math.max(0, currentWeight - targetWeight);
  
  const latestEntry = weightEntries[0];
  const currentBodyFat = latestEntry?.body_fat_percentage ? parseFloat(latestEntry.body_fat_percentage.toString()) : null;
  const currentMuscleMass = latestEntry?.muscle_mass ? parseFloat(latestEntry.muscle_mass.toString()) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <Scale className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-gray-600">Current</span>
        </div>
        <p className="text-2xl font-bold text-gray-800">{currentWeight.toFixed(1)} kg</p>
        {totalLoss > 0 && (
          <p className="text-sm text-green-600">-{totalLoss.toFixed(1)} kg total</p>
        )}
      </Card>

      <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <Target className="w-5 h-5 text-purple-600" />
          <span className="text-sm text-gray-600">Target</span>
        </div>
        <p className="text-2xl font-bold text-gray-800">{targetWeight.toFixed(1)} kg</p>
        {weightToGo > 0 && (
          <p className="text-sm text-blue-600">{weightToGo.toFixed(1)} kg to go</p>
        )}
      </Card>

      {currentBodyFat && (
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-600">Body Fat</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{currentBodyFat.toFixed(1)}%</p>
          <p className="text-sm text-gray-500">Latest measurement</p>
        </Card>
      )}

      {currentMuscleMass && (
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Muscle Mass</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{currentMuscleMass.toFixed(1)} kg</p>
          <p className="text-sm text-gray-500">Latest measurement</p>
        </Card>
      )}

      <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <span className="text-sm text-gray-600">Entries</span>
        </div>
        <p className="text-2xl font-bold text-gray-800">{weightEntries.length}</p>
        <p className="text-sm text-gray-500">Total logged</p>
      </Card>
    </div>
  );
};

export default WeightStatsCards;
