
import React from 'react';
import type { CoachChatMessage } from '@/features/coach/types';

// NOTE: This is a placeholder component.
interface MessagesListProps {
    messages: CoachChatMessage[];
    currentUserId: string;
    coachName: string;
    typingUsers: any[];
    replyingTo: CoachChatMessage | null;
    onReply: (msg: CoachChatMessage) => void;
    onEdit: (msg: CoachChatMessage) => void;
    onDelete: (id: string) => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}
export const MessagesList = ({ messages, messagesEndRef, currentUserId }: MessagesListProps) => (
  <div className="flex-1 p-4 overflow-y-auto space-y-4">
    {messages.map((msg: any) => (
      <div key={msg.id} className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}>
        <div className={`rounded-lg px-4 py-2 max-w-sm ${msg.sender_id === currentUserId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            {msg.message}
        </div>
      </div>
    ))}
    <div ref={messagesEndRef} />
  </div>
);
export default MessagesList;
