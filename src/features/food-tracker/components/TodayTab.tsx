
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Plus, Utensils } from "lucide-react";

interface TodayTabProps {
  onAddFood: () => void;
}

export const TodayTab = ({ onAddFood }: TodayTabProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {t('No food logged today')}
        </h3>
        <p className="text-gray-500 mb-6">
          {t('Start tracking your nutrition by adding your first meal')}
        </p>
        <Button onClick={onAddFood} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('Add Food')}
        </Button>
      </div>
    </div>
  );
};
