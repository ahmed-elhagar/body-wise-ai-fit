
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeftRight, Sparkles, Clock, Users, ChefHat, X, Zap, Star } from 'lucide-react';
import { useMealExchange } from '@/hooks/useMealExchange';
import type { DailyMeal } from '@/features/meal-plan/types';

interface MealExchangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
  onExchangeComplete?: () => void;
}

const EXCHANGE_REASONS = [
  { value: 'dietary_restrictions', label: 'Dietary restrictions', icon: '🚫' },
  { value: 'ingredient_availability', label: 'Missing ingredients', icon: '🛒' },
  { value: 'time_constraints', label: 'Too time consuming', icon: '⏰' },
  { value: 'personal_preference', label: 'Personal preference', icon: '❤️' },
  { value: 'variety_seeking', label: 'Want more variety', icon: '🌟' },
  { value: 'cooking_difficulty', label: 'Too difficult to cook', icon: '👨‍🍳' },
  { value: 'nutritional_adjustment', label: 'Nutritional adjustment', icon: '📊' },
];

export const MealExchangeDialog = ({ isOpen, onClose, meal, onExchangeComplete }: MealExchangeDialogProps) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [exchangeMode, setExchangeMode] = useState<'quick' | 'alternatives'>('alternatives');
  
  const {
    isLoading,
    alternatives,
    generateAlternatives,
    exchangeMeal,
    quickExchange,
    clearAlternatives,
    hasAlternatives,
  } = useMealExchange();

  const handleClose = () => {
    clearAlternatives();
    setSelectedReason('');
    setExchangeMode('alternatives');
    onClose();
  };

  const handleGenerateAlternatives = async () => {
    if (!meal || !selectedReason) return;
    
    const reasonLabel = EXCHANGE_REASONS.find(r => r.value === selectedReason)?.label || selectedReason;
    await generateAlternatives(meal, reasonLabel);
  };

  const handleQuickExchange = async () => {
    if (!meal || !selectedReason) return;
    
    const reasonLabel = EXCHANGE_REASONS.find(r => r.value === selectedReason)?.label || selectedReason;
    await quickExchange(meal, reasonLabel, () => {
      onExchangeComplete?.();
      handleClose();
    });
  };

  const handleSelectAlternative = async (alternative: any) => {
    await exchangeMeal(alternative, () => {
      onExchangeComplete?.();
      handleClose();
    });
  };

  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0">
        <DialogHeader className="p-4 pb-3 border-b bg-gradient-to-r from-violet-50 to-purple-50">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 bg-violet-100 rounded-md">
              <ArrowLeftRight className="w-4 h-4 text-violet-600" />
            </div>
            Exchange Meal
            <Badge variant="secondary" className="ml-auto text-xs">
              {meal.meal_type}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4 max-h-[calc(85vh-80px)] overflow-y-auto">
          {/* Current Meal Info */}
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <ChefHat className="w-4 h-4 text-gray-600" />
                <h3 className="font-medium text-gray-800">Current Meal</h3>
              </div>
              <p className="font-semibold mb-3 text-gray-900">{meal.name}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
                  <Clock className="w-3 h-3 mr-1" />
                  {(meal.prep_time || 0) + (meal.cook_time || 0)} min
                </Badge>
                <Badge variant="outline" className="text-xs bg-green-50 border-green-200">
                  <Users className="w-3 h-3 mr-1" />
                  {meal.servings || 1} serving{(meal.servings || 1) !== 1 ? 's' : ''}
                </Badge>
                <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200">
                  🔥 {meal.calories || 0} cal
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-emerald-50 rounded border border-emerald-200">
                  <span className="font-medium text-sm text-emerald-700">{meal.protein || 0}g</span>
                  <div className="text-xs text-emerald-600">Protein</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
                  <span className="font-medium text-sm text-blue-700">{meal.carbs || 0}g</span>
                  <div className="text-xs text-blue-600">Carbs</div>
                </div>
                <div className="text-center p-2 bg-amber-50 rounded border border-amber-200">
                  <span className="font-medium text-sm text-amber-700">{meal.fat || 0}g</span>
                  <div className="text-xs text-amber-600">Fat</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Reason Selection */}
          {!hasAlternatives && (
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <span>🤔</span>
                  Why exchange this meal?
                </h3>
                
                <Select value={selectedReason} onValueChange={setSelectedReason}>
                  <SelectTrigger className="mb-4 h-10">
                    <SelectValue placeholder="Select a reason for exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXCHANGE_REASONS.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value} className="py-2">
                        <div className="flex items-center gap-2">
                          <span>{reason.icon}</span>
                          <span>{reason.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Exchange Mode Toggle */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Button
                    variant={exchangeMode === 'alternatives' ? 'default' : 'outline'}
                    onClick={() => setExchangeMode('alternatives')}
                    className={`h-12 flex-col gap-1 ${
                      exchangeMode === 'alternatives' 
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700' 
                        : 'border-2 hover:border-violet-300 hover:bg-violet-50'
                    }`}
                    size="sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <div className="text-xs font-medium">Browse Options</div>
                  </Button>
                  <Button
                    variant={exchangeMode === 'quick' ? 'default' : 'outline'}
                    onClick={() => setExchangeMode('quick')}
                    className={`h-12 flex-col gap-1 ${
                      exchangeMode === 'quick' 
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700' 
                        : 'border-2 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                    size="sm"
                  >
                    <Zap className="w-4 h-4" />
                    <div className="text-xs font-medium">Quick Exchange</div>
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button onClick={handleClose} variant="outline" className="flex-1 h-9" size="sm">
                    Cancel
                  </Button>
                  {exchangeMode === 'alternatives' ? (
                    <Button
                      onClick={handleGenerateAlternatives}
                      disabled={!selectedReason || isLoading}
                      className="flex-1 h-9 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                      size="sm"
                    >
                      {isLoading ? (
                        <>
                          <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 mr-1" />
                          Generate Options
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleQuickExchange}
                      disabled={!selectedReason || isLoading}
                      className="flex-1 h-9 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                      size="sm"
                    >
                      {isLoading ? (
                        <>
                          <Zap className="w-3 h-3 mr-1 animate-spin" />
                          Exchanging...
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 mr-1" />
                          Quick Exchange
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alternatives List */}
          {hasAlternatives && (
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Alternative Meals ({alternatives.length})
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAlternatives}
                    className="text-gray-500 hover:text-gray-700 h-7 px-2"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                </div>
                
                <ScrollArea className="max-h-72">
                  <div className="space-y-3">
                    {alternatives.map((alternative, index) => (
                      <Card key={index} className="border hover:border-violet-200 hover:shadow-sm transition-all duration-200">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-3">
                              <h4 className="font-medium text-sm mb-1 text-gray-900">{alternative.name}</h4>
                              <p className="text-xs text-gray-600 mb-2 leading-relaxed">{alternative.reason}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                                  <Clock className="w-2 h-2 mr-1" />
                                  {(alternative.prep_time || 0) + (alternative.cook_time || 0)} min
                                </Badge>
                                <Badge variant="secondary" className="text-xs bg-orange-50 text-orange-700">
                                  🔥 {alternative.calories} cal
                                </Badge>
                                <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700">
                                  🥩 {alternative.protein}g protein
                                </Badge>
                              </div>

                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  alternative.similarity_score > 0.8 
                                    ? 'border-green-300 bg-green-50 text-green-700' 
                                    : alternative.similarity_score > 0.6 
                                    ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                                    : 'border-red-300 bg-red-50 text-red-700'
                                }`}
                              >
                                {Math.round((alternative.similarity_score || 0) * 100)}% similar
                              </Badge>
                            </div>
                            
                            <Button
                              onClick={() => handleSelectAlternative(alternative)}
                              disabled={isLoading}
                              className="ml-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 h-8 px-3"
                              size="sm"
                            >
                              {isLoading ? (
                                <>
                                  <ArrowLeftRight className="w-3 h-3 mr-1 animate-spin" />
                                  Exchanging...
                                </>
                              ) : (
                                <>
                                  <ArrowLeftRight className="w-3 h-3 mr-1" />
                                  Select
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="flex gap-3 mt-4 pt-3 border-t">
                  <Button onClick={handleClose} variant="outline" className="flex-1 h-8" size="sm">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateAlternatives}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1 h-8 border-violet-200 text-violet-600 hover:bg-violet-50"
                    size="sm"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Generate More
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
