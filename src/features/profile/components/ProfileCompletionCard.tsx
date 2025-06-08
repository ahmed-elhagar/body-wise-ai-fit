
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";
import { calculateProfileCompletion, getProfileCompletionStatus } from "../utils/profileUtils";

interface ProfileCompletionCardProps {
  profile: any;
}

const ProfileCompletionCard = ({ profile }: ProfileCompletionCardProps) => {
  const completionPercentage = calculateProfileCompletion(profile);
  const status = getProfileCompletionStatus(completionPercentage);

  return (
    <Card className="bg-gradient-to-br from-white via-purple-50/20 to-indigo-50/20 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-purple-100 rounded-lg">
            {completionPercentage >= 80 ? (
              <CheckCircle className="w-6 h-6 text-purple-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-purple-600" />
            )}
          </div>
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {completionPercentage}%
          </div>
          <Badge className={`${status.color} border font-medium mb-4`}>
            {status.label}
          </Badge>
          <Progress value={completionPercentage} className="h-3" />
        </div>
        
        <div className="text-sm text-gray-600 text-center">
          {completionPercentage >= 80 
            ? "Your profile is complete! You'll get the best AI recommendations."
            : "Complete your profile to get personalized AI recommendations."
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;
