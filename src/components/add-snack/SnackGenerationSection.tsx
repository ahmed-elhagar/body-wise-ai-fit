
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SnackFeatures from "./SnackFeatures";

interface SnackGenerationSectionProps {
  remainingCalories: number;
  isGenerating: boolean;
  onGenerate: () => void;
  onCancel: () => void;
}

const SnackGenerationSection = ({ 
  remainingCalories, 
  isGenerating, 
  onGenerate, 
  onCancel 
}: SnackGenerationSectionProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <div className="w-24 h-24 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden shadow-xl">
          <Sparkles className="w-12 h-12 text-white animate-pulse" />
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          {t('addSnack.aiPoweredTitle')}
        </h3>
        <p className="text-gray-600 text-sm px-6 leading-relaxed">
          {t('addSnack.aiDescription')}
        </p>
      </div>

      <SnackFeatures remainingCalories={remainingCalories} />

      <div className={`flex gap-4 pt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="flex-1 py-3 text-base font-medium"
          disabled={isGenerating}
        >
          {t('cancel')}
        </Button>
        <Button 
          onClick={onGenerate} 
          disabled={isGenerating}
          className="flex-1 py-3 text-base font-medium bg-fitness-gradient hover:opacity-90 text-white shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t('generating')}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              {t('addSnack.generateSnack')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SnackGenerationSection;
