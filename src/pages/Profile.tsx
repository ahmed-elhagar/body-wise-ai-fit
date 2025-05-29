
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ProfileLoadingState from "@/components/profile/ProfileLoadingState";
import ProfileCompletionCard from "@/components/profile/enhanced/ProfileCompletionCard";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import ProfileUserInfoCard from "@/components/profile/ProfileUserInfoCard";
import ProfileTabNavigation from "@/components/profile/ProfileTabNavigation";
import ProfileTabContent from "@/components/profile/ProfileTabContent";
import { useEnhancedProfile } from "@/hooks/useEnhancedProfile";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const { profile, isLoading, error } = useProfile();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  // Track unsaved changes
  useEffect(() => {
    if (profile) {
      const hasChanges = 
        formData.first_name !== (profile.first_name || '') ||
        formData.last_name !== (profile.last_name || '') ||
        formData.age !== (profile.age?.toString() || '') ||
        formData.gender !== (profile.gender || '') ||
        formData.height !== (profile.height?.toString() || '') ||
        formData.weight !== (profile.weight?.toString() || '') ||
        formData.nationality !== (profile.nationality || '') ||
        formData.body_shape !== (profile.body_shape || '') ||
        formData.fitness_goal !== (profile.fitness_goal || '') ||
        formData.activity_level !== (profile.activity_level || '');
      
      setHasUnsavedChanges(hasChanges);
    }
  }, [formData, profile]);

  const handleStepClick = (step: string) => {
    if (hasUnsavedChanges) {
      toast.error('Please save your current changes before switching sections');
      return;
    }

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
      default:
        setActiveTab('overview');
    }
  };

  const handleTabChange = (newTab: string) => {
    if (hasUnsavedChanges) {
      toast.error('Please save your current changes before switching tabs');
      return;
    }
    setActiveTab(newTab);
  };

  if (isLoading) {
    return <ProfileLoadingState />;
  }

  if (error) {
    return (
      <ProtectedRoute requireProfile={false}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load profile data. Please refresh the page or try again later.
            </AlertDescription>
          </Alert>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireProfile={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className={`${isRTL ? 'mr-16 lg:mr-64' : 'ml-16 lg:ml-64'} min-h-screen`}>
          <div className="max-w-6xl mx-auto p-3 lg:p-4">
            <ProfilePageHeader
              hasUnsavedChanges={hasUnsavedChanges}
              completionPercentage={completionPercentage}
              formData={formData}
              user={user}
            />

            <ProfileUserInfoCard
              formData={formData}
              user={user}
              completionPercentage={completionPercentage}
            />

            <div className="mb-4 mt-4">
              <ProfileCompletionCard onStepClick={handleStepClick} />
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <ProfileTabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
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
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
