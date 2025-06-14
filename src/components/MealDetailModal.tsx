
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Users, Flame, Dumbbell, Wheat, Droplets, Heart, Zap, Activity } from "lucide-react";

interface MealResult {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: string;
  category: string;
  cookTime?: number;
  servings?: number;
  image: string;
  description?: string;
}

interface MealDetailModalProps {
  meal: MealResult | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToLog: (meal: MealResult) => void;
}

const MealDetailModal = ({ meal, isOpen, onClose, onAddToLog }: MealDetailModalProps) => {
  if (!meal) return null;

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Breakfast': 'bg-orange-100 text-orange-800 border-orange-200',
      'Lunch': 'bg-green-100 text-green-800 border-green-200',
      'Dinner': 'bg-blue-100 text-blue-800 border-blue-200',
      'Snack': 'bg-purple-100 text-purple-800 border-purple-200',
      'Dessert': 'bg-pink-100 text-pink-800 border-pink-200',
      'Beverage': 'bg-cyan-100 text-cyan-800 border-cyan-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleAddToLog = () => {
    onAddToLog(meal);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <span className="text-3xl">{meal.image}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{meal.name}</h2>
              <Badge className={getCategoryColor(meal.category)}>
                {meal.category}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Serving Size */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="text-center">
              <p className="text-sm text-blue-600 mb-1">Serving Size</p>
              <p className="text-lg font-semibold text-blue-800">{meal.servingSize}</p>
            </div>
          </Card>

          {/* Main Nutrition Facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <div className="text-center">
                <Flame className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-red-600 mb-1">Calories</p>
                <p className="text-2xl font-bold text-red-800">{meal.calories}</p>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="text-center">
                <Dumbbell className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-blue-600 mb-1">Protein</p>
                <p className="text-2xl font-bold text-blue-800">{meal.protein}g</p>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <div className="text-center">
                <Wheat className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-yellow-600 mb-1">Carbs</p>
                <p className="text-2xl font-bold text-yellow-800">{meal.carbs}g</p>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="text-center">
                <Droplets className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-green-600 mb-1">Fat</p>
                <p className="text-2xl font-bold text-green-800">{meal.fat}g</p>
              </div>
            </Card>
          </div>

          {/* Additional Nutrition Info */}
          {(meal.fiber || meal.sugar || meal.sodium) && (
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-fitness-primary" />
                Additional Nutrition
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {meal.fiber && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Fiber</p>
                    <p className="text-lg font-semibold text-gray-800">{meal.fiber}g</p>
                  </div>
                )}
                {meal.sugar && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Sugar</p>
                    <p className="text-lg font-semibold text-gray-800">{meal.sugar}g</p>
                  </div>
                )}
                {meal.sodium && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Sodium</p>
                    <p className="text-lg font-semibold text-gray-800">{meal.sodium}mg</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Description */}
          {meal.description && (
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600">{meal.description}</p>
            </Card>
          )}

          {/* Meal Info */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-fitness-primary" />
              Meal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {meal.cookTime && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Cook Time: {meal.cookTime} minutes</span>
                </div>
              )}
              {meal.servings && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Servings: {meal.servings}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Nutrition Breakdown Chart */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-fitness-primary" />
              Macronutrient Breakdown
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-blue-600">Protein ({meal.protein}g)</span>
                  <span className="text-blue-600">{Math.round((meal.protein * 4 / meal.calories) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${Math.round((meal.protein * 4 / meal.calories) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-yellow-600">Carbs ({meal.carbs}g)</span>
                  <span className="text-yellow-600">{Math.round((meal.carbs * 4 / meal.calories) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${Math.round((meal.carbs * 4 / meal.calories) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-600">Fat ({meal.fat}g)</span>
                  <span className="text-green-600">{Math.round((meal.fat * 9 / meal.calories) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${Math.round((meal.fat * 9 / meal.calories) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Button */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={handleAddToLog}
              className="bg-fitness-gradient hover:opacity-90 text-white"
            >
              Add to Food Log
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealDetailModal;
