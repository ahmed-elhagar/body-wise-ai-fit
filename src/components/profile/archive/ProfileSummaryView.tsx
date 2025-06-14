
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Heart, Target, Edit, Save, X, Activity, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";

interface ProfileSummaryViewProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveBasicInfo: () => Promise<boolean>;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileSummaryView = ({
  formData,
  updateFormData,
  handleArrayInput,
  saveBasicInfo,
  saveGoalsAndActivity,
  isUpdating,
  validationErrors,
}: ProfileSummaryViewProps) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const handleEdit = (section: string) => {
    setEditingSection(section);
  };

  const handleCancel = () => {
    setEditingSection(null);
  };

  const handleSave = async (section: string) => {
    let success = false;
    
    if (section === "basic") {
      success = await saveBasicInfo();
    } else if (section === "goals") {
      success = await saveGoalsAndActivity();
    }
    
    if (success) {
      setEditingSection(null);
    }
  };

  const getBMI = () => {
    if (formData.height && formData.weight) {
      const heightInM = parseFloat(formData.height) / 100;
      const weight = parseFloat(formData.weight);
      return (weight / (heightInM * heightInM)).toFixed(1);
    }
    return null;
  };

  const bmi = getBMI();

  // Debug log to check what data we're displaying
  console.log('ProfileSummaryView - Current form data:', {
    firstName: formData.first_name,
    lastName: formData.last_name,
    age: formData.age,
    gender: formData.gender,
    height: formData.height,
    weight: formData.weight,
    nationality: formData.nationality,
    bodyShape: formData.body_shape,
    fitnessGoal: formData.fitness_goal,
    activityLevel: formData.activity_level,
    healthConditions: formData.health_conditions,
    allergies: formData.allergies,
    preferredFoods: formData.preferred_foods,
    dietaryRestrictions: formData.dietary_restrictions
  });

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <Card className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-0 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              Personal Information
            </CardTitle>
            {editingSection === "basic" ? (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancel}
                  className="hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleSave("basic")}
                  disabled={isUpdating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEdit("basic")}
                className="hover:bg-blue-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {editingSection === "basic" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name || ''}
                  onChange={(e) => updateFormData('first_name', e.target.value)}
                  className={validationErrors.first_name ? 'border-red-500' : ''}
                />
                {validationErrors.first_name && (
                  <p className="text-sm text-red-500">{validationErrors.first_name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name || ''}
                  onChange={(e) => updateFormData('last_name', e.target.value)}
                  className={validationErrors.last_name ? 'border-red-500' : ''}
                />
                {validationErrors.last_name && (
                  <p className="text-sm text-red-500">{validationErrors.last_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => updateFormData('age', e.target.value)}
                  className={validationErrors.age ? 'border-red-500' : ''}
                />
                {validationErrors.age && (
                  <p className="text-sm text-red-500">{validationErrors.age}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender || ''} onValueChange={(value) => updateFormData('gender', value)}>
                  <SelectTrigger className={validationErrors.gender ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.gender && (
                  <p className="text-sm text-red-500">{validationErrors.gender}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => updateFormData('height', e.target.value)}
                  className={validationErrors.height ? 'border-red-500' : ''}
                />
                {validationErrors.height && (
                  <p className="text-sm text-red-500">{validationErrors.height}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => updateFormData('weight', e.target.value)}
                  className={validationErrors.weight ? 'border-red-500' : ''}
                />
                {validationErrors.weight && (
                  <p className="text-sm text-red-500">{validationErrors.weight}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={formData.nationality || ''}
                  onChange={(e) => updateFormData('nationality', e.target.value)}
                  className={validationErrors.nationality ? 'border-red-500' : ''}
                />
                {validationErrors.nationality && (
                  <p className="text-sm text-red-500">{validationErrors.nationality}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="body_shape">Body Shape</Label>
                <Select value={formData.body_shape || ''} onValueChange={(value) => updateFormData('body_shape', value)}>
                  <SelectTrigger className={validationErrors.body_shape ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select body shape" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ectomorph">Ectomorph</SelectItem>
                    <SelectItem value="mesomorph">Mesomorph</SelectItem>
                    <SelectItem value="endomorph">Endomorph</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.body_shape && (
                  <p className="text-sm text-red-500">{validationErrors.body_shape}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Info Display */}
              <div className="flex items-center gap-4 p-4 bg-white/70 rounded-xl border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">
                    {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">
                    {formData.first_name && formData.last_name 
                      ? `${formData.first_name} ${formData.last_name}` 
                      : "Complete your profile"}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{formData.nationality || 'Add nationality'}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {formData.age ? `${formData.age} years old` : 'Age not set'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500 capitalize">
                      {formData.gender || 'Gender not set'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/70 p-4 rounded-xl border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formData.height ? `${formData.height}` : '—'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Height (cm)</div>
                </div>
                <div className="bg-white/70 p-4 rounded-xl border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formData.weight ? `${formData.weight}` : '—'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Weight (kg)</div>
                </div>
                <div className="bg-white/70 p-4 rounded-xl border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {bmi || '—'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">BMI</div>
                </div>
                <div className="bg-white/70 p-4 rounded-xl border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-orange-600 capitalize">
                    {formData.body_shape?.substring(0, 4) || '—'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Body Type</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fitness Goals Section */}
      <Card className="bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/20 border-0 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              Fitness Goals & Preferences
            </CardTitle>
            {editingSection === "goals" ? (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancel}
                  className="hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleSave("goals")}
                  disabled={isUpdating}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEdit("goals")}
                className="hover:bg-purple-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Goals
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {editingSection === "goals" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fitness_goal">Fitness Goal</Label>
                  <Select value={formData.fitness_goal || ''} onValueChange={(value) => updateFormData('fitness_goal', value)}>
                    <SelectTrigger className={validationErrors.fitness_goal ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight_loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                      <SelectItem value="maintenance">Weight Maintenance</SelectItem>
                      <SelectItem value="endurance">Improve Endurance</SelectItem>
                      <SelectItem value="strength">Build Strength</SelectItem>
                      <SelectItem value="flexibility">Improve Flexibility</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.fitness_goal && (
                    <p className="text-sm text-red-500">{validationErrors.fitness_goal}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity_level">Activity Level</Label>
                  <Select value={formData.activity_level || ''} onValueChange={(value) => updateFormData('activity_level', value)}>
                    <SelectTrigger className={validationErrors.activity_level ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="lightly_active">Lightly Active</SelectItem>
                      <SelectItem value="moderately_active">Moderately Active</SelectItem>
                      <SelectItem value="very_active">Very Active</SelectItem>
                      <SelectItem value="extremely_active">Extremely Active</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.activity_level && (
                    <p className="text-sm text-red-500">{validationErrors.activity_level}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="preferred_foods">Preferred Foods</Label>
                  <Textarea
                    id="preferred_foods"
                    value={formData.preferred_foods?.join(', ') || ''}
                    onChange={(e) => handleArrayInput('preferred_foods', e.target.value)}
                    placeholder="e.g., Chicken, Rice, Vegetables"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
                  <Textarea
                    id="dietary_restrictions"
                    value={formData.dietary_restrictions?.join(', ') || ''}
                    onChange={(e) => handleArrayInput('dietary_restrictions', e.target.value)}
                    placeholder="e.g., Vegetarian, Gluten-free"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fitness Goals Display */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Fitness Journey
                </h4>
                <div className="space-y-3">
                  <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Primary Goal</p>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium">
                      {formData.fitness_goal?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not set'}
                    </Badge>
                  </div>
                  <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Activity Level</p>
                    <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">
                      {formData.activity_level?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not set'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Dietary Preferences Display */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  Nutrition Profile
                </h4>
                <div className="space-y-3">
                  {formData.preferred_foods?.length > 0 ? (
                    <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-500 mb-2">Preferred Foods</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.preferred_foods.slice(0, 4).map((food: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            {food}
                          </Badge>
                        ))}
                        {formData.preferred_foods.length > 4 && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            +{formData.preferred_foods.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                      <p className="text-sm text-gray-500">No food preferences set</p>
                    </div>
                  )}

                  {formData.dietary_restrictions?.length > 0 && (
                    <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-500 mb-2">Dietary Restrictions</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.dietary_restrictions.map((restriction: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                            {restriction}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Information Section */}
      <Card className="bg-gradient-to-br from-white via-red-50/20 to-pink-50/20 border-0 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              Health Information
            </CardTitle>
            {editingSection === "health" ? (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancel}
                  className="hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleSave("goals")}
                  disabled={isUpdating}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEdit("health")}
                className="hover:bg-red-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Health
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {editingSection === "health" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="health_conditions">Health Conditions</Label>
                <Textarea
                  id="health_conditions"
                  value={formData.health_conditions?.join(', ') || ''}
                  onChange={(e) => handleArrayInput('health_conditions', e.target.value)}
                  placeholder="e.g., Diabetes, Hypertension"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies & Intolerances</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies?.join(', ') || ''}
                  onChange={(e) => handleArrayInput('allergies', e.target.value)}
                  placeholder="e.g., Nuts, Dairy, Gluten"
                  rows={4}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {formData.health_conditions?.length > 0 ? (
                <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2 font-medium">Health Conditions</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.health_conditions.map((condition: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <p className="text-sm text-gray-500">No health conditions reported</p>
                </div>
              )}

              {formData.allergies?.length > 0 ? (
                <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2 font-medium">Allergies & Intolerances</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.allergies.map((allergy: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <p className="text-sm text-gray-500">No allergies reported</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSummaryView;
