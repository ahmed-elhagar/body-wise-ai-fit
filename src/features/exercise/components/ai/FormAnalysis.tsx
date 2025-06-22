
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, AlertCircle, Camera } from "lucide-react";

interface FormAnalysisProps {
  exerciseId?: string;
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

export const FormAnalysis = ({
  exerciseId,
  isRecording = false,
  onStartRecording,
  onStopRecording
}: FormAnalysisProps) => {
  // Mock form analysis data
  const formAnalysis = {
    score: 85,
    feedback: [
      { type: 'good', message: 'Good form on the descent' },
      { type: 'warning', message: 'Keep your back straight throughout the movement' },
      { type: 'good', message: 'Excellent tempo control' }
    ],
    suggestions: [
      'Focus on core engagement',
      'Maintain steady breathing pattern',
      'Control the eccentric phase'
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFeedbackIcon = (type: string) => {
    return type === 'good' ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <AlertCircle className="w-4 h-4 text-yellow-500" />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          AI Form Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recording Controls */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">
              {isRecording ? 'Recording...' : 'Ready to analyze'}
            </span>
          </div>
          <Button
            variant={isRecording ? "destructive" : "default"}
            size="sm"
            onClick={isRecording ? onStopRecording : onStartRecording}
          >
            {isRecording ? 'Stop' : 'Start'} Recording
          </Button>
        </div>

        {/* Form Score */}
        <div className="text-center">
          <p className={`text-4xl font-bold ${getScoreColor(formAnalysis.score)}`}>
            {formAnalysis.score}%
          </p>
          <p className="text-sm text-gray-600">Form Score</p>
        </div>

        {/* Feedback */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Real-time Feedback</h4>
          {formAnalysis.feedback.map((item, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              {getFeedbackIcon(item.type)}
              <span className="flex-1">{item.message}</span>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Improvement Suggestions</h4>
          <div className="space-y-1">
            {formAnalysis.suggestions.map((suggestion, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
