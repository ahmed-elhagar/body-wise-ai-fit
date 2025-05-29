
import { CheckCircle, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileCompletionStatusProps {
  completionScore: number;
  completedSteps: number;
  totalSteps: number;
  nextIncompleteStep: any;
}

const ProfileCompletionStatus = ({ 
  completionScore, 
  completedSteps, 
  totalSteps, 
  nextIncompleteStep 
}: ProfileCompletionStatusProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-3">
        <Target className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{t('profileCompletion')}</h3>
          <p className="text-sm text-gray-600">{completedSteps} of {totalSteps} steps completed</p>
        </div>
      </div>
      
      {completionScore < 100 && nextIncompleteStep && (
        <div className="bg-white/60 rounded-lg p-3">
          <p className="text-sm text-gray-600 mb-1">{t('nextStep')}:</p>
          <p className="font-medium text-gray-800 text-sm">{nextIncompleteStep.title}</p>
        </div>
      )}
      
      {completionScore === 100 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="font-medium text-green-800 text-sm">{t('profileComplete')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionStatus;
