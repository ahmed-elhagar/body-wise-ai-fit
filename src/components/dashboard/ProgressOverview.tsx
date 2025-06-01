import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from "@/hooks/useI18n";

interface ProgressOverviewProps {
  weightChange: number | null;
  exerciseProgress: number;
  todaysCalories: number;
}

export const ProgressOverview = ({ weightChange, exerciseProgress, todaysCalories }: ProgressOverviewProps) => {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Progress Overview')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p>{t('Weight Change')}: {weightChange !== null ? `${weightChange.toFixed(1)} kg` : t('No data')}</p>
          <p>{t('Exercise Progress')}: {exerciseProgress.toFixed(1)}%</p>
          <p>{t('Calories Consumed')}: {todaysCalories}</p>
        </div>
      </CardContent>
    </Card>
  );
};
