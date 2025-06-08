
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Reply, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { CoachChatMessage } from '../types/chatTypes';

interface MessagesListProps {
  messages: CoachChatMessage[];
  currentUserId?: string;
  coachName: string;
  typingUsers: string[];
  replyingTo: CoachChatMessage | null;
  onReply: (message: CoachChatMessage) => void;
  onEdit: (message: CoachChatMessage) => void;
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
          const isCurrentUser = msg.sender_id === currentUserId;
          const senderName = msg.sender_name || (isCurrentUser ? 'You' : coachName);
          
          return (
            <div
              key={msg.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} group`}
            >
              <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                <Card className={`p-3 ${
                  isCurrentUser 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="text-sm">{msg.message}</div>
                  <div className={`text-xs mt-2 opacity-70 flex items-center justify-between`}>
                    <span>{senderName}</span>
                    <span>{formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}</span>
                  </div>
                </Card>
                
                {isCurrentUser && (
                  <div className="flex gap-1 mt-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => onReply(msg)}>
                      <Reply className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(msg)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(msg.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <Card className="p-3 bg-gray-100">
              <div className="text-sm text-gray-600">
                {coachName} is typing...
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessagesList;
