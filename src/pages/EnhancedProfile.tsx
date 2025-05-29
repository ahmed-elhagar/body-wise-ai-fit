
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useEnhancedProfile } from "@/hooks/useEnhancedProfile";
import { useMobile } from "@/hooks/use-mobile";
import ProtectedRoute from "@/components/ProtectedRoute";
import EnhancedProfileMobileLayout from "@/components/profile/enhanced/EnhancedProfileMobileLayout";
import EnhancedProfileDesktopLayout from "@/components/profile/enhanced/EnhancedProfileDesktopLayout";
import EnhancedProfileTabs from "@/components/profile/enhanced/EnhancedProfileTabs";
import EnhancedBasicInfoForm from "@/components/profile/enhanced/EnhancedBasicInfoForm";
import EnhancedGoalsForm from "@/components/profile/enhanced/EnhancedGoalsForm";
import HealthAssessmentForm from "@/components/profile/enhanced/HealthAssessmentForm";
import EnhancedProfileOverview from "@/components/profile/enhanced/EnhancedProfileOverview";

const EnhancedProfile = () => {
  const { user } = useAuth();
  const { isLoading } = useProfile();
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    saveHealthAssessment,
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <EnhancedProfileOverview />;
      
      case 'basic':
        return (
          <EnhancedBasicInfoForm
            formData={formData}
            updateFormData={updateFormData}
            onSave={saveBasicInfo}
            isUpdating={isUpdating}
          />
        );
      
      case 'health':
        return <HealthAssessmentForm />;
      
      case 'goals':
        return (
          <EnhancedGoalsForm
            formData={formData}
            updateFormData={updateFormData}
            handleArrayInput={handleArrayInput}
            onSave={saveGoalsAndActivity}
            isUpdating={isUpdating}
          />
        );
      
      case 'settings':
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Settings Coming Soon</h3>
            <p className="text-gray-500">Notification and preference settings will be available here.</p>
          </div>
        );
      
      default:
        return <EnhancedProfileOverview />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading enhanced profile...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireProfile>
      {isMobile ? (
        <EnhancedProfileMobileLayout
          currentStep={activeTab}
          onStepChange={setActiveTab}
        >
          {renderTabContent()}
        </EnhancedProfileMobileLayout>
      ) : (
        <EnhancedProfileDesktopLayout onStepClick={handleStepClick}>
          <EnhancedProfileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formData={formData}
            updateFormData={updateFormData}
            handleArrayInput={handleArrayInput}
            handleSave={saveBasicInfo}
            isUpdating={isUpdating}
          />
        </EnhancedProfileDesktopLayout>
      )}
    </ProtectedRoute>
  );
};

export default EnhancedProfile;
