
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface ProfileOverviewTabProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  saveBasicInfo: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileOverviewTab = ({
  formData,
  updateFormData,
  saveBasicInfo,
  isUpdating,
  validationErrors,
}: ProfileOverviewTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">Basic profile information coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileOverviewTab;
