
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload } from "lucide-react";

interface FoodPhotoAnalyzerProps {
  onSelectFood: (food: any) => void;
}

const FoodPhotoAnalyzer = ({ onSelectFood }: FoodPhotoAnalyzerProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalyze = () => {
    // Mock analysis result
    const mockFood = {
      name: "Apple",
      calories: 95,
      description: "A fresh red apple"
    };
    onSelectFood(mockFood);
  };

  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <Camera className="w-16 h-16 text-gray-400 mx-auto" />
        <h3 className="text-xl font-semibold">Analyze Your Food</h3>
        
        <div className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="max-w-md mx-auto"
          />
          
          {selectedFile && (
            <Button onClick={handleAnalyze} className="w-full max-w-md">
              <Upload className="w-4 h-4 mr-2" />
              Analyze Photo
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FoodPhotoAnalyzer;
