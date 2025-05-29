
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface RecipeActionButtonsProps {
  onOpenYouTube: () => void;
  onClose: () => void;
}

const RecipeActionButtons = ({ onOpenYouTube, onClose }: RecipeActionButtonsProps) => {
  return (
    <div className="flex justify-between">
      <Button
        onClick={onOpenYouTube}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <Play className="w-4 h-4" />
        <span>Watch on YouTube</span>
      </Button>
      
      <Button onClick={onClose} variant="outline">
        Close
      </Button>
    </div>
  );
};

export default RecipeActionButtons;
