
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
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-violet-50 to-purple-50">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-violet-100 rounded-lg">
              <ArrowLeftRight className="w-5 h-5 text-violet-600" />
            </div>
            Exchange Meal
            <Badge variant="secondary" className="ml-auto">
              {meal.meal_type}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Current Meal Info */}
          <Card className="border-2 border-dashed border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <ChefHat className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-lg text-gray-800">Current Meal</h3>
                  </div>
                  <p className="text-xl font-bold mb-4 text-gray-900">{meal.name}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Badge variant="outline" className="bg-blue-50 border-blue-200">
                      <Clock className="w-3 h-3 mr-1" />
                      {(meal.prep_time || 0) + (meal.cook_time || 0)} min
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 border-green-200">
                      <Users className="w-3 h-3 mr-1" />
                      {meal.servings || 1} serving{(meal.servings || 1) !== 1 ? 's' : ''}
                    </Badge>
                    <Badge variant="outline" className="bg-orange-50 border-orange-200">
                      🔥 {meal.calories || 0} cal
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <span className="font-bold text-lg text-emerald-700">{meal.protein || 0}g</span>
                      <div className="text-sm text-emerald-600 font-medium">Protein</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="font-bold text-lg text-blue-700">{meal.carbs || 0}g</span>
                      <div className="text-sm text-blue-600 font-medium">Carbs</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <span className="font-bold text-lg text-amber-700">{meal.fat || 0}g</span>
                      <div className="text-sm text-amber-600 font-medium">Fat</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Reason Selection */}
          {!hasAlternatives && (
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                  <span>🤔</span>
                  Why do you want to exchange this meal?
                </h3>
                
                <Select value={selectedReason} onValueChange={setSelectedReason}>
                  <SelectTrigger className="mb-6 h-12 text-base">
                    <SelectValue placeholder="Select a reason for exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXCHANGE_REASONS.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value} className="py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{reason.icon}</span>
                          <span>{reason.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Enhanced Exchange Mode Toggle */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button
                    variant={exchangeMode === 'alternatives' ? 'default' : 'outline'}
                    onClick={() => setExchangeMode('alternatives')}
                    className={`h-16 flex-col gap-2 ${
                      exchangeMode === 'alternatives' 
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700' 
                        : 'border-2 hover:border-violet-300 hover:bg-violet-50'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                    <div className="text-sm font-medium">Browse Alternatives</div>
                    <div className="text-xs opacity-80">See multiple options</div>
                  </Button>
                  <Button
                    variant={exchangeMode === 'quick' ? 'default' : 'outline'}
                    onClick={() => setExchangeMode('quick')}
                    className={`h-16 flex-col gap-2 ${
                      exchangeMode === 'quick' 
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700' 
                        : 'border-2 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <Zap className="w-5 h-5" />
                    <div className="text-sm font-medium">Quick Exchange</div>
                    <div className="text-xs opacity-80">Instant replacement</div>
                  </Button>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex gap-4">
                  <Button onClick={handleClose} variant="outline" className="flex-1 h-12">
                    Cancel
                  </Button>
                  {exchangeMode === 'alternatives' ? (
                    <Button
                      onClick={handleGenerateAlternatives}
                      disabled={!selectedReason || isLoading}
                      className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                    >
                      {isLoading ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Alternatives
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleQuickExchange}
                      disabled={!selectedReason || isLoading}
                      className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                    >
                      {isLoading ? (
                        <>
                          <Zap className="w-4 h-4 mr-2 animate-spin" />
                          Exchanging...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Quick Exchange
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Alternatives List */}
          {hasAlternatives && (
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Alternative Meals ({alternatives.length})
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAlternatives}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
                
                <ScrollArea className="max-h-96">
                  <div className="space-y-4">
                    {alternatives.map((alternative, index) => (
                      <Card key={index} className="border-2 hover:border-violet-200 hover:shadow-md transition-all duration-200">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-4">
                              <h4 className="font-semibold text-lg mb-2 text-gray-900">{alternative.name}</h4>
                              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{alternative.reason}</p>
                              
                              <div className="flex flex-wrap gap-3 mb-4">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {(alternative.prep_time || 0) + (alternative.cook_time || 0)} min
                                </Badge>
                                <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                                  🔥 {alternative.calories} cal
                                </Badge>
                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                                  🥩 {alternative.protein}g protein
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={`border-2 ${
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
                            </div>
                            
                            <Button
                              onClick={() => handleSelectAlternative(alternative)}
                              disabled={isLoading}
                              className="ml-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 h-11 px-6"
                            >
                              {isLoading ? (
                                <>
                                  <ArrowLeftRight className="w-4 h-4 mr-2 animate-spin" />
                                  Exchanging...
                                </>
                              ) : (
                                <>
                                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                                  Select This
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="flex gap-4 mt-6 pt-4 border-t">
                  <Button onClick={handleClose} variant="outline" className="flex-1 h-11">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateAlternatives}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1 h-11 border-violet-200 text-violet-600 hover:bg-violet-50"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
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
