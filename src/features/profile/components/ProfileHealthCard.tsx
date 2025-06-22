
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Edit, Save, X, Shield, AlertTriangle, Sparkles } from "lucide-react";
import HealthConditionsAutocompleteEnhanced from "./onboarding/HealthConditionsAutocompleteEnhanced";

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
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    const success = await saveGoalsAndActivity();
    if (success) {
      setIsEditing(false);
    }
  };

  const handleHealthConditionsChange = (conditions: string[]) => {
    updateFormData('health_conditions', conditions);
  };

  const handleAllergiesChange = (allergies: string[]) => {
    updateFormData('allergies', allergies);
  };

  const hasHealthInfo = (formData.health_conditions?.length > 0) || (formData.allergies?.length > 0);

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white via-red-50/30 to-pink-50/20">
      <CardHeader className="bg-gradient-to-r from-red-600/5 to-pink-600/5 border-b border-gray-100/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Health & Medical Information
              </span>
              <p className="text-sm text-gray-500 font-normal mt-1">
                Your health conditions and allergies for safe recommendations
              </p>
            </div>
          </CardTitle>
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(false)}
                className="hover:bg-gray-50 border-gray-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Health
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <HealthConditionsAutocompleteEnhanced
                  selectedConditions={formData.health_conditions || []}
                  onConditionsChange={handleHealthConditionsChange}
                  label="Health Conditions"
                  placeholder="Search for health conditions..."
                />
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-700">
                    Include any medical conditions that might affect your fitness or nutrition plan
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <HealthConditionsAutocompleteEnhanced
                  selectedConditions={formData.allergies || []}
                  onConditionsChange={handleAllergiesChange}
                  label="Allergies & Food Intolerances"
                  placeholder="Search for allergies..."
                />
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-700">
                    Include food allergies and environmental allergies for safe meal recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {hasHealthInfo ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Health Conditions */}
                  <div className="bg-white/90 p-5 rounded-2xl border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Heart className="w-5 h-5 text-red-600" />
                      </div>
                      <h4 className="font-semibold text-gray-700">Health Conditions</h4>
                    </div>
                    {formData.health_conditions?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.health_conditions.map((condition: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3 py-1">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No health conditions reported</p>
                    )}
                  </div>

                  {/* Allergies */}
                  <div className="bg-white/90 p-5 rounded-2xl border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Shield className="w-5 h-5 text-orange-600" />
                      </div>
                      <h4 className="font-semibold text-gray-700">Allergies & Intolerances</h4>
                    </div>
                    {formData.allergies?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.allergies.map((allergy: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No allergies reported</p>
                    )}
                  </div>
                </div>

                {/* AI Safety Features */}
                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Sparkles className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                        AI Safety Protection Active
                        <Shield className="w-4 h-4 text-green-600" />
                      </h4>
                      <p className="text-sm text-green-700 mb-4">
                        Your health information helps our AI create safe, personalized recommendations that respect your medical needs.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-white/70 rounded-lg p-4 border border-green-100 text-center">
                          <div className="text-2xl mb-2">🛡️</div>
                          <div className="text-sm font-medium text-green-800 mb-1">Safe Meal Plans</div>
                          <div className="text-xs text-green-600">Avoids trigger foods</div>
                        </div>
                        <div className="bg-white/70 rounded-lg p-4 border border-green-100 text-center">
                          <div className="text-2xl mb-2">⚡</div>
                          <div className="text-sm font-medium text-green-800 mb-1">Adapted Workouts</div>
                          <div className="text-xs text-green-600">Considers limitations</div>
                        </div>
                        <div className="bg-white/70 rounded-lg p-4 border border-green-100 text-center">
                          <div className="text-2xl mb-2">📋</div>
                          <div className="text-sm font-medium text-green-800 mb-1">Health Monitoring</div>
                          <div className="text-xs text-green-600">Tracks progress safely</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Health Information Added</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                  Adding your health conditions and allergies helps our AI create safer, more personalized recommendations for you.
                </p>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Add Health Information
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileHealthCard;
