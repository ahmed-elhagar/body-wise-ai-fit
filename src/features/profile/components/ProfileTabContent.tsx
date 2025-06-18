
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ProfileOverviewTab from "./tabs/ProfileOverviewTab";
import ProfileHealthTab from "./tabs/ProfileHealthTab";
import ProfileSettingsTab from "./tabs/ProfileSettingsTab";

interface ProfileTabContentProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveBasicInfo: () => Promise<boolean>;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileTabContent = React.memo(({
  formData,
  updateFormData,
  handleArrayInput,
  saveBasicInfo,
  saveGoalsAndActivity,
  isUpdating,
  validationErrors,
}: ProfileTabContentProps) => {
  return (
    <>
      <TabsContent value="overview">
        <ProfileOverviewTab
          formData={formData}
          updateFormData={updateFormData}
          saveBasicInfo={saveBasicInfo}
          isUpdating={isUpdating}
          validationErrors={validationErrors}
        />
      </TabsContent>

      <TabsContent value="health">
        <ProfileHealthTab
          formData={formData}
          updateFormData={updateFormData}
          handleArrayInput={handleArrayInput}
          saveGoalsAndActivity={saveGoalsAndActivity}
          isUpdating={isUpdating}
          validationErrors={validationErrors}
        />
      </TabsContent>

      <TabsContent value="goals">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Goals & Activity</h3>
          <p className="text-gray-600">Goals configuration coming soon...</p>
        </div>
      </TabsContent>

      <TabsContent value="settings">
        <ProfileSettingsTab />
      </TabsContent>
    </>
  );
});

ProfileTabContent.displayName = 'ProfileTabContent';

export default ProfileTabContent;
