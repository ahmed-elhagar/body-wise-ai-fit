
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Scale } from "lucide-react";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import WeightEntryForm from "@/components/weight/WeightEntryForm";
import WeightProgressChart from "@/components/weight/WeightProgressChart";
import WeightStatsCards from "@/components/weight/WeightStatsCards";

const WeightTracking = () => {
  const navigate = useNavigate();
  const { weightEntries, isLoading } = useWeightTracking();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading weight data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Weight Tracking</h1>
              <p className="text-gray-600">Monitor your body composition and progress</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Stats Overview */}
          <WeightStatsCards weightEntries={weightEntries} />

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Weight Entry Form */}
            <div className="lg:col-span-1">
              <WeightEntryForm />
            </div>

            {/* Progress Chart */}
            <div className="lg:col-span-2">
              <WeightProgressChart weightEntries={weightEntries} />
            </div>
          </div>

          {/* Recent Entries */}
          {weightEntries.length > 0 && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center mb-6">
                <Scale className="w-5 h-5 text-fitness-primary mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Recent Entries</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600">Weight</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600">Body Fat</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600">Muscle Mass</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weightEntries.slice(0, 10).map((entry) => (
                      <tr key={entry.id} className="border-b border-gray-100">
                        <td className="py-3 px-2 text-gray-800">
                          {new Date(entry.recorded_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2 font-medium text-gray-800">
                          {parseFloat(entry.weight.toString()).toFixed(1)} kg
                        </td>
                        <td className="py-3 px-2 text-gray-600">
                          {entry.body_fat_percentage ? `${parseFloat(entry.body_fat_percentage.toString()).toFixed(1)}%` : '—'}
                        </td>
                        <td className="py-3 px-2 text-gray-600">
                          {entry.muscle_mass ? `${parseFloat(entry.muscle_mass.toString()).toFixed(1)} kg` : '—'}
                        </td>
                        <td className="py-3 px-2 text-gray-600 truncate max-w-xs">
                          {entry.notes || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeightTracking;
