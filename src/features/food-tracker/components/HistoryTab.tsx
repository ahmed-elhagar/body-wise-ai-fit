
import { useLanguage } from "@/contexts/LanguageContext";
import { History } from "lucide-react";

export const HistoryTab = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {t('No food history yet')}
        </h3>
        <p className="text-gray-500">
          {t('Your food logging history will appear here')}
        </p>
      </div>
    </div>
  );
};
