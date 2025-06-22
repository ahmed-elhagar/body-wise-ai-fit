
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, TrendingUp } from 'lucide-react';

export const SmartRecommendations = () => {
  const { t } = useTranslation(['dashboard']);

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-green-800">
          <Lightbulb className="w-6 h-6" />
          Smart Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Stay Hydrated</p>
              <p className="text-sm text-green-600">You're doing great! Keep up your water intake.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
