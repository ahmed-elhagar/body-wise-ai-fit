
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Edit, X } from 'lucide-react';

interface Message {
  id: string;
  message: string;
  sender_type: 'coach' | 'trainee';
  sender_id: string;
  created_at: string;
  updated_at?: string;
  is_read?: boolean;
  sender_name?: string;
}

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  isSending: boolean;
  isEditing: boolean;
  editingMessage: Message | null;
  replyingTo: Message | null;
  onSend: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onCancelReply: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

const ChatInput = ({
  message,
  setMessage,
  isSending,
  isEditing,
  editingMessage,
  replyingTo,
  onSend,
  onSaveEdit,
  onCancelEdit,
  onCancelReply,
  onKeyPress,
  onChange,
  inputRef
}: ChatInputProps) => {
  return (
    <div className="p-4 border-t bg-white">
      {replyingTo && (
        <Card className="p-3 mb-3 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium text-blue-700">Replying to:</span>
              <p className="text-blue-600 mt-1 truncate">{replyingTo.message}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancelReply}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
      
      {editingMessage && (
        <Card className="p-3 mb-3 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium text-yellow-700">Editing message:</span>
              <p className="text-yellow-600 mt-1 truncate">{editingMessage.message}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancelEdit}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
      
      <div className="flex gap-2 items-end">
        <Textarea
          ref={inputRef}
          value={message}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder="Type your message..."
          className="flex-1 min-h-[44px] max-h-32 resize-none"
          disabled={isSending || isEditing}
        />
        
        {editingMessage ? (
          <Button
            onClick={onSaveEdit}
            disabled={!message.trim() || isEditing}
            className="h-11"
          >
            <Edit className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={onSend}
            disabled={!message.trim() || isSending}
            className="h-11"
          >
            <Send className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
