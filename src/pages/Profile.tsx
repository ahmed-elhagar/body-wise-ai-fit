
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { User } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEnhancedProfile } from "@/hooks/useEnhancedProfile";
import ProfileTabNavigation from "@/components/profile/ProfileTabNavigation";
import ProfileTabContent from "@/components/profile/ProfileTabContent";

const Profile = () => {
  const {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating,
    validationErrors,
    completionPercentage,
  } = useEnhancedProfile();

  return (
    <ProtectedRoute>
      <Layout>
        <PageHeader
          title="Profile"
          description={`Complete your profile to get personalized recommendations (${completionPercentage}% complete)`}
          icon={<User className="h-6 w-6 text-blue-600" />}
        />

        <Tabs defaultValue="overview" className="w-full">
          <ProfileTabNavigation 
            activeTab="overview"
            onTabChange={() => {}}
          />

          <ProfileTabContent
            formData={formData}
            updateFormData={updateFormData}
            handleArrayInput={handleArrayInput}
            saveBasicInfo={saveBasicInfo}
            saveGoalsAndActivity={saveGoalsAndActivity}
            isUpdating={isUpdating}
            validationErrors={validationErrors}
          />
        </Tabs>
      </Layout>
    </ProtectedRoute>
  );
};

export default Profile;
