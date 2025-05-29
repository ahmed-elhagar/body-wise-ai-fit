
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Edit, Target, Activity } from "lucide-react";

interface ProfileOverviewCardProps {
  formData: any;
  onEdit: () => void;
}

const ProfileOverviewCard = ({ formData, onEdit }: ProfileOverviewCardProps) => {
  const calculateAge = (birthYear: string) => {
    if (!birthYear) return null;
    return new Date().getFullYear() - parseInt(birthYear);
  };

  const calculateBMI = (height: string, weight: string) => {
    if (!height || !weight) return null;
    const h = parseFloat(height) / 100; // convert cm to m
    const w = parseFloat(weight);
    return (w / (h * h)).toFixed(1);
  };

  const bmi = calculateBMI(formData.height, formData.weight);

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <User className="w-5 h-5 text-fitness-primary mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Profile Overview</h3>
        </div>
        <Button onClick={onEdit} variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 mb-3">Personal Information</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">
                {formData.first_name && formData.last_name 
                  ? `${formData.first_name} ${formData.last_name}` 
                  : 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Age:</span>
              <span className="font-medium">{formData.age || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium capitalize">{formData.gender || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nationality:</span>
              <span className="font-medium">{formData.nationality || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Physical Stats */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 mb-3">Physical Stats</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Height:</span>
              <span className="font-medium">{formData.height ? `${formData.height} cm` : 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium">{formData.weight ? `${formData.weight} kg` : 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">BMI:</span>
              <span className="font-medium">{bmi || 'Not available'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Body Shape:</span>
              <span className="font-medium capitalize">{formData.body_shape || 'Not provided'}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileOverviewCard;
