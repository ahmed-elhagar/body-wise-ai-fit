
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Square, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  onChange: onControlledChange
}: ChatInputProps) => {
  const [internalValue, setInternalValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Use controlled or internal value
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = onControlledChange || setInternalValue;

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setValue(value + ' ' + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [value, setValue]);

  const handleSend = () => {
    if (!value.trim() || disabled || isLoading) return;
    
    onSendMessage(value.trim());
    setValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  return (
    <div className={cn("p-4 bg-white border-t border-gray-200", className)}>
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "min-h-[52px] max-h-[120px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl pr-12 transition-all duration-200",
              isListening && "ring-2 ring-red-300 border-red-300"
            )}
            rows={1}
          />
          
          {/* Voice Input Button */}
          {recognitionRef.current && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleVoiceInput}
              disabled={disabled}
              className={cn(
                "absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-100 transition-colors",
                isListening && "text-red-600 bg-red-50 hover:bg-red-100"
              )}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {/* Character counter for long messages */}
          {value.length > 200 && (
            <div className="absolute -top-6 right-2 text-xs text-gray-500">
              {value.length}/1000
            </div>
          )}
        </div>
        
        {/* Send/Cancel Button */}
        <Button
          onClick={isLoading ? onCancel : handleSend}
          disabled={(!value.trim() && !isLoading) || disabled}
          size="lg"
          className={cn(
            "h-[52px] px-6 transition-all duration-200 transform hover:scale-105",
            isLoading 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-blue-600 hover:bg-blue-700 text-white"
          )}
        >
          {isLoading ? (
            <>
              <Square className="h-4 w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send
            </>
          )}
        </Button>
      </div>
      
      {/* Voice Input Indicator */}
      {isListening && (
        <div className="flex items-center justify-center mt-2 text-sm text-red-600">
          <div className="animate-pulse flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Listening...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
