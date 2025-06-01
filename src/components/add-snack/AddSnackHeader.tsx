
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useI18n } from "@/hooks/useI18n";
import { Sparkles } from "lucide-react";

interface AddSnackHeaderProps {
  selectedDay: number;
}

const AddSnackHeader = ({ selectedDay }: AddSnackHeaderProps) => {
  const { t, isRTL } = useI18n();

  const getDayName = (dayNumber: number) => {
    const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    return t(days[dayNumber - 1]);
  };

  return (
    <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <DialogTitle className="text-xl font-bold text-gray-800">
            {t('mealPlan.addSnack.title')}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            {getDayName(selectedDay)} - {t('mealPlan.addSnack.description')}
          </p>
        </div>
      </div>
    </DialogHeader>
  );
};

export default AddSnackHeader;
