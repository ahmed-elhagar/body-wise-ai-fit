
import React from 'react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export const RestDayCard = () => {
  const { t } = useLanguage();

  return (
    <Card className="p-8 text-center bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-3xl">🛌</span>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {t('exercise.restDay', 'Rest Day')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('exercise.restDayDescription', 'Take this time to recover and prepare for tomorrow\'s workout.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-white rounded-lg border">
            <div className="font-medium text-gray-900">💧 {t('exercise.stayHydrated', 'Stay Hydrated')}</div>
            <div className="text-gray-600">{t('exercise.drinkWater', 'Drink plenty of water')}</div>
          </div>
          
          <div className="p-3 bg-white rounded-lg border">
            <div className="font-medium text-gray-900">🧘 {t('exercise.lightActivity', 'Light Activity')}</div>
            <div className="text-gray-600">{t('exercise.gentleStretching', 'Gentle stretching or walking')}</div>
          </div>
          
          <div className="p-3 bg-white rounded-lg border">
            <div className="font-medium text-gray-900">😴 {t('exercise.qualitySleep', 'Quality Sleep')}</div>
            <div className="text-gray-600">{t('exercise.getRestful', 'Get 7-9 hours of sleep')}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
