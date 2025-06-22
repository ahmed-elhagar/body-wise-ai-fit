
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, AlertTriangle } from "lucide-react";
import { useI18n } from "@/shared/hooks/useI18n";

interface ProfileCompletionIndicatorProps {
  completionPercentage: number;
  missingFields: string[];
}

export const ProfileCompletionIndicator = ({ 
  completionPercentage, 
  missingFields 
}: ProfileCompletionIndicatorProps) => {
  const { tFrom, isRTL } = useI18n();
  const tProfile = tFrom('profile');

  const getCompletionStatus = () => {
    if (completionPercentage >= 100) {
      return {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        title: String(tProfile('profileComplete')),
        description: String(tProfile('profileCompleteDesc')),
        color: "text-green-600"
      };
    }
    if (completionPercentage >= 70) {
      return {
        icon: <Target className="w-5 h-5 text-blue-500" />,
        title: String(tProfile('almostComplete')),
        description: String(tProfile('almostCompleteDesc')),
        color: "text-blue-600"
      };
    }
    return {
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      title: String(tProfile('needsAttention')),
      description: String(tProfile('needsAttentionDesc')),
      color: "text-amber-600"
    };
  };

  const status = getCompletionStatus();

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center gap-2 text-lg ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}>
          {status.icon}
          <span className={status.color}>{status.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className={`flex justify-between text-sm mb-2 ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}>
            <span className="text-gray-600">{String(tProfile('completion'))}</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        <p className={`text-sm text-gray-600 ${isRTL ? 'font-arabic text-right' : ''}`}>
          {status.description}
        </p>

        {missingFields.length > 0 && (
          <div className="mt-3">
            <h4 className={`text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'font-arabic text-right' : ''}`}>
              {String(tProfile('missingFields'))}:
            </h4>
            <div className="flex flex-wrap gap-2">
              {missingFields.map((field) => (
                <span
                  key={field}
                  className={`px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full ${isRTL ? 'font-arabic' : ''}`}
                >
                  {String(tProfile(field))}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
