
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  onCancel?: () => void;
  placeholder?: string;
  className?: string;
}

const ChatInput = ({ 
  onSendMessage, 
  disabled = false, 
  isLoading = false, 
  onCancel,
  placeholder = "Type your message...",
  className 
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    if (!message.trim() || disabled || isLoading) return;
    
    onSendMessage(message.trim());
    setMessage("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message, disabled, isLoading, onSendMessage]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording logic here
    } else {
      setIsRecording(true);
      // Start recording logic here
    }
  };

  const canSend = message.trim().length > 0 && !disabled && !isLoading;

  return (
    <div className={cn("p-4 bg-white border-t border-gray-200", className)}>
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[44px] max-h-[120px] resize-none pr-20 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
            rows={1}
          />
          
          {/* Character count */}
          {message.length > 0 && (
            <div className="absolute bottom-2 right-16 text-xs text-gray-400">
              {message.length}/2000
            </div>
          )}
        </div>
        
        {/* Voice recording button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleVoiceRecord}
          disabled={disabled}
          className={cn(
            "h-[44px] w-[44px] p-0 rounded-xl transition-colors",
            isRecording ? "bg-red-100 text-red-600 hover:bg-red-200" : "hover:bg-gray-100"
          )}
        >
          {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        
        {/* Send/Cancel button */}
        {isLoading ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-[44px] w-[44px] p-0 rounded-xl hover:bg-red-100 text-red-600"
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className={cn(
              "h-[44px] w-[44px] p-0 rounded-xl transition-all duration-200",
              canSend 
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105" 
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
      
      {/* Helpful tips */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};

export default ChatInput;
