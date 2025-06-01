import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface AIChatMessageProps {
  message: string;
  onLike?: (liked: boolean) => void;
}

export const AIChatMessage = ({ message, onLike }: AIChatMessageProps) => {
  const { t } = useI18n();
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const messageRef = useRef(null);

  useEffect(() => {
    setIsCopied(false); // Reset copied state when message changes
  }, [message]);

  const handleLike = (liked: boolean) => {
    setIsLiked(liked);
    onLike?.(liked);
  };

  const handleCopyClick = () => {
    if (messageRef.current) {
      const text = messageRef.current.innerText;
      navigator.clipboard.writeText(text)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
          alert("Failed to copy text. Please try again.");
        });
    }
  };

  return (
    <Card className="bg-gray-50 border-gray-200 shadow-sm">
      <div className="flex items-start space-x-4 p-4">
        <div className="shrink-0">
          <Bot className="h-6 w-6 text-blue-500" />
        </div>
        <div className="flex-1 space-y-2">
          <div ref={messageRef} className="text-sm text-gray-800 whitespace-pre-line">
            {message}
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyClick}
              disabled={isCopied}
              className="px-2 py-1"
            >
              {isCopied ? (
                <Badge variant="secondary">
                  {t('chat.copied') || 'Copied!'}
                </Badge>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  {t('chat.copy') || 'Copy'}
                </>
              )}
            </Button>
            {onLike && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(true)}
                  className={`px-2 py-1 ${isLiked === true ? 'text-green-600' : ''}`}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  {t('chat.like') || 'Like'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(false)}
                  className={`px-2 py-1 ${isLiked === false ? 'text-red-600' : ''}`}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  {t('chat.dislike') || 'Dislike'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
