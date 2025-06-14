
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LoadingState = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-violet-600" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {t('Loading your meal plan...')}
        </h3>
        <p className="text-gray-600">
          {t('Please wait while we fetch your personalized nutrition plan')}
        </p>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
