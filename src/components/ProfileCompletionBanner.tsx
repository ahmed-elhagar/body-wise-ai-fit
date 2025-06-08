
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileCompletionScore } from "@/hooks/useProfileCompletionScore";

const ProfileCompletionBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const navigate = useNavigate();
  const { completionScore } = useProfileCompletionScore();

  useEffect(() => {
    // Only show banner after we have checked the completion score
    // and only if it's truly incomplete
    if (!hasChecked && completionScore !== undefined) {
      setHasChecked(true);
      if (completionScore < 100) {
        setIsVisible(true);
      }
    }
  }, [completionScore, hasChecked]);

  // Don't render anything until we've checked the completion score
  if (!hasChecked || completionScore === undefined || completionScore >= 100) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Complete Your Profile
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Get personalized recommendations by completing your fitness profile
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Profile completion</span>
                <span className="font-medium text-blue-600">{completionScore}%</span>
              </div>
              <Progress value={completionScore} className="h-2" />
            </div>
            <Button
              onClick={() => navigate('/profile')}
              className="mt-3 bg-blue-500 hover:bg-blue-600 text-white"
              size="sm"
            >
              Complete Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};

export default ProfileCompletionBanner;
