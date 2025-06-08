
import { Card } from '@/components/ui/card';
import { Loader2, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeekContentLoaderProps {
  weekNumber: number;
  isVisible: boolean;
}

export const WeekContentLoader = ({ weekNumber, isVisible }: WeekContentLoaderProps) => {
  const { t } = useLanguage();

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 rounded-lg flex items-center justify-center">
      <Card className="p-8 shadow-xl border-0 bg-white max-w-sm mx-auto">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-gray-900">
              {t('Loading Week')} {weekNumber}
            </h3>
            <p className="text-gray-600">
              {t('Fetching your workout schedule and progress...')}
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">{t('Please wait')}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
