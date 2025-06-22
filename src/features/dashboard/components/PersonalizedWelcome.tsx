
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Moon, Coffee } from 'lucide-react';

export const PersonalizedWelcome = () => {
  const { t } = useTranslation(['dashboard']);
  
  const getTimeOfDayIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return Sun;
    if (hour < 17) return Sun;
    return Moon;
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 17) return t('goodAfternoon');
    return t('goodEvening');
  };

  const TimeIcon = getTimeOfDayIcon();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-blue-800">
          <TimeIcon className="w-6 h-6" />
          {getTimeOfDayGreeting()}!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-blue-700">
          Ready to continue your fitness journey today? Let's make it count!
        </p>
      </CardContent>
    </Card>
  );
};
