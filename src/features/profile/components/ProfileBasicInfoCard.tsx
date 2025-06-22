
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Calendar, Ruler, Weight } from "lucide-react";

interface ProfileBasicInfoCardProps {
  profile?: any;
  formData?: any;
  updateFormData?: (field: string, value: any) => void;
  saveBasicInfo?: () => Promise<boolean>;
  isUpdating?: boolean;
  validationErrors?: Record<string, string>;
  onUpdate?: () => void;
}

const ProfileBasicInfoCard = ({ 
  profile, 
  formData, 
  updateFormData, 
  saveBasicInfo, 
  isUpdating, 
  validationErrors,
  onUpdate 
}: ProfileBasicInfoCardProps) => {
  // Use formData if available (edit mode), otherwise use profile (display mode)
  const data = formData || profile;
  
  if (!data) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-blue-600" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No profile data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="w-5 h-5 text-blue-600" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {data.first_name ? data.first_name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {data.first_name && data.last_name 
                ? `${data.first_name} ${data.last_name}` 
                : "Complete your profile"}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {data.gender || 'Gender not set'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Age</p>
              <p className="font-medium">{data.age || '—'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Nationality</p>
              <p className="font-medium">{data.nationality || '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Height</p>
              <p className="font-medium">{data.height ? `${data.height} cm` : '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Weight className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Weight</p>
              <p className="font-medium">{data.weight ? `${data.weight} kg` : '—'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileBasicInfoCard;
