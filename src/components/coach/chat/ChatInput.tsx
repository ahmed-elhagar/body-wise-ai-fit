
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2, Send, X } from "lucide-react";
import type { ChatMessage } from "@/hooks/useCoachChat";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  isSending: boolean;
  isEditing: boolean;
  editingMessage?: ChatMessage | null;
  replyingTo?: ChatMessage | null;
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
    <div className="border-t p-4 bg-gray-50 rounded-b-xl">
      {/* Reply indicator */}
      {replyingTo && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-blue-600 font-medium">Replying to:</span>
              <p className="text-gray-600 truncate mt-1">{replyingTo.message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelReply}
              className="p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Edit indicator */}
      {editingMessage && (
        <div className="mb-3 p-2 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-orange-600 font-medium flex items-center gap-1">
                <Edit className="h-3 w-3" />
                Editing message
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSaveEdit}
                disabled={isEditing}
                className="p-1 text-green-600 hover:bg-green-100"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelEdit}
                className="p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex gap-3">
        <Textarea
          ref={inputRef}
          value={message}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder={editingMessage ? "Edit your message..." : "Type your message..."}
          className="flex-1 min-h-[60px] resize-none"
          disabled={isSending || isEditing}
        />
        <Button
          onClick={editingMessage ? onSaveEdit : onSend}
          disabled={!message.trim() || isSending || isEditing}
          className="self-end bg-green-600 hover:bg-green-700"
        >
          {isSending || isEditing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : editingMessage ? (
            <Edit className="h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
