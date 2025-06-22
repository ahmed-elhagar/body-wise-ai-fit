
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge as BadgeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import MessageActionsMenu from "@/components/chat/MessageActionsMenu";
import type { ChatMessage as ChatMessageType } from "@/shared/hooks/useCoachChat";

interface ChatMessageProps {
  message: ChatMessageType;
  isOwn: boolean;
  senderName: string;
  replyingTo?: ChatMessageType | null;
  onReply: (message: ChatMessageType) => void;
  onEdit: (message: ChatMessageType) => void;
  onDelete: (messageId: string) => void;
}

const ChatMessage = ({ 
  message, 
  isOwn, 
  senderName, 
  replyingTo,
  onReply,
  onEdit,
  onDelete
}: ChatMessageProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div
      className={cn(
        "group flex gap-3 max-w-[80%]",
        isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {!isOwn && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-green-100 text-green-700">
            {getInitials(message.sender_name || senderName)}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex-1">
        {/* Reply indicator */}
        {replyingTo?.id === message.id && (
          <div className="text-xs text-blue-600 mb-1">
            Replying to this message
          </div>
        )}
        
        <div
          className={cn(
            "rounded-lg px-3 py-2 relative",
            isOwn
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-900",
            message.updated_at !== message.created_at && "border-l-2 border-orange-400"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm whitespace-pre-wrap flex-1">
              {message.message}
            </p>
            <MessageActionsMenu
              message={message}
              isOwnMessage={isOwn}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
          
          <div className={cn(
            "text-xs mt-1 flex items-center justify-between",
            isOwn ? "text-green-100" : "text-gray-500"
          )}>
            <div className="flex items-center gap-2">
              <span>{formatTime(message.created_at)}</span>
              {message.updated_at !== message.created_at && (
                <span className="text-xs opacity-75">(edited)</span>
              )}
            </div>
            {isOwn && message.is_read && (
              <span className="flex items-center gap-1">
                <BadgeIcon className="w-3 h-3" />
                Read
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
