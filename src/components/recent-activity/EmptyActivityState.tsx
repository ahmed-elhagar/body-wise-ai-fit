
import { useLanguage } from "@/contexts/LanguageContext";

export const EmptyActivityState = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-health-soft rounded-2xl flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">📈</span>
      </div>
      <p className="text-health-text-secondary">{t('recentActivity.noActivity')}</p>
    </div>
  );
};
