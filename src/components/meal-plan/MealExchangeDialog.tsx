
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeftRight, Sparkles, Clock, Users, ChefHat, X } from 'lucide-react';
import { useMealExchange } from '@/hooks/useMealExchange';
import type { DailyMeal } from '@/features/meal-plan/types';

interface MealExchangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
  onExchangeComplete?: () => void;
}

const EXCHANGE_REASONS = [
  { value: 'dietary_restrictions', label: 'Dietary restrictions' },
  { value: 'ingredient_availability', label: 'Missing ingredients' },
  { value: 'time_constraints', label: 'Too time consuming' },
  { value: 'personal_preference', label: 'Personal preference' },
  { value: 'variety_seeking', label: 'Want more variety' },
  { value: 'cooking_difficulty', label: 'Too difficult to cook' },
  { value: 'nutritional_adjustment', label: 'Nutritional adjustment' },
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
    const newMeal = await quickExchange(meal, reasonLabel, () => {
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
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            Exchange Meal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Meal Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Current Meal</h3>
                  <p className="text-lg font-medium mb-3">{meal.name}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {(meal.prep_time || 0) + (meal.cook_time || 0)} min
                    </Badge>
                    <Badge variant="outline">
                      <Users className="w-3 h-3 mr-1" />
                      {meal.servings || 1} serving{(meal.servings || 1) !== 1 ? 's' : ''}
                    </Badge>
                    <Badge variant="outline">
                      {meal.calories || 0} cal
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <span className="font-semibold text-green-700">{meal.protein || 0}g</span>
                      <div className="text-green-600">Protein</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <span className="font-semibold text-blue-700">{meal.carbs || 0}g</span>
                      <div className="text-blue-600">Carbs</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded">
                      <span className="font-semibold text-yellow-700">{meal.fat || 0}g</span>
                      <div className="text-yellow-600">Fat</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Reason Selection */}
          {!hasAlternatives && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Why do you want to exchange this meal?</h3>
                
                <Select value={selectedReason} onValueChange={setSelectedReason}>
                  <SelectTrigger className="mb-4">
                    <SelectValue placeholder="Select a reason for exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXCHANGE_REASONS.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Exchange Mode Toggle */}
                <div className="flex gap-3 mb-4">
                  <Button
                    variant={exchangeMode === 'alternatives' ? 'default' : 'outline'}
                    onClick={() => setExchangeMode('alternatives')}
                    className="flex-1"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Browse Alternatives
                  </Button>
                  <Button
                    variant={exchangeMode === 'quick' ? 'default' : 'outline'}
                    onClick={() => setExchangeMode('quick')}
                    className="flex-1"
                  >
                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                    Quick Exchange
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button onClick={handleClose} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  {exchangeMode === 'alternatives' ? (
                    <Button
                      onClick={handleGenerateAlternatives}
                      disabled={!selectedReason || isLoading}
                      className="flex-1"
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
                      className="flex-1"
                    >
                      {isLoading ? (
                        <>
                          <ArrowLeftRight className="w-4 h-4 mr-2 animate-spin" />
                          Exchanging...
                        </>
                      ) : (
                        <>
                          <ArrowLeftRight className="w-4 h-4 mr-2" />
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
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Alternative Meals ({alternatives.length})</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAlternatives}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
                
                <ScrollArea className="max-h-96">
                  <div className="space-y-3">
                    {alternatives.map((alternative, index) => (
                      <Card key={index} className="border hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium mb-2">{alternative.name}</h4>
                              <p className="text-sm text-gray-600 mb-3">{alternative.reason}</p>
                              
                              <div className="flex gap-4 text-sm mb-3">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {alternative.prep_time + alternative.cook_time} min
                                </span>
                                <span>{alternative.calories} cal</span>
                                <span className="text-green-600">{alternative.protein}g protein</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {Math.round(alternative.similarity_score * 100)}% similar
                                </Badge>
                              </div>
                            </div>
                            
                            <Button
                              onClick={() => handleSelectAlternative(alternative)}
                              disabled={isLoading}
                              size="sm"
                              className="ml-4"
                            >
                              {isLoading ? 'Exchanging...' : 'Select'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleClose} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateAlternatives}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1"
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
