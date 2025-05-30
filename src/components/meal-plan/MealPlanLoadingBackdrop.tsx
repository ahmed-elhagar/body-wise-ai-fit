
import { Loader2, UtensilsCrossed } from "lucide-react";

interface MealPlanLoadingBackdropProps {
  isLoading: boolean;
  message?: string;
}

const MealPlanLoadingBackdrop = ({ isLoading, message = "Loading..." }: MealPlanLoadingBackdropProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1E1F23] border border-gray-700 rounded-lg p-8 max-w-sm mx-4 text-center">
        <div className="mb-6">
          <div className="relative">
            <UtensilsCrossed className="w-12 h-12 mx-auto text-[#FF6F3C] mb-4" />
            <Loader2 className="w-6 h-6 absolute top-0 right-1/2 translate-x-1/2 text-[#FF8F4C] animate-spin" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">
          {message}
        </h3>
        
        <p className="text-gray-400 text-sm">
          Please wait while we process your request...
        </p>
        
        <div className="mt-4 flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-[#FF6F3C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-[#FF6F3C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-[#FF6F3C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanLoadingBackdrop;
