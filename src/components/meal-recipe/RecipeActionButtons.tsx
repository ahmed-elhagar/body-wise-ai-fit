
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";

interface RecipeActionButtonsProps {
  onOpenYouTube: () => void;
  onClose: () => void;
}

const RecipeActionButtons = ({ onOpenYouTube, onClose }: RecipeActionButtonsProps) => {
  return (
    <div className="flex justify-between gap-4">
      <Button
        onClick={onOpenYouTube}
        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
      >
        <Play className="w-4 h-4 mr-2" />
        Watch on YouTube
      </Button>
      
      <Button 
        onClick={onClose} 
        variant="outline"
        className="border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50"
      >
        <X className="w-4 h-4 mr-2" />
        Close
      </Button>
    </div>
  );
};

export default RecipeActionButtons;
