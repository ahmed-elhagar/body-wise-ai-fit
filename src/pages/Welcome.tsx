
import React from 'react';
import { Card } from '@/components/ui/card';

const Welcome = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome to FitFatta!</h1>
          <p className="text-gray-600 text-center">Let's get you started on your fitness journey...</p>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
