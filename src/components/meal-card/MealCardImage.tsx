
import { useState } from "react";
import { ImageIcon, ChefHat, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Meal {
  id?: string;
  type: string;
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: any[];
  instructions: string[];
  cookTime: number;
  prepTime: number;
  servings: number;
  image: string;
  image_url?: string;
  imageUrl?: string;
}

interface MealCardImageProps {
  meal: Meal;
  mealImage: string | null;
  isLoadingImage: boolean;
  onGenerateImage: () => Promise<void>;
}

const MealCardImage = ({ meal, mealImage, isLoadingImage, onGenerateImage }: MealCardImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const getMealTypeGradient = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return 'from-orange-400 to-amber-500';
      case 'lunch':
        return 'from-green-400 to-emerald-500';
      case 'dinner':
        return 'from-purple-400 to-indigo-500';
      case 'snack':
        return 'from-pink-400 to-rose-500';
      default:
        return 'from-blue-400 to-cyan-500';
    }
  };

  if (!mealImage || imageError) {
    return (
      <div className={`w-full h-40 sm:h-48 bg-gradient-to-br ${getMealTypeGradient(meal.type)} rounded-2xl flex items-center justify-center relative overflow-hidden group`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full opacity-50 animate-float"></div>
          <div className="absolute bottom-6 right-6 w-6 h-6 bg-white rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-8 w-4 h-4 bg-white rounded-full opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="text-center z-10">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm transform group-hover:scale-110 transition-transform">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <p className="text-white font-semibold text-sm px-4 line-clamp-2 leading-tight mb-3">
            {meal.name.replace('🍎 ', '')}
          </p>
          
          {/* Generate Image Button */}
          <Button
            size="sm"
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            onClick={onGenerateImage}
            disabled={isLoadingImage}
          >
            {isLoadingImage ? (
              <>
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 mr-1" />
                Generate Image
              </>
            )}
          </Button>
        </div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden group">
      {isImageLoading && (
        <div className={`absolute inset-0 bg-gradient-to-br ${getMealTypeGradient(meal.type)} flex items-center justify-center`}>
          <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
        </div>
      )}
      
      <img
        src={mealImage}
        alt={meal.name}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        onLoad={() => setIsImageLoading(false)}
        onError={() => {
          setImageError(true);
          setIsImageLoading(false);
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Meal name overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white font-medium text-sm line-clamp-2">
          {meal.name.replace('🍎 ', '')}
        </p>
      </div>
    </div>
  );
};

export default MealCardImage;
