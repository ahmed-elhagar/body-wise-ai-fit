
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, X, Edit3 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: () => void;
  disabled?: boolean;
  isSending?: boolean;
  isEditing?: boolean;
  editingMessage?: any;
  replyingTo?: any;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  onCancelReply?: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

const ChatInput = ({ 
  message, 
  setMessage, 
  onSend, 
  disabled,
  isSending,
  isEditing,
  editingMessage,
  replyingTo,
  onSaveEdit,
  onCancelEdit,
  onCancelReply,
  onKeyPress,
  onChange,
  inputRef
}: ChatInputProps) => {
  const { t } = useI18n();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (onKeyPress) {
      onKeyPress(e);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="p-4 border-t bg-white">
      {/* Reply/Edit indicators */}
      {replyingTo && (
        <div className="flex items-center justify-between bg-blue-50 p-2 rounded mb-2">
          <span className="text-sm text-blue-700">Replying to message</span>
          <Button variant="ghost" size="sm" onClick={onCancelReply}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
      
      {editingMessage && (
        <div className="flex items-center justify-between bg-orange-50 p-2 rounded mb-2">
          <span className="text-sm text-orange-700">
            <Edit3 className="w-3 h-3 inline mr-1" />
            Editing message
          </span>
          <Button variant="ghost" size="sm" onClick={onCancelEdit}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="ghost" size="sm">
          <Paperclip className="w-4 h-4" />
        </Button>
        <Input
          value={message}
          onChange={handleChange}
          placeholder={t('coach:typeMessage') || 'Type a message...'}
          onKeyPress={handleKeyPress}
          disabled={disabled || isSending}
          className="flex-1"
        />
        <Button 
          onClick={isEditing ? onSaveEdit : onSend} 
          disabled={!message.trim() || disabled || isSending}
          size="sm"
        >
          {isEditing ? (
            <Edit3 className="w-4 h-4" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
