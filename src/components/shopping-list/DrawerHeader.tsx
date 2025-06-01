
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Mail, Download } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface DrawerHeaderProps {
  totalItems: number;
  groupedItems: Record<string, any[]>;
  weekId?: string;
  onShoppingListUpdate?: () => void;
  onSendEmail?: () => Promise<void>;
}

const DrawerHeader = ({ 
  totalItems, 
  groupedItems, 
  weekId, 
  onShoppingListUpdate,
  onSendEmail 
}: DrawerHeaderProps) => {
  const { t, isRTL } = useI18n();

  const categoryCount = Object.keys(groupedItems).length;

  const handleSendEmail = async () => {
    if (onSendEmail) {
      await onSendEmail();
    }
  };

  return (
    <SheetHeader className="space-y-4">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <SheetTitle className="text-fitness-primary-700 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-fitness-accent-600" />
          {t('shoppingList.title')}
        </SheetTitle>
        <div className="flex items-center gap-2">
          <Badge className="bg-fitness-accent-500 text-white">
            {totalItems} {t('shoppingList.items')}
          </Badge>
          <Badge className="bg-fitness-primary-500 text-white">
            {categoryCount} {t('shoppingList.categories')}
          </Badge>
        </div>
      </div>

      {/* Enhanced action buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleSendEmail}
          variant="outline"
          size="sm"
          className="flex-1 border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50"
        >
          <Mail className="w-4 h-4 mr-2" />
          {t('shoppingList.sendEmail')}
        </Button>
        
        <Button
          onClick={() => {
            // Enhanced download functionality can be added here
            console.log('📥 Download shopping list');
            if (onShoppingListUpdate) {
              onShoppingListUpdate();
            }
          }}
          variant="outline"
          size="sm"
          className="border-fitness-accent-300 text-fitness-accent-600 hover:bg-fitness-accent-50"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </SheetHeader>
  );
};

export default DrawerHeader;
