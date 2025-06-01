
import { CheckCircle, Target, TrendingUp } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

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
  const { t } = useI18n();

  const getStatusColor = () => {
    if (completionScore >= 80) return "text-green-600";
    if (completionScore >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBg = () => {
    if (completionScore >= 80) return "bg-green-50 border-green-200";
    if (completionScore >= 50) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${getStatusBg()}`}>
          <Target className={`w-6 h-6 ${getStatusColor()}`} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            {t('profileCompletion')}
            <span className={`text-2xl font-bold ${getStatusColor()}`}>
              {completionScore}%
            </span>
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>{completedSteps} of {totalSteps} steps completed</span>
          </div>
        </div>
      </div>
      
      {completionScore < 100 && nextIncompleteStep && (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1 font-medium">{t('nextStep')}:</p>
          <p className="font-semibold text-gray-800 text-sm">{nextIncompleteStep.title}</p>
          <p className="text-xs text-gray-500 mt-1">{nextIncompleteStep.description}</p>
        </div>
      )}
      
      {completionScore === 100 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-bold text-green-800 text-sm">{t('profileComplete')}</p>
              <p className="text-xs text-green-700 mt-1">
                Ready for AI-powered recommendations!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionStatus;
