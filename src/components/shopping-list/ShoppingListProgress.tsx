
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";

interface ShoppingListProgressProps {
  progress: number;
  checkedCount: number;
  totalItems: number;
  remainingItems: number;
}

export const ShoppingListProgress = ({ 
  progress, 
  checkedCount, 
  totalItems, 
  remainingItems 
}: ShoppingListProgressProps) => {
  return (
    <Card className="rounded-none border-0 border-b bg-gradient-to-r from-green-50 to-emerald-50">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Shopping Progress</span>
            <span className="text-lg font-bold text-green-600">{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-3 h-3" />
              <span>{checkedCount} completed</span>
            </div>
            <div className="flex items-center gap-1 text-orange-600">
              <Clock className="w-3 h-3" />
              <span>{remainingItems} remaining</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
