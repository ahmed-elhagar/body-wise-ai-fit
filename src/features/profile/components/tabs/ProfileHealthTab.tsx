
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface ProfileHealthTabProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileHealthTab = ({
  formData,
  updateFormData,
  handleArrayInput,
  saveGoalsAndActivity,
  isUpdating,
  validationErrors,
}: ProfileHealthTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Health Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">Health and fitness information coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHealthTab;
