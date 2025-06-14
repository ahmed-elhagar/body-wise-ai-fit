
import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Loading your meal plan
          </h3>
          <p className="text-gray-600">
            Please wait while we fetch your personalized meals...
          </p>
        </div>
      </div>
    </Card>
  );
};

export default LoadingState;
