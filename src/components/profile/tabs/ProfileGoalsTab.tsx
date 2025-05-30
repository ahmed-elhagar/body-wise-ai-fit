
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileGoalsTabProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileGoalsTab = ({ 
  formData, 
  updateFormData, 
  handleArrayInput, 
  saveGoalsAndActivity, 
  isUpdating, 
  validationErrors 
}: ProfileGoalsTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Goals & Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Goals and activity form will be displayed here.</p>
          <Button 
            onClick={saveGoalsAndActivity} 
            disabled={isUpdating}
            className="mt-4"
          >
            {isUpdating ? 'Saving...' : 'Save Goals'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileGoalsTab;
