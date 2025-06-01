
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "@/components/chat/TypingIndicator";
import type { ChatMessage as ChatMessageType } from "@/hooks/useCoachChat";

interface MessagesListProps {
  messages: ChatMessageType[];
  currentUserId?: string;
  coachName: string;
  typingUsers: string[];
  replyingTo?: ChatMessageType | null;
  onReply: (message: ChatMessageType) => void;
  onEdit: (message: ChatMessageType) => void;
  onDelete: (messageId: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessagesList = ({
  messages,
  currentUserId,
  coachName,
  typingUsers,
  replyingTo,
  onReply,
  onEdit,
  onDelete,
  messagesEndRef
}: MessagesListProps) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId;
          return (
            <ChatMessage
              key={msg.id}
              message={msg}
              isOwn={isOwn}
              senderName={coachName}
              replyingTo={replyingTo}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
        
        {/* Typing indicator */}
        <TypingIndicator
          typingUsers={typingUsers}
          getCoachName={() => coachName}
        />
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessagesList;
