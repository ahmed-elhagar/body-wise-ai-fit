
import { Card } from '@/components/ui/card';
import { Timer, Heart, Apple } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const RestDayCard = () => {
  const { t } = useLanguage();

  return (
    <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Timer className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {t('Rest Day')}
        </h3>
        <p className="text-gray-600 mb-6">
          {t('Today is your rest day. Take time to recover and prepare for tomorrow\'s workout!')}
        </p>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white rounded-lg">
            <div className="text-2xl mb-1">💤</div>
            <div className="text-sm font-medium text-gray-900">{t('Rest')}</div>
            <div className="text-xs text-gray-600">{t('Sleep well')}</div>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <div className="text-2xl mb-1">🥗</div>
            <div className="text-sm font-medium text-gray-900">{t('Nutrition')}</div>
            <div className="text-xs text-gray-600">{t('Eat healthy')}</div>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <div className="text-2xl mb-1">🧘</div>
            <div className="text-sm font-medium text-gray-900">{t('Recovery')}</div>
            <div className="text-xs text-gray-600">{t('Stretch & relax')}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
