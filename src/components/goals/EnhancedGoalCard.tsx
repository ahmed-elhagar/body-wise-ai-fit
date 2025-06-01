import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useI18n } from "@/hooks/useI18n";

interface EnhancedGoalCardProps {
  title: string;
  description: string;
  progress: number;
  ctaText: string;
  onCtaClick: () => void;
}

const EnhancedGoalCard: React.FC<EnhancedGoalCardProps> = ({
  title,
  description,
  progress,
  ctaText,
  onCtaClick,
}) => {
  const { t } = useI18n();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{description}</p>
        <Progress value={progress} />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{t('Progress')}: {progress}%</span>
          <span>{t('Complete')}</span>
        </div>
        <Button onClick={onCtaClick} className="w-full">
          {ctaText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedGoalCard;
