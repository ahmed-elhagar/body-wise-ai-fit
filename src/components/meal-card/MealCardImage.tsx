
import { useState } from "react";
import { ImageIcon, ChefHat } from "lucide-react";

interface MealCardImageProps {
  imageUrl?: string;
  mealName: string;
  mealType: string;
}

const MealCardImage = ({ imageUrl, mealName, mealType }: MealCardImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  if (!imageUrl || imageError) {
    return (
      <div className={`w-full h-40 sm:h-48 bg-gradient-to-br ${getMealTypeGradient(mealType)} rounded-2xl flex items-center justify-center relative overflow-hidden group`}>
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
          <p className="text-white font-semibold text-sm px-4 line-clamp-2 leading-tight">
            {mealName}
          </p>
        </div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden group">
      {isLoading && (
        <div className={`absolute inset-0 bg-gradient-to-br ${getMealTypeGradient(mealType)} flex items-center justify-center`}>
          <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
        </div>
      )}
      
      <img
        src={imageUrl}
        alt={mealName}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Meal name overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white font-medium text-sm line-clamp-2">
          {mealName}
        </p>
      </div>
    </div>
  );
};

export default MealCardImage;
