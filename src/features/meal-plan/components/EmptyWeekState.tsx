
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Sparkles } from "lucide-react";

interface EmptyWeekStateProps {
  onGenerateAI: () => void;
  isGenerating: boolean;
}

export const EmptyWeekState = ({ onGenerateAI, isGenerating }: EmptyWeekStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full bg-white shadow-lg border-0">
        <CardContent className="text-center p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UtensilsCrossed className="h-10 w-10 text-violet-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No Meal Plan Yet
          </h3>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Generate your personalized meal plan with AI to get started on your fitness journey. 
            We'll create meals tailored to your goals and preferences.
          </p>
          
          <Button 
            onClick={onGenerateAI}
            disabled={isGenerating}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg w-full"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate AI Meal Plan'}
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            This usually takes 30-60 seconds
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
