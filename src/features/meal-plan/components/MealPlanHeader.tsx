
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Shuffle, ShoppingCart, RotateCcw } from "lucide-react";

interface MealPlanHeaderProps {
  onGenerateAI: () => void;
  onShuffle: () => void;
  onShowShoppingList: () => void;
  onRegeneratePlan: () => void;
  isGenerating: boolean;
  isShuffling: boolean;
  hasWeeklyPlan: boolean;
}

const MealPlanHeader = ({
  onGenerateAI,
  onShuffle,
  onShowShoppingList,
  onRegeneratePlan,
  isGenerating,
  isShuffling,
  hasWeeklyPlan
}: MealPlanHeaderProps) => {
  return (
    <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Your Meal Plan
            </h1>
            <p className="text-gray-600">
              AI-powered nutrition planning for your fitness goals
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {hasWeeklyPlan && (
              <>
                <Button
                  onClick={onShuffle}
                  disabled={isShuffling || isGenerating}
                  variant="outline"
                  size="sm"
                  className="border-violet-300 text-violet-700 hover:bg-violet-50"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  {isShuffling ? 'Shuffling...' : 'Shuffle Meals'}
                </Button>
                
                <Button
                  onClick={onShowShoppingList}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shopping List
                </Button>
                
                <Button
                  onClick={onRegeneratePlan}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </>
            )}
            
            <Button
              onClick={onGenerateAI}
              disabled={isGenerating}
              size="sm"
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {hasWeeklyPlan ? 'Generate New Plan' : 'Generate AI Plan'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealPlanHeader;
