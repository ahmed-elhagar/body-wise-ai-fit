
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SheetTitle } from "@/components/ui/sheet";
import { ShoppingCart, Download, Mail, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

interface DrawerHeaderProps {
  totalItems: number;
  groupedItems: Record<string, ShoppingItem[]>;
  weekId?: string;
  onShoppingListUpdate?: () => void;
}

const DrawerHeader = ({ 
  totalItems, 
  groupedItems, 
  weekId, 
  onShoppingListUpdate 
}: DrawerHeaderProps) => {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const [isEmailSending, setIsEmailSending] = useState(false);

  // Get current week date range for PDF header
  const getWeekRange = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

    const formatOptions: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    
    const locale = isRTL ? 'ar' : 'en';
    const startFormatted = startOfWeek.toLocaleDateString(locale, formatOptions);
    const endFormatted = endOfWeek.toLocaleDateString(locale, formatOptions);
    
    return isRTL ? 
      `قائمة التسوق · ${startFormatted} – ${endFormatted}` :
      `Shopping List · ${startFormatted} – ${endFormatted}`;
  };

  const generateShoppingPdf = () => {
    const categories = Object.keys(groupedItems).sort();
    const weekRange = getWeekRange();
    
    const listContent = categories.map(category => {
      const items = groupedItems[category];
      const itemsText = items
        .map(item => `• ${item.name} - ${item.quantity} ${isRTL && item.unit === 'g' ? 'جم' : item.unit}`)
        .join('\n');
      return `${category.toUpperCase()}\n${itemsText}`;
    }).join('\n\n');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${isRTL ? 'قائمة التسوق' : 'Shopping List'}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                direction: ${isRTL ? 'rtl' : 'ltr'};
                text-align: ${isRTL ? 'right' : 'left'};
              }
              .header { 
                color: #FF6F3C; 
                text-align: ${isRTL ? 'right' : 'left'}; 
                margin-bottom: 20px; 
                font-size: 28px;
                font-weight: bold;
              }
              h3 { 
                color: #FF6F3C; 
                border-bottom: 2px solid #FF6F3C; 
                padding-bottom: 5px; 
                margin-top: 20px;
              }
              .item { margin: 8px 0; padding: 8px; border-bottom: 1px solid #eee; }
              .meta { 
                text-align: ${isRTL ? 'right' : 'left'}; 
                color: #666; 
                margin-bottom: 30px; 
                font-size: 14px;
              }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <div class="header">${weekRange}</div>
            <p class="meta">
              ${isRTL ? 'تم إنشاؤها في' : 'Generated on'} ${new Date().toLocaleDateString(isRTL ? 'ar' : 'en')}
            </p>
            <div style="white-space: pre-line;">${listContent}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const sendShoppingListEmail = async () => {
    if (!user || !weekId) return;
    
    setIsEmailSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-shopping-list-email', {
        body: {
          userId: user.id,
          weekId: weekId,
          shoppingItems: groupedItems,
          weekRange: getWeekRange()
        }
      });

      if (error) throw error;

      toast.success(isRTL ? 'تم إرسال البريد الإلكتروني' : 'Email sent', {
        duration: 2000,
      });
      onShoppingListUpdate?.();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(isRTL ? 'فشل في إرسال البريد الإلكتروني' : 'Failed to send email');
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <>
      <SheetTitle className="text-white flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-[#FF6F3C]" />
        {isRTL ? 'قائمة التسوق' : 'Shopping List'}
        {totalItems > 0 && (
          <Badge className="bg-[#FF6F3C] text-white ml-2">
            {totalItems} {isRTL ? 'عنصر' : 'items'}
          </Badge>
        )}
      </SheetTitle>

      {/* Action Buttons */}
      {totalItems > 0 && (
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={generateShoppingPdf}
            className="flex-1 bg-gradient-to-r from-[#FF6F3C] to-[#FF8F4C] hover:from-[#FF5F2C] hover:to-[#FF7F3C] text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            {isRTL ? 'تصدير PDF' : 'Export PDF'}
          </Button>
          
          <Button 
            onClick={sendShoppingListEmail}
            disabled={isEmailSending}
            variant="outline"
            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600"
          >
            {isEmailSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}
    </>
  );
};

export default DrawerHeader;
