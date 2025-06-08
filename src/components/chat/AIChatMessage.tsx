
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import { Markdown } from './Markdown';
import { toast } from 'sonner';
import { useI18n } from '@/hooks/useI18n';

interface AIChatMessageProps {
  content: string;
  timestamp: Date;
  isGenerating?: boolean;
  onRegenerate?: () => void;
  messageId?: string;
}

export const AIChatMessage: React.FC<AIChatMessageProps> = ({
  content,
  timestamp,
  isGenerating = false,
  onRegenerate,
  messageId
}) => {
  const { t, isRTL } = useI18n();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(t('common:copied') || 'Copied to clipboard');
    } catch (error) {
      toast.error(t('common:copyFailed') || 'Failed to copy');
    }
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    // In a real app, this would send feedback to analytics
    console.log(`Feedback for message ${messageId}:`, type);
    toast.success(t('common:feedbackReceived') || 'Feedback received');
  };

  return (
    <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm font-bold">AI</span>
      </div>
      
      <div className="flex-1 max-w-none">
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge variant="secondary" className="text-xs">
                {t('chat:aiAssistant') || 'AI Assistant'}
              </Badge>
              <span className="text-xs text-gray-500">
                {timestamp.toLocaleTimeString()}
              </span>
            </div>
            
            <div className={`prose prose-sm max-w-none ${isRTL ? 'text-right' : 'text-left'}`}>
              <Markdown content={content} />
            </div>

            {!isGenerating && (
              <div className={`flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('positive')}
                  className="h-8 px-2"
                >
                  <ThumbsUp className="w-3 h-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('negative')}
                  className="h-8 px-2"
                >
                  <ThumbsDown className="w-3 h-3" />
                </Button>
                
                {onRegenerate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRegenerate}
                    className="h-8 px-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
