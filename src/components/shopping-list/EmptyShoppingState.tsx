
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, X } from "lucide-react";

interface EmptyShoppingStateProps {
  onClose: () => void;
}

export const EmptyShoppingState = ({ onClose }: EmptyShoppingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="flex items-center justify-between w-full mb-8">
        <h2 className="text-lg font-semibold text-gray-900">Shopping List</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <ShoppingCart className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No Shopping List Available
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-sm">
        Generate a meal plan first to create your shopping list with all the ingredients you'll need.
      </p>
      
      <Button onClick={onClose} className="bg-violet-600 hover:bg-violet-700">
        Close
      </Button>
    </div>
  );
};
