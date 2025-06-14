
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfilePromotionCardProps {
  profileCompleteness: number;
}

const ProfilePromotionCard = ({ profileCompleteness }: ProfilePromotionCardProps) => {
  const navigate = useNavigate();

  if (profileCompleteness >= 100) return null;

  return (
    <Card className="mb-6 p-4 lg:p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:justify-between">
        <div className="flex items-start gap-3 lg:gap-4 flex-1">
          <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 mt-1 lg:mt-0 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg lg:text-xl font-semibold mb-1">Complete Your Enhanced Profile</h3>
            <p className="text-blue-100 text-sm lg:text-base">
              Unlock personalized AI recommendations with our comprehensive health assessment
            </p>
            <p className="text-xs lg:text-sm text-blue-200 mt-1">
              Profile completion: {profileCompleteness}%
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate('/enhanced-profile')}
          variant="secondary"
          className="bg-white text-blue-600 hover:bg-blue-50 w-full lg:w-auto flex-shrink-0"
        >
          Get Started
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};

export default ProfilePromotionCard;
