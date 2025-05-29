
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useEnhancedProfile } from "@/hooks/useEnhancedProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileCompletionCard from "@/components/profile/enhanced/ProfileCompletionCard";
import EnhancedProfilePageHeader from "@/components/profile/enhanced/EnhancedProfilePageHeader";
import EnhancedProfileTabsContainer from "@/components/profile/enhanced/EnhancedProfileTabsContainer";

const EnhancedProfile = () => {
  const { user } = useAuth();
  const { profile, isLoading } = useProfile();
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating,
  } = useEnhancedProfile();

  const handleStepClick = (step: string) => {
    switch (step) {
      case 'basic_info':
        setActiveTab('basic');
        break;
      case 'health_assessment':
        setActiveTab('health');
        break;
      case 'goals_setup':
        setActiveTab('goals');
        break;
      case 'preferences':
        setActiveTab('settings');
        break;
      case 'profile_review':
        setActiveTab('overview');
        break;
      default:
        setActiveTab('overview');
    }
  };

  const profileCompleteness = profile?.profile_completion_score || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-primary mx-auto mb-4" />
          <p className="text-gray-600">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireProfile>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Account for main navigation */}
        <div className={`${isRTL ? 'mr-16 lg:mr-64' : 'ml-16 lg:ml-64'} min-h-screen`}>
          <div className="max-w-6xl mx-auto p-4 lg:p-6">
            {/* Header */}
            <EnhancedProfilePageHeader 
              formData={formData}
              profileCompleteness={profileCompleteness}
            />

            {/* Profile Completion Card */}
            <div className="mb-4">
              <ProfileCompletionCard onStepClick={handleStepClick} />
            </div>

            {/* Main Content with Tabs */}
            <EnhancedProfileTabsContainer
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              formData={formData}
              updateFormData={updateFormData}
              handleArrayInput={handleArrayInput}
              saveBasicInfo={saveBasicInfo}
              saveGoalsAndActivity={saveGoalsAndActivity}
              isUpdating={isUpdating}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EnhancedProfile;
