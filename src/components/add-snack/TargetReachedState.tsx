
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TargetReachedStateProps {
  onClose: () => void;
}

const TargetReachedState = ({ onClose }: TargetReachedStateProps) => {
  const { t } = useLanguage();

  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        {t('addSnack.targetReached')}
      </h3>
      <p className="text-gray-600 mb-6 leading-relaxed">
        {t('addSnack.targetReachedDesc')}
      </p>
      <Button 
        variant="outline" 
        onClick={onClose} 
        className="w-full py-3 text-base font-medium"
      >
        {t('addSnack.understood')}
      </Button>
    </div>
  );
};

export default TargetReachedState;
