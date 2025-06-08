
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Mail, Download, X } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface ShoppingListHeaderProps {
  totalItems: number;
  checkedCount: number;
  onSendEmail: () => void;
  onExport: () => void;
  onClose: () => void;
}

export const ShoppingListHeader = ({ 
  totalItems, 
  checkedCount, 
  onSendEmail, 
  onExport, 
  onClose 
}: ShoppingListHeaderProps) => {
  const { isRTL } = useI18n();

  return (
    <Card className="rounded-none border-0 border-b bg-white shadow-sm">
      <CardContent className="p-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Smart Shopping List</h2>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  {totalItems} items
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  {checkedCount} done
                </Badge>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              onClick={onSendEmail}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Mail className="w-3 h-3 mr-1" />
              Email
            </Button>
            
            <Button
              onClick={onExport}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>

            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
