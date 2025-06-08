
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddSnackDialogHeaderProps {
  selectedDay: number;
  isGenerating: boolean;
  onClose: () => void;
}

export const AddSnackDialogHeader = ({ 
  selectedDay, 
  isGenerating, 
  onClose 
}: AddSnackDialogHeaderProps) => {
  const { t, isRTL } = useLanguage();

  const getDayName = (dayNumber: number) => {
    return t(`mealPlan.dayNames.${dayNumber}`) || `Day ${dayNumber}`;
  };

  return (
    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-10 h-10 bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h2 className="text-xl font-bold text-fitness-primary-800">
            {t('mealPlan.addSnack') || 'Add Snack'}
          </h2>
          <p className="text-fitness-primary-600 text-sm">
            {getDayName(selectedDay)} - {t('mealPlan.smartSnackSuggestions') || 'Smart snack suggestions'}
          </p>
        </div>
      </div>
      {!isGenerating && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="hover:bg-fitness-primary-100"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
