
import ProfileBasicInfoCard from "./enhanced/ProfileBasicInfoCard";
import ProfileGoalsCard from "./enhanced/ProfileGoalsCard";
import ProfileHealthCard from "../enhanced/ProfileHealthCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Crown, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useI18n } from "@/hooks/useI18n";
import ProMemberBadge from "@/components/ui/pro-member-badge";

interface RefactoredProfileViewProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveBasicInfo: () => Promise<boolean>;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const RefactoredProfileView = ({
  formData,
  updateFormData,
  handleArrayInput,
  saveBasicInfo,
  saveGoalsAndActivity,
  isUpdating,
  validationErrors,
}: RefactoredProfileViewProps) => {
  const navigate = useNavigate();
  const { isProMember } = useSubscription();
  const { isRTL } = useI18n();

  return (
    <div className="space-y-6">
      {/* Pro Subscription Promotion */}
      {!isProMember && (
        <Alert className={`border-gradient-to-r from-yellow-200 to-orange-200 bg-gradient-to-r from-yellow-50 to-orange-50 ${isRTL ? 'rtl' : 'ltr'}`}>
          <Crown className="h-4 w-4 text-yellow-600" />
          <AlertDescription className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`text-yellow-800 font-medium ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL ? 'ترقى إلى FitFatta Pro للحصول على ميزات متقدمة وتوليدات ذكية غير محدودة' : 'Upgrade to FitFatta Pro for unlimited AI generations and premium features'}
              </span>
            </div>
            <Button
              onClick={() => navigate('/pro')}
              size="sm"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              <Star className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {isRTL ? 'ترقية الآن' : 'Upgrade Now'}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Pro Member Status */}
      {isProMember && (
        <Alert className={`border-green-200 bg-green-50 ${isRTL ? 'rtl' : 'ltr'}`}>
          <Crown className="h-4 w-4 text-green-600" />
          <AlertDescription className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ProMemberBadge variant="default" />
            <span className={`text-green-800 font-medium ${isRTL ? 'font-arabic' : ''}`}>
              {isRTL ? 'أنت عضو مميز في FitFatta Pro! استمتع بالميزات المتقدمة' : 'You are a FitFatta Pro member! Enjoy unlimited features'}
            </span>
          </AlertDescription>
        </Alert>
      )}

      <ProfileBasicInfoCard
        formData={formData}
        updateFormData={updateFormData}
        saveBasicInfo={saveBasicInfo}
        isUpdating={isUpdating}
        validationErrors={validationErrors}
      />

      <ProfileGoalsCard
        formData={formData}
        updateFormData={updateFormData}
        handleArrayInput={handleArrayInput}
        saveGoalsAndActivity={saveGoalsAndActivity}
        isUpdating={isUpdating}
        validationErrors={validationErrors}
      />

      <ProfileHealthCard
        formData={formData}
        updateFormData={updateFormData}
        handleArrayInput={handleArrayInput}
        saveGoalsAndActivity={saveGoalsAndActivity}
        isUpdating={isUpdating}
        validationErrors={validationErrors}
      />
    </div>
  );
};

export default RefactoredProfileView;
