
import { TabsContent } from "@/components/ui/tabs";
import ProfileOverviewTab from "./tabs/ProfileOverviewTab";
import ProfileBasicTab from "./tabs/ProfileBasicTab";
import ProfileHealthTab from "./tabs/ProfileHealthTab";
import ProfileGoalsTab from "./tabs/ProfileGoalsTab";
import ProfileSettingsTab from "./tabs/ProfileSettingsTab";
import { LifePhaseForm } from "./LifePhaseForm";
import { useLifePhaseProfile } from "@/hooks/useLifePhaseProfile";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

interface ProfileTabContentProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveBasicInfo: () => Promise<boolean>;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileTabContent = (props: ProfileTabContentProps) => {
  const { flags } = useFeatureFlags();
  const {
    lifePhase,
    isLoading: isLifePhaseLoading,
    updateLifePhaseProfile,
    getNutritionContext
  } = useLifePhaseProfile();

  const handleLifePhaseUpdate = async (field: string, value: any) => {
    await updateLifePhaseProfile({ [field]: value });
  };

  return (
    <>
      <TabsContent value="overview" className="space-y-6">
        <ProfileOverviewTab />
      </TabsContent>

      <TabsContent value="basic" className="space-y-6">
        <ProfileBasicTab
          formData={props.formData}
          updateFormData={props.updateFormData}
          saveBasicInfo={props.saveBasicInfo}
          isUpdating={props.isUpdating}
          validationErrors={props.validationErrors}
        />
      </TabsContent>

      <TabsContent value="health" className="space-y-6">
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
      </TabsContent>

      <TabsContent value="goals" className="space-y-6">
        <ProfileGoalsTab
          formData={props.formData}
          updateFormData={props.updateFormData}
          handleArrayInput={props.handleArrayInput}
          saveGoalsAndActivity={props.saveGoalsAndActivity}
          isUpdating={props.isUpdating}
          validationErrors={props.validationErrors}
        />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <ProfileSettingsTab />
      </TabsContent>
    </>
  );
};

export default ProfileTabContent;
