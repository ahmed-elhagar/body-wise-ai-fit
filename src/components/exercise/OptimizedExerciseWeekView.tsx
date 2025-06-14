
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OptimizedExerciseWeekViewProps {
  weekStructure: any[];
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

const OptimizedExerciseWeekView = ({ weekStructure, selectedDay, onDaySelect }: OptimizedExerciseWeekViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Week Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <Button
              key={day}
              variant={selectedDay === day ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onDaySelect(day)}
            >
              Day {day}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedExerciseWeekView;
