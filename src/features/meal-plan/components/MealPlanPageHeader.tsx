
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Shuffle, ShoppingCart, Loader2 } from "lucide-react";
import { useMealPlanTranslations } from "@/hooks/useMealPlanTranslations";

interface MealPlanPageHeaderProps {
  onGenerateAI: () => void;
  onShuffle: () => void;
  onShowShoppingList: () => void;
  isGenerating: boolean;
  isShuffling: boolean;
  hasWeeklyPlan: boolean;
}

export const MealPlanPageHeader = ({
  onGenerateAI,
  onShuffle,
  onShowShoppingList,
  isGenerating,
  isShuffling,
  hasWeeklyPlan
}: MealPlanPageHeaderProps) => {
  const { smartMealPlanning, personalizedNutrition, generateAI, generating } = useMealPlanTranslations();

  return (
    <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-fitness-primary-800 mb-2">
              {smartMealPlanning}
            </h1>
            <p className="text-fitness-primary-600 text-lg">
              {personalizedNutrition}
            </p>
          </div>
          <div className="flex gap-3">
            {hasWeeklyPlan && (
              <>
                <Button
                  onClick={onShuffle}
                  disabled={isShuffling}
                  variant="outline"
                  className="border-fitness-primary-300 text-fitness-primary-700 hover:bg-fitness-primary-100"
                >
                  {isShuffling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Shuffling...
                    </>
                  ) : (
                    <>
                      <Shuffle className="w-4 h-4 mr-2" />
                      Shuffle
                    </>
                  )}
                </Button>
                <Button
                  onClick={onShowShoppingList}
                  variant="outline"
                  className="border-fitness-primary-300 text-fitness-primary-700 hover:bg-fitness-primary-100"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shopping List
                </Button>
              </>
            )}
            <Button
              onClick={onGenerateAI}
              disabled={isGenerating}
              className="bg-gradient-to-r from-fitness-primary-500 to-fitness-accent-500 hover:from-fitness-primary-600 hover:to-fitness-accent-600 text-white shadow-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {generating}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generateAI}
                </>
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
