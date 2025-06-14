
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, TrendingUp, TrendingDown, Target, Plus, ArrowRight } from "lucide-react";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";

const WeightTrackingWidget = () => {
  const { getWeightStats } = useWeightTracking();
  const { profile } = useProfile();
  const navigate = useNavigate();
  
  const stats = getWeightStats();
  
  if (!stats) {
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
        <CardContent className="pt-6 text-center">
          <Scale className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 mb-2">Start Weight Tracking</h3>
          <p className="text-sm text-gray-500 mb-4">Log your weight to see progress</p>
          <Button 
            onClick={() => navigate('/weight-tracking')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Entry
          </Button>
        </CardContent>
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
    if (stats.weeklyChange > 0.1) return <TrendingUp className="w-4 h-4" />;
    if (stats.weeklyChange < -0.1) return <TrendingDown className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (stats.weeklyChange > 0.1) return 'text-orange-600';
    if (stats.weeklyChange < -0.1) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <Scale className="w-5 h-5 text-blue-600" />
            <span>Weight Tracking</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/weight-tracking')}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            View All
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weight & Change */}
        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Current Weight</p>
            <p className="text-2xl font-bold text-gray-800">
              {stats.currentWeight.toFixed(1)} kg
            </p>
          </div>
          <div className="text-right">
             <p className="text-xs text-gray-500">7d Change</p>
            <div className={`flex items-center justify-end gap-1 font-semibold ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>
                {stats.weeklyChange > 0 ? '+' : ''}
                {stats.weeklyChange.toFixed(1)} kg
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            {bmi && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">BMI</p>
                <p className="font-bold text-gray-800 text-lg">{bmi.toFixed(1)}</p>
                 <Badge variant="secondary" className={`mt-1 text-xs font-normal border-0 ${getBMICategory(bmi).color}`}>
                    {getBMICategory(bmi).label}
                 </Badge>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-3 text-center col-span-1">
              <p className="text-xs text-gray-500">Total Change</p>
              <p className={`font-bold text-lg ${stats.totalChange >= 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {stats.totalChange > 0 ? '+' : ''}{stats.totalChange.toFixed(1)} kg
              </p>
              <p className="text-xs text-gray-500 mt-1">{stats.entryCount} entries</p>
            </div>
        </div>
        
        <Button 
          onClick={() => navigate('/weight-tracking')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Weight Entry
        </Button>
      </CardContent>
    </Card>
  );
};

export default WeightTrackingWidget;
