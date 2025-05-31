
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Edit, Heart, Target, Calendar, MapPin } from "lucide-react";
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
    if (bmi < 18.5) return { label: 'Underweight', color: 'bg-blue-100 text-blue-800' };
    if (bmi < 25) return { label: 'Normal', color: 'bg-green-100 text-green-800' };
    if (bmi < 30) return { label: 'Overweight', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Obese', color: 'bg-red-100 text-red-800' };
  };

  const completionScore = profile?.profile_completion_score || 0;
  const bmi = getBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Profile Overview
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Info
            </h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Name:</span> {formData.first_name} {formData.last_name}</p>
              <p><span className="text-gray-500">Age:</span> {formData.age || 'Not set'}</p>
              <p><span className="text-gray-500">Gender:</span> {formData.gender || 'Not set'}</p>
              {formData.nationality && (
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="text-gray-500">From:</span> {formData.nationality}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Physical Stats
            </h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Height:</span> {formData.height ? `${formData.height} cm` : 'Not set'}</p>
              <p><span className="text-gray-500">Weight:</span> {formData.weight ? `${formData.weight} kg` : 'Not set'}</p>
              {bmi && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">BMI:</span>
                  <span>{bmi}</span>
                  {bmiCategory && (
                    <Badge className={`text-xs ${bmiCategory.color}`}>
                      {bmiCategory.label}
                    </Badge>
                  )}
                </div>
              )}
              <p><span className="text-gray-500">Body Type:</span> {formData.body_shape || 'Not set'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Fitness Info
            </h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Goal:</span> {formData.fitness_goal || 'Not set'}</p>
              <p><span className="text-gray-500">Activity:</span> {formData.activity_level || 'Not set'}</p>
              {profile?.last_health_assessment_date && (
                <p className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span className="text-gray-500">Last Assessment:</span> 
                  {new Date(profile.last_health_assessment_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-700">Profile Completion</h4>
            <span className="text-sm font-semibold text-gray-800">{completionScore}%</span>
          </div>
          <Progress value={completionScore} className="h-2" />
          <p className="text-sm text-gray-600">
            {completionScore < 50 
              ? "Complete your profile to get better AI recommendations"
              : completionScore < 80 
              ? "Great progress! Add more details for personalized plans"
              : "Excellent! Your profile is comprehensive"}
          </p>
        </div>

        {/* Health Summary */}
        {(formData.health_conditions?.length > 0 || formData.allergies?.length > 0) && (
          <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-800 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Health Considerations
            </h4>
            {formData.health_conditions?.length > 0 && (
              <div>
                <p className="text-sm text-red-700 font-medium">Conditions:</p>
                <p className="text-sm text-red-600">{formData.health_conditions.join(', ')}</p>
              </div>
            )}
            {formData.allergies?.length > 0 && (
              <div>
                <p className="text-sm text-red-700 font-medium">Allergies:</p>
                <p className="text-sm text-red-600">{formData.allergies.join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileOverviewCard;
