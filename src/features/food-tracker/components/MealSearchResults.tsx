
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Flame, Dumbbell, Wheat, Droplets } from "lucide-react";

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

interface MealSearchResultsProps {
  results: MealResult[];
  isLoading: boolean;
  onSelectMeal: (meal: MealResult) => void;
}

const MealSearchResults = ({ results, isLoading, onSelectMeal }: MealSearchResultsProps) => {
  if (isLoading) {
    return (
      <Card className="p-8 bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching meals...</p>
        </div>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="p-8 bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No meals found</h3>
        <p className="text-gray-600">Try searching with different keywords</p>
      </Card>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Breakfast': 'bg-orange-100 text-orange-800',
      'Lunch': 'bg-green-100 text-green-800',
      'Dinner': 'bg-blue-100 text-blue-800',
      'Snack': 'bg-purple-100 text-purple-800',
      'Dessert': 'bg-pink-100 text-pink-800',
      'Beverage': 'bg-cyan-100 text-cyan-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Search Results ({results.length} meals found)
        </h3>
      </div>
      
      <div className="grid gap-4">
        {results.map((meal) => (
          <Card key={meal.id} className="p-6 bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{meal.image}</div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">{meal.name}</h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getCategoryColor(meal.category)}>
                        {meal.category}
                      </Badge>
                      <span className="text-sm text-gray-600">{meal.servingSize}</span>
                    </div>
                    {meal.description && (
                      <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => onSelectMeal(meal)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white"
                  >
                    View Details
                  </Button>
                </div>

                {/* Nutrition Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Flame className="w-4 h-4 text-red-600 mr-1" />
                      <span className="text-sm font-medium text-red-700">Calories</span>
                    </div>
                    <p className="text-lg font-bold text-red-800">{meal.calories}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Dumbbell className="w-4 h-4 text-blue-600 mr-1" />
                      <span className="text-sm font-medium text-blue-700">Protein</span>
                    </div>
                    <p className="text-lg font-bold text-blue-800">{meal.protein}g</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Wheat className="w-4 h-4 text-yellow-600 mr-1" />
                      <span className="text-sm font-medium text-yellow-700">Carbs</span>
                    </div>
                    <p className="text-lg font-bold text-yellow-800">{meal.carbs}g</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Droplets className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-700">Fat</span>
                    </div>
                    <p className="text-lg font-bold text-green-800">{meal.fat}g</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {meal.cookTime && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{meal.cookTime} min</span>
                    </div>
                  )}
                  {meal.servings && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{meal.servings} serving{meal.servings > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {meal.fiber && (
                    <span>Fiber: {meal.fiber}g</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MealSearchResults;
