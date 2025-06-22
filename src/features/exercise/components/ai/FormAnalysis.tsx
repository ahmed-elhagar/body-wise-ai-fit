
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle, AlertTriangle, Info } from "lucide-react";

interface FormAnalysisProps {
  exerciseName: string;
  analysisResult?: {
    score: number;
    feedback: string[];
    improvements: string[];
  };
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const FormAnalysis = ({
  exerciseName,
  analysisResult,
  onAnalyze,
  isAnalyzing
}: FormAnalysisProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Form Analysis - {exerciseName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysisResult ? (
          <div className="text-center py-6">
            <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">
              Record yourself performing this exercise for AI form analysis
            </p>
            <Button onClick={onAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(analysisResult.score)}`}>
                {analysisResult.score}%
              </div>
              <Badge className={getScoreBadge(analysisResult.score)}>
                Form Score
              </Badge>
            </div>

            {analysisResult.feedback.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Good Form Points
                </h4>
                <ul className="space-y-1">
                  {analysisResult.feedback.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <Info className="w-3 h-3 mt-0.5 text-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysisResult.improvements.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-1">
                  {analysisResult.improvements.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 mt-0.5 text-yellow-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={onAnalyze} variant="outline" size="sm" className="w-full">
              Analyze Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
