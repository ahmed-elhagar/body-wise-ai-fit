
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, Save, AlertTriangle, Sparkles } from "lucide-react";

interface ProfileHealthCardProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileHealthCard = ({
  formData,
  updateFormData,
  handleArrayInput,
  saveGoalsAndActivity,
  isUpdating,
  validationErrors,
}: ProfileHealthCardProps) => {
  return (
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
            {validationErrors.health_conditions && (
              <p className="text-sm text-red-600">{validationErrors.health_conditions}</p>
            )}
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
            {validationErrors.allergies && (
              <p className="text-sm text-red-600">{validationErrors.allergies}</p>
            )}
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
          onClick={saveGoalsAndActivity} 
          disabled={isUpdating}
          className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-3 rounded-xl shadow-lg"
        >
          <Save className="w-5 h-5 mr-2" />
          {isUpdating ? 'Saving Health Information...' : 'Save Health Information'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileHealthCard;
