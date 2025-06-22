
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { useSmartReplies } from "@/features/chat/hooks/useSmartReplies";
import { useLanguage } from "@/contexts/LanguageContext";

interface SmartReplySuggestionsProps {
  messageContext: string;
  onSuggestionSelect: (suggestion: string) => void;
  className?: string;
}

const SmartReplySuggestions = ({ 
  messageContext, 
  onSuggestionSelect, 
  className = "" 
}: SmartReplySuggestionsProps) => {
  const { t } = useLanguage();
  const { replies, loading, generateReplies, clearReplies } = useSmartReplies();

  const handleGenerateReplies = async () => {
    await generateReplies(messageContext);
  };

  if (replies.length === 0 && !loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">{t('Smart Replies')}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGenerateReplies}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t('Generate')
            )}
          </Button>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
          <span className="text-sm text-gray-600">
            {t('Generating smart replies...')}
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium">{t('Smart Replies')}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearReplies}
          className="text-xs"
        >
          {t('Clear')}
        </Button>
      </div>
      
      <div className="space-y-2">
        {replies.map((reply, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="w-full text-left justify-start h-auto p-2 whitespace-normal"
            onClick={() => onSuggestionSelect(reply.text)}
          >
            <div className="flex items-start gap-2">
              <span className="text-xs bg-purple-100 text-purple-600 px-1 rounded">
                {reply.type}
              </span>
              <span className="text-sm">{reply.text}</span>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default SmartReplySuggestions;
