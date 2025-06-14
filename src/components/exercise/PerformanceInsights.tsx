
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceInsightsProps {
  onApplyRecommendation: (insightId: string) => void;
}

export const PerformanceInsights = ({ onApplyRecommendation }: PerformanceInsightsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <p>AI-powered performance insights and recommendations</p>
      </CardContent>
    </Card>
  );
};
