
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Play, CheckCircle, AlertTriangle } from 'lucide-react';

interface FormAnalysisProps {
  activeExerciseId?: string | null;
  energyLevel?: number;
  recoveryScore?: number;
}

export const FormAnalysis: React.FC<FormAnalysisProps> = ({
  activeExerciseId = null,
  energyLevel = 70,
  recoveryScore = 85
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyzeForm = async () => {
    setIsAnalyzing(true);
    
    // Simulate form analysis
    setTimeout(() => {
      setAnalysisResult({
        score: 88,
        feedback: [
          'Good posture maintained throughout the movement',
          'Depth could be improved by 2-3 inches',
          'Excellent control during the eccentric phase'
        ],
        recommendations: [
          'Focus on driving through your heels',
          'Keep your chest up and core engaged',
          'Work on ankle mobility for better depth'
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            AI Form Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Record your exercise form for AI analysis
            </p>
            <Button 
              onClick={handleAnalyzeForm}
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing Form...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Analysis
                </>
              )}
            </Button>
          </div>

          {analysisResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Form Score</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {analysisResult.score}/100
                </Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Positive Feedback
                </h4>
                <ul className="space-y-1">
                  {analysisResult.feedback.map((item: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {analysisResult.recommendations.map((item: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
