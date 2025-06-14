
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Sparkles, 
  Shuffle, 
  RotateCcw, 
  ShoppingCart,
  Calendar,
  ChefHat
} from "lucide-react";

interface MealPlanHeaderProps {
  onGenerateAI: () => Promise<boolean>;
  onShuffle: () => Promise<void>;
  onShowShoppingList: () => void;
  onRegeneratePlan: () => Promise<boolean>;
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
  const { t } = useLanguage();

  return (
    <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Header Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t('Meal Plan')}
                </h1>
                <p className="text-gray-600 text-sm">
                  {t('AI-powered personalized nutrition planning')}
                </p>
              </div>
            </div>
            
            {hasWeeklyPlan && (
              <div className="flex items-center gap-2 mt-3">
                <Calendar className="w-4 h-4 text-green-600" />
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {t('Active Plan')}
                </Badge>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {!hasWeeklyPlan ? (
              <Button
                onClick={onGenerateAI}
                disabled={isGenerating}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? t('Generating...') : t('Generate AI Plan')}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onShuffle}
                  disabled={isShuffling || isGenerating}
                  className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  {isShuffling ? t('Shuffling...') : t('Shuffle')}
                </Button>

                <Button
                  variant="outline"
                  onClick={onRegeneratePlan}
                  disabled={isGenerating}
                  className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {isGenerating ? t('Regenerating...') : t('Regenerate')}
                </Button>

                <Button
                  variant="outline"
                  onClick={onShowShoppingList}
                  disabled={isGenerating}
                  className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 px-4 py-2.5 rounded-xl"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t('Shopping List')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanHeader;
