
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePromotionCard from "@/components/profile/ProfilePromotionCard";
import ProfileContent from "@/components/profile/ProfileContent";
import ProfileLoadingState from "@/components/profile/ProfileLoadingState";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { useProfileForm } from "@/hooks/useProfileForm";
import { useLanguage } from "@/contexts/LanguageContext";

const Profile = () => {
  const { user, isAdmin } = useAuth();
  const { profile, isLoading } = useProfile();
  const { isRTL } = useLanguage();
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
        {/* Account for main navigation */}
        <div className={`${isRTL ? 'mr-16 lg:mr-64' : 'ml-16 lg:ml-64'} min-h-screen`}>
          <div className="flex min-h-screen">
            {/* Profile Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="h-full overflow-y-auto bg-white/60 backdrop-blur-sm border-r border-gray-200">
                <ProfileSidebar 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  formData={formData}
                  user={user}
                  isAdmin={isAdmin}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="h-full overflow-y-auto">
                <div className="max-w-4xl mx-auto p-4 lg:p-6">
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
              </div>
            </div>
          </div>

          {/* Mobile Navigation - Bottom tabs */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="flex justify-around py-2">
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setIsEditMode(false);
                }}
                className={`flex flex-col items-center px-3 py-2 text-xs ${
                  activeTab === "overview" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <span className="text-lg mb-1">👁️</span>
                Overview
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex flex-col items-center px-3 py-2 text-xs ${
                  activeTab === "profile" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <span className="text-lg mb-1">👤</span>
                Profile
              </button>
              <button
                onClick={() => setActiveTab("goals")}
                className={`flex flex-col items-center px-3 py-2 text-xs ${
                  activeTab === "goals" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <span className="text-lg mb-1">🎯</span>
                Goals
              </button>
              <button
                onClick={() => setActiveTab("account")}
                className={`flex flex-col items-center px-3 py-2 text-xs ${
                  activeTab === "account" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <span className="text-lg mb-1">⚙️</span>
                Account
              </button>
            </div>
          </div>

          {/* Add bottom padding on mobile to account for bottom navigation */}
          <div className="lg:hidden h-16"></div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
