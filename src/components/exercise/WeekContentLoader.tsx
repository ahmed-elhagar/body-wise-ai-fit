
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeekContentLoaderProps {
  weekNumber: number;
  isVisible: boolean;
}

export const WeekContentLoader = ({ weekNumber, isVisible }: WeekContentLoaderProps) => {
  const { t } = useLanguage();

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
      <Card className="p-4 shadow-lg border-0 bg-white">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">
            {t('Loading Week')} {weekNumber}
          </p>
          <p className="text-xs text-gray-600">
            {t('Fetching workout data...')}
          </p>
        </div>
      </Card>
    </div>
  );
};
