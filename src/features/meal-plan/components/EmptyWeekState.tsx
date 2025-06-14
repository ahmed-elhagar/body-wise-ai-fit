
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles, Wand2, Calendar } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface EmptyWeekStateProps {
  onGenerateAI: () => void;
  isGenerating: boolean;
}

export const EmptyWeekState = ({ onGenerateAI, isGenerating }: EmptyWeekStateProps) => {
  const { tFrom, isRTL } = useI18n();
  const tMealPlan = tFrom('mealPlan');

  return (
    <Card className="p-12 text-center bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-0 shadow-xl backdrop-blur-sm">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <ChefHat className="w-12 h-12 text-white" />
        </div>
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {String(tMealPlan('noWeeklyPlan'))}
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          {String(tMealPlan('createWeeklyPlan'))}
        </p>
        
        {/* Features */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="bg-white/60 p-4 rounded-xl border border-gray-200/50">
            <Calendar className="w-6 h-6 text-blue-500 mb-2 mx-auto" />
            <h4 className="font-semibold text-sm text-gray-800 mb-1">7-Day Planning</h4>
            <p className="text-xs text-gray-600">Complete weekly meal schedule</p>
          </div>
          
          <div className="bg-white/60 p-4 rounded-xl border border-gray-200/50">
            <Sparkles className="w-6 h-6 text-purple-500 mb-2 mx-auto" />
            <h4 className="font-semibold text-sm text-gray-800 mb-1">AI-Powered</h4>
            <p className="text-xs text-gray-600">Personalized to your goals</p>
          </div>
          
          <div className="bg-white/60 p-4 rounded-xl border border-gray-200/50">
            <Wand2 className="w-6 h-6 text-green-500 mb-2 mx-auto" />
            <h4 className="font-semibold text-sm text-gray-800 mb-1">Smart Recipes</h4>
            <p className="text-xs text-gray-600">Detailed instructions & nutrition</p>
          </div>
        </div>
        
        {/* Action Button */}
        <Button 
          onClick={onGenerateAI}
          disabled={isGenerating}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-2xl"
        >
          {isGenerating ? (
            <>
              <Wand2 className="w-6 h-6 mr-3 animate-spin" />
              {String(tMealPlan('generating'))}...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 mr-3" />
              {String(tMealPlan('generateMealPlan'))}
            </>
          )}
        </Button>
        
        <div className={`flex items-center justify-center gap-2 text-sm text-gray-500 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Wand2 className="w-4 h-4" />
          <span>{String(tMealPlan('aiPowered'))}</span>
        </div>
      </div>
    </Card>
  );
};
