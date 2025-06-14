
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";

interface ModernShoppingListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyPlan?: any;
  weekId?: string;
  onShoppingListUpdate: () => void;
}

const ModernShoppingListDrawer = ({ 
  isOpen, 
  onClose, 
  weeklyPlan,
  weekId,
  onShoppingListUpdate 
}: ModernShoppingListDrawerProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping List
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <p className="text-gray-600">Shopping list coming soon!</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ModernShoppingListDrawer;
