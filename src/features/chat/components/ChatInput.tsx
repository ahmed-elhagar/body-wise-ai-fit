
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Square, Mic, Image, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  onCancel?: () => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const ChatInput = ({
  onSendMessage,
  disabled = false,
  isLoading = false,
  onCancel,
  placeholder = "Type your message...",
  className,
  value: controlledValue,
  onChange
}: ChatInputProps) => {
  const [message, setMessage] = useState(controlledValue || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : message;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (isControlled && onChange) {
      onChange(newValue);
    } else {
      setMessage(newValue);
    }
  };

  const handleSend = () => {
    const messageToSend = currentValue.trim();
    if (!messageToSend || disabled || isLoading) return;

    onSendMessage(messageToSend);
    
    if (!isControlled) {
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [currentValue]);

  return (
    <Card className={cn("border-0 shadow-none bg-transparent", className)}>
      <div className="p-4 space-y-3">
        {/* Enhanced Input Area */}
        <div className="relative">
          <div className="flex gap-3 items-end">
            {/* Attachment Button */}
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                disabled={disabled || isLoading}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl"
                disabled={disabled || isLoading}
              >
                <Image className="h-4 w-4" />
              </Button>
            </div>

            {/* Enhanced Textarea */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={currentValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={disabled || isLoading}
                className="min-h-[50px] max-h-[120px] resize-none border-2 border-gray-200 focus:border-blue-400 rounded-2xl px-4 py-3 pr-12 text-base bg-white/90 backdrop-blur-sm transition-all duration-200 focus:ring-0 focus:ring-offset-0"
                rows={1}
              />
              
              {/* Character Counter */}
              <div className="absolute bottom-2 right-12 text-xs text-gray-400">
                {currentValue.length}/2000
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Voice Input Button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl"
                disabled={disabled || isLoading}
              >
                <Mic className="h-4 w-4" />
              </Button>

              {/* Send/Cancel Button */}
              {isLoading ? (
                <Button
                  onClick={onCancel}
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 bg-red-50 border-red-200 text-red-600 hover:bg-red-100 rounded-xl"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              ) : (
                <Button
                  onClick={handleSend}
                  disabled={!currentValue.trim() || disabled}
                  size="sm"
                  className={cn(
                    "h-10 px-4 rounded-xl transition-all duration-200",
                    currentValue.trim()
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Helper Text */}
        <div className="flex items-center justify-between text-xs text-gray-500 px-2">
          <span className="flex items-center gap-2">
            <span>{placeholder.includes('fitness') ? '🏋️' : '💬'}</span>
            Press <kbd className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">Enter</kbd> to send, 
            <kbd className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">Shift + Enter</kbd> for new line
          </span>
          {isLoading && (
            <span className="text-blue-600 animate-pulse">AI is thinking...</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChatInput;
