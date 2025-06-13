import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIAnalysis } from '@/hooks/useAIAnalysis'; // Using consolidated hook
import { Camera, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const FoodPhotoAnalysisCard = () => {
  const { analyzeFood, analyzeImage, isAnalyzing } = useAIAnalysis(); // Using consolidated hook
  const [foodDescription, setFoodDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyzeFood = async () => {
    if (!foodDescription.trim()) {
      toast.error('Please enter a food description');
      return;
    }

    try {
      const result = await analyzeFood(foodDescription);
      if (result) {
        setAnalysisResult(result);
        toast.success('Food analysis completed!');
      }
    } catch (error) {
      console.error('Food analysis error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Food Analysis</CardTitle>
        <CardDescription>Enter a description of the food to analyze its nutritional content.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Describe the food..."
            value={foodDescription}
            onChange={(e) => setFoodDescription(e.target.value)}
            disabled={isAnalyzing}
          />
          <Button onClick={handleAnalyzeFood} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </Button>
        </div>

        {analysisResult ? (
          <div className="mt-4">
            <h3 className="text-md font-semibold">Analysis Result:</h3>
            <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="mt-4 text-gray-500">
            {isAnalyzing ? "Analyzing food..." : "Enter a description to see the analysis."}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodPhotoAnalysisCard;
