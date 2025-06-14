
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, TrendingUp, TrendingDown, Target, Plus } from "lucide-react";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";

const WeightTrackingWidget = () => {
  const { weightEntries, getWeightStats } = useWeightTracking();
  const { profile } = useProfile();
  const navigate = useNavigate();
  
  const stats = getWeightStats();
  
  if (!stats) {
    return (
      <Card className="p-6 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg">
        <div className="text-center">
          <Scale className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-600 mb-2">Start Weight Tracking</h3>
          <p className="text-sm text-gray-500 mb-4">Record your first weight entry</p>
          <Button 
            onClick={() => navigate('/weight-tracking')}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </Card>
    );
  }

  // Calculate BMI if height is available
  const bmi = profile?.height 
    ? stats.currentWeight / Math.pow(profile.height / 100, 2)
    : null;

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'bg-blue-100 text-blue-700' };
    if (bmi < 25) return { label: 'Normal', color: 'bg-green-100 text-green-700' };
    if (bmi < 30) return { label: 'Overweight', color: 'bg-orange-100 text-orange-700' };
    return { label: 'Obese', color: 'bg-red-100 text-red-700' };
  };

  const getTrendIcon = () => {
    if (stats.weeklyChange > 0.1) return <TrendingUp className="w-4 h-4 text-orange-600" />;
    if (stats.weeklyChange < -0.1) return <TrendingDown className="w-4 h-4 text-green-600" />;
    return <Target className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (stats.weeklyChange > 0.1) return 'text-orange-600';
    if (stats.weeklyChange < -0.1) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Scale className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800">Weight Tracking</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/weight-tracking')}
          className="text-blue-600 hover:text-blue-700"
        >
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {/* Current Weight */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {stats.currentWeight.toFixed(1)} kg
            </p>
            <p className="text-sm text-gray-600">Current Weight</p>
          </div>
          <div className="text-right">
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {stats.weeklyChange > 0 ? '+' : ''}
                {stats.weeklyChange.toFixed(1)} kg
              </span>
            </div>
            <p className="text-xs text-gray-500">7-day change</p>
          </div>
        </div>

        {/* BMI */}
        {bmi && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-800">
                BMI: {bmi.toFixed(1)}
              </p>
            </div>
            <Badge className={getBMICategory(bmi).color}>
              {getBMICategory(bmi).label}
            </Badge>
          </div>
        )}

        {/* Progress Summary */}
        <div className="pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Change</p>
              <p className={`font-semibold ${stats.totalChange >= 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {stats.totalChange > 0 ? '+' : ''}{stats.totalChange.toFixed(1)} kg
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Entries</p>
              <p className="font-semibold text-gray-800">{stats.entryCount}</p>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div className="pt-2">
          <Button 
            onClick={() => navigate('/weight-tracking')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Weight Entry
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default WeightTrackingWidget;
