
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trophy, Target } from "lucide-react";

interface TargetReachedStateProps {
  onClose: () => void;
}

const TargetReachedState = ({ onClose }: TargetReachedStateProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
        <Trophy className="w-8 h-8 text-white" />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-yellow-800">
          {t('mealPlan.addSnack.targetReached')}
        </h3>
        <p className="text-sm text-yellow-700">
          {t('mealPlan.addSnack.targetReachedDesc')}
        </p>
        
        <div className={`flex items-center justify-center gap-2 text-sm text-yellow-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Target className="w-4 h-4" />
          <span>{t('mealPlan.addSnack.notEnoughCalories')}</span>
        </div>
      </div>

      <Button
        onClick={onClose}
        className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white"
      >
        {t('mealPlan.addSnack.cancel')}
      </Button>
    </Card>
  );
};

export default TargetReachedState;
