
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Mail, Copy, CheckCircle, Check, Package } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

interface ShoppingListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shoppingItems: {
    items: ShoppingItem[];
    groupedItems: Record<string, ShoppingItem[]>;
  };
  weekStartDate: Date;
  onSendEmail: () => Promise<boolean>;
}

const ShoppingListDialog = ({ 
  isOpen, 
  onClose, 
  shoppingItems, 
  weekStartDate,
  onSendEmail 
}: ShoppingListDialogProps) => {
  const { t, isRTL } = useLanguage();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    try {
      const success = await onSendEmail();
      if (success) {
        toast.success(t('shoppingList.emailSent') || "Shopping list sent to your email!");
      }
    } catch (error) {
      toast.error(t('shoppingList.emailFailed') || "Failed to send email. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleCopyToClipboard = async () => {
    let clipboardText = `${t('shoppingList.title') || 'Shopping List'} - ${format(weekStartDate, 'MMM d, yyyy')}\n\n`;
    
    Object.entries(shoppingItems.groupedItems).forEach(([category, items]) => {
      clipboardText += `${category.toUpperCase()}\n`;
      items.forEach(item => {
        clipboardText += `• ${item.quantity} ${item.unit} ${item.name}\n`;
      });
      clipboardText += '\n';
    });

    try {
      await navigator.clipboard.writeText(clipboardText);
      setCopiedToClipboard(true);
      toast.success(t('shoppingList.copied') || "Shopping list copied to clipboard!");
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (error) {
      toast.error(t('shoppingList.copyFailed') || "Failed to copy to clipboard");
    }
  };

  const toggleItem = (itemKey: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemKey)) {
      newChecked.delete(itemKey);
    } else {
      newChecked.add(itemKey);
    }
    setCheckedItems(newChecked);
  };

  const categoryColors = {
    'Produce': 'bg-green-100 border-green-300 text-green-800',
    'Meat & Seafood': 'bg-red-100 border-red-300 text-red-800',
    'Dairy': 'bg-blue-100 border-blue-300 text-blue-800',
    'Grains & Cereals': 'bg-yellow-100 border-yellow-300 text-yellow-800',
    'Pantry': 'bg-purple-100 border-purple-300 text-purple-800',
    'Spices & Herbs': 'bg-orange-100 border-orange-300 text-orange-800',
    'Other': 'bg-gray-100 border-gray-300 text-gray-800'
  };

  const categoryIcons = {
    'Produce': '🥬',
    'Meat & Seafood': '🥩',
    'Dairy': '🥛',
    'Grains & Cereals': '🌾',
    'Pantry': '🏺',
    'Spices & Herbs': '🌿',
    'Other': '📦'
  };

  const totalItems = shoppingItems.items.length;
  const totalCategories = Object.keys(shoppingItems.groupedItems).length;
  const checkedCount = checkedItems.size;
  const progressPercentage = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] p-0">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {t('shoppingList.title') || 'Shopping List'}
                </DialogTitle>
                <p className="text-sm text-gray-600">
                  {t('shoppingList.weekOf') || 'Week of'} {format(weekStartDate, 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {totalItems} {t('shoppingList.items') || 'items'}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {totalCategories} {t('shoppingList.categories') || 'categories'}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {t('shoppingList.progress') || 'Shopping Progress'}
              </span>
              <span className="text-sm text-gray-600">
                {checkedCount}/{totalItems} {t('shoppingList.completed') || 'completed'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6 max-h-[60vh]">
          <div className="space-y-4">
            {Object.entries(shoppingItems.groupedItems).map(([category, items]) => (
              <Card key={category} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className={`flex items-center gap-3 text-base ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-lg">
                        {categoryIcons[category as keyof typeof categoryIcons] || '📦'}
                      </span>
                      <Badge className={`${categoryColors[category as keyof typeof categoryColors] || categoryColors['Other']} font-medium`}>
                        {category}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500 font-normal">
                      ({items.length} {t('shoppingList.items') || 'items'})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 gap-2">
                    {items.map((item, index) => {
                      const itemKey = `${category}-${index}`;
                      const isChecked = checkedItems.has(itemKey);
                      
                      return (
                        <div
                          key={itemKey}
                          onClick={() => toggleItem(itemKey)}
                          className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            isChecked 
                              ? 'bg-green-50 border-green-200 text-gray-500' 
                              : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                          }`}
                        >
                          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isChecked 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-gray-300'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`font-medium ${isChecked ? 'line-through' : ''}`}>
                              {item.name}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            {item.quantity} {item.unit}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t bg-gray-50">
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              onClick={handleCopyToClipboard}
              variant="outline"
              className="flex-1"
              disabled={copiedToClipboard}
            >
              {copiedToClipboard ? (
                <CheckCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              ) : (
                <Copy className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              )}
              {copiedToClipboard ? (t('shoppingList.copied') || 'Copied!') : (t('shoppingList.copy') || 'Copy List')}
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Mail className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isSendingEmail ? (t('shoppingList.sending') || 'Sending...') : (t('shoppingList.emailList') || 'Email List')}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              {t('close') || 'Close'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingListDialog;
