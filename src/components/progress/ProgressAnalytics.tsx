
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/hooks/useI18n";
import { TrendingUp, Scale, Target } from "lucide-react";

interface ProgressAnalyticsProps {
  data: any[];
}

export const ProgressAnalytics = ({ data }: ProgressAnalyticsProps) => {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            {t('Overall Progress')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{t('Track your fitness journey over time')}</p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-green-600" />
            {t('Weight Trends')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{t('Monitor your weight changes')}</p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            {t('Goal Achievement')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{t('See how close you are to your goals')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressAnalytics;
