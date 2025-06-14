
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OptimizedExerciseHeaderProps {
  program: any;
  progressMetrics: any;
  onGenerateNew: () => void;
}

const OptimizedExerciseHeader = ({ program, progressMetrics, onGenerateNew }: OptimizedExerciseHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise Program</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{program?.program_name || 'No Program'}</h3>
            <p className="text-gray-600">{program?.difficulty_level || 'Unknown'} Level</p>
          </div>
          <Button onClick={onGenerateNew}>Generate New Program</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedExerciseHeader;
