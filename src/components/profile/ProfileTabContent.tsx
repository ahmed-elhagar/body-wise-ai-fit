
import { TabsContent } from "@/components/ui/tabs";
import ProfileOverviewTab from "./tabs/ProfileOverviewTab";
import ProfileBasicTab from "./tabs/ProfileBasicTab";
import ProfileHealthTab from "./tabs/ProfileHealthTab";
import ProfileGoalsTab from "./tabs/ProfileGoalsTab";
import ProfileSettingsTab from "./tabs/ProfileSettingsTab";
import { LifePhaseForm } from "./LifePhaseForm";
import { useLifePhaseProfile } from "@/hooks/useLifePhaseProfile";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { useOptimizedProfile } from "@/hooks/useOptimizedProfile";

interface ProfileTabContentProps {
  tabId: string;
}

const ProfileTabContent = ({ tabId }: ProfileTabContentProps) => {
  const { flags } = useFeatureFlags();
  const {
    lifePhase,
    isLoading: isLifePhaseLoading,
    updateLifePhaseProfile,
    getNutritionContext
  } = useLifePhaseProfile();

  const {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating,
    validationErrors
  } = useOptimizedProfile();

  const handleLifePhaseUpdate = async (field: string, value: any) => {
    await updateLifePhaseProfile({ [field]: value });
  };

  const renderTabContent = () => {
    switch (tabId) {
      case "overview":
        return <ProfileOverviewTab />;
      
      case "basic":
        return (
          <ProfileBasicTab
            formData={formData}
            updateFormData={updateFormData}
            saveBasicInfo={saveBasicInfo}
            isUpdating={isUpdating}
            validationErrors={validationErrors}
          />
        );
      
      case "health":
        return (
          <div className="space-y-6">
            <ProfileHealthTab />
            
            {/* Life Phase Form - Only show if feature flag is enabled */}
            {flags.life_phase_nutrition && (
              <div className="mt-6">
                <LifePhaseForm
                  fastingType={lifePhase.fasting_type}
                  pregnancyTrimester={lifePhase.pregnancy_trimester}
                  breastfeedingLevel={lifePhase.breastfeeding_level}
                  conditionStartDate={lifePhase.condition_start_date}
                  onFastingTypeChange={(value) => handleLifePhaseUpdate('fasting_type', value)}
                  onPregnancyTrimesterChange={(value) => handleLifePhaseUpdate('pregnancy_trimester', value)}
                  onBreastfeedingLevelChange={(value) => handleLifePhaseUpdate('breastfeeding_level', value)}
                  onConditionStartDateChange={(value) => handleLifePhaseUpdate('condition_start_date', value)}
                />
              </div>
            )}
          </div>
        );
      
      case "goals":
        return (
          <ProfileGoalsTab
            formData={formData}
            updateFormData={updateFormData}
            handleArrayInput={handleArrayInput}
            saveGoalsAndActivity={saveGoalsAndActivity}
            isUpdating={isUpdating}
            validationErrors={validationErrors}
          />
        );
      
      case "settings":
        return <ProfileSettingsTab />;
      
      default:
        return <ProfileOverviewTab />;
    }
  };

  return renderTabContent();
};

export default ProfileTabContent;
