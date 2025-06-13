
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';

interface EmptyDayStateProps {
  onAddSnack: () => void;
}

export const EmptyDayState = ({ onAddSnack }: EmptyDayStateProps) => {
  return (
    <Card className="border-dashed border-2 border-fitness-primary-300 bg-gradient-to-br from-fitness-primary-50 to-white">
      <CardContent className="p-8 text-center">
        <Target className="w-16 h-16 mx-auto mb-4 text-fitness-primary-400" />
        <h3 className="text-xl font-semibold mb-2 text-fitness-primary-800">No meals planned for this day</h3>
        <p className="text-fitness-primary-600 mb-6 max-w-md mx-auto">
          Start your day right by adding nutritious meals and snacks to reach your daily goals.
        </p>
        <Button 
          onClick={onAddSnack} 
          className="bg-fitness-primary-500 hover:bg-fitness-primary-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Snack
        </Button>
      </CardContent>
    </Card>
  );
};
