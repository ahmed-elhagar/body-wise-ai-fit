
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ExerciseErrorStateProps {
  onRetry: () => void;
  error: any;
}

export const ExerciseErrorState = ({ onRetry, error }: ExerciseErrorStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h2>
        
        <p className="text-gray-600 mb-6">
          We couldn't load your exercise program. Please try again or check your connection.
        </p>
        
        <Button onClick={onRetry} className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </Card>
    </div>
  );
};
