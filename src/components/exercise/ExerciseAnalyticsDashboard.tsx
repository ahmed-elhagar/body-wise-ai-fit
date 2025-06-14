
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExerciseAnalyticsDashboardProps {
  timeRange: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void;
}

export const ExerciseAnalyticsDashboard = ({ timeRange, onTimeRangeChange }: ExerciseAnalyticsDashboardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise Analytics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Analytics for time range: {timeRange}</p>
      </CardContent>
    </Card>
  );
};
