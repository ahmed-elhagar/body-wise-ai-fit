
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';

interface AILoadingStepsProps {
  steps: {
    id: string;
    label: string;
    completed: boolean;
    loading: boolean;
  }[];
}

const AILoadingSteps: React.FC<AILoadingStepsProps> = ({ steps }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3">
              {step.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : step.loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
              )}
              <span className={`text-sm ${step.completed ? 'text-green-700' : step.loading ? 'text-blue-700' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AILoadingSteps;
