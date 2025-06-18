
import React from 'react';
import { Button } from "@/components/ui/button";
import { X, Mail, Download, ShoppingCart } from "lucide-react";

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
  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-violet-600" />
          <h2 className="text-lg font-semibold text-gray-900">Shopping List</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {totalItems} items total
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSendEmail}
            className="text-xs"
          >
            <Mail className="w-3 h-3 mr-1" />
            Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="text-xs"
          >
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};
