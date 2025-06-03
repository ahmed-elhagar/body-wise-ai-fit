
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  mealSource?: string;
  isChecked: boolean;
  originalQuantities?: Array<{
    quantity: number;
    unit: string;
    meal: string;
  }>;
}

interface ShoppingListItemProps {
  item: ShoppingItem;
  isChecked: boolean;
  onToggle: () => void;
}

export const ShoppingListItem = ({ item, isChecked, onToggle }: ShoppingListItemProps) => {
  const { isRTL } = useLanguage();

  return (
    <Card 
      className={`bg-white border transition-all duration-200 cursor-pointer hover:shadow-sm ${
        isChecked ? 'bg-gray-50 border-gray-300' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onToggle}
    >
      <CardContent className="p-3">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Checkbox
              checked={isChecked}
              onCheckedChange={onToggle}
              onClick={(e) => e.stopPropagation()}
              className="border-gray-400"
            />
            
            <div className="flex-1">
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className={`font-medium ${isChecked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {item.name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {item.quantity} {item.unit}
                </Badge>
              </div>
              
              {item.mealSource && (
                <p className={`text-xs text-gray-500 mt-1 ${isChecked ? 'line-through' : ''}`}>
                  From: {item.mealSource}
                </p>
              )}
              
              {item.originalQuantities && item.originalQuantities.length > 1 && (
                <div className="mt-1">
                  <Badge variant="outline" className="text-xs">
                    <Info className="w-3 h-3 mr-1" />
                    {item.originalQuantities.length} meals combined
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
