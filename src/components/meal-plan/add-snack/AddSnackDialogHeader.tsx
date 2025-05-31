
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
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-fitness-accent-500 to-fitness-accent-600 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-fitness-accent-800">
            {t('mealPlan.addSnackDialog.title')}
          </h2>
          <p className="text-fitness-accent-600 text-sm">
            {t('mealPlan.addSnackDialog.subtitle')}
          </p>
        </div>
      </div>
      {!isGenerating && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="hover:bg-fitness-accent-100"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
