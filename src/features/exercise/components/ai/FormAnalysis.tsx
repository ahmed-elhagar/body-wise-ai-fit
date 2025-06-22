
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Camera, Play } from 'lucide-react';
import { Exercise } from '../../types';

interface FormAnalysisProps {
  todaysExercises: Exercise[];
  activeExerciseId: string | null;
}

export const FormAnalysis: React.FC<FormAnalysisProps> = ({
  todaysExercises,
  activeExerciseId
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Form Analysis (Coming Soon)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Form Analysis
            </h3>
            <p className="text-gray-600 mb-4">
              Use your camera to get real-time feedback on your exercise form and technique.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                This feature will analyze your exercise form using AI computer vision to help you maintain proper technique and prevent injuries.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
