
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Square } from "lucide-react";
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
  placeholder = "Ask me anything about fitness, nutrition, or health...",
  className 
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSend = () => {
    if (!message.trim() || disabled || isLoading) return;
    
    onSendMessage(message.trim());
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(prev => prev + (prev ? ' ' : '') + transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <div className={cn("border-t bg-white p-4", className)}>
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[44px] max-h-[120px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl pr-12"
            rows={1}
          />
          {message.length > 450 && (
            <div className="absolute right-3 bottom-2 text-xs text-gray-400">
              {500 - message.length}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleVoiceInput}
            disabled={disabled}
            className={cn(
              "h-[44px] w-[44px] p-0 rounded-xl transition-colors",
              isRecording && "bg-red-100 text-red-600 border-red-300"
            )}
          >
            <Mic className="h-4 w-4" />
          </Button>
          
          {isLoading ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="h-[44px] w-[44px] p-0 rounded-xl bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              disabled={!message.trim() || disabled}
              size="sm"
              className="h-[44px] w-[44px] p-0 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {message.length > 450 && (
        <p className="text-xs text-amber-600 mt-2 text-center">
          {500 - message.length} characters remaining
        </p>
      )}
    </div>
  );
};

export default ChatInput;
