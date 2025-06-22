import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, Dumbbell } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="p-6">
      <Card className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto relative">
            <Dumbbell className="h-8 w-8 text-white" />
            <Loader2 className="h-6 w-6 text-white animate-spin absolute -top-2 -right-2" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Exercise Program</h3>
          <p className="text-gray-600">
            Please wait while we prepare your personalized workout plan...
          </p>
        </div>
      </Card>
    </div>
  );
}; 