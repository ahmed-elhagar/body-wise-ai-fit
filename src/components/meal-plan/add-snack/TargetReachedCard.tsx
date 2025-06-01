
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface TargetReachedCardProps {
  onClose: () => void;
}

export const TargetReachedCard = ({ onClose }: TargetReachedCardProps) => {
  const { t } = useI18n();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-fitness-primary-200">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-fitness-primary-800 mb-2">
          {t('common.targetReached') || 'Daily target reached!'}
        </h3>
        <p className="text-fitness-primary-600 mb-4">
          {t('common.targetReachedDesc') || "You've reached your calorie goal for today. Great job!"}
        </p>
        <Button
          onClick={onClose}
          size="sm"
          variant="default"
        >
          {t('common.close') || 'Close'}
        </Button>
      </CardContent>
    </Card>
  );
};
