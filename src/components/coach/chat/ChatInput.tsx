
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, X, Edit3, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  isSending: boolean;
  isEditing: boolean;
  editingMessage?: any;
  replyingTo?: any;
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
  const { t } = useLanguage();

  return (
    <div className="border-t bg-white p-4">
      {/* Reply/Edit Context */}
      {(replyingTo || editingMessage) && (
        <div className="mb-3">
          {replyingTo && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 font-medium">
                  {t('Replying to')} {replyingTo.sender_type === 'coach' ? 'Coach' : 'You'}
                </div>
                <div className="text-sm text-gray-700 truncate max-w-md">
                  {replyingTo.message}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelReply}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {editingMessage && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-r-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-600 font-medium">
                  {t('Editing message')}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-3">
        <Textarea
          ref={inputRef}
          value={message}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder={
            editingMessage 
              ? t('Edit your message...')
              : replyingTo 
                ? t('Reply to message...')
                : t('Type your message...')
          }
          disabled={isSending || isEditing}
          className="flex-1 min-h-[60px] max-h-32 resize-none"
          rows={2}
        />
        
        <div className="flex flex-col gap-2">
          {editingMessage ? (
            <>
              <Button
                onClick={onSaveEdit}
                disabled={!message.trim() || isEditing}
                size="sm"
                className="bg-green-500 hover:bg-green-600"
              >
                {isEditing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Edit3 className="w-4 h-4" />
                )}
              </Button>
              <Button
                onClick={onCancelEdit}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              onClick={onSend}
              disabled={!message.trim() || isSending}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 h-[60px]"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>
          {t('Press Enter + Shift for new line, Enter to send')}
        </span>
        <span>
          {message.length}/1000
        </span>
      </div>
    </div>
  );
};

export default ChatInput;
