
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddSnackHeaderProps {
  selectedDay: number;
}

const AddSnackHeader = ({ selectedDay }: AddSnackHeaderProps) => {
  const { t, isRTL } = useLanguage();

  const dayNames = [
    t('day.saturday'), t('day.sunday'), t('day.monday'), 
    t('day.tuesday'), t('day.wednesday'), t('day.thursday'), t('day.friday')
  ];

  return (
    <DialogHeader>
      <DialogTitle className={`flex items-center gap-3 text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-10 h-10 bg-fitness-gradient rounded-full flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-gray-800">{t('addSnack.title')}</div>
          <div className="text-sm font-normal text-gray-600">{dayNames[selectedDay - 1]}</div>
        </div>
      </DialogTitle>
    </DialogHeader>
  );
};

export default AddSnackHeader;
