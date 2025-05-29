
import { TabsContent } from "@/components/ui/tabs";
import EnhancedProfileOverview from "@/components/profile/enhanced/EnhancedProfileOverview";
import EnhancedBasicInfoForm from "@/components/profile/enhanced/EnhancedBasicInfoForm";
import CompactHealthAssessmentForm from "@/components/profile/enhanced/CompactHealthAssessmentForm";
import EnhancedGoalsForm from "@/components/profile/enhanced/EnhancedGoalsForm";
import CompactSettingsForm from "@/components/profile/enhanced/CompactSettingsForm";

interface ProfileTabContentProps {
  formData: any;
  updateFormData: (field: string, value: string | number | string[]) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveBasicInfo: () => Promise<boolean>;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileTabContent = ({
  formData,
  updateFormData,
  handleArrayInput,
  saveBasicInfo,
  saveGoalsAndActivity,
  isUpdating,
  validationErrors,
}: ProfileTabContentProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
      <TabsContent value="overview" className="p-4 m-0">
        <EnhancedProfileOverview />
      </TabsContent>

      <TabsContent value="basic" className="p-4 m-0">
        <EnhancedBasicInfoForm
          formData={formData}
          updateFormData={updateFormData}
          onSave={saveBasicInfo}
          isUpdating={isUpdating}
          validationErrors={validationErrors}
        />
      </TabsContent>

      <TabsContent value="health" className="p-4 m-0">
        <CompactHealthAssessmentForm />
      </TabsContent>

      <TabsContent value="goals" className="p-4 m-0">
        <EnhancedGoalsForm
          formData={formData}
          updateFormData={updateFormData}
          handleArrayInput={handleArrayInput}
          onSave={saveGoalsAndActivity}
          isUpdating={isUpdating}
          validationErrors={validationErrors}
        />
      </TabsContent>

      <TabsContent value="settings" className="p-4 m-0">
        <CompactSettingsForm />
      </TabsContent>
    </div>
  );
};

export default ProfileTabContent;
