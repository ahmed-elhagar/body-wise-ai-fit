import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Apple, Calculator, Sparkles, Flame } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useCalorieCalculations } from "./add-snack/useCalorieCalculations";
import EnhancedLoadingIndicator from "@/components/ui/enhanced-loading-indicator";

interface EnhancedAddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  weeklyPlanId: string | null;
  onSnackAdded: () => void;
  currentDayCalories: number;
  targetDayCalories: number;
}

const commonSnacks = [
  { name: "Apple with Almond Butter", calories: 190, protein: 4, carbs: 25, fat: 8 },
  { name: "Greek Yogurt with Berries", calories: 150, protein: 15, carbs: 20, fat: 2 },
  { name: "Handful of Mixed Nuts", calories: 170, protein: 6, carbs: 6, fat: 15 },
  { name: "Protein Bar", calories: 200, protein: 20, carbs: 22, fat: 7 },
  { name: "Banana with Peanut Butter", calories: 220, protein: 8, carbs: 27, fat: 11 },
  { name: "Hummus with Carrots", calories: 120, protein: 5, carbs: 12, fat: 6 },
  { name: "String Cheese", calories: 80, protein: 6, carbs: 1, fat: 6 },
  { name: "Trail Mix", calories: 140, protein: 4, carbs: 13, fat: 9 }
];

const EnhancedAddSnackDialog = ({
  isOpen,
  onClose,
  selectedDay,
  weeklyPlanId,
  onSnackAdded,
  currentDayCalories,
  targetDayCalories
}: EnhancedAddSnackDialogProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSnack, setSelectedSnack] = useState<any>(null);
  const [customSnack, setCustomSnack] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: ""
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [viewMode, setViewMode] = useState<'ai' | 'quick' | 'custom'>('ai');

  const { remainingCalories, progressPercentage } = useCalorieCalculations(
    currentDayCalories,
    targetDayCalories
  );

  const filteredSnacks = commonSnacks.filter(snack =>
    snack.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateAISnack = async () => {
    if (!user || !weeklyPlanId || !profile) {
      toast.error('Missing required data for AI generation');
      return;
    }

    setIsGeneratingAI(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-snack', {
        body: {
          userProfile: profile,
          day: selectedDay,
          calories: Math.min(remainingCalories, 250), // Use remaining calories or max 250
          weeklyPlanId,
          language: profile?.preferred_language || 'en'
        }
      });

      if (error) {
        console.error('Error generating AI snack:', error);
        toast.error('Failed to generate AI snack');
        return;
      }

      if (data?.success) {
        toast.success('AI snack added successfully!');
        onSnackAdded();
        onClose();
      } else {
        toast.error(data?.error || 'Failed to generate AI snack');
      }
      
    } catch (error) {
      console.error('Error generating AI snack:', error);
      toast.error('Failed to generate AI snack');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAddSnack = async (snack: any) => {
    if (!weeklyPlanId || !user) {
      toast.error("Unable to add snack. Please try again.");
      return;
    }

    setIsAdding(true);
    try {
      const { error } = await supabase
        .from('daily_meals')
        .insert({
          weekly_plan_id: weeklyPlanId,
          day_number: selectedDay,
          meal_type: 'snack',
          name: snack.name,
          calories: snack.calories,
          protein: snack.protein,
          carbs: snack.carbs,
          fat: snack.fat,
          prep_time: 5,
          cook_time: 0,
          servings: 1,
          ingredients: [{ name: snack.name, quantity: "1", unit: "serving" }],
          instructions: [`Enjoy your ${snack.name}!`]
        });

      if (error) throw error;

      toast.success(`${snack.name} added successfully!`);
      onSnackAdded();
      onClose();
    } catch (error: any) {
      console.error('Error adding snack:', error);
      toast.error(error.message || "Failed to add snack");
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddCustomSnack = async () => {
    if (!customSnack.name || !customSnack.calories) {
      toast.error("Please fill in snack name and calories");
      return;
    }

    const snack = {
      name: customSnack.name,
      calories: parseInt(customSnack.calories),
      protein: parseFloat(customSnack.protein) || 0,
      carbs: parseFloat(customSnack.carbs) || 0,
      fat: parseFloat(customSnack.fat) || 0
    };

    await handleAddSnack(snack);
  };

  const getDayName = (dayNumber: number) => {
    const days = ['', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days[dayNumber] || 'Day';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Apple className="w-5 h-5" />
            Add Snack - {getDayName(selectedDay)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Calorie Progress */}
          <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Daily Progress</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {remainingCalories} cal remaining
                </Badge>
              </div>
              <div className="w-full bg-fitness-primary-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-fitness-primary-500 to-fitness-accent-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-fitness-primary-600 mt-1">
                <span>{currentDayCalories} cal</span>
                <span>{targetDayCalories} cal target</span>
              </div>
            </CardContent>
          </Card>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'ai' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('ai')}
              className="flex-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generated
            </Button>
            <Button
              variant={viewMode === 'quick' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('quick')}
              className="flex-1"
            >
              Quick Add
            </Button>
            <Button
              variant={viewMode === 'custom' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('custom')}
              className="flex-1"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Custom
            </Button>
          </div>

          {/* Content based on view mode */}
          {viewMode === 'ai' ? (
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI-Generated Snack</h3>
                  <p className="text-gray-600 mb-4">
                    Let AI create a perfect snack based on your profile and remaining {remainingCalories} calories
                  </p>
                  
                  {isGeneratingAI ? (
                    <EnhancedLoadingIndicator
                      status="loading"
                      type="generation"
                      message="Generating AI Snack"
                      description="Creating the perfect snack for your remaining calories"
                      variant="card"
                      size="md"
                      showSteps={true}
                      customSteps={[
                        'Analyzing your dietary preferences...',
                        'Calculating optimal nutrition...',
                        'Creating personalized snack...',
                        'Finalizing recipe details...'
                      ]}
                    />
                  ) : (
                    <Button
                      onClick={handleGenerateAISnack}
                      disabled={isGeneratingAI || !weeklyPlanId}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate AI Snack
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : viewMode === 'quick' ? (
            <>
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search snacks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Quick Snacks */}
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {filteredSnacks.map((snack, index) => (
                    <Card 
                      key={index} 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedSnack(snack)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{snack.name}</h4>
                            <div className="flex gap-4 mt-1 text-xs text-gray-600">
                              <span>{snack.calories} cal</span>
                              <span>{snack.protein}g protein</span>
                              <span>{snack.carbs}g carbs</span>
                              <span>{snack.fat}g fat</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddSnack(snack);
                            }}
                            disabled={isAdding}
                            className="ml-2"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <>
              {/* Custom Snack Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="snack-name">Snack Name *</Label>
                  <Input
                    id="snack-name"
                    placeholder="e.g., Mixed Berry Smoothie"
                    value={customSnack.name}
                    onChange={(e) => setCustomSnack(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="calories">Calories *</Label>
                    <Input
                      id="calories"
                      type="number"
                      placeholder="0"
                      value={customSnack.calories}
                      onChange={(e) => setCustomSnack(prev => ({ ...prev, calories: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      placeholder="0"
                      value={customSnack.protein}
                      onChange={(e) => setCustomSnack(prev => ({ ...prev, protein: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      placeholder="0"
                      value={customSnack.carbs}
                      onChange={(e) => setCustomSnack(prev => ({ ...prev, carbs: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input
                      id="fat"
                      type="number"
                      placeholder="0"
                      value={customSnack.fat}
                      onChange={(e) => setCustomSnack(prev => ({ ...prev, fat: e.target.value }))}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddCustomSnack}
                  disabled={isAdding || !customSnack.name || !customSnack.calories}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isAdding ? 'Adding...' : 'Add Custom Snack'}
                </Button>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAddSnackDialog;
