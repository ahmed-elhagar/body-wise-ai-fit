
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Exercise {
  id: string;
  name: string;
}

interface PersonalRecordsTrackerProps {
  exercises: Exercise[];
  onViewDetails: (recordId: string) => void;
}

export const PersonalRecordsTracker = ({ exercises, onViewDetails }: PersonalRecordsTrackerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Records</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Tracking records for {exercises.length} exercises</p>
      </CardContent>
    </Card>
  );
};
