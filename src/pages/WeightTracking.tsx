
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Scale, Plus, TrendingUp, TrendingDown, Target } from "lucide-react";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import WeightEntryForm from "@/components/weight/WeightEntryForm";
import WeightProgressChart from "@/components/weight/WeightProgressChart";
import WeightStatsCards from "@/components/weight/WeightStatsCards";

const WeightTracking = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { weightEntries, isLoading } = useWeightTracking();
  const { profile } = useProfile();
  const [showAddForm, setShowAddForm] = useState(false);

  // Calculate statistics
  const latestEntry = weightEntries[0];
  const previousEntry = weightEntries[1];
  const weekAgoEntry = weightEntries.find(entry => {
    const entryDate = new Date(entry.recorded_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate <= weekAgo;
  });

  const weeklyChange = latestEntry && weekAgoEntry 
    ? latestEntry.weight - weekAgoEntry.weight 
    : 0;

  const dailyChange = latestEntry && previousEntry
    ? latestEntry.weight - previousEntry.weight
    : 0;

  // Calculate BMI if height is available
  const bmi = latestEntry && profile?.height 
    ? latestEntry.weight / Math.pow(profile.height / 100, 2)
    : null;

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-orange-600' };
    return { label: 'Obese', color: 'text-red-600' };
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading weight data...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
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
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <Scale className="w-8 h-8 text-blue-600" />
                  Weight Tracking
                </h1>
                <p className="text-gray-600">Monitor your body composition and progress</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </div>

          {/* Current Stats */}
          {latestEntry && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {/* Current Weight */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Weight</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {parseFloat(latestEntry.weight.toString()).toFixed(1)} kg
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
                      <Badge className={`mt-1 ${getBMICategory(bmi).color} bg-transparent border`}>
                        {getBMICategory(bmi).label}
                      </Badge>
                    </div>
                  </div>
                </Card>
              )}

              {/* Total Entries */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Entries</p>
                    <p className="text-2xl font-bold text-gray-800">{weightEntries.length}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div className="space-y-6">
            {/* Stats Overview */}
            <WeightStatsCards weightEntries={weightEntries} />

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Weight Entry Form */}
              {showAddForm && (
                <div className="lg:col-span-1">
                  <Card className="p-6 bg-white/80 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4">Add Weight Entry</h3>
                    <WeightEntryForm onSuccess={() => setShowAddForm(false)} />
                  </Card>
                </div>
              )}

              {/* Progress Chart */}
              <div className={showAddForm ? "lg:col-span-2" : "lg:col-span-3"}>
                <WeightProgressChart weightEntries={weightEntries} />
              </div>
            </div>

            {/* Recent Entries */}
            {weightEntries.length > 0 && (
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center mb-6">
                  <Scale className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Recent Entries</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-medium text-gray-600">Date</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-600">Weight</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-600">Change</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-600">Body Fat</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-600">Muscle Mass</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-600">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weightEntries.slice(0, 10).map((entry, index) => {
                        const previousWeight = weightEntries[index + 1]?.weight;
                        const change = previousWeight ? entry.weight - previousWeight : 0;
                        
                        return (
                          <tr key={entry.id} className="border-b border-gray-100">
                            <td className="py-3 px-2 text-gray-800">
                              {new Date(entry.recorded_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-2 font-medium text-gray-800">
                              {parseFloat(entry.weight.toString()).toFixed(1)} kg
                            </td>
                            <td className="py-3 px-2">
                              {change !== 0 && (
                                <span className={`text-sm ${change > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                  {change > 0 ? '+' : ''}{change.toFixed(1)} kg
                                </span>
                              )}
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Empty State */}
            {weightEntries.length === 0 && (
              <Card className="p-12 bg-white/80 backdrop-blur-sm text-center">
                <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Weight Data Yet</h3>
                <p className="text-gray-500 mb-6">Start tracking your weight to monitor your progress</p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Entry
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default WeightTracking;
