
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import BasicInfoCard from "./BasicInfoCard";
import HealthGoalsCard from "./HealthGoalsCard";
import AccountSettingsCard from "./AccountSettingsCard";
import ProfileOverviewCard from "./ProfileOverviewCard";
import ProfileGoalsCard from "./ProfileGoalsCard";

interface ProfileContentProps {
  activeTab: string;
  isEditMode: boolean;
  formData: any;
  user: any;
  updateFormData: (field: string, value: string) => void;
  handleArrayInput: (field: string, value: string) => void;
  handleSave: () => void;
  setIsEditMode: (mode: boolean) => void;
  setActiveTab: (tab: string) => void;
  handleEditProfile: () => void;
  handleEditGoals: () => void;
  isUpdating: boolean;
}

const ProfileContent = ({
  activeTab,
  isEditMode,
  formData,
  user,
  updateFormData,
  handleArrayInput,
  handleSave,
  setIsEditMode,
  setActiveTab,
  handleEditProfile,
  handleEditGoals,
  isUpdating,
}: ProfileContentProps) => {
  return (
    <div className="space-y-6">
      {activeTab === "overview" && !isEditMode && (
        <>
          <ProfileOverviewCard formData={formData} onEdit={handleEditProfile} />
          <ProfileGoalsCard formData={formData} onEdit={handleEditGoals} />
        </>
      )}

      {(activeTab === "profile" || (isEditMode && activeTab === "profile")) && (
        <>
          <BasicInfoCard formData={formData} updateFormData={updateFormData} />
          {isEditMode && (
            <div className="flex gap-3 justify-end">
              <Button 
                onClick={() => {
                  setIsEditMode(false);
                  setActiveTab("overview");
                }}
                variant="outline"
                className="w-full lg:w-auto"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-fitness-gradient w-full lg:w-auto"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {(activeTab === "goals" || (isEditMode && activeTab === "goals")) && (
        <>
          <HealthGoalsCard 
            formData={formData} 
            updateFormData={updateFormData}
            handleArrayInput={handleArrayInput}
          />
          {isEditMode && (
            <div className="flex gap-3 justify-end">
              <Button 
                onClick={() => {
                  setIsEditMode(false);
                  setActiveTab("overview");
                }}
                variant="outline"
                className="w-full lg:w-auto"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-fitness-gradient w-full lg:w-auto"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {activeTab === "account" && !isEditMode && (
        <AccountSettingsCard user={user} />
      )}
    </div>
  );
};

export default ProfileContent;
