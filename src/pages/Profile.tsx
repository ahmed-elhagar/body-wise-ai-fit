
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ProfileAppSidebar } from "@/components/profile/ProfileAppSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePromotionCard from "@/components/profile/ProfilePromotionCard";
import ProfileContent from "@/components/profile/ProfileContent";
import ProfileLoadingState from "@/components/profile/ProfileLoadingState";
import { useProfileForm } from "@/hooks/useProfileForm";

const Profile = () => {
  const { user, isAdmin } = useAuth();
  const { profile, isLoading } = useProfile();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    formData,
    updateFormData,
    handleArrayInput,
    handleSave,
    isUpdating,
  } = useProfileForm();

  const handleEditProfile = () => {
    setIsEditMode(true);
    setActiveTab("profile");
  };

  const handleEditGoals = () => {
    setIsEditMode(true);
    setActiveTab("goals");
  };

  const profileCompleteness = profile?.profile_completion_score || 0;

  if (isLoading) {
    return <ProfileLoadingState />;
  }

  return (
    <ProtectedRoute requireProfile>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <ProfileAppSidebar 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              formData={formData}
              user={user}
              isAdmin={isAdmin}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
            />
            <SidebarInset className="flex-1">
              <div className="w-full max-w-4xl mx-auto px-4 py-6">
                <ProfileHeader isEditMode={isEditMode} />
                
                <ProfilePromotionCard 
                  profileCompleteness={profileCompleteness} 
                />

                <ProfileContent
                  activeTab={activeTab}
                  isEditMode={isEditMode}
                  formData={formData}
                  user={user}
                  updateFormData={updateFormData}
                  handleArrayInput={handleArrayInput}
                  handleSave={handleSave}
                  setIsEditMode={setIsEditMode}
                  setActiveTab={setActiveTab}
                  handleEditProfile={handleEditProfile}
                  handleEditGoals={handleEditGoals}
                  isUpdating={isUpdating}
                />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
