
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmptyShoppingStateProps {
  onClose: () => void;
}

export const EmptyShoppingState = ({ onClose }: EmptyShoppingStateProps) => {
  const { isRTL } = useLanguage();

  return (
    <div className="flex items-center justify-center h-full p-8">
      <Card className="max-w-sm w-full bg-white shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            No Shopping List Available
          </h3>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Generate a meal plan first to create your personalized shopping list with all the ingredients you'll need.
          </p>
          
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              onClick={() => {
                onClose();
                // This could trigger opening the AI meal plan dialog
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Meal Plan
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
