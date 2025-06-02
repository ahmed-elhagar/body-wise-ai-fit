
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Download, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import CategoryAccordion from "./shopping-list/CategoryAccordion";
import type { ShoppingListData } from "@/types/shoppingList";

interface ShoppingListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shoppingItems: ShoppingListData;
  onSendEmail: () => Promise<boolean>;
  weekStartDate: Date;
  isLoading?: boolean;
}

const ShoppingListDialog = ({
  isOpen,
  onClose,
  shoppingItems,
  onSendEmail,
  weekStartDate,
  isLoading = false
}: ShoppingListDialogProps) => {
  const { t, isRTL } = useLanguage();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    try {
      await onSendEmail();
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleDownload = () => {
    const content = Object.entries(shoppingItems.groupedItems)
      .map(([category, items]) => {
        const itemList = items
          .map(item => `- ${item.name} (${item.quantity} ${item.unit})`)
          .join('\n');
        return `${category}:\n${itemList}`;
      })
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopping-list-${weekStartDate.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalItems = shoppingItems.items.length;
  const categoryCount = Object.keys(shoppingItems.groupedItems).length;
  const checkedCount = checkedItems.size;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ShoppingCart className="w-5 h-5 text-fitness-accent-600" />
            {t?.('shoppingList.title') || 'Shopping List'}
          </DialogTitle>
        </DialogHeader>

        {/* Stats Card */}
        <Card className="flex-shrink-0 bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200">
          <CardContent className="p-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Badge className="bg-fitness-accent-500 text-white">
                  {totalItems} {t?.('shoppingList.items') || 'items'}
                </Badge>
                <Badge className="bg-fitness-primary-500 text-white">
                  {categoryCount} {t?.('shoppingList.categories') || 'categories'}
                </Badge>
                <Badge className="bg-green-500 text-white">
                  {checkedCount} {t?.('shoppingList.checked') || 'checked'}
                </Badge>
              </div>
              <div className="text-sm text-fitness-primary-600">
                Week of {weekStartDate.toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shopping List Content */}
        <div className="flex-1 overflow-y-auto px-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fitness-primary-500"></div>
            </div>
          ) : (
            <CategoryAccordion
              groupedItems={shoppingItems.groupedItems}
              checkedItems={checkedItems}
              setCheckedItems={setCheckedItems}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-3 pt-4 border-t border-fitness-primary-200 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            onClick={handleSendEmail}
            disabled={isSendingEmail || totalItems === 0}
            className="flex-1 bg-fitness-primary-500 hover:bg-fitness-primary-600 text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            {isSendingEmail ? 'Sending...' : (t?.('shoppingList.sendEmail') || 'Email List')}
          </Button>
          
          <Button
            onClick={handleDownload}
            variant="outline"
            disabled={totalItems === 0}
            className="border-fitness-accent-300 text-fitness-accent-600 hover:bg-fitness-accent-50"
          >
            <Download className="w-4 h-4" />
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            className="px-6"
          >
            {t?.('common.close') || 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingListDialog;
