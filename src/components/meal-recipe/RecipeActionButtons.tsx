
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";

interface RecipeActionButtonsProps {
  onOpenYouTube: () => void;
  onClose: () => void;
}

const RecipeActionButtons = ({ onOpenYouTube, onClose }: RecipeActionButtonsProps) => {
  return (
    <div className="flex justify-center gap-4 pt-4">
      <Button
        onClick={onOpenYouTube}
        className="flex-1 max-w-xs bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all border-0"
      >
        <Play className="w-4 h-4 mr-2" />
        Watch Tutorial
      </Button>
      
      <Button 
        onClick={onClose} 
        variant="outline"
        className="flex-1 max-w-xs border-fitness-primary-300 bg-white text-fitness-primary-600 hover:bg-fitness-primary-50 hover:text-fitness-primary-700 font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
      >
        <X className="w-4 h-4 mr-2" />
        Close
      </Button>
    </div>
  );
};

export default RecipeActionButtons;
