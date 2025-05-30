
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileBasicTabProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  saveBasicInfo: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileBasicTab = ({ 
  formData, 
  updateFormData, 
  saveBasicInfo, 
  isUpdating, 
  validationErrors 
}: ProfileBasicTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Basic profile information form will be displayed here.</p>
          <Button 
            onClick={saveBasicInfo} 
            disabled={isUpdating}
            className="mt-4"
          >
            {isUpdating ? 'Saving...' : 'Save Basic Info'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileBasicTab;
