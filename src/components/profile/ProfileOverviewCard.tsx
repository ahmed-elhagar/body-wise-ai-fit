
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Edit, Heart, Target, Calendar, MapPin, TrendingUp, Activity } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

interface ProfileOverviewCardProps {
  formData: any;
  onEdit: () => void;
}

const ProfileOverviewCard = ({ formData, onEdit }: ProfileOverviewCardProps) => {
  const { profile } = useProfile();

  const calculateAge = (birthYear: number) => {
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const getBMI = () => {
    if (formData.height && formData.weight) {
      const heightInM = parseFloat(formData.height) / 100;
      const weight = parseFloat(formData.weight);
      return (weight / (heightInM * heightInM)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (bmi < 25) return { label: 'Normal', color: 'bg-green-100 text-green-800 border-green-200' };
    if (bmi < 30) return { label: 'Overweight', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { label: 'Obese', color: 'bg-red-100 text-red-800 border-red-200' };
  };

  const completionScore = profile?.profile_completion_score || 0;
  const bmi = getBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Information Card */}
      <Card className="lg:col-span-2 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-0 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              Personal Information
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onEdit} className="hover:bg-blue-50">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Avatar and Basic Info */}
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
              <p className="text-gray-600">{formData.nationality || 'Add your nationality'}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500">
                  {formData.age ? `${formData.age} years old` : 'Age not set'}
                </span>
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
              {bmiCategory && (
                <Badge className={`text-xs mt-1 ${bmiCategory.color} border`}>
                  {bmiCategory.label}
                </Badge>
              )}
            </div>
            <div className="bg-white/70 p-4 rounded-xl border border-gray-100 text-center">
              <div className="text-2xl font-bold text-orange-600 capitalize">
                {formData.body_shape?.substring(0, 4) || '—'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Body Type</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress and Health Card */}
      <Card className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            Health Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Completion */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm font-bold text-gray-800">{completionScore}%</span>
            </div>
            <Progress value={completionScore} className="h-2" />
            <p className="text-xs text-gray-600">
              {completionScore < 50 
                ? "Complete your profile for better AI recommendations"
                : completionScore < 80 
                ? "Great progress! Add more details"
                : "Excellent! Your profile is comprehensive"}
            </p>
          </div>

          {/* Fitness Goals */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Fitness Goals
            </h4>
            <div className="space-y-2">
              <Badge className="w-full justify-center py-2 bg-blue-100 text-blue-800 border-blue-200">
                {formData.fitness_goal?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not set'}
              </Badge>
              <Badge className="w-full justify-center py-2 bg-purple-100 text-purple-800 border-purple-200">
                {formData.activity_level?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not set'}
              </Badge>
            </div>
          </div>

          {/* Health Info */}
          {(formData.health_conditions?.length > 0 || formData.allergies?.length > 0) && (
            <div className="space-y-3 p-3 bg-red-50 rounded-lg border border-red-100">
              <h4 className="font-medium text-red-800 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Health Notes
              </h4>
              {formData.health_conditions?.length > 0 && (
                <div>
                  <p className="text-xs text-red-700 font-medium">Conditions:</p>
                  <p className="text-xs text-red-600">{formData.health_conditions.slice(0, 2).join(', ')}</p>
                </div>
              )}
              {formData.allergies?.length > 0 && (
                <div>
                  <p className="text-xs text-red-700 font-medium">Allergies:</p>
                  <p className="text-xs text-red-600">{formData.allergies.slice(0, 2).join(', ')}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileOverviewCard;
