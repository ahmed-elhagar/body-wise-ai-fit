
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Reply, Edit, Trash, Copy } from 'lucide-react';
import type { ChatMessage } from '@/shared/hooks/useCoachChat';

interface MessageActionsMenuProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  onReply: (message: ChatMessage) => void;
  onEdit: (message: ChatMessage) => void;
  onDelete: (messageId: string) => void;
}

const MessageActionsMenu: React.FC<MessageActionsMenuProps> = ({
  message,
  isOwnMessage,
  onReply,
  onEdit,
  onDelete
}) => {
  const handleCopy = async () => {
    try {
      const messageText = message.message || '';
      await navigator.clipboard.writeText(messageText);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg z-50">
        <DropdownMenuItem onClick={() => onReply(message)}>
          <Reply className="w-4 h-4 mr-2" />
          Reply
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleCopy}>
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </DropdownMenuItem>
        
        {isOwnMessage && (
          <>
            <DropdownMenuItem onClick={() => onEdit(message)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => onDelete(message.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageActionsMenu;
