
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Play, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import type { Exercise } from '../../types';

interface FormAnalysisProps {
  todaysExercises?: Exercise[];
  activeExerciseId?: string | null;
  className?: string;
}

export const FormAnalysis: React.FC<FormAnalysisProps> = ({ 
  todaysExercises = [],
  activeExerciseId = null,
  className 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setAnalysisResult({
        score: 85,
        feedback: [
          'Good posture maintained throughout the exercise',
          'Proper breathing technique observed',
          'Full range of motion achieved'
        ],
        recommendations: [
          'Focus on slower controlled movements',
          'Engage core muscles more consistently',
          'Increase time under tension'
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            AI Form Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!analysisResult ? (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Camera className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Analyze Your Form</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Use AI to get real-time feedback on your exercise form
                </p>
                <Button 
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Analysis
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Form Score */}
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analysisResult.score}/100
                </div>
                <Progress value={analysisResult.score} className="w-full max-w-xs mx-auto" />
                <p className="text-sm text-gray-600 mt-2">Overall Form Score</p>
              </div>

              {/* Feedback */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  What's Going Well
                </h4>
                <div className="space-y-2">
                  {analysisResult.feedback.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-green-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Areas for Improvement
                </h4>
                <div className="space-y-2">
                  {analysisResult.recommendations.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-blue-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setAnalysisResult(null)}
                  className="flex-1"
                >
                  New Analysis
                </Button>
                <Button 
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing}
                  className="flex-1"
                >
                  Re-analyze
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
