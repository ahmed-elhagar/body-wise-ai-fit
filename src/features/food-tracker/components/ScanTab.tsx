
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Camera } from "lucide-react";

interface ScanTabProps {
  onFoodAdded: () => void;
  onClose: () => void;
}

const ScanTab = ({ onFoodAdded, onClose }: ScanTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            AI Credits
          </span>
        </div>
        <Badge variant="default">
          Unlimited
        </Badge>
      </div>

      <Card className="p-8 text-center">
        <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">AI Food Scanning</h3>
        <p className="text-gray-600 mb-4">
          Take a photo of your food and let AI analyze its nutritional content
        </p>
        <p className="text-sm text-gray-500">
          This feature will be available soon
        </p>
      </Card>
    </div>
  );
};

export default ScanTab;
