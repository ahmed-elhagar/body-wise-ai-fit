
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Save, Activity, AlertTriangle, Sparkles } from "lucide-react";
import { useEnhancedProfile } from "@/hooks/useEnhancedProfile";
import { Badge } from "@/components/ui/badge";

const ProfileHealthTab = () => {
  const { formData, updateFormData, handleArrayInput, saveBasicInfo, isUpdating } = useEnhancedProfile();

  const getBMI = () => {
    if (formData.height && formData.weight) {
      const heightInM = parseFloat(formData.height) / 100;
      const weight = parseFloat(formData.weight);
      return (weight / (heightInM * heightInM)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'bg-blue-100 text-blue-800', recommendation: 'Consider consulting a nutritionist for healthy weight gain' };
    if (bmi < 25) return { label: 'Normal', color: 'bg-green-100 text-green-800', recommendation: 'Great! Maintain your current lifestyle' };
    if (bmi < 30) return { label: 'Overweight', color: 'bg-yellow-100 text-yellow-800', recommendation: 'Consider a balanced diet and regular exercise' };
    return { label: 'Obese', color: 'bg-red-100 text-red-800', recommendation: 'Consult healthcare professionals for a personalized plan' };
  };

  const bmi = getBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="space-y-6 p-6">
      {/* Physical Measurements Card */}
      <Card className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            Physical Measurements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm font-medium text-gray-700">Height (cm)</Label>
              <div className="relative">
                <Input
                  id="height"
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => updateFormData('height', e.target.value)}
                  placeholder="Enter height"
                  className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  cm
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium text-gray-700">Weight (kg)</Label>
              <div className="relative">
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => updateFormData('weight', e.target.value)}
                  placeholder="Enter weight"
                  className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  kg
                </div>
              </div>
            </div>

            {bmi && bmiInfo && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">BMI Score</Label>
                <div className="p-4 bg-white/80 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-800">{bmi}</span>
                    <Badge className={`${bmiInfo.color} border font-medium`}>
                      {bmiInfo.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{bmiInfo.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Health Conditions Card */}
      <Card className="bg-gradient-to-br from-white via-red-50/20 to-pink-50/20 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            Health Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="health_conditions" className="text-sm font-medium text-gray-700">
                Health Conditions
              </Label>
              <Textarea
                id="health_conditions"
                value={formData.health_conditions?.join(', ') || ''}
                onChange={(e) => handleArrayInput('health_conditions', e.target.value)}
                placeholder="e.g., Diabetes, Hypertension, Heart condition"
                rows={4}
                className="bg-white/80 border-gray-200 focus:border-red-400 focus:ring-red-400"
              />
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700">
                  List any medical conditions that might affect your fitness or nutrition plan. 
                  This helps our AI create safer, personalized recommendations.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="allergies" className="text-sm font-medium text-gray-700">
                Allergies & Intolerances
              </Label>
              <Textarea
                id="allergies"
                value={formData.allergies?.join(', ') || ''}
                onChange={(e) => handleArrayInput('allergies', e.target.value)}
                placeholder="e.g., Nuts, Dairy, Gluten, Shellfish"
                rows={4}
                className="bg-white/80 border-gray-200 focus:border-red-400 focus:ring-red-400"
              />
              <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-yellow-700">
                  Include food allergies, environmental allergies, or medication allergies to ensure 
                  safe meal plan recommendations.
                </p>
              </div>
            </div>
          </div>

          {(formData.health_conditions?.length > 0 || formData.allergies?.length > 0) && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-800">AI Safety Features</h4>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Your health information helps our AI create safe, personalized recommendations:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white/80 p-3 rounded-lg border border-green-100 text-center">
                  <div className="text-lg mb-1">🛡️</div>
                  <div className="text-xs text-green-700 font-medium">Safe Meal Plans</div>
                </div>
                <div className="bg-white/80 p-3 rounded-lg border border-green-100 text-center">
                  <div className="text-lg mb-1">⚡</div>
                  <div className="text-xs text-green-700 font-medium">Adapted Workouts</div>
                </div>
                <div className="bg-white/80 p-3 rounded-lg border border-green-100 text-center">
                  <div className="text-lg mb-1">📋</div>
                  <div className="text-xs text-green-700 font-medium">Health Monitoring</div>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={saveBasicInfo} 
            disabled={isUpdating}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-3 rounded-xl shadow-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            {isUpdating ? 'Saving Health Information...' : 'Save Health Information'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileHealthTab;
