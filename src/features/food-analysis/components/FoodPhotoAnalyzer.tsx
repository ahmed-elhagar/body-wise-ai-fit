
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";

interface FoodPhotoAnalyzerProps {
  onSelectFood: (food: any) => void;
}

const FoodPhotoAnalyzer = ({ onSelectFood }: FoodPhotoAnalyzerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Food Photo Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">AI food photo analysis component</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodPhotoAnalyzer;
