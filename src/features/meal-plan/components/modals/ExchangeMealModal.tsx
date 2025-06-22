import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  RefreshCw, 
  Flame, 
  Zap, 
  Clock, 
  Users, 
  Loader2, 
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useMealExchange } from '../../hooks/useMealExchange';
import type { DailyMeal } from '../../types';
import { toast } from 'sonner';

interface ExchangeMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal | null;
  onMealExchanged?: () => void;
}

export const ExchangeMealModal: React.FC<ExchangeMealModalProps> = ({
  isOpen,
  onClose,
  meal,
  onMealExchanged
}) => {
  const { generateAlternatives, exchangeMeal, alternatives, isLoading, clearAlternatives } = useMealExchange();
  const [selectedAlternative, setSelectedAlternative] = useState<any>(null);
  const [exchangeReason, setExchangeReason] = useState('');
  const [step, setStep] = useState<'reason' | 'alternatives' | 'exchanging'>('reason');

  useEffect(() => {
    if (isOpen && meal) {
      setStep('reason');
      setExchangeReason('');
      setSelectedAlternative(null);
      clearAlternatives();
    }
  }, [isOpen, meal]);

  const handleGenerateAlternatives = async () => {
    if (!meal || !exchangeReason.trim()) {
      toast.error('Please provide a reason for the exchange');
      return;
    }

    setStep('alternatives');
    const success = await generateAlternatives(meal, exchangeReason);
    if (!success) {
      setStep('reason');
    }
  };

  const handleSelectAlternative = (alternative: any) => {
    setSelectedAlternative(alternative);
  };

  const handleConfirmExchange = async () => {
    if (!selectedAlternative || !meal?.id) {
      toast.error('Please select an alternative meal');
      return;
    }

    setStep('exchanging');
    const success = await exchangeMeal(selectedAlternative, meal.id, () => {
      onMealExchanged?.();
      handleClose();
    });

    if (!success) {
      setStep('alternatives');
    }
  };

  const handleClose = () => {
    setStep('reason');
    setExchangeReason('');
    setSelectedAlternative(null);
    clearAlternatives();
    onClose();
  };

  const reasonOptions = [
    { value: 'dietary_restriction', label: 'Dietary Restriction', description: 'Food allergies or dietary needs' },
    { value: 'preference', label: 'Personal Preference', description: 'Don\'t like this meal' },
    { value: 'ingredients', label: 'Missing Ingredients', description: 'Don\'t have required ingredients' },
    { value: 'time', label: 'Time Constraint', description: 'Need something quicker to prepare' },
    { value: 'variety', label: 'Want Variety', description: 'Looking for something different' },
    { value: 'custom', label: 'Custom Reason', description: 'Specify your own reason' }
  ];

  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Exchange Meal</DialogTitle>
                <DialogDescription>
                  {step === 'reason' && 'Why would you like to exchange this meal?'}
                  {step === 'alternatives' && 'Choose from AI-generated alternatives'}
                  {step === 'exchanging' && 'Exchanging your meal...'}
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {step === 'reason' && (
          <div className="space-y-6">
            {/* Current Meal Info */}
            <Card className="p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{meal.name}</h3>
                <Badge variant="secondary">{meal.meal_type}</Badge>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <Flame className="h-4 w-4 text-red-500 mr-1" />
                  <span>{meal.calories || 0} cal</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-green-500 mr-1" />
                  <span>{meal.protein || 0}g protein</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-500 mr-1" />
                  <span>{(meal.prep_time || 0) + (meal.cook_time || 0)}m</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-purple-500 mr-1" />
                  <span>{meal.servings || 1} serving</span>
                </div>
              </div>
            </Card>

            {/* Exchange Reason */}
            <div>
              <Label htmlFor="reason" className="text-base font-semibold mb-3 block">
                Why do you want to exchange this meal?
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {reasonOptions.slice(0, -1).map((option) => (
                  <Card 
                    key={option.value}
                    className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                      exchangeReason === option.value ? 'ring-2 ring-orange-500 bg-orange-50' : 'bg-white'
                    }`}
                    onClick={() => setExchangeReason(option.value)}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </Card>
                ))}
              </div>

              {/* Custom Reason */}
              <Card 
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                  exchangeReason === 'custom' ? 'ring-2 ring-orange-500 bg-orange-50' : 'bg-white'
                }`}
                onClick={() => setExchangeReason('custom')}
              >
                <div className="font-medium mb-2">Custom Reason</div>
                {exchangeReason === 'custom' && (
                  <Textarea
                    placeholder="Please describe why you want to exchange this meal..."
                    className="mt-2"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </Card>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateAlternatives}
                disabled={!exchangeReason || isLoading}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Alternatives
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'alternatives' && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Generating Alternatives</h3>
                <p className="text-gray-600 text-center">
                  Creating personalized meal alternatives based on your preferences...
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Choose Your Alternative</h3>
                  <Badge variant="secondary">{alternatives.length} options available</Badge>
                </div>

                <div className="grid gap-4">
                  {alternatives.map((alternative, index) => (
                    <Card 
                      key={index}
                      className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                        selectedAlternative === alternative ? 'ring-2 ring-green-500 bg-green-50' : 'bg-white'
                      }`}
                      onClick={() => handleSelectAlternative(alternative)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">{alternative.name}</h4>
                        {selectedAlternative === alternative && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                        <div className="flex items-center">
                          <Flame className="h-4 w-4 text-red-500 mr-1" />
                          <span>{alternative.calories || 0} cal</span>
                        </div>
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 text-green-500 mr-1" />
                          <span>{alternative.protein || 0}g protein</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-blue-500 mr-1" />
                          <span>{(alternative.prep_time || 0) + (alternative.cook_time || 0)}m</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-purple-500 mr-1" />
                          <span>{alternative.servings || 1} serving</span>
                        </div>
                      </div>

                      {alternative.ingredients && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Key ingredients: </span>
                          {alternative.ingredients.slice(0, 3).map((ing: any) => ing.name || ing).join(', ')}
                          {alternative.ingredients.length > 3 && '...'}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('reason')}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleConfirmExchange}
                    disabled={!selectedAlternative}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Exchange Meal
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 'exchanging' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Exchanging Meal</h3>
            <p className="text-gray-600 text-center">
              Updating your meal plan with the selected alternative...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 